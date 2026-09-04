import type { TableIdentity } from 'table-identity';
import type { TypeAccountStatus } from 'vona-module-a-user';
import type { EntityRole, EntityRoleUser, EntityUser } from 'vona-module-home-user';

import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoSystemAdminAccountStatus } from '../dto/systemAdminAccountStatus.ts';
import type { DtoSystemAdminActivation } from '../dto/systemAdminActivation.ts';
import type { DtoSystemAdminFreshProofIssueRes } from '../dto/systemAdminFreshProofIssueRes.ts';
import type { DtoSystemAdminGrant } from '../dto/systemAdminGrant.ts';
import type { DtoSystemAdminRevoke } from '../dto/systemAdminRevoke.ts';

type TypeSystemAdminCommand = 'grant' | 'revoke' | 'activate' | 'deactivate';
type TypeSystemAdminState = {
  accountStatus: TypeAccountStatus;
  activated: boolean;
  hasSystemAdmin: boolean;
};
type TypeProtectedCommand = {
  freshProof: string;
  reason: string;
};
type TypeProtectedOperationContext = {
  actorId: TableIdentity;
  commandId: string;
  target: EntityUser;
  role: EntityRole;
  membership: EntityRoleUser | undefined;
};

const FreshProofPurpose = 'admin.systemAdmin.manage';
const FreshProofMethod = 'auth-simple:password';
const FreshProofTtlMilliseconds = 5 * 60 * 1000;

