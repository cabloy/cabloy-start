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
    const removedRoleIds = this.uniqueIds(data.removedRoleIds);
    if (removedRoleIds.length) {
      const roleMenus = await this.scope.model.roleMenu.select({
        where: { roleId: { _in_: removedRoleIds } },
      });
      if (roleMenus.length) {
        await this.scope.model.roleMenu.deleteBulk(roleMenus.map(item => item.id));
        await this.scope.service.menuVisibilityRevision.invalidate();
      }
    }
    return await next(data);
  }

  private uniqueIds(ids: string[] | undefined): string[] {
    return [...new Set((ids ?? []).filter(id => typeof id === 'string' && id.length > 0))];
  }
}
