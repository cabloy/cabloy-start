// eslint-disable
/** controller: begin */
export * from '../component/blockFilter/controller.jsx';
export * from '../component/blockFilterActions/controller.jsx';
export * from '../component/blockPage/controller.jsx';
export * from '../component/blockTable/controller.jsx';
export * from '../component/blockToolbarBulk/controller.jsx';

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
import { ControllerBlockFilter } from '../component/blockFilter/controller.jsx';
import { ControllerBlockFilterActions } from '../component/blockFilterActions/controller.jsx';
import { ControllerBlockPage } from '../component/blockPage/controller.jsx';
import { ControllerBlockTable } from '../component/blockTable/controller.jsx';
import { ControllerBlockToolbarBulk } from '../component/blockToolbarBulk/controller.jsx';
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
export * from './component/blockFilter.js';
import { ZBlockFilter } from './component/blockFilter.js';
export * from './component/blockFilterActions.js';
import { ZBlockFilterActions } from './component/blockFilterActions.js';
export * from './component/blockPage.js';
import { ZBlockPage } from './component/blockPage.js';
export * from './component/blockTable.js';
import { ZBlockTable } from './component/blockTable.js';
export * from './component/blockToolbarBulk.js';
import { ZBlockToolbarBulk } from './component/blockToolbarBulk.js';
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
import { locales } from './locales.js';
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
