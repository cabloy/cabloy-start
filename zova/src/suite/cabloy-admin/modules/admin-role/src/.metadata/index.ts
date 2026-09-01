// eslint-disable
/** model: begin */
export * from '../model/role.js';
import { IModelOptionsRole } from '../model/role.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'admin-role:role': IModelOptionsRole;
    }


}
declare module 'zova-module-admin-role' {

        export interface ModelRole {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

        export interface ModelRole {
          get $beanFullName(): 'admin-role.model.role';
          get $onionName(): 'admin-role:role';
          get $onionOptions(): IModelOptionsRole;
        }
}
/** model: end */
/** model: begin */
import { ModelRole } from '../model/role.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-role.model.role': ModelRole;
  }
}
/** model: end */
/** api: begin */
export * from '../api/adminRole.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-admin-role' {

        export interface ApiAdminRole {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

        export interface ApiAdminRole {
          get $beanFullName(): 'admin-role.api.adminRole';
          get $onionName(): 'admin-role:adminRole';

        }
}
/** api: end */
/** api: begin */
import { ApiAdminRole } from '../api/adminRole.js';
export interface IModuleApi {
  'adminRole': ApiAdminRole;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-role.api.adminRole': ApiAdminRole;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/adminRole.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-admin-role' {

        export interface ApiSchemaAdminRole {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

        export interface ApiSchemaAdminRole {
          get $beanFullName(): 'admin-role.apiSchema.adminRole';
          get $onionName(): 'admin-role:adminRole';

        }
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaAdminRole } from '../apiSchema/adminRole.js';
export interface IModuleApiSchema {
  'adminRole': ApiSchemaAdminRole;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-role.apiSchema.adminRole': ApiSchemaAdminRole;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../component/actionReplaceUserRoles/controller.jsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-admin-role' {

        export interface ControllerActionReplaceUserRoles {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }
}
/** controller: end */
/** controller: begin */
import { ControllerActionReplaceUserRoles } from '../component/actionReplaceUserRoles/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'admin-role.controller.actionReplaceUserRoles': ControllerActionReplaceUserRoles;
  }
}
/** controller: end */

/** components: begin */
export * from './component/actionReplaceUserRoles.js';
import { ZActionReplaceUserRoles } from './component/actionReplaceUserRoles.js';
export const components = {
  'actionReplaceUserRoles': ZActionReplaceUserRoles,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'admin-role:actionReplaceUserRoles': ControllerActionReplaceUserRoles;
}
export interface IZovaComponentRecord {
  'admin-role:actionReplaceUserRoles': typeof ZActionReplaceUserRoles;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.actionOperationsRow.jsx';
import { ITableCellOptionsActionOperationsRow } from '../bean/tableCell.actionOperationsRow.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {

    export interface ITableCellRecord {
      'admin-role:actionOperationsRow': ITableCellOptionsActionOperationsRow;
    }


}
declare module 'zova-module-admin-role' {

        export interface TableCellActionOperationsRow {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

        export interface TableCellActionOperationsRow {
          get $beanFullName(): 'admin-role.tableCell.actionOperationsRow';
          get $onionName(): 'admin-role:actionOperationsRow';
          get $onionOptions(): ITableCellOptionsActionOperationsRow;
        }
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellActionOperationsRow } from '../bean/tableCell.actionOperationsRow.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-role.tableCell.actionOperationsRow': TableCellActionOperationsRow;
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
export class ScopeModuleAdminRole extends BeanScopeBase {}

export interface ScopeModuleAdminRole {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'admin-role': ScopeModuleAdminRole;
  }



  export interface IBeanScopeLocale {
    'admin-role': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `admin-role::${K}` {
  return `admin-role::${key}`;
}
/** scope: end */
