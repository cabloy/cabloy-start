import type { TableIdentity } from 'table-identity';
import type { IRbacScopeAdapter } from 'vona-module-a-rbac';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

@Service()
export class ServiceRbacScopeAdapter extends BeanBase implements IRbacScopeAdapter {
  async isUnrestricted(): Promise<boolean> {
    return await this.bean.passport.isSystemAdmin();
  }

  async ownerValues(
    _action: unknown,
    _decision: unknown,
  ): Promise<{ departmentId: TableIdentity | null; userIdOwner: TableIdentity }> {
    const userIdOwner = this.bean.passport.currentUser?.id;
    if (!userIdOwner) this.app.throw(401);
    return {
      departmentId: await this.creatorDepartmentId(userIdOwner),
      userIdOwner,
    };
  }

  private async creatorDepartmentId(userId: TableIdentity): Promise<TableIdentity | null> {
    const departmentScope = this.app.scope('admin-department');
    const memberships = await departmentScope.model.departmentMembership.select({
      where: { userId, enabled: true },
      orders: [['id', 'asc']],
    });
    if (!memberships.length) return null;

    const departments = await departmentScope.model.department.select({
      where: {
        id: { _in_: memberships.map(item => item.departmentId) },
        enabled: true,
      },
    });
    const enabledDepartmentIds = new Set(departments.map(item => String(item.id)));
    const enabledMemberships = memberships.filter(membership =>
      enabledDepartmentIds.has(String(membership.departmentId)),
    );
    if (enabledMemberships.length === 1) return enabledMemberships[0].departmentId;

    const primaryMemberships = enabledMemberships.filter(membership => membership.primary);
    return primaryMemberships.length === 1 ? primaryMemberships[0].departmentId : null;
  }
}
