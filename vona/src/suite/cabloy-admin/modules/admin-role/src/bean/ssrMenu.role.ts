import type { IDecoratorSsrMenuOptions, IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsRole extends IDecoratorSsrMenuOptions<
  IDecoratorSsrSiteOptions<any, any, any>
> {}

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
    group: 'start-siteadmin:systemManagement',
    roles: ['systemAdmin'],
  },
})
export class SsrMenuRole extends BeanBase {}
