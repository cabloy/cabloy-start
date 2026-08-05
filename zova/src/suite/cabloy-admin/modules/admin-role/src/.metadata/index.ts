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
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAdminRole extends BeanScopeBase {}

export interface ScopeModuleAdminRole {
  util: BeanScopeUtil;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'admin-role': ScopeModuleAdminRole;
  }
  
  

  

  
}

/** scope: end */
