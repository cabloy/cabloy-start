// eslint-disable
/** controller: begin */
export * from '../component/formFieldDate/controller.jsx';
export * from '../component/formFieldDateRange/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-date' {
  
        export interface ControllerFormFieldDate {
          /** @internal */
          get scope(): ScopeModuleStartDate;
        }

        export interface ControllerFormFieldDateRange {
          /** @internal */
          get scope(): ScopeModuleStartDate;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldDate } from '../component/formFieldDate/controller.jsx';
import { ControllerFormFieldDateRange } from '../component/formFieldDateRange/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-date.controller.formFieldDate': ControllerFormFieldDate;
'start-date.controller.formFieldDateRange': ControllerFormFieldDateRange;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldDate.js';
import { ZFormFieldDate } from './component/formFieldDate.js';
export * from './component/formFieldDateRange.js';
import { ZFormFieldDateRange } from './component/formFieldDateRange.js';
export const components = {
  'formFieldDate': ZFormFieldDate,
'formFieldDateRange': ZFormFieldDateRange,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-date:formFieldDate': ControllerFormFieldDate;
'start-date:formFieldDateRange': ControllerFormFieldDateRange;
}
export interface IZovaComponentRecord {
  'start-date:formFieldDate': typeof ZFormFieldDate;
'start-date:formFieldDateRange': typeof ZFormFieldDateRange;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.date.jsx';
import { ITableCellOptionsDate } from '../bean/tableCell.date.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'start-date:date': ITableCellOptionsDate;
    }

  
}
declare module 'zova-module-start-date' {
  
        export interface TableCellDate {
          /** @internal */
          get scope(): ScopeModuleStartDate;
        }

        export interface TableCellDate {
          get $beanFullName(): 'start-date.tableCell.date';
          get $onionName(): 'start-date:date';
          get $onionOptions(): ITableCellOptionsDate;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellDate } from '../bean/tableCell.date.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-date.tableCell.date': TableCellDate;
  }
}
/** tableCell: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartDate extends BeanScopeBase {}

export interface ScopeModuleStartDate {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-date': ScopeModuleStartDate;
  }
  
  

  

  
}
  
/** scope: end */
