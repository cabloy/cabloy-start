// eslint-disable
/** service: begin */
export * from '../service/detail.tsx';

import 'zova-module-a-bean';
declare module 'zova-module-a-bean' {

    export interface IServiceRecord {
      'start-details:detail': never;
    }


}
declare module 'zova-module-start-details' {

        export interface ServiceDetail {
          /** @internal */
          get scope(): ScopeModuleStartDetails;
        }

        export interface ServiceDetail {
          get $beanFullName(): 'start-details.service.detail';
          get $onionName(): 'start-details:detail';

        }
}
/** service: end */
/** service: begin */
import type { ServiceDetail } from '../service/detail.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-details.service.detail': ServiceDetail;
  }
}
/** service: end */
/** controller: begin */
export * from '../component/actionCreate/controller.tsx';
export * from '../component/blockDetails/controller.tsx';
export * from '../component/blockForm/controller.tsx';
export * from '../component/blockTable/controller.tsx';
export * from '../component/blockToolbarBulk/controller.tsx';
export * from '../component/formFieldDetails/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-details' {

        export interface ControllerActionCreate {
          /** @internal */
          get scope(): ScopeModuleStartDetails;
        }

        export interface ControllerBlockDetails {
          /** @internal */
          get scope(): ScopeModuleStartDetails;
        }

        export interface ControllerBlockForm {
          /** @internal */
          get scope(): ScopeModuleStartDetails;
        }

        export interface ControllerBlockTable {
          /** @internal */
          get scope(): ScopeModuleStartDetails;
        }

        export interface ControllerBlockToolbarBulk {
          /** @internal */
          get scope(): ScopeModuleStartDetails;
        }

        export interface ControllerFormFieldDetails {
          /** @internal */
          get scope(): ScopeModuleStartDetails;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerActionCreate } from '../component/actionCreate/controller.tsx';
import type { ControllerBlockDetails } from '../component/blockDetails/controller.tsx';
import type { ControllerBlockForm } from '../component/blockForm/controller.tsx';
import type { ControllerBlockTable } from '../component/blockTable/controller.tsx';
import type { ControllerBlockToolbarBulk } from '../component/blockToolbarBulk/controller.tsx';
import type { ControllerFormFieldDetails } from '../component/formFieldDetails/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-details.controller.actionCreate': ControllerActionCreate;
'start-details.controller.blockDetails': ControllerBlockDetails;
'start-details.controller.blockForm': ControllerBlockForm;
'start-details.controller.blockTable': ControllerBlockTable;
'start-details.controller.blockToolbarBulk': ControllerBlockToolbarBulk;
'start-details.controller.formFieldDetails': ControllerFormFieldDetails;
  }
}
/** controller: end */

/** components: begin */
export * from './component/actionCreate.ts';
import { ZActionCreate } from './component/actionCreate.ts';
export * from './component/blockDetails.ts';
import { ZBlockDetails } from './component/blockDetails.ts';
export * from './component/blockForm.ts';
import { ZBlockForm } from './component/blockForm.ts';
export * from './component/blockTable.ts';
import { ZBlockTable } from './component/blockTable.ts';
export * from './component/blockToolbarBulk.ts';
import { ZBlockToolbarBulk } from './component/blockToolbarBulk.ts';
export * from './component/formFieldDetails.ts';
import { ZFormFieldDetails } from './component/formFieldDetails.ts';
export const components = {
  'actionCreate': ZActionCreate,
'blockDetails': ZBlockDetails,
'blockForm': ZBlockForm,
'blockTable': ZBlockTable,
'blockToolbarBulk': ZBlockToolbarBulk,
'formFieldDetails': ZFormFieldDetails,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-details:actionCreate': ControllerActionCreate;
'start-details:blockDetails': ControllerBlockDetails;
'start-details:blockForm': ControllerBlockForm;
'start-details:blockTable': ControllerBlockTable;
'start-details:blockToolbarBulk': ControllerBlockToolbarBulk;
'start-details:formFieldDetails': ControllerFormFieldDetails;
}
export interface IZovaComponentRecord {
  'start-details:actionCreate': typeof ZActionCreate;
'start-details:blockDetails': typeof ZBlockDetails;
'start-details:blockForm': typeof ZBlockForm;
'start-details:blockTable': typeof ZBlockTable;
'start-details:blockToolbarBulk': typeof ZBlockToolbarBulk;
'start-details:formFieldDetails': typeof ZFormFieldDetails;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.actionDelete.tsx';
export * from '../bean/tableCell.actionOperationsRow.tsx';
export * from '../bean/tableCell.actionUpdate.tsx';
export * from '../bean/tableCell.actionView.tsx';
export * from '../bean/tableCell.lineNumber.tsx';
import { ITableCellOptionsActionDelete } from '../bean/tableCell.actionDelete.tsx';
import { ITableCellOptionsActionOperationsRow } from '../bean/tableCell.actionOperationsRow.tsx';
import { ITableCellOptionsActionUpdate } from '../bean/tableCell.actionUpdate.tsx';
import { ITableCellOptionsActionView } from '../bean/tableCell.actionView.tsx';
import { ITableCellOptionsLineNumber } from '../bean/tableCell.lineNumber.tsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {

