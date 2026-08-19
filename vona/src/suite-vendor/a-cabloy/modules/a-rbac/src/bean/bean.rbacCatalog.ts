import type { ContextRoute } from 'vona-module-a-web';

import { beanFullNameFromOnionName, BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';
import { getCacheControllerRoutes } from 'vona-module-a-web';

import type { IRbacActionDescriptor } from '../types/rbac.ts';
import type { IGuardOptionsRbac } from './guard.rbac.ts';

import { rbacActionKey } from '../lib/rbac.ts';

const BeanFullNameGuardRbac = beanFullNameFromOnionName('a-rbac:rbac', 'guard');

@Bean()
export class BeanRbacCatalog extends BeanBase {
  private _catalog: Map<string, IRbacActionDescriptor> | undefined;

  getAction(route: ContextRoute): IRbacActionDescriptor | undefined {
    return this.getCatalog().get(rbacActionKey(route.controllerBeanFullName, route.action));
  }

  getCatalog(): ReadonlyMap<string, IRbacActionDescriptor> {
    if (!this._catalog) this._catalog = this.createCatalog();
    return this._catalog;
  }

  clear(): void {
    this._catalog = undefined;
  }

  private createCatalog(): Map<string, IRbacActionDescriptor> {
    const catalog = new Map<string, IRbacActionDescriptor>();
    const routesByController = getCacheControllerRoutes(this.app);
    for (const routes of Object.values(routesByController)) {
      for (const route of routes) {
        const options = route.route.meta?.[BeanFullNameGuardRbac] as IGuardOptionsRbac | undefined;
        if (!options) continue;
        const actionKey = rbacActionKey(route.controllerBeanFullName, route.action);
        catalog.set(actionKey, {
          actionKey,
          controllerBeanFullName: route.controllerBeanFullName,
          action: route.action,
          route,
          options: Object.freeze({ ...options }),
        });
      }
    }
    this.validateActionInherit(catalog);
    return catalog;
  }

  private validateActionInherit(catalog: ReadonlyMap<string, IRbacActionDescriptor>): void {
    for (const descriptor of catalog.values()) {
      const seen = new Set<string>();
      let current = descriptor;
      while (current.options.actionInherit) {
        if (seen.has(current.actionKey)) {
          throw new Error(`RBAC actionInherit cycle: ${descriptor.actionKey}`);
        }
        seen.add(current.actionKey);
        const action = current.options.actionInherit;
        if (action === current.action) {
          throw new Error(`RBAC actionInherit cannot reference itself: ${current.actionKey}`);
        }
        const targetKey = rbacActionKey(current.controllerBeanFullName, action);
        const target = catalog.get(targetKey);
        if (!target) {
          throw new Error(`RBAC actionInherit target not found: ${current.actionKey} -> ${action}`);
        }
        current = target;
      }
    }
  }
}
