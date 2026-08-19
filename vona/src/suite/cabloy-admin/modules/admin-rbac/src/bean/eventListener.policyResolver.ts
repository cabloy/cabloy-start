import type {
  IEventExecute,
  NextEvent,
} from 'vona-module-a-event';
import type {
  TypeEventResolvePolicyData,
  TypeEventResolvePolicyResult,
} from 'vona-module-a-rbac';

import { BeanBase } from 'vona';
import { EventListener } from 'vona-module-a-event';

@EventListener({ match: 'a-rbac:resolvePolicy' })
export class EventListenerPolicyResolver
  extends BeanBase
  implements IEventExecute<TypeEventResolvePolicyData, TypeEventResolvePolicyResult>
{
  async execute(
    data: TypeEventResolvePolicyData,
    next: NextEvent<TypeEventResolvePolicyData, TypeEventResolvePolicyResult>,
  ): Promise<TypeEventResolvePolicyResult> {
    const decision = await this.scope.service.rbacPolicy.resolve(data);
    if (decision) return decision;
    return next(data);
  }
}
