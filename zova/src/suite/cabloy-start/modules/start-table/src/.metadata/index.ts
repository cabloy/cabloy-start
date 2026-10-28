// eslint-disable
/** controller: begin */
export * from '../component/actionColumnConfig/controller.tsx';
export * from '../component/actionCreate/controller.tsx';
export * from '../component/actionDeleteBulk/controller.tsx';
export * from '../component/actionRefresh/controller.tsx';
export * from '../component/rowOperations/controller.tsx';

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

        export interface ControllerRowOperations {
          /** @internal */
          get scope(): ScopeModuleStartTable;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerActionColumnConfig } from '../component/actionColumnConfig/controller.tsx';
import type { ControllerActionCreate } from '../component/actionCreate/controller.tsx';
import type { ControllerActionDeleteBulk } from '../component/actionDeleteBulk/controller.tsx';
import type { ControllerActionRefresh } from '../component/actionRefresh/controller.tsx';
import type { ControllerRowOperations } from '../component/rowOperations/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-table.controller.actionColumnConfig': ControllerActionColumnConfig;
'start-table.controller.actionCreate': ControllerActionCreate;
'start-table.controller.actionDeleteBulk': ControllerActionDeleteBulk;
'start-table.controller.actionRefresh': ControllerActionRefresh;
'start-table.controller.rowOperations': ControllerRowOperations;
  }
}
/** controller: end */

/** components: begin */
export * from './component/actionColumnConfig.ts';
import { ZActionColumnConfig } from './component/actionColumnConfig.ts';
export * from './component/actionCreate.ts';
import { ZActionCreate } from './component/actionCreate.ts';
export * from './component/actionDeleteBulk.ts';
import { ZActionDeleteBulk } from './component/actionDeleteBulk.ts';
export * from './component/actionRefresh.ts';
import { ZActionRefresh } from './component/actionRefresh.ts';
export * from './component/rowOperations.ts';
import { ZRowOperations } from './component/rowOperations.ts';
export const components = {
  'actionColumnConfig': ZActionColumnConfig,
'actionCreate': ZActionCreate,
'actionDeleteBulk': ZActionDeleteBulk,
'actionRefresh': ZActionRefresh,
'rowOperations': ZRowOperations,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-table:actionColumnConfig': ControllerActionColumnConfig;
'start-table:actionCreate': ControllerActionCreate;
'start-table:actionDeleteBulk': ControllerActionDeleteBulk;
'start-table:actionRefresh': ControllerActionRefresh;
'start-table:rowOperations': ControllerRowOperations;
}
export interface IZovaComponentRecord {
  'start-table:actionColumnConfig': typeof ZActionColumnConfig;
'start-table:actionCreate': typeof ZActionCreate;
'start-table:actionDeleteBulk': typeof ZActionDeleteBulk;
'start-table:actionRefresh': typeof ZActionRefresh;
'start-table:rowOperations': typeof ZRowOperations;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.actionDelete.tsx';
export * from '../bean/tableCell.actionOperationsRow.tsx';
export * from '../bean/tableCell.actionUpdate.tsx';
export * from '../bean/tableCell.actionView.tsx';
import { ITableCellOptionsActionDelete } from '../bean/tableCell.actionDelete.tsx';
import { ITableCellOptionsActionOperationsRow } from '../bean/tableCell.actionOperationsRow.tsx';
import { ITableCellOptionsActionUpdate } from '../bean/tableCell.actionUpdate.tsx';
import { ITableCellOptionsActionView } from '../bean/tableCell.actionView.tsx';
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
import type { TableCellActionDelete } from '../bean/tableCell.actionDelete.tsx';
import type { TableCellActionOperationsRow } from '../bean/tableCell.actionOperationsRow.tsx';
import type { TableCellActionUpdate } from '../bean/tableCell.actionUpdate.tsx';
import type { TableCellActionView } from '../bean/tableCell.actionView.tsx';
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
import { locales } from './locales.ts';
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
