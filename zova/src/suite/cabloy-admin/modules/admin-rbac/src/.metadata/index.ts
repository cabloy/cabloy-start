// eslint-disable
/** model: begin */
export * from '../model/rbacPolicy.ts';
import { IModelOptionsRbacPolicy } from '../model/rbacPolicy.ts';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'admin-rbac:rbacPolicy': IModelOptionsRbacPolicy;
    }


}
declare module 'zova-module-admin-rbac' {

        export interface ModelRbacPolicy {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

        export interface ModelRbacPolicy {
          get $beanFullName(): 'admin-rbac.model.rbacPolicy';
          get $onionName(): 'admin-rbac:rbacPolicy';
          get $onionOptions(): IModelOptionsRbacPolicy;
        }
}
/** model: end */
/** model: begin */
import type { ModelRbacPolicy } from '../model/rbacPolicy.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-rbac.model.rbacPolicy': ModelRbacPolicy;
  }
}
/** model: end */
/** api: begin */
export * from '../api/adminRbacRbacGrant.ts';
export * from '../api/adminRbacRbacGrantDepartment.ts';
export * from '../api/adminRbacRbacPolicy.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-admin-rbac' {

        export interface ApiAdminRbacRbacGrant {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

        export interface ApiAdminRbacRbacGrant {
          get $beanFullName(): 'admin-rbac.api.adminRbacRbacGrant';
          get $onionName(): 'admin-rbac:adminRbacRbacGrant';

        }

        export interface ApiAdminRbacRbacGrantDepartment {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

        export interface ApiAdminRbacRbacGrantDepartment {
          get $beanFullName(): 'admin-rbac.api.adminRbacRbacGrantDepartment';
          get $onionName(): 'admin-rbac:adminRbacRbacGrantDepartment';

        }

        export interface ApiAdminRbacRbacPolicy {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

        export interface ApiAdminRbacRbacPolicy {
          get $beanFullName(): 'admin-rbac.api.adminRbacRbacPolicy';
          get $onionName(): 'admin-rbac:adminRbacRbacPolicy';

        }
}
/** api: end */
/** api: begin */
import type { ApiAdminRbacRbacGrant } from '../api/adminRbacRbacGrant.ts';
import type { ApiAdminRbacRbacGrantDepartment } from '../api/adminRbacRbacGrantDepartment.ts';
import type { ApiAdminRbacRbacPolicy } from '../api/adminRbacRbacPolicy.ts';
export interface IModuleApi {
  'adminRbacRbacGrant': ApiAdminRbacRbacGrant;
'adminRbacRbacGrantDepartment': ApiAdminRbacRbacGrantDepartment;
'adminRbacRbacPolicy': ApiAdminRbacRbacPolicy;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-rbac.api.adminRbacRbacGrant': ApiAdminRbacRbacGrant;
'admin-rbac.api.adminRbacRbacGrantDepartment': ApiAdminRbacRbacGrantDepartment;
'admin-rbac.api.adminRbacRbacPolicy': ApiAdminRbacRbacPolicy;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.ts';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/adminRbacRbacGrant.ts';
export * from '../apiSchema/adminRbacRbacGrantDepartment.ts';
export * from '../apiSchema/adminRbacRbacPolicy.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-admin-rbac' {

        export interface ApiSchemaAdminRbacRbacGrant {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

        export interface ApiSchemaAdminRbacRbacGrant {
          get $beanFullName(): 'admin-rbac.apiSchema.adminRbacRbacGrant';
          get $onionName(): 'admin-rbac:adminRbacRbacGrant';

        }

        export interface ApiSchemaAdminRbacRbacGrantDepartment {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

        export interface ApiSchemaAdminRbacRbacGrantDepartment {
          get $beanFullName(): 'admin-rbac.apiSchema.adminRbacRbacGrantDepartment';
          get $onionName(): 'admin-rbac:adminRbacRbacGrantDepartment';

        }

        export interface ApiSchemaAdminRbacRbacPolicy {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

        export interface ApiSchemaAdminRbacRbacPolicy {
          get $beanFullName(): 'admin-rbac.apiSchema.adminRbacRbacPolicy';
          get $onionName(): 'admin-rbac:adminRbacRbacPolicy';

        }
}
/** apiSchema: end */
/** apiSchema: begin */
import type { ApiSchemaAdminRbacRbacGrant } from '../apiSchema/adminRbacRbacGrant.ts';
import type { ApiSchemaAdminRbacRbacGrantDepartment } from '../apiSchema/adminRbacRbacGrantDepartment.ts';
import type { ApiSchemaAdminRbacRbacPolicy } from '../apiSchema/adminRbacRbacPolicy.ts';
export interface IModuleApiSchema {
  'adminRbacRbacGrant': ApiSchemaAdminRbacRbacGrant;
'adminRbacRbacGrantDepartment': ApiSchemaAdminRbacRbacGrantDepartment;
'adminRbacRbacPolicy': ApiSchemaAdminRbacRbacPolicy;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-rbac.apiSchema.adminRbacRbacGrant': ApiSchemaAdminRbacRbacGrant;
'admin-rbac.apiSchema.adminRbacRbacGrantDepartment': ApiSchemaAdminRbacRbacGrantDepartment;
'admin-rbac.apiSchema.adminRbacRbacPolicy': ApiSchemaAdminRbacRbacPolicy;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../component/blockPolicyEditor/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-admin-rbac' {

        export interface ControllerBlockPolicyEditor {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerBlockPolicyEditor } from '../component/blockPolicyEditor/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'admin-rbac.controller.blockPolicyEditor': ControllerBlockPolicyEditor;
  }
}
/** controller: end */

/** components: begin */
export * from './component/blockPolicyEditor.ts';
import { ZBlockPolicyEditor } from './component/blockPolicyEditor.ts';
export const components = {
  'blockPolicyEditor': ZBlockPolicyEditor,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'admin-rbac:blockPolicyEditor': ControllerBlockPolicyEditor;
}
export interface IZovaComponentRecord {
  'admin-rbac:blockPolicyEditor': typeof ZBlockPolicyEditor;
}
}
/** components: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAdminRbac extends BeanScopeBase {}

export interface ScopeModuleAdminRbac {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'admin-rbac': ScopeModuleAdminRbac;
  }



  export interface IBeanScopeLocale {
    'admin-rbac': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `admin-rbac::${K}` {
  return `admin-rbac::${key}`;
}
/** scope: end */
