import type { TableIdentity } from 'table-identity';
import type { IQueueExecute, IQueuePushOptions } from 'vona-module-a-queue';

import { BeanQueueBase, Queue } from 'vona-module-a-queue';

export interface ISystemAdminSessionEvictionJobData {
  evictionId: TableIdentity;
}

@Queue()
export class QueueSystemAdminSessionEviction
  extends BeanQueueBase<ISystemAdminSessionEvictionJobData, void>
  implements IQueueExecute<ISystemAdminSessionEvictionJobData, void>
{
  async execute(
    data: ISystemAdminSessionEvictionJobData,
    _options?: IQueuePushOptions,
  ): Promise<void> {
    const eviction = await this.scope.service.systemAdminSessionEviction.claim(data.evictionId);
    if (!eviction) return;
    try {
      const user = await this.$scope.homeUser.model.user.getById(eviction.targetId);
      if (!user) this.app.throw(404, 'User not found');
      await this.bean.passport.kickOut(user);
      await this.scope.service.systemAdminSessionEviction.markDispatched(
        eviction.id,
        eviction.claimToken!,
      );
    } catch (error) {
      await this.scope.service.systemAdminSessionEviction.release(
        eviction.id,
        eviction.claimToken!,
        error,
      );
    }
  }
}
