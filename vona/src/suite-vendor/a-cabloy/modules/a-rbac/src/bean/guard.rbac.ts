import type { IDecoratorGuardOptions } from 'vona-module-a-aspect';

import { Guard, GuardBase } from 'vona-module-a-aspect';

import { setRbacDecision } from '../lib/rbac.ts';

export interface IGuardOptionsRbac extends IDecoratorGuardOptions {
  dataScope?: boolean;
  dataScopeField?: string;
  dataScopeMineField?: string;
  actionInherit?: string;
}

@Guard<IGuardOptionsRbac>({
  dataScopeField: 'departmentId',
  dataScopeMineField: 'userIdOwner',
})
export class GuardRbac extends GuardBase {
  async check(options: IGuardOptionsRbac): Promise<boolean> {
    const action = this.bean.rbacCatalog.getAction(this.ctx.route);
    if (!action) return false;
    const decision = await this.scope.event.resolvePolicy.emit(
      { action: { ...action, options: { ...action.options, ...options } } },
      async () => undefined,
    );
    if (!decision || decision.actionKey !== action.actionKey) return false;
    setRbacDecision(this.ctx, decision);
    return decision.allowed;
  }
}
