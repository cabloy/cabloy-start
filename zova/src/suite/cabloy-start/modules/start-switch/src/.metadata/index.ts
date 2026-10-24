// eslint-disable
/** controller: begin */
export * from '../component/formFieldSwitch/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-switch' {

        export interface ControllerFormFieldSwitch {
          /** @internal */
          get scope(): ScopeModuleStartSwitch;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerFormFieldSwitch } from '../component/formFieldSwitch/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-switch.controller.formFieldSwitch': ControllerFormFieldSwitch;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldSwitch.ts';
import { ZFormFieldSwitch } from './component/formFieldSwitch.ts';
export const components = {
  'formFieldSwitch': ZFormFieldSwitch,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-switch:formFieldSwitch': ControllerFormFieldSwitch;
}
export interface IZovaComponentRecord {
  'start-switch:formFieldSwitch': typeof ZFormFieldSwitch;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.switch.tsx';
import { ITableCellOptionsSwitch } from '../bean/tableCell.switch.tsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {

    export interface ITableCellRecord {
      'start-switch:switch': ITableCellOptionsSwitch;
    }


}
declare module 'zova-module-start-switch' {

        export interface TableCellSwitch {
          /** @internal */
          get scope(): ScopeModuleStartSwitch;
        }

        export interface TableCellSwitch {
          get $beanFullName(): 'start-switch.tableCell.switch';
          get $onionName(): 'start-switch:switch';
          get $onionOptions(): ITableCellOptionsSwitch;
        }
}
/** tableCell: end */
/** tableCell: begin */
import type { TableCellSwitch } from '../bean/tableCell.switch.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-switch.tableCell.switch': TableCellSwitch;
  }
}
/** tableCell: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartSwitch extends BeanScopeBase {}

export interface ScopeModuleStartSwitch {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-switch': ScopeModuleStartSwitch;
  }






}

/** scope: end */
