// eslint-disable
/** model: begin */
export * from '../model/roleMenu.js';
import { IModelOptionsRoleMenu } from '../model/roleMenu.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'admin-menu:roleMenu': IModelOptionsRoleMenu;
    }


}
declare module 'zova-module-admin-menu' {

        export interface ModelRoleMenu {
          /** @internal */
          get scope(): ScopeModuleAdminMenu;
        }

        export interface ModelRoleMenu {
          get $beanFullName(): 'admin-menu.model.roleMenu';
          get $onionName(): 'admin-menu:roleMenu';
          get $onionOptions(): IModelOptionsRoleMenu;
        }
}
/** model: end */
/** model: begin */
import { ModelRoleMenu } from '../model/roleMenu.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-menu.model.roleMenu': ModelRoleMenu;
  }
}
/** model: end */
/** api: begin */
export * from '../api/adminMenuRoleMenu.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-admin-menu' {

        export interface ApiAdminMenuRoleMenu {
          /** @internal */
          get scope(): ScopeModuleAdminMenu;
        }

        export interface ApiAdminMenuRoleMenu {
          get $beanFullName(): 'admin-menu.api.adminMenuRoleMenu';
          get $onionName(): 'admin-menu:adminMenuRoleMenu';

        }
}
/** api: end */
/** api: begin */
import { ApiAdminMenuRoleMenu } from '../api/adminMenuRoleMenu.js';
export interface IModuleApi {
  'adminMenuRoleMenu': ApiAdminMenuRoleMenu;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-menu.api.adminMenuRoleMenu': ApiAdminMenuRoleMenu;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/adminMenuRoleMenu.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-admin-menu' {

        export interface ApiSchemaAdminMenuRoleMenu {
          /** @internal */
          get scope(): ScopeModuleAdminMenu;
        }

        export interface ApiSchemaAdminMenuRoleMenu {
          get $beanFullName(): 'admin-menu.apiSchema.adminMenuRoleMenu';
          get $onionName(): 'admin-menu:adminMenuRoleMenu';

        }
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaAdminMenuRoleMenu } from '../apiSchema/adminMenuRoleMenu.js';
export interface IModuleApiSchema {
  'adminMenuRoleMenu': ApiSchemaAdminMenuRoleMenu;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-menu.apiSchema.adminMenuRoleMenu': ApiSchemaAdminMenuRoleMenu;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../component/blockRoleMenuEditor/controller.jsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-admin-menu' {

        export interface ControllerBlockRoleMenuEditor {
          /** @internal */
          get scope(): ScopeModuleAdminMenu;
        }
}
/** controller: end */
/** controller: begin */
import { ControllerBlockRoleMenuEditor } from '../component/blockRoleMenuEditor/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'admin-menu.controller.blockRoleMenuEditor': ControllerBlockRoleMenuEditor;
  }
}
/** controller: end */

/** components: begin */
export * from './component/blockRoleMenuEditor.js';
import { ZBlockRoleMenuEditor } from './component/blockRoleMenuEditor.js';
export const components = {
  'blockRoleMenuEditor': ZBlockRoleMenuEditor,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'admin-menu:blockRoleMenuEditor': ControllerBlockRoleMenuEditor;
}
export interface IZovaComponentRecord {
  'admin-menu:blockRoleMenuEditor': typeof ZBlockRoleMenuEditor;
}
}
/** components: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAdminMenu extends BeanScopeBase {}

export interface ScopeModuleAdminMenu {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'admin-menu': ScopeModuleAdminMenu;
  }



  export interface IBeanScopeLocale {
    'admin-menu': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `admin-menu::${K}` {
  return `admin-menu::${key}`;
}
/** scope: end */
