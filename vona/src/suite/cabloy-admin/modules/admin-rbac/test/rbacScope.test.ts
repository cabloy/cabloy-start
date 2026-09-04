import type { IRbacPolicyRequest } from 'vona-module-a-rbac';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const actionKey = 'training-student.controller.student#select';

function createRequest(): IRbacPolicyRequest {
  const action = app.bean.rbacCatalog.getCatalog().get(actionKey);
  assert.ok(action);
  return { action, policyActionKey: actionKey };
}

describe('rbacScope.test.ts', { concurrency: false }, () => {
  it('exposes the configured Start RBAC scope adapter', async () => {
    await app.bean.executor.mockCtx(async () => {
      const adapter = app.scope('admin-rbac').service.rbacScopeAdapter;
      assert.equal(typeof adapter.isUnrestricted, 'function');
      assert.equal(typeof adapter.ownerValues, 'function');
    });
  });

  it('service:rbacPolicy resolves five data scopes with union and all dominance', async () => {
    const suffix = crypto.randomUUID();
    const grantIds: string[] = [];
    const grantDepartmentIds: string[] = [];
    const membershipIds: string[] = [];
    const departmentIds: string[] = [];
    const userIds: string[] = [];
    let roleId: string | undefined;
    let delegatedUserName: string | undefined;
    let delegatedUserId: string | undefined;
    let customDepartmentId: string | undefined;
    let ownDepartmentId: string | undefined;
    let descendantDepartmentId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          const delegatedUser = await app.bean.user.register({
            name: `admin-rbac-scope-${suffix}`,
          });
          await app.bean.user.activate(delegatedUser);
          delegatedUserName = delegatedUser.name;
          delegatedUserId = String(delegatedUser.id);
          userIds.push(delegatedUserId);

          const role = await app.scope('admin-role').service.role.create({
            name: `admin-rbac-scope-role-${suffix}`,
            title: 'RBAC scope resolver fixture',
            siteIds: ['admin'],
          });
          roleId = String(role.id);

          const departments = app.scope('admin-department').service.department;
          const custom = await departments.create({
            name: `RBAC custom ${suffix}`,
            parentId: null,
          });
          const own = await departments.create({ name: `RBAC own ${suffix}`, parentId: null });
          const descendant = await departments.create({
            name: `RBAC descendant ${suffix}`,
            parentId: own.id,
          });
          const disabled = await departments.create({
            name: `RBAC disabled ${suffix}`,
            parentId: null,
          });
          await departments.updateActivation(disabled.id, { enabled: false });
          customDepartmentId = String(custom.id);
          ownDepartmentId = String(own.id);
          descendantDepartmentId = String(descendant.id);
          departmentIds.push(
            customDepartmentId,
            ownDepartmentId,
            descendantDepartmentId,
            String(disabled.id),
          );

          const membership = await departments.createMembership(own.id, {
            userId: delegatedUser.id,
          });
          membershipIds.push(String(membership.id));

          const adminRbac = app.scope('admin-rbac');
          for (const dataScope of [
            'customDepartments',
            'ownDepartment',
            'ownDepartmentAndDescendants',
            'mine',
          ] as const) {
            const grant = await adminRbac.service.rbacGrant.create({
              roleId: role.id,
              actionKey,
              dataScope,
              enabled: true,
            });
            grantIds.push(String(grant.id));
            if (dataScope === 'customDepartments') {
              const customAssociation = await adminRbac.service.rbacGrantDepartment.create({
                rbacGrantId: grant.id,
                departmentId: custom.id,
              });
              const disabledAssociation = await adminRbac.model.rbacGrantDepartment.insert({
                rbacGrantId: grant.id,
                departmentId: disabled.id,
              });
              grantDepartmentIds.push(String(customAssociation.id), String(disabledAssociation.id));
            }
          }

          await app.scope('admin-role').service.role.replaceUserRoles(delegatedUser.id, {
            roleIds: [role.id],
          });
        } finally {
          await app.bean.passport.signout();
        }
      });

      assert.ok(roleId);
      assert.ok(delegatedUserName);
      assert.ok(delegatedUserId);
      assert.ok(customDepartmentId);
      assert.ok(ownDepartmentId);
      assert.ok(descendantDepartmentId);
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinSystem('mock', -10001 as any, delegatedUserName!);
        try {
          const policy = app.scope('admin-rbac').service.rbacPolicy;
          const decision = await policy.resolve(createRequest());
          assert.equal(decision.allowed, true);
          assert.deepEqual(decision.terms, [
            { dataScope: 'mine', ownerId: delegatedUserId },
            { dataScope: 'customDepartments', departmentIds: [customDepartmentId] },
            { dataScope: 'ownDepartment', departmentIds: [ownDepartmentId] },
            {
              dataScope: 'ownDepartmentAndDescendants',
              departmentIds: [ownDepartmentId, descendantDepartmentId],
            },
          ]);
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          const grant = await app.scope('admin-rbac').service.rbacGrant.create({
            roleId: roleId!,
            actionKey,
            dataScope: 'all',
            enabled: true,
          });
          grantIds.push(String(grant.id));
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinSystem('mock', -10001 as any, delegatedUserName!);
        try {
          const decision = await app
            .scope('admin-rbac')
            .service.rbacPolicy.resolve(createRequest());
          assert.equal(decision.allowed, true);
          assert.deepEqual(decision.terms, [{ dataScope: 'all' }]);
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const adminRbac = app.scope('admin-rbac');
        for (const grantDepartmentId of grantDepartmentIds.toReversed()) {
          await adminRbac.model.rbacGrantDepartment.deleteById(grantDepartmentId);
        }
        for (const grantId of grantIds.toReversed()) {
          await adminRbac.model.rbacGrant.deleteById(grantId);
        }
        if (membershipIds.length) {
          await app.scope('admin-department').model.departmentMembership.delete({
            id: { _in_: membershipIds },
          });
        }
        for (const departmentId of departmentIds.toReversed()) {
          await app.scope('admin-department').model.department.deleteById(departmentId);
        }
        if (delegatedUserId) {
          await app.scope('home-user').model.roleUser.delete({ userId: delegatedUserId });
        }
        if (roleId) await app.scope('home-user').model.role.deleteById(roleId);
        for (const userId of userIds.toReversed()) {
          await app.bean.user.removeById(userId);
        }
      });
    }
  });
});
