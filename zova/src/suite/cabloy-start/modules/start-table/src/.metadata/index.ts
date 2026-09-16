// eslint-disable
/** controller: begin */
export * from '../component/actionColumnConfig/controller.jsx';
export * from '../component/actionCreate/controller.jsx';
export * from '../component/actionDeleteBulk/controller.jsx';
export * from '../component/actionRefresh/controller.jsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-table' {

        export interface ControllerActionColumnConfig {
          /** @internal */
          get scope(): ScopeModuleStartTable;
        }

        export interface ControllerActionCreate {
          /** @internal */
          get scope(): ScopeModuleStartTable;
        }

        export interface ControllerActionDeleteBulk {
          /** @internal */
          get scope(): ScopeModuleStartTable;
        }

        export interface ControllerActionRefresh {
          /** @internal */
          get scope(): ScopeModuleStartTable;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerActionColumnConfig } from '../component/actionColumnConfig/controller.jsx';
import type { ControllerActionCreate } from '../component/actionCreate/controller.jsx';
import type { ControllerActionDeleteBulk } from '../component/actionDeleteBulk/controller.jsx';
import type { ControllerActionRefresh } from '../component/actionRefresh/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-table.controller.actionColumnConfig': ControllerActionColumnConfig;
'start-table.controller.actionCreate': ControllerActionCreate;
'start-table.controller.actionDeleteBulk': ControllerActionDeleteBulk;
'start-table.controller.actionRefresh': ControllerActionRefresh;
  }
}
/** controller: end */

/** components: begin */
export * from './component/actionColumnConfig.js';
import { ZActionColumnConfig } from './component/actionColumnConfig.js';
export * from './component/actionCreate.js';
import { ZActionCreate } from './component/actionCreate.js';
export * from './component/actionDeleteBulk.js';
import { ZActionDeleteBulk } from './component/actionDeleteBulk.js';
export * from './component/actionRefresh.js';
import { ZActionRefresh } from './component/actionRefresh.js';
export const components = {
  'actionColumnConfig': ZActionColumnConfig,
'actionCreate': ZActionCreate,
'actionDeleteBulk': ZActionDeleteBulk,
'actionRefresh': ZActionRefresh,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-table:actionColumnConfig': ControllerActionColumnConfig;
'start-table:actionCreate': ControllerActionCreate;
'start-table:actionDeleteBulk': ControllerActionDeleteBulk;
'start-table:actionRefresh': ControllerActionRefresh;
}
export interface IZovaComponentRecord {
  'start-table:actionColumnConfig': typeof ZActionColumnConfig;
'start-table:actionCreate': typeof ZActionCreate;
'start-table:actionDeleteBulk': typeof ZActionDeleteBulk;
'start-table:actionRefresh': typeof ZActionRefresh;
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
import type { TableCellActionDelete } from '../bean/tableCell.actionDelete.jsx';
import type { TableCellActionOperationsRow } from '../bean/tableCell.actionOperationsRow.jsx';
import type { TableCellActionUpdate } from '../bean/tableCell.actionUpdate.jsx';
import type { TableCellActionView } from '../bean/tableCell.actionView.jsx';
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
