import type { IDecoratorSsrMenuOptions, IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsUser extends IDecoratorSsrMenuOptions<
  IDecoratorSsrSiteOptions<any, any, any>
> {}

@SsrMenu<ISsrMenuOptionsUser>({
  items: {
    user: {
      title: $locale('User'),
      order: $order(1),
      icon: undefined,
      link: 'presetResource',
      meta: {
        params: {
          resource: 'admin-user:user',
        },
      },
      group: 'start-siteadmin:systemManagement',
      roles: ['systemAdmin'],
    },
  },
})
export class SsrMenuUser extends BeanBase {}
