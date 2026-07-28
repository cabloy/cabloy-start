import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsAdmin } from 'vona-module-start-siteadmin';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsStudent extends IDecoratorSsrMenuOptions<ISsrSiteOptionsAdmin> {}

@SsrMenu<ISsrMenuOptionsStudent>({
  items: {
    student: {
      title: $locale('Student'),
      order: $order(1),
      icon: undefined,
      link: 'presetResource',
      meta: {
        params: {
          resource: 'training-student:student',
        },
      },
      group: 'start-siteadmin:management',
      roles: ['systemAdmin'],
    },
  },
  site: ['start-siteadmin:admin'],
})
export class SsrMenuStudent extends BeanBase {}
