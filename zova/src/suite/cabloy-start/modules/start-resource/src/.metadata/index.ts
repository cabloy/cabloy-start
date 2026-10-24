// eslint-disable
/** controller: begin */
export * from '../component/blockResourcePickerActions/controller.tsx';
export * from '../component/formFieldResourcePicker/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-resource' {

        export interface ControllerBlockResourcePickerActions {
          /** @internal */
          get scope(): ScopeModuleStartResource;
        }

        export interface ControllerFormFieldResourcePicker {
          /** @internal */
          get scope(): ScopeModuleStartResource;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerBlockResourcePickerActions } from '../component/blockResourcePickerActions/controller.tsx';
import type { ControllerFormFieldResourcePicker } from '../component/formFieldResourcePicker/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-resource.controller.blockResourcePickerActions': ControllerBlockResourcePickerActions;
'start-resource.controller.formFieldResourcePicker': ControllerFormFieldResourcePicker;
  }
}
/** controller: end */

/** components: begin */
export * from './component/blockResourcePickerActions.ts';
import { ZBlockResourcePickerActions } from './component/blockResourcePickerActions.ts';
export * from './component/formFieldResourcePicker.ts';
import { ZFormFieldResourcePicker } from './component/formFieldResourcePicker.ts';
export const components = {
  'blockResourcePickerActions': ZBlockResourcePickerActions,
'formFieldResourcePicker': ZFormFieldResourcePicker,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-resource:blockResourcePickerActions': ControllerBlockResourcePickerActions;
'start-resource:formFieldResourcePicker': ControllerFormFieldResourcePicker;
}
export interface IZovaComponentRecord {
  'start-resource:blockResourcePickerActions': typeof ZBlockResourcePickerActions;
'start-resource:formFieldResourcePicker': typeof ZFormFieldResourcePicker;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.resourcePicker.tsx';
import { ITableCellOptionsResourcePicker } from '../bean/tableCell.resourcePicker.tsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {

    export interface ITableCellRecord {
      'start-resource:resourcePicker': ITableCellOptionsResourcePicker;
    }


}
declare module 'zova-module-start-resource' {

        export interface TableCellResourcePicker {
          /** @internal */
          get scope(): ScopeModuleStartResource;
        }

        export interface TableCellResourcePicker {
          get $beanFullName(): 'start-resource.tableCell.resourcePicker';
          get $onionName(): 'start-resource:resourcePicker';
          get $onionOptions(): ITableCellOptionsResourcePicker;
        }
}
/** tableCell: end */
/** tableCell: begin */
import type { TableCellResourcePicker } from '../bean/tableCell.resourcePicker.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-resource.tableCell.resourcePicker': TableCellResourcePicker;
  }
}
/** tableCell: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartResource extends BeanScopeBase {}

export interface ScopeModuleStartResource {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-resource': ScopeModuleStartResource;
  }



  export interface IBeanScopeLocale {
    'start-resource': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `start-resource::${K}` {
  return `start-resource::${key}`;
}
/** scope: end */
