import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { TypeAccountStatus } from 'vona-module-a-user';
import type { EntityUser, ModelUser } from 'vona-module-home-user';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoUserDepartmentMembershipSummary } from '../dto/userDepartmentMembershipSummary.ts';
import type { DtoUserRoleSummary } from '../dto/userRoleSummary.ts';
import type { DtoUserSelectRes } from '../dto/userSelectRes.tsx';
import type { DtoUserSelectResItem } from '../dto/userSelectResItem.tsx';
import type { DtoUserUpdate } from '../dto/userUpdate.tsx';
import type { DtoUserView } from '../dto/userView.tsx';

function toUserItem(user: EntityUser) {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    email: user.email,
    mobile: user.mobile,
    activated: user.activated,
    accountStatus: user.accountStatus,
    locale: user.locale,
    tz: user.tz,
  };
}

@Service()
export class ServiceUser extends BeanBase {
  async select(params?: IQueryParams<ModelUser>): Promise<DtoUserSelectRes> {
    const result = await this.$scope.homeUser.model.user.selectAndCount(params);
    return {
      ...result,
      list: result.list.map(toUserItem) as DtoUserSelectResItem[],
    };
  }

  async view(id: TableIdentity): Promise<DtoUserView | undefined> {
    const user = await this.$scope.homeUser.model.user.getById(id);
    if (!user) return undefined;

    const [roles, memberships] = await Promise.all([
      this.$scope.homeUser.model.roleUser.select({ where: { userId: user.id } }),
      this.app.scope('admin-department').model.departmentMembership.select({
        where: { userId: user.id },
        orders: [['id', 'asc']],
      }),
    ]);
    const roleIds = roles.map(item => item.roleId);
    const roleEntities = roleIds.length
      ? await this.$scope.homeUser.model.role.select({ where: { id: { _in_: roleIds } } })
      : [];
    const rolesById = new Map(roleEntities.map(role => [String(role.id), role]));
    const roleSummaries: DtoUserRoleSummary[] = roles.flatMap(item => {
      const role = rolesById.get(String(item.roleId));
      if (!role) return [];
      return [
        {
          id: role.id,
          name: role.name,
          title: role.title,
          systemAdmin: role.name === 'systemAdmin',
        },
      ];
    });

    const departmentIds = memberships.map(item => item.departmentId);
    const departments = departmentIds.length
      ? await this.app.scope('admin-department').model.department.mget(departmentIds)
      : [];
    const departmentsById = new Map(
      departments.map(department => [String(department.id), department]),
    );
    const membershipSummaries = memberships.flatMap(
      (membership): DtoUserDepartmentMembershipSummary[] => {
        const department = departmentsById.get(String(membership.departmentId));
        if (!department) return [];
        return [
          {
            id: membership.id,
            departmentId: department.id,
            departmentName: department.name,
            position: membership.position ?? null,
            enabled: membership.enabled,
            primary: membership.primary,
          },
        ];
      },
    );

    return {
      ...toUserItem(user),
      roles: roleSummaries,
      departmentMemberships: membershipSummaries,
    } as DtoUserView;
  }

  @Core.transaction()
  async update(id: TableIdentity, user: DtoUserUpdate): Promise<void> {
    const target = await this.$scope.homeUser.model.user.getByIdForUpdate(id);
    if (!target) this.app.throw(404, 'User not found');
    if (user.email) {
      const existing = await this.$scope.homeUser.model.user.getByEmailEqI(user.email);
      if (existing && String(existing.id) !== String(id)) {
        this.scope.error.EmailAlreadyInUse.throw();
      }
    }
    await this.$scope.homeUser.model.user.updateById(id, user);
  }

  @Core.transaction()
  async activate(id: TableIdentity): Promise<void> {
    const user = await this.$scope.homeUser.model.user.getByIdForUpdate(id);
    if (!user) this.app.throw(404, 'User not found');
    await this.bean.user.activate(user);
  }

  @Core.transaction()
  async updateAccountStatus(id: TableIdentity, accountStatus: TypeAccountStatus): Promise<void> {
    const user = await this.$scope.homeUser.model.user.getByIdForUpdate(id, {
      include: { roles: true },
    });
    if (!user) this.app.throw(404, 'User not found');
    if (accountStatus === 'disabled' && user.roles?.some(role => role.name === 'systemAdmin')) {
      this.scope.error.ProtectedSystemAdminTransition.throw();
    }
    if (user.accountStatus === accountStatus) return;
    await this.$scope.homeUser.service.userAdapter.setAccountStatus(id, accountStatus);
    await this.bean.permission.clearAllCaches();
    if (accountStatus === 'disabled') {
      await this.bean.passport.kickOut(user);
    }
  }
}
