// eslint-disable
/** controller: begin */
export * from '../component/blockFilter/controller.tsx';
export * from '../component/blockFilterActions/controller.tsx';
export * from '../component/blockPage/controller.tsx';
export * from '../component/blockTable/controller.tsx';
export * from '../component/blockToolbarBulk/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-page' {

        export interface ControllerBlockFilter {
          /** @internal */
          get scope(): ScopeModuleStartPage;
        }

        export interface ControllerBlockFilterActions {
          /** @internal */
          get scope(): ScopeModuleStartPage;
        }

        export interface ControllerBlockPage {
          /** @internal */
          get scope(): ScopeModuleStartPage;
        }

        export interface ControllerBlockTable {
          /** @internal */
          get scope(): ScopeModuleStartPage;
        }

        export interface ControllerBlockToolbarBulk {
          /** @internal */
          get scope(): ScopeModuleStartPage;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerBlockFilter } from '../component/blockFilter/controller.tsx';
import type { ControllerBlockFilterActions } from '../component/blockFilterActions/controller.tsx';
import type { ControllerBlockPage } from '../component/blockPage/controller.tsx';
import type { ControllerBlockTable } from '../component/blockTable/controller.tsx';
import type { ControllerBlockToolbarBulk } from '../component/blockToolbarBulk/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-page.controller.blockFilter': ControllerBlockFilter;
'start-page.controller.blockFilterActions': ControllerBlockFilterActions;
'start-page.controller.blockPage': ControllerBlockPage;
'start-page.controller.blockTable': ControllerBlockTable;
'start-page.controller.blockToolbarBulk': ControllerBlockToolbarBulk;
  }
}
/** controller: end */

/** components: begin */
export * from './component/blockFilter.ts';
import { ZBlockFilter } from './component/blockFilter.ts';
export * from './component/blockFilterActions.ts';
import { ZBlockFilterActions } from './component/blockFilterActions.ts';
export * from './component/blockPage.ts';
import { ZBlockPage } from './component/blockPage.ts';
export * from './component/blockTable.ts';
import { ZBlockTable } from './component/blockTable.ts';
export * from './component/blockToolbarBulk.ts';
import { ZBlockToolbarBulk } from './component/blockToolbarBulk.ts';
export const components = {
  'blockFilter': ZBlockFilter,
'blockFilterActions': ZBlockFilterActions,
'blockPage': ZBlockPage,
'blockTable': ZBlockTable,
'blockToolbarBulk': ZBlockToolbarBulk,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-page:blockFilter': ControllerBlockFilter;
'start-page:blockFilterActions': ControllerBlockFilterActions;
'start-page:blockPage': ControllerBlockPage;
'start-page:blockTable': ControllerBlockTable;
'start-page:blockToolbarBulk': ControllerBlockToolbarBulk;
}
export interface IZovaComponentRecord {
  'start-page:blockFilter': typeof ZBlockFilter;
'start-page:blockFilterActions': typeof ZBlockFilterActions;
'start-page:blockPage': typeof ZBlockPage;
'start-page:blockTable': typeof ZBlockTable;
'start-page:blockToolbarBulk': typeof ZBlockToolbarBulk;
}
}
/** components: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartPage extends BeanScopeBase {}

export interface ScopeModuleStartPage {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-page': ScopeModuleStartPage;
  }



  export interface IBeanScopeLocale {
    'start-page': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `start-page::${K}` {
  return `start-page::${key}`;
}
/** scope: end */
