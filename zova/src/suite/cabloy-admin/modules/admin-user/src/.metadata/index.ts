// eslint-disable
/** model: begin */
export * from '../model/user.js';
import { IModelOptionsUser } from '../model/user.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'admin-user:user': IModelOptionsUser;
    }

  
}
declare module 'zova-module-admin-user' {
  
        export interface ModelUser {
          /** @internal */
          get scope(): ScopeModuleAdminUser;
        }

        export interface ModelUser {
          get $beanFullName(): 'admin-user.model.user';
          get $onionName(): 'admin-user:user';
          get $onionOptions(): IModelOptionsUser;
        } 
}
/** model: end */
/** model: begin */
import { ModelUser } from '../model/user.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-user.model.user': ModelUser;
  }
}
/** model: end */
/** api: begin */
export * from '../api/adminUser.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-admin-user' {
  
        export interface ApiAdminUser {
          /** @internal */
          get scope(): ScopeModuleAdminUser;
        }

        export interface ApiAdminUser {
          get $beanFullName(): 'admin-user.api.adminUser';
          get $onionName(): 'admin-user:adminUser';
          
        } 
}
/** api: end */
/** api: begin */
import { ApiAdminUser } from '../api/adminUser.js';
export interface IModuleApi {
  'adminUser': ApiAdminUser;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-user.api.adminUser': ApiAdminUser;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/adminUser.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-admin-user' {
  
        export interface ApiSchemaAdminUser {
          /** @internal */
          get scope(): ScopeModuleAdminUser;
        }

        export interface ApiSchemaAdminUser {
          get $beanFullName(): 'admin-user.apiSchema.adminUser';
          get $onionName(): 'admin-user:adminUser';
          
        } 
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaAdminUser } from '../apiSchema/adminUser.js';
export interface IModuleApiSchema {
  'adminUser': ApiSchemaAdminUser;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-user.apiSchema.adminUser': ApiSchemaAdminUser;
  }
}
/** apiSchema: end */
/** tableCell: begin */
export * from '../bean/tableCell.actionDisable.jsx';
import { ITableCellOptionsActionDisable } from '../bean/tableCell.actionDisable.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  export interface ITableCellRecord {
    'admin-user:actionDisable': ITableCellOptionsActionDisable;
  }
}
declare module 'zova-module-admin-user' {
  export interface TableCellActionDisable {
    /** @internal */
    get scope(): ScopeModuleAdminUser;
  }

  export interface TableCellActionDisable {
    get $beanFullName(): 'admin-user.tableCell.actionDisable';
    get $onionName(): 'admin-user:actionDisable';
    get $onionOptions(): ITableCellOptionsActionDisable;
  }
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellActionDisable } from '../bean/tableCell.actionDisable.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-user.tableCell.actionDisable': TableCellActionDisable;
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
export class ScopeModuleAdminUser extends BeanScopeBase {}

export interface ScopeModuleAdminUser {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'admin-user': ScopeModuleAdminUser;
  }
  
  

  export interface IBeanScopeLocale {
    'admin-user': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `admin-user::${K}` {
  return `admin-user::${key}`;
}
/** scope: end */
