import type { IDecoratorSsrMenuOptions, IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsDepartment extends IDecoratorSsrMenuOptions<
  IDecoratorSsrSiteOptions<any, any, any>
> {}

@SsrMenu<ISsrMenuOptionsDepartment>({
  item: {
    title: $locale('Department'),
    order: $order(12),
    icon: undefined,
    link: 'presetResource',
    meta: {
      params: {
        resource: 'admin-department:department',
      },
    },
    group: 'start-siteadmin:systemManagement',
    roles: ['systemAdmin'],
  },
})
export class SsrMenuDepartment extends BeanBase {}
