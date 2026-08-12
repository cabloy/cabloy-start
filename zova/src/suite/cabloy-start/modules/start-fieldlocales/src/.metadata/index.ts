// eslint-disable
/** controller: begin */
export * from '../component/formFieldLocalizedText/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-fieldlocales' {
  
        export interface ControllerFormFieldLocalizedText {
          /** @internal */
          get scope(): ScopeModuleStartFieldlocales;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldLocalizedText } from '../component/formFieldLocalizedText/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-fieldlocales.controller.formFieldLocalizedText': ControllerFormFieldLocalizedText;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldLocalizedText.js';
import { ZFormFieldLocalizedText } from './component/formFieldLocalizedText.js';
export const components = {
  'formFieldLocalizedText': ZFormFieldLocalizedText,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-fieldlocales:formFieldLocalizedText': ControllerFormFieldLocalizedText;
}
export interface IZovaComponentRecord {
  'start-fieldlocales:formFieldLocalizedText': typeof ZFormFieldLocalizedText;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.localizedText.jsx';
import { ITableCellOptionsLocalizedText } from '../bean/tableCell.localizedText.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'start-fieldlocales:localizedText': ITableCellOptionsLocalizedText;
    }

  
}
declare module 'zova-module-start-fieldlocales' {
  
        export interface TableCellLocalizedText {
          /** @internal */
          get scope(): ScopeModuleStartFieldlocales;
        }

        export interface TableCellLocalizedText {
          get $beanFullName(): 'start-fieldlocales.tableCell.localizedText';
          get $onionName(): 'start-fieldlocales:localizedText';
          get $onionOptions(): ITableCellOptionsLocalizedText;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellLocalizedText } from '../bean/tableCell.localizedText.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-fieldlocales.tableCell.localizedText': TableCellLocalizedText;
  }
}
/** tableCell: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartFieldlocales extends BeanScopeBase {}

export interface ScopeModuleStartFieldlocales {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-fieldlocales': ScopeModuleStartFieldlocales;
  }
  
  

  export interface IBeanScopeLocale {
    'start-fieldlocales': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `start-fieldlocales::${K}` {
  return `start-fieldlocales::${key}`;
}
/** scope: end */
