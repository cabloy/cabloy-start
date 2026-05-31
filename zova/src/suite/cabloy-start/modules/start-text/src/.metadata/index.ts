// eslint-disable
/** controller: begin */
export * from '../component/formFieldTextarea/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-text' {
  
        export interface ControllerFormFieldTextarea {
          /** @internal */
          get scope(): ScopeModuleStartText;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldTextarea } from '../component/formFieldTextarea/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-text.controller.formFieldTextarea': ControllerFormFieldTextarea;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldTextarea.js';
import { ZFormFieldTextarea } from './component/formFieldTextarea.js';
export const components = {
  'formFieldTextarea': ZFormFieldTextarea,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-text:formFieldTextarea': ControllerFormFieldTextarea;
}
export interface IZovaComponentRecord {
  'start-text:formFieldTextarea': typeof ZFormFieldTextarea;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.text.jsx';
export * from '../bean/tableCell.textarea.jsx';
import { ITableCellOptionsText } from '../bean/tableCell.text.jsx';
import { ITableCellOptionsTextarea } from '../bean/tableCell.textarea.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'start-text:text': ITableCellOptionsText;
'start-text:textarea': ITableCellOptionsTextarea;
    }

  
}
declare module 'zova-module-start-text' {
  
        export interface TableCellText {
          /** @internal */
          get scope(): ScopeModuleStartText;
        }

        export interface TableCellText {
          get $beanFullName(): 'start-text.tableCell.text';
          get $onionName(): 'start-text:text';
          get $onionOptions(): ITableCellOptionsText;
        }

        export interface TableCellTextarea {
          /** @internal */
          get scope(): ScopeModuleStartText;
        }

        export interface TableCellTextarea {
          get $beanFullName(): 'start-text.tableCell.textarea';
          get $onionName(): 'start-text:textarea';
          get $onionOptions(): ITableCellOptionsTextarea;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellText } from '../bean/tableCell.text.jsx';
import { TableCellTextarea } from '../bean/tableCell.textarea.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-text.tableCell.text': TableCellText;
'start-text.tableCell.textarea': TableCellTextarea;
  }
}
/** tableCell: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartText extends BeanScopeBase {}

export interface ScopeModuleStartText {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-text': ScopeModuleStartText;
  }
  
  

  

  
}
  
/** scope: end */
