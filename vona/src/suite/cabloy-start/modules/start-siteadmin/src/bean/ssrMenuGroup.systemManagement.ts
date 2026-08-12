import type { IDecoratorSsrMenuGroupOptions } from 'vona-module-a-ssr';
import type { IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenuGroup } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuGroupOptionsSystemManagement extends IDecoratorSsrMenuGroupOptions<
  IDecoratorSsrSiteOptions<any, any, any>
> {}

@SsrMenuGroup<ISsrMenuGroupOptionsSystemManagement>({
  item: {
    title: $locale('SystemManagement'),
    order: $order(1),
    icon: undefined,
  },
})
export class SsrMenuGroupSystemManagement extends BeanBase {}
