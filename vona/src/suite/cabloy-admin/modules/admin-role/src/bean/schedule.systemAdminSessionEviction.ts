import type { IScheduleExecute } from 'vona-module-a-schedule';

import { BeanBase } from 'vona';
import { Schedule } from 'vona-module-a-schedule';

@Schedule({ repeat: { every: 60 * 1000 } })
export class ScheduleSystemAdminSessionEviction extends BeanBase implements IScheduleExecute {
  async execute() {
    await this.scope.service.systemAdminSessionEviction.queueDue();
  }
}
