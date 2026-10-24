// eslint-disable
/** controller: begin */
export * from '../component/formFieldCurrency/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-currency' {

        export interface ControllerFormFieldCurrency {
          /** @internal */
          get scope(): ScopeModuleStartCurrency;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerFormFieldCurrency } from '../component/formFieldCurrency/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-currency.controller.formFieldCurrency': ControllerFormFieldCurrency;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldCurrency.ts';
import { ZFormFieldCurrency } from './component/formFieldCurrency.ts';
export const components = {
  'formFieldCurrency': ZFormFieldCurrency,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-currency:formFieldCurrency': ControllerFormFieldCurrency;
}
export interface IZovaComponentRecord {
  'start-currency:formFieldCurrency': typeof ZFormFieldCurrency;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.currency.tsx';
import { ITableCellOptionsCurrency } from '../bean/tableCell.currency.tsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {

    export interface ITableCellRecord {
      'start-currency:currency': ITableCellOptionsCurrency;
    }


}
declare module 'zova-module-start-currency' {

        export interface TableCellCurrency {
          /** @internal */
          get scope(): ScopeModuleStartCurrency;
        }

        export interface TableCellCurrency {
          get $beanFullName(): 'start-currency.tableCell.currency';
          get $onionName(): 'start-currency:currency';
          get $onionOptions(): ITableCellOptionsCurrency;
        }
}
/** tableCell: end */
/** tableCell: begin */
import type { TableCellCurrency } from '../bean/tableCell.currency.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-currency.tableCell.currency': TableCellCurrency;
  }
}
/** tableCell: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartCurrency extends BeanScopeBase {}

export interface ScopeModuleStartCurrency {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-currency': ScopeModuleStartCurrency;
  }






}

/** scope: end */
