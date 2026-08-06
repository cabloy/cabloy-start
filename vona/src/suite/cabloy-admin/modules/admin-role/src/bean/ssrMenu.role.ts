import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsAdmin } from 'vona-module-start-siteadmin';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsRole extends IDecoratorSsrMenuOptions<ISsrSiteOptionsAdmin> {}

@SsrMenu<ISsrMenuOptionsRole>({
  item: {
    title: $locale('Role'),
    order: $order(11),
    icon: undefined,
    link: 'presetResource',
    meta: {
      params: {
        resource: 'admin-role:role',
      },
    },
    group: 'start-siteadmin:management',
    roles: ['systemAdmin'],
  },
  site: ['start-siteadmin:admin'],
})
export class SsrMenuRole extends BeanBase {}
