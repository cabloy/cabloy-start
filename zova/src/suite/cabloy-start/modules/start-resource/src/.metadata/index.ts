// eslint-disable
/** controller: begin */
export * from '../component/formFieldResourcePicker/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-resource' {
  
        export interface ControllerFormFieldResourcePicker {
          /** @internal */
          get scope(): ScopeModuleStartResource;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldResourcePicker } from '../component/formFieldResourcePicker/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-resource.controller.formFieldResourcePicker': ControllerFormFieldResourcePicker;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldResourcePicker.js';
import { ZFormFieldResourcePicker } from './component/formFieldResourcePicker.js';
export const components = {
  'formFieldResourcePicker': ZFormFieldResourcePicker,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-resource:formFieldResourcePicker': ControllerFormFieldResourcePicker;
}
export interface IZovaComponentRecord {
  'start-resource:formFieldResourcePicker': typeof ZFormFieldResourcePicker;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.resourcePicker.jsx';
import { ITableCellOptionsResourcePicker } from '../bean/tableCell.resourcePicker.jsx';
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
import { TableCellResourcePicker } from '../bean/tableCell.resourcePicker.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-resource.tableCell.resourcePicker': TableCellResourcePicker;
  }
}
/** tableCell: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartResource extends BeanScopeBase {}

export interface ScopeModuleStartResource {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-resource': ScopeModuleStartResource;
  }
  
  

  

  
}

/** scope: end */
