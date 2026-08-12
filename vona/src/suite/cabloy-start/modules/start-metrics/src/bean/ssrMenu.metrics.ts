import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsAdmin } from 'vona-module-start-siteadmin';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsMetrics extends IDecoratorSsrMenuOptions<ISsrSiteOptionsAdmin> {}

@SsrMenu<ISsrMenuOptionsMetrics>({
  items: {
    metrics: {
      title: $locale('Metrics'),
      order: $order(90),
      icon: undefined,
      link: '/start/metrics/dashboard',
      group: 'start-siteadmin:systemManagement',
      roles: ['systemAdmin'],
    },
  },
})
export class SsrMenuMetrics extends BeanBase {}
