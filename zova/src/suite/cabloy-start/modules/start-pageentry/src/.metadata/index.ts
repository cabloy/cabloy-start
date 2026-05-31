// eslint-disable
/** controller: begin */
export * from '../component/blockForm/controller.jsx';
export * from '../component/blockPageEntry/controller.jsx';
export * from '../component/blockToolbarRow/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-pageentry' {
  
        export interface ControllerBlockForm {
          /** @internal */
          get scope(): ScopeModuleStartPageentry;
        }

        export interface ControllerBlockPageEntry {
          /** @internal */
          get scope(): ScopeModuleStartPageentry;
        }

        export interface ControllerBlockToolbarRow {
          /** @internal */
          get scope(): ScopeModuleStartPageentry;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerBlockForm } from '../component/blockForm/controller.jsx';
import { ControllerBlockPageEntry } from '../component/blockPageEntry/controller.jsx';
import { ControllerBlockToolbarRow } from '../component/blockToolbarRow/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-pageentry.controller.blockForm': ControllerBlockForm;
'start-pageentry.controller.blockPageEntry': ControllerBlockPageEntry;
'start-pageentry.controller.blockToolbarRow': ControllerBlockToolbarRow;
  }
}
/** controller: end */

/** components: begin */
export * from './component/blockForm.js';
import { ZBlockForm } from './component/blockForm.js';
export * from './component/blockPageEntry.js';
import { ZBlockPageEntry } from './component/blockPageEntry.js';
export * from './component/blockToolbarRow.js';
import { ZBlockToolbarRow } from './component/blockToolbarRow.js';
export const components = {
  'blockForm': ZBlockForm,
'blockPageEntry': ZBlockPageEntry,
'blockToolbarRow': ZBlockToolbarRow,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-pageentry:blockForm': ControllerBlockForm;
'start-pageentry:blockPageEntry': ControllerBlockPageEntry;
'start-pageentry:blockToolbarRow': ControllerBlockToolbarRow;
}
export interface IZovaComponentRecord {
  'start-pageentry:blockForm': typeof ZBlockForm;
'start-pageentry:blockPageEntry': typeof ZBlockPageEntry;
'start-pageentry:blockToolbarRow': typeof ZBlockToolbarRow;
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
export class ScopeModuleStartPageentry extends BeanScopeBase {}

export interface ScopeModuleStartPageentry {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-pageentry': ScopeModuleStartPageentry;
  }
  
  

  export interface IBeanScopeLocale {
    'start-pageentry': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `start-pageentry::${K}` {
  return `start-pageentry::${key}`;
}  
/** scope: end */
