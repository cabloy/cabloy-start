import type { IEventExecute, NextEvent } from 'vona-module-a-event';
import type {
  TypeEventResolveMenuVisibilityData,
  TypeEventResolveMenuVisibilityResult,
} from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { EventListener } from 'vona-module-a-event';

@EventListener({ match: 'a-ssr:resolveMenuVisibility' })
export class EventListenerMenuVisibilityResolver
  extends BeanBase
  implements
    IEventExecute<TypeEventResolveMenuVisibilityData, TypeEventResolveMenuVisibilityResult>
{
  async execute(
    data: TypeEventResolveMenuVisibilityData,
    next: NextEvent<TypeEventResolveMenuVisibilityData, TypeEventResolveMenuVisibilityResult>,
  ): Promise<TypeEventResolveMenuVisibilityResult> {
    const menusVisible = await next(data);
    const roleIds = [...new Set(data.currentRoleIds.map(String))];
    const menuNames = data.menus.filter(menu => menu.roles !== undefined).map(menu => menu.name);
    if (!roleIds.length || !menuNames.length) return menusVisible;

    const associations = await this.scope.model.roleMenu.select({
      where: {
        roleId: { _in_: roleIds },
        ssrSiteName: data.ssrSiteName,
        ssrMenuName: { _in_: menuNames },
      },
      columns: ['ssrMenuName'],
    });
    if (!associations.length) return menusVisible;

    const associatedMenuNames = new Set(associations.map(association => association.ssrMenuName));
    const visibleMenuNames = new Set(menusVisible.map(menu => menu.name));
    return data.menus.filter(
      menu => visibleMenuNames.has(menu.name) || associatedMenuNames.has(menu.name),
    );
  }
}
