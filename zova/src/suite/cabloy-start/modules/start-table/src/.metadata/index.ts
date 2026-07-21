// eslint-disable
/** controller: begin */
export * from '../component/actionCreate/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-table' {
  
        export interface ControllerActionCreate {
          /** @internal */
          get scope(): ScopeModuleStartTable;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerActionCreate } from '../component/actionCreate/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-table.controller.actionCreate': ControllerActionCreate;
  }
}
/** controller: end */

/** components: begin */
export * from './component/actionCreate.js';
import { ZActionCreate } from './component/actionCreate.js';
export const components = {
  'actionCreate': ZActionCreate,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-table:actionCreate': ControllerActionCreate;
}
export interface IZovaComponentRecord {
  'start-table:actionCreate': typeof ZActionCreate;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.actionDelete.jsx';
export * from '../bean/tableCell.actionOperationsRow.jsx';
export * from '../bean/tableCell.actionUpdate.jsx';
export * from '../bean/tableCell.actionView.jsx';
import { ITableCellOptionsActionDelete } from '../bean/tableCell.actionDelete.jsx';
import { ITableCellOptionsActionOperationsRow } from '../bean/tableCell.actionOperationsRow.jsx';
import { ITableCellOptionsActionUpdate } from '../bean/tableCell.actionUpdate.jsx';
import { ITableCellOptionsActionView } from '../bean/tableCell.actionView.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'start-table:actionDelete': ITableCellOptionsActionDelete;
'start-table:actionOperationsRow': ITableCellOptionsActionOperationsRow;
'start-table:actionUpdate': ITableCellOptionsActionUpdate;
'start-table:actionView': ITableCellOptionsActionView;
    }

  
}
declare module 'zova-module-start-table' {
  
        export interface TableCellActionDelete {
          /** @internal */
          get scope(): ScopeModuleStartTable;
        }

        export interface TableCellActionDelete {
          get $beanFullName(): 'start-table.tableCell.actionDelete';
          get $onionName(): 'start-table:actionDelete';
          get $onionOptions(): ITableCellOptionsActionDelete;
        }

        export interface TableCellActionOperationsRow {
          /** @internal */
          get scope(): ScopeModuleStartTable;
        }

        export interface TableCellActionOperationsRow {
          get $beanFullName(): 'start-table.tableCell.actionOperationsRow';
          get $onionName(): 'start-table:actionOperationsRow';
          get $onionOptions(): ITableCellOptionsActionOperationsRow;
        }

        export interface TableCellActionUpdate {
          /** @internal */
          get scope(): ScopeModuleStartTable;
        }

        export interface TableCellActionUpdate {
          get $beanFullName(): 'start-table.tableCell.actionUpdate';
          get $onionName(): 'start-table:actionUpdate';
          get $onionOptions(): ITableCellOptionsActionUpdate;
        }

        export interface TableCellActionView {
          /** @internal */
          get scope(): ScopeModuleStartTable;
        }

        export interface TableCellActionView {
          get $beanFullName(): 'start-table.tableCell.actionView';
          get $onionName(): 'start-table:actionView';
          get $onionOptions(): ITableCellOptionsActionView;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellActionDelete } from '../bean/tableCell.actionDelete.jsx';
import { TableCellActionOperationsRow } from '../bean/tableCell.actionOperationsRow.jsx';
import { TableCellActionUpdate } from '../bean/tableCell.actionUpdate.jsx';
import { TableCellActionView } from '../bean/tableCell.actionView.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-table.tableCell.actionDelete': TableCellActionDelete;
'start-table.tableCell.actionOperationsRow': TableCellActionOperationsRow;
'start-table.tableCell.actionUpdate': TableCellActionUpdate;
'start-table.tableCell.actionView': TableCellActionView;
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
export class ScopeModuleStartTable extends BeanScopeBase {}

export interface ScopeModuleStartTable {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-table': ScopeModuleStartTable;
  }
  
  

  export interface IBeanScopeLocale {
    'start-table': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `start-table::${K}` {
  return `start-table::${key}`;
}
/** scope: end */
