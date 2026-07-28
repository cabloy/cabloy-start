import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsAdmin } from 'vona-module-start-siteadmin';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

export interface ISsrMenuOptionsMetrics extends IDecoratorSsrMenuOptions<ISsrSiteOptionsAdmin> {}

@SsrMenu<ISsrMenuOptionsMetrics>({
  items: {
    metrics: {
      title: 'Metrics',
      order: $order(90),
      icon: undefined,
      link: '/start/metrics/dashboard',
      group: 'start-siteadmin:management',
      roles: ['systemAdmin'],
    },
  },
  site: ['start-siteadmin:admin'],
})
export class SsrMenuMetrics extends BeanBase {}
