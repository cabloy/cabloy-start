import type { IEventExecute, NextEvent } from 'vona-module-a-event';
import type {
  TypeEventPolicyInvalidatedData,
  TypeEventPolicyInvalidatedResult,
} from 'vona-module-a-rbac';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { EventListener } from 'vona-module-a-event';

type TypeEventData = TypeEventPolicyInvalidatedData;
type TypeEventResult = TypeEventPolicyInvalidatedResult;

@EventListener({ match: 'a-rbac:policyInvalidated' })
export class EventListenerPolicyInvalidated
  extends BeanBase
  implements IEventExecute<TypeEventData, TypeEventResult>
{
  @Core.transaction()
  async execute(
    data: TypeEventData,
    next: NextEvent<TypeEventData, TypeEventResult>,
  ): Promise<TypeEventResult> {
    await this.removeInvalidatedGrants(data);
    await this.scope.service.rbacPolicyRevision.invalidate();
    this.ctx.db.commit(() => this.bean.permission.clearAllCaches());
    return await next(data);
  }

  private async removeInvalidatedGrants(data: TypeEventData): Promise<void> {
    const removedScopeIds = this.uniqueIds(data.removedScopeIds);
    if (removedScopeIds.length) {
      const grantDepartments = await this.scope.model.rbacGrantDepartment.select({
        where: { departmentId: { _in_: removedScopeIds } },
      });
      if (grantDepartments.length) {
        await this.scope.model.rbacGrantDepartment.deleteBulk(
          grantDepartments.map(item => item.id),
        );
      }
    }
    const removedRoleIds = this.uniqueIds(data.removedRoleIds);
    if (!removedRoleIds.length) return;
    const grants = await this.scope.model.rbacGrant.select({
      where: { roleId: { _in_: removedRoleIds } },
    });
    if (grants.length) {
      const grantDepartments = await this.scope.model.rbacGrantDepartment.select({
        where: { rbacGrantId: { _in_: grants.map(item => item.id) } },
      });
      if (grantDepartments.length) {
        await this.scope.model.rbacGrantDepartment.deleteBulk(
          grantDepartments.map(item => item.id),
        );
      }
      await this.scope.model.rbacGrant.deleteBulk(grants.map(item => item.id));
    }
  }

  private uniqueIds(ids: string[] | undefined): string[] {
    return [...new Set((ids ?? []).filter(id => typeof id === 'string' && id.length > 0))];
  }
}