    export interface ITableCellRecord {
      'start-details:actionDelete': ITableCellOptionsActionDelete;
'start-details:actionOperationsRow': ITableCellOptionsActionOperationsRow;
'start-details:actionUpdate': ITableCellOptionsActionUpdate;
'start-details:actionView': ITableCellOptionsActionView;
'start-details:lineNumber': ITableCellOptionsLineNumber;
    }


}
declare module 'zova-module-start-details' {

        export interface TableCellActionDelete {
          /** @internal */
          get scope(): ScopeModuleStartDetails;
        }

        export interface TableCellActionDelete {
          get $beanFullName(): 'start-details.tableCell.actionDelete';
          get $onionName(): 'start-details:actionDelete';
          get $onionOptions(): ITableCellOptionsActionDelete;
        }

        export interface TableCellActionOperationsRow {
          /** @internal */
          get scope(): ScopeModuleStartDetails;
        }

        export interface TableCellActionOperationsRow {
          get $beanFullName(): 'start-details.tableCell.actionOperationsRow';
          get $onionName(): 'start-details:actionOperationsRow';
          get $onionOptions(): ITableCellOptionsActionOperationsRow;
        }

        export interface TableCellActionUpdate {
          /** @internal */
          get scope(): ScopeModuleStartDetails;
        }

        export interface TableCellActionUpdate {
          get $beanFullName(): 'start-details.tableCell.actionUpdate';
          get $onionName(): 'start-details:actionUpdate';
          get $onionOptions(): ITableCellOptionsActionUpdate;
        }

        export interface TableCellActionView {
          /** @internal */
          get scope(): ScopeModuleStartDetails;
        }

        export interface TableCellActionView {
          get $beanFullName(): 'start-details.tableCell.actionView';
          get $onionName(): 'start-details:actionView';
          get $onionOptions(): ITableCellOptionsActionView;
        }

        export interface TableCellLineNumber {
          /** @internal */
          get scope(): ScopeModuleStartDetails;
        }

        export interface TableCellLineNumber {
          get $beanFullName(): 'start-details.tableCell.lineNumber';
          get $onionName(): 'start-details:lineNumber';
          get $onionOptions(): ITableCellOptionsLineNumber;
        }
}
/** tableCell: end */
/** tableCell: begin */
import type { TableCellActionDelete } from '../bean/tableCell.actionDelete.tsx';
import type { TableCellActionOperationsRow } from '../bean/tableCell.actionOperationsRow.tsx';
import type { TableCellActionUpdate } from '../bean/tableCell.actionUpdate.tsx';
import type { TableCellActionView } from '../bean/tableCell.actionView.tsx';
import type { TableCellLineNumber } from '../bean/tableCell.lineNumber.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-details.tableCell.actionDelete': TableCellActionDelete;
'start-details.tableCell.actionOperationsRow': TableCellActionOperationsRow;
'start-details.tableCell.actionUpdate': TableCellActionUpdate;
'start-details.tableCell.actionView': TableCellActionView;
'start-details.tableCell.lineNumber': TableCellLineNumber;
  }
}
/** tableCell: end */
/** command: begin */
export * from '../bean/command.delete.tsx';
import { ICommandOptionsDelete } from '../bean/command.delete.tsx';
import 'zova-module-a-command';
declare module 'zova-module-a-command' {

    export interface ICommandRecord {
      'start-details:delete': ICommandOptionsDelete;
    }


}
declare module 'zova-module-start-details' {

        export interface CommandDelete {
          /** @internal */
          get scope(): ScopeModuleStartDetails;
        }

        export interface CommandDelete {
          get $beanFullName(): 'start-details.command.delete';
          get $onionName(): 'start-details:delete';
          get $onionOptions(): ICommandOptionsDelete;
        }
}
/** command: end */
/** command: begin */
import type { CommandDelete } from '../bean/command.delete.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-details.command.delete': CommandDelete;
  }
}
/** command: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartDetails extends BeanScopeBase {}

export interface ScopeModuleStartDetails {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-details': ScopeModuleStartDetails;
  }



  export interface IBeanScopeLocale {
    'start-details': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `start-details::${K}` {
  return `start-details::${key}`;
}
/** scope: end */