@Service()
export class ServiceSystemAdmin extends BeanBase {
  async issueFreshProof(password: string): Promise<DtoSystemAdminFreshProofIssueRes> {
    const actor = await this.getCurrentSystemAdmin();
    const profileId = await this.$scope.authSimple.service.authSimple.verifyPassword(
      actor.id,
      password,
    );
    if (!profileId) this.scope.error.FreshProofInvalid.throw();
    const proof = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + FreshProofTtlMilliseconds);
    await this.scope.model.systemAdminFreshProof.insert({
      actorId: actor.id,
      proofHash: hashProof(proof),
      purpose: FreshProofPurpose,
      proofMethod: FreshProofMethod,
      expiresAt,
    });
    return { proof, expiresAt };
  }

  async grant(targetId: TableIdentity, command: DtoSystemAdminGrant): Promise<void> {
    await this.execute(
      targetId,
      'grant',
      command,
      false,
      async ({ target, role, membership, actorId, commandId }) => {
        if (membership) this.scope.error.ProtectedCommandInvalid.throw();
        if (!target.activated || target.accountStatus === 'disabled') {
          this.scope.error.InactiveSystemAdminTarget.throw();
        }
        await this.bean.role.addUserId(role.id, target.id);
        await this.accept(
          actorId,
          target.id,
          'grant',
          command.reason,
          commandId,
          toState(target, false),
          toState(target, true),
        );
      },
    );
  }

  async revoke(targetId: TableIdentity, command: DtoSystemAdminRevoke): Promise<void> {
    await this.execute(
      targetId,
      'revoke',
      command,
      false,
      async ({ target, role, membership, actorId, commandId }) => {
        if (!membership) {
          this.scope.error.ProtectedCommandInvalid.throw();
          throw new Error('system administrator membership is unavailable');
        }
        await this.ensureNotFinalSystemAdmin(target.id);
        await this.bean.role.removeUserId(role.id, target.id);
        await this.accept(
          actorId,
          target.id,
          'revoke',
          command.reason,
          commandId,
          toState(target, true),
          toState(target, false),
        );
      },
    );
  }

  async updateAccountStatus(
    targetId: TableIdentity,
    command: DtoSystemAdminAccountStatus,
  ): Promise<void> {
    const action = command.accountStatus === 'disabled' ? 'deactivate' : 'activate';
    await this.execute(
      targetId,
      action,
      command,
      true,
      async ({ target, membership, actorId, commandId }) => {
        if (!membership || target.accountStatus === command.accountStatus) {
          this.scope.error.ProtectedCommandInvalid.throw();
        }
        if (command.accountStatus === 'disabled') {
          await this.ensureNotFinalSystemAdmin(target.id);
        }
        const beforeState = toState(target, true);
        await this.$scope.homeUser.service.userAdapter.setAccountStatus(
          target.id,
          command.accountStatus,
        );
        await this.accept(actorId, target.id, action, command.reason, commandId, beforeState, {
          ...beforeState,
          accountStatus: command.accountStatus,
        });
      },
    );
  }

  async updateActivation(
    targetId: TableIdentity,
    command: DtoSystemAdminActivation,
  ): Promise<void> {
    const action = command.activated ? 'activate' : 'deactivate';
    await this.execute(
      targetId,
      action,
      command,
      true,
      async ({ target, membership, actorId, commandId }) => {
        if (!membership || target.activated === command.activated) {
          this.scope.error.ProtectedCommandInvalid.throw();
        }
        if (!command.activated) {
          await this.ensureNotFinalSystemAdmin(target.id);
        }
        const beforeState = toState(target, true);
        await this.$scope.homeUser.service.userAdapter.setActivated(target.id, command.activated);
        await this.accept(actorId, target.id, action, command.reason, commandId, beforeState, {
          ...beforeState,
          activated: command.activated,
        });
      },
    );
  }

  private async execute(
    targetId: TableIdentity,
    action: TypeSystemAdminCommand,
    command: TypeProtectedCommand,
    clearPermissionCaches: boolean,
    operation: (context: TypeProtectedOperationContext) => Promise<void>,
  ): Promise<void> {
    const actor = await this.getCurrentSystemAdmin();
    const normalizedReason = command.reason.trim();
    const reason = normalizedReason || '[invalid protected reason]';
    const commandId = randomUUID();
    try {
      await this.consumeFreshProof(actor.id, command.freshProof, commandId);
      if (!normalizedReason) {
        this.scope.error.InvalidProtectedReason.throw();
        throw new Error('protected administrator reason is required');
      }
      await this.executeAccepted(targetId, commandId, clearPermissionCaches, operation);
    } catch (error) {
      await this.appendRejectedAudit(actor.id, targetId, action, reason, commandId, error);
      throw error;
    }
  }

  @Core.transaction()
  private async executeAccepted(
    targetId: TableIdentity,
    commandId: string,
    clearPermissionCaches: boolean,
    operation: (context: TypeProtectedOperationContext) => Promise<void>,
  ): Promise<void> {
    const actor = await this.getCurrentSystemAdmin();
    const role = await this.getLockedSystemAdminRole();
    const target = await this.getLockedUser(targetId);
    const membership = await this.getLockedSystemAdminMembership(target.id, role.id);
    await operation({ actorId: actor.id, commandId, target, role, membership });
    if (clearPermissionCaches) this.ctx.db.commit(() => this.bean.permission.clearAllCaches());
  }

  @Core.transaction({ propagation: 'REQUIRES_NEW' })
  private async consumeFreshProof(
    actorId: TableIdentity,
    proof: string,
    commandId: string,
  ): Promise<void> {
    const freshProof = await this.scope.model.systemAdminFreshProof.getForUpdate({
      actorId,
      proofHash: hashProof(proof),
    });
    if (
      !freshProof ||
      freshProof.purpose !== FreshProofPurpose ||
      freshProof.proofMethod !== FreshProofMethod ||
      freshProof.consumedAt ||
      freshProof.expiresAt <= new Date()
    ) {
      this.scope.error.FreshProofInvalid.throw();
      throw new Error('fresh proof is unavailable');
    }
    await this.scope.model.systemAdminFreshProof.updateById(freshProof.id, {
      consumedAt: new Date(),
      commandId,
    });
  }

  @Core.transaction({ propagation: 'REQUIRES_NEW' })
  private async appendRejectedAudit(
    actorId: TableIdentity,
    targetId: TableIdentity,
    command: TypeSystemAdminCommand,
    reason: string,
    commandId: string,
    error: unknown,
  ): Promise<void> {
    try {
      const target = await this.getProtectedAuditTarget(targetId);
      await this.scope.model.systemAdminAudit.insert({
        actorId,
        targetId: target.id,
        command,
        result: 'rejected',
        reason,
        commandId,
        proofMethod: FreshProofMethod,
        errorCode: errorCode(error),
        beforeState: target.state,
        afterState: target.state,
        occurredAt: new Date(),
      });
    } catch (auditError) {
      this.$logger.error(auditError);
    }
  }

  private async getProtectedAuditTarget(targetId: TableIdentity): Promise<{
    id?: TableIdentity;
    state: TypeSystemAdminState | Record<string, never>;
  }> {
    const target = await this.$scope.homeUser.model.user.getById(targetId);
    if (!target) return { state: {} };
    const role = await this.$scope.homeUser.model.role.get({ name: 'systemAdmin' });
    const membership = role
      ? await this.$scope.homeUser.model.roleUser.get({ userId: target.id, roleId: role.id })
      : undefined;
    return { id: target.id, state: toState(target, !!membership) };
  }

  private async accept(
    actorId: TableIdentity,
    targetId: TableIdentity,
    command: TypeSystemAdminCommand,
    reason: string,
    commandId: string,
    beforeState: TypeSystemAdminState,
    afterState: TypeSystemAdminState,
  ): Promise<void> {
    const audit = await this.scope.model.systemAdminAudit.insert({
      actorId,
      targetId,
      command,
      result: 'accepted',
      reason,
      commandId,
      proofMethod: FreshProofMethod,
      beforeState,
      afterState,
      occurredAt: new Date(),
    });
    await this.scope.service.systemAdminSessionEviction.enqueue(targetId, audit.id);
  }

  private async getCurrentSystemAdmin(): Promise<EntityUser> {
    const actorId = this.bean.passport.currentUser?.id;
    if (!actorId || !this.bean.passport.isActivated || !this.bean.passport.isAccountActive) {
      this.scope.error.ProtectedCommandInvalid.throw();
      throw new Error('current system administrator is unavailable');
    }
    const actor = await this.$scope.homeUser.model.user.getById(actorId);
    if (!actor || !actor.activated || actor.accountStatus === 'disabled') {
      this.scope.error.ProtectedCommandInvalid.throw();
      throw new Error('current system administrator is unavailable');
    }
    const systemAdminRole = await this.$scope.homeUser.model.role.get({ name: 'systemAdmin' });
    if (!systemAdminRole) {
      this.scope.error.ProtectedCommandInvalid.throw();
      throw new Error('system administrator role is unavailable');
    }
    const membership = await this.$scope.homeUser.model.roleUser.get({
      userId: actor.id,
      roleId: systemAdminRole.id,
    });
    if (!membership) {
      this.scope.error.ProtectedCommandInvalid.throw();
      throw new Error('current system administrator membership is unavailable');
    }
    return actor;
  }

  private async getLockedSystemAdminRole(): Promise<EntityRole> {
    const role = await this.$scope.homeUser.model.role.getForUpdate({ name: 'systemAdmin' });
    if (!role) {
      this.scope.error.ProtectedCommandInvalid.throw();
      throw new Error('system administrator role is unavailable');
    }
    return role;
  }

  private async getLockedUser(id: TableIdentity): Promise<EntityUser> {
    const user = await this.$scope.homeUser.model.user.getByIdForUpdate(id);
    if (!user) this.app.throw(404, 'User not found');
    if (!user) throw new Error('user is unavailable');
    return user;
  }

  private async getLockedSystemAdminMembership(
    userId: TableIdentity,
    roleId: TableIdentity,
  ): Promise<EntityRoleUser | undefined> {
    return await this.$scope.homeUser.model.roleUser.getForUpdate({ userId, roleId });
  }

  private async ensureNotFinalSystemAdmin(targetId: TableIdentity): Promise<void> {
    const role = await this.getLockedSystemAdminRole();
    const memberships = await this.$scope.homeUser.model.roleUser.select({
      where: { roleId: role.id },
    });
    let usableCount = 0;
    for (const membership of memberships) {
      const user = await this.$scope.homeUser.model.user.getByIdForUpdate(membership.userId);
      if (
        user &&
        String(user.id) !== String(targetId) &&
        user.activated &&
        user.accountStatus !== 'disabled'
      ) {
        usableCount += 1;
      }
    }
    if (usableCount === 0) this.scope.error.FinalSystemAdminProtected.throw();
  }
}

function hashProof(proof: string) {
  return createHash('sha256').update(proof).digest('hex');
}

function toState(
  user: { activated?: boolean; accountStatus: TypeAccountStatus },
  hasSystemAdmin: boolean,
): TypeSystemAdminState {
  return {
    activated: !!user.activated,
    accountStatus: user.accountStatus,
    hasSystemAdmin,
  };
}

function errorCode(error: unknown) {
  return typeof error === 'object' && error && 'code' in error ? String(error.code) : 'unknown';
}
