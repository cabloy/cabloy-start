import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import type { ISsrSiteOptionsWeb } from './ssrSite.web.ts';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsHome extends IDecoratorSsrMenuOptions<ISsrSiteOptionsWeb> {}

@SsrMenu<ISsrMenuOptionsHome>({
  item: {
    title: $locale('Home'),
    order: $order(1, 'core'),
    icon: '::home',
    link: '/home/indexweb/home/:locale?',
    meta: {
      params: {
        locale: true,
      },
    },
  },
  site: ['start-siteweb:web'],
})
export class SsrMenuHome extends BeanBase {}
