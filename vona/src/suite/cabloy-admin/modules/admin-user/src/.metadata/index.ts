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
export * from '../dto/userAccountStatusUpdate.ts';
export * from '../dto/userBase.tsx';
export * from '../dto/userDepartmentMembershipSummary.ts';
export * from '../dto/userRoleSummary.ts';
export * from '../dto/userSelectReq.tsx';
export * from '../dto/userSelectRes.tsx';
export * from '../dto/userSelectResItem.tsx';
export * from '../dto/userUpdate.tsx';
export * from '../dto/userView.tsx';
import type { IDtoOptionsUserAccountStatusUpdate } from '../dto/userAccountStatusUpdate.ts';
import type { IDtoOptionsUserBase } from '../dto/userBase.tsx';
import type { IDtoOptionsUserDepartmentMembershipSummary } from '../dto/userDepartmentMembershipSummary.ts';
import type { IDtoOptionsUserRoleSummary } from '../dto/userRoleSummary.ts';
import type { IDtoOptionsUserSelectReq } from '../dto/userSelectReq.tsx';
import type { IDtoOptionsUserSelectRes } from '../dto/userSelectRes.tsx';
import type { IDtoOptionsUserSelectResItem } from '../dto/userSelectResItem.tsx';
import type { IDtoOptionsUserUpdate } from '../dto/userUpdate.tsx';
import type { IDtoOptionsUserView } from '../dto/userView.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'admin-user:userAccountStatusUpdate': IDtoOptionsUserAccountStatusUpdate;
'admin-user:userBase': IDtoOptionsUserBase;
'admin-user:userDepartmentMembershipSummary': IDtoOptionsUserDepartmentMembershipSummary;
'admin-user:userRoleSummary': IDtoOptionsUserRoleSummary;
'admin-user:userSelectReq': IDtoOptionsUserSelectReq;
'admin-user:userSelectRes': IDtoOptionsUserSelectRes;
'admin-user:userSelectResItem': IDtoOptionsUserSelectResItem;
'admin-user:userUpdate': IDtoOptionsUserUpdate;
'admin-user:userView': IDtoOptionsUserView;
    }

  
}
declare module 'vona-module-admin-user' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoUserAccountStatusUpdate } from '../dto/userAccountStatusUpdate.ts';
import type { DtoUserBase } from '../dto/userBase.tsx';
import type { DtoUserDepartmentMembershipSummary } from '../dto/userDepartmentMembershipSummary.ts';
import type { DtoUserRoleSummary } from '../dto/userRoleSummary.ts';
import type { DtoUserSelectReq } from '../dto/userSelectReq.tsx';
import type { DtoUserSelectRes } from '../dto/userSelectRes.tsx';
import type { DtoUserSelectResItem } from '../dto/userSelectResItem.tsx';
import type { DtoUserUpdate } from '../dto/userUpdate.tsx';
import type { DtoUserView } from '../dto/userView.tsx';
declare module 'vona-module-admin-user' {
  
    export interface IDtoOptionsUserAccountStatusUpdate {
      fields?: TypeEntityOptionsFields<DtoUserAccountStatusUpdate, IDtoOptionsUserAccountStatusUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserBase {
      fields?: TypeEntityOptionsFields<DtoUserBase, IDtoOptionsUserBase[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserDepartmentMembershipSummary {
      fields?: TypeEntityOptionsFields<DtoUserDepartmentMembershipSummary, IDtoOptionsUserDepartmentMembershipSummary[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserRoleSummary {
      fields?: TypeEntityOptionsFields<DtoUserRoleSummary, IDtoOptionsUserRoleSummary[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserSelectReq {
      fields?: TypeEntityOptionsFields<DtoUserSelectReq, IDtoOptionsUserSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserSelectRes {
      fields?: TypeEntityOptionsFields<DtoUserSelectRes, IDtoOptionsUserSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserSelectResItem {
      fields?: TypeEntityOptionsFields<DtoUserSelectResItem, IDtoOptionsUserSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserUpdate {
      fields?: TypeEntityOptionsFields<DtoUserUpdate, IDtoOptionsUserUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserView {
      fields?: TypeEntityOptionsFields<DtoUserView, IDtoOptionsUserView[TypeSymbolKeyFieldsMore]>;
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
    }
export interface IApiPathPutRecord{
        '/admin/user/account-status/:id': undefined;
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
