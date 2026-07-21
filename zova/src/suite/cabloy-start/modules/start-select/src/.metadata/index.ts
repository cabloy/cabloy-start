// eslint-disable
/** controller: begin */
export * from '../component/formFieldChips/controller.jsx';
export * from '../component/formFieldSelect/controller.jsx';

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
import { ControllerFormFieldChips } from '../component/formFieldChips/controller.jsx';
import { ControllerFormFieldSelect } from '../component/formFieldSelect/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-select.controller.formFieldChips': ControllerFormFieldChips;
'start-select.controller.formFieldSelect': ControllerFormFieldSelect;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldChips.js';
import { ZFormFieldChips } from './component/formFieldChips.js';
export * from './component/formFieldSelect.js';
import { ZFormFieldSelect } from './component/formFieldSelect.js';
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
export * from '../bean/tableCell.chips.jsx';
export * from '../bean/tableCell.select.jsx';
import { ITableCellOptionsChips } from '../bean/tableCell.chips.jsx';
import { ITableCellOptionsSelect } from '../bean/tableCell.select.jsx';
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
import { TableCellChips } from '../bean/tableCell.chips.jsx';
import { TableCellSelect } from '../bean/tableCell.select.jsx';
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
