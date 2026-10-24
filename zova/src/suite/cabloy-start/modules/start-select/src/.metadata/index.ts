// eslint-disable
/** controller: begin */
export * from '../component/formFieldChips/controller.tsx';
export * from '../component/formFieldSelect/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-select' {

        export interface ControllerFormFieldChips {
          /** @internal */
          get scope(): ScopeModuleStartSelect;
        }

        export interface ControllerFormFieldSelect {
          /** @internal */
          get scope(): ScopeModuleStartSelect;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerFormFieldChips } from '../component/formFieldChips/controller.tsx';
import type { ControllerFormFieldSelect } from '../component/formFieldSelect/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-select.controller.formFieldChips': ControllerFormFieldChips;
'start-select.controller.formFieldSelect': ControllerFormFieldSelect;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldChips.ts';
import { ZFormFieldChips } from './component/formFieldChips.ts';
export * from './component/formFieldSelect.ts';
import { ZFormFieldSelect } from './component/formFieldSelect.ts';
export const components = {
  'formFieldChips': ZFormFieldChips,
'formFieldSelect': ZFormFieldSelect,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-select:formFieldChips': ControllerFormFieldChips;
'start-select:formFieldSelect': ControllerFormFieldSelect;
}
export interface IZovaComponentRecord {
  'start-select:formFieldChips': typeof ZFormFieldChips;
'start-select:formFieldSelect': typeof ZFormFieldSelect;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.chips.tsx';
export * from '../bean/tableCell.select.tsx';
import { ITableCellOptionsChips } from '../bean/tableCell.chips.tsx';
import { ITableCellOptionsSelect } from '../bean/tableCell.select.tsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {

    export interface ITableCellRecord {
      'start-select:chips': ITableCellOptionsChips;
'start-select:select': ITableCellOptionsSelect;
    }


}
declare module 'zova-module-start-select' {

        export interface TableCellChips {
          /** @internal */
          get scope(): ScopeModuleStartSelect;
        }

        export interface TableCellChips {
          get $beanFullName(): 'start-select.tableCell.chips';
          get $onionName(): 'start-select:chips';
          get $onionOptions(): ITableCellOptionsChips;
        }

        export interface TableCellSelect {
          /** @internal */
          get scope(): ScopeModuleStartSelect;
        }

        export interface TableCellSelect {
          get $beanFullName(): 'start-select.tableCell.select';
          get $onionName(): 'start-select:select';
          get $onionOptions(): ITableCellOptionsSelect;
        }
}
/** tableCell: end */
/** tableCell: begin */
import type { TableCellChips } from '../bean/tableCell.chips.tsx';
import type { TableCellSelect } from '../bean/tableCell.select.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-select.tableCell.chips': TableCellChips;
'start-select.tableCell.select': TableCellSelect;
  }
}
/** tableCell: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartSelect extends BeanScopeBase {}

export interface ScopeModuleStartSelect {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-select': ScopeModuleStartSelect;
  }






}

/** scope: end */
