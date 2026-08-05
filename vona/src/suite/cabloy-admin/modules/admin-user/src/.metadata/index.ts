// eslint-disable
import type { TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** service: begin */
export * from '../service/user.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'admin-user:user': never;
    }

  
}
declare module 'vona-module-admin-user' {
  
        export interface ServiceUser {
          /** @internal */
          get scope(): ScopeModuleAdminUser;
        }

          export interface ServiceUser {
            get $beanFullName(): 'admin-user.service.user';
            get $onionName(): 'admin-user:user';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceUser } from '../service/user.ts';
export interface IModuleService {
  'user': ServiceUser;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'admin-user.service.user': ServiceUser;
  }
}
/** service: end */
/** dto: begin */
export * from '../dto/userItem.ts';
export * from '../dto/userSelectReq.ts';
export * from '../dto/userSelectRes.ts';
export * from '../dto/userUpdate.ts';
import type { IDtoOptionsUserItem } from '../dto/userItem.ts';
import type { IDtoOptionsUserSelectReq } from '../dto/userSelectReq.ts';
import type { IDtoOptionsUserSelectRes } from '../dto/userSelectRes.ts';
import type { IDtoOptionsUserUpdate } from '../dto/userUpdate.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'admin-user:userItem': IDtoOptionsUserItem;
'admin-user:userSelectReq': IDtoOptionsUserSelectReq;
'admin-user:userSelectRes': IDtoOptionsUserSelectRes;
'admin-user:userUpdate': IDtoOptionsUserUpdate;
    }

  
}
declare module 'vona-module-admin-user' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoUserItem } from '../dto/userItem.ts';
import type { DtoUserSelectReq } from '../dto/userSelectReq.ts';
import type { DtoUserSelectRes } from '../dto/userSelectRes.ts';
import type { DtoUserUpdate } from '../dto/userUpdate.ts';
declare module 'vona-module-admin-user' {
  
    export interface IDtoOptionsUserItem {
      fields?: TypeEntityOptionsFields<DtoUserItem, IDtoOptionsUserItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserSelectReq {
      fields?: TypeEntityOptionsFields<DtoUserSelectReq, IDtoOptionsUserSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserSelectRes {
      fields?: TypeEntityOptionsFields<DtoUserSelectRes, IDtoOptionsUserSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserUpdate {
      fields?: TypeEntityOptionsFields<DtoUserUpdate, IDtoOptionsUserUpdate[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/user.ts';
import type { IControllerOptionsUser } from '../controller/user.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'admin-user:user': IControllerOptionsUser;
    }

  
}
declare module 'vona-module-admin-user' {
  
        export interface ControllerUser {
          /** @internal */
          get scope(): ScopeModuleAdminUser;
        }

          export interface ControllerUser {
            get $beanFullName(): 'admin-user.controller.user';
            get $onionName(): 'admin-user:user';
            get $onionOptions(): IControllerOptionsUser;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerUser } from '../controller/user.ts';
declare module 'vona-module-admin-user' {
  
    export interface IControllerOptionsUser {
      actions?: TypeControllerOptionsActions<ControllerUser>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/admin/user': undefined;
'/admin/user/:id': undefined;
    }
export interface IApiPathPatchRecord{
        '/admin/user/:id': undefined;
    }
export interface IApiPathPostRecord{
        '/admin/user/activate/:id': undefined;
'/admin/user/deactivate/:id': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'admin-user:user': never;
    }
  }
  
/** controller: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.user.ts';
import type { ISsrMenuOptionsUser } from '../bean/ssrMenu.user.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'admin-user:user': ISsrMenuOptionsUser;
    }

  
}
declare module 'vona-module-admin-user' {
  
        export interface SsrMenuUser {
          /** @internal */
          get scope(): ScopeModuleAdminUser;
        }

          export interface SsrMenuUser {
            get $beanFullName(): 'admin-user.ssrMenu.user';
            get $onionName(): 'admin-user:user';
            get $onionOptions(): ISsrMenuOptionsUser;
          } 
}
/** ssrMenu: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** error: begin */
export * from '../config/errors.ts';
import type { errors } from '../config/errors.ts';
/** error: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleErrors, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAdminUser extends BeanScopeBase {}

export interface ScopeModuleAdminUser {
  util: BeanScopeUtil;
error: TypeModuleErrors<typeof errors>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'admin-user': ScopeModuleAdminUser;
  }

  export interface IBeanScopeContainer {
    adminUser: ScopeModuleAdminUser;
  }
  
  

  export interface IBeanScopeLocale {
    'admin-user': (typeof locales)[TypeLocaleBase];
  }

  export interface IBeanScopeErrors {
    'admin-user': typeof errors;
  }
}
/** scope: end */
