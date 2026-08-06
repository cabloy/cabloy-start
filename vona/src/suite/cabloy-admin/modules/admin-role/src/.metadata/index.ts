// eslint-disable
import type { TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** service: begin */
export * from '../service/role.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'admin-role:role': never;
    }

  
}
declare module 'vona-module-admin-role' {
  
        export interface ServiceRole {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface ServiceRole {
            get $beanFullName(): 'admin-role.service.role';
            get $onionName(): 'admin-role:role';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceRole } from '../service/role.ts';
export interface IModuleService {
  'role': ServiceRole;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'admin-role.service.role': ServiceRole;
  }
}
/** service: end */
/** meta: begin */
export * from '../bean/meta.redlock.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'admin-role:redlock': never;
    }

  
}
declare module 'vona-module-admin-role' {
  
        export interface MetaRedlock {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface MetaRedlock {
            get $beanFullName(): 'admin-role.meta.redlock';
            get $onionName(): 'admin-role:redlock';
            
          } 
}
/** meta: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
/** dto: begin */
export * from '../dto/roleBase.tsx';
export * from '../dto/roleCreate.tsx';
export * from '../dto/roleSelectReq.tsx';
export * from '../dto/roleSelectRes.tsx';
export * from '../dto/roleSelectResItem.tsx';
export * from '../dto/roleUpdate.tsx';
export * from '../dto/roleView.tsx';
export * from '../dto/userRoleReplace.ts';
import type { IDtoOptionsRoleBase } from '../dto/roleBase.tsx';
import type { IDtoOptionsRoleCreate } from '../dto/roleCreate.tsx';
import type { IDtoOptionsRoleSelectReq } from '../dto/roleSelectReq.tsx';
import type { IDtoOptionsRoleSelectRes } from '../dto/roleSelectRes.tsx';
import type { IDtoOptionsRoleSelectResItem } from '../dto/roleSelectResItem.tsx';
import type { IDtoOptionsRoleUpdate } from '../dto/roleUpdate.tsx';
import type { IDtoOptionsRoleView } from '../dto/roleView.tsx';
import type { IDtoOptionsUserRoleReplace } from '../dto/userRoleReplace.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'admin-role:roleBase': IDtoOptionsRoleBase;
'admin-role:roleCreate': IDtoOptionsRoleCreate;
'admin-role:roleSelectReq': IDtoOptionsRoleSelectReq;
'admin-role:roleSelectRes': IDtoOptionsRoleSelectRes;
'admin-role:roleSelectResItem': IDtoOptionsRoleSelectResItem;
'admin-role:roleUpdate': IDtoOptionsRoleUpdate;
'admin-role:roleView': IDtoOptionsRoleView;
'admin-role:userRoleReplace': IDtoOptionsUserRoleReplace;
    }

  
}
declare module 'vona-module-admin-role' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoRoleBase } from '../dto/roleBase.tsx';
import type { DtoRoleCreate } from '../dto/roleCreate.tsx';
import type { DtoRoleSelectReq } from '../dto/roleSelectReq.tsx';
import type { DtoRoleSelectRes } from '../dto/roleSelectRes.tsx';
import type { DtoRoleSelectResItem } from '../dto/roleSelectResItem.tsx';
import type { DtoRoleUpdate } from '../dto/roleUpdate.tsx';
import type { DtoRoleView } from '../dto/roleView.tsx';
import type { DtoUserRoleReplace } from '../dto/userRoleReplace.ts';
declare module 'vona-module-admin-role' {
  
    export interface IDtoOptionsRoleBase {
      fields?: TypeEntityOptionsFields<DtoRoleBase, IDtoOptionsRoleBase[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleCreate {
      fields?: TypeEntityOptionsFields<DtoRoleCreate, IDtoOptionsRoleCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleSelectReq {
      fields?: TypeEntityOptionsFields<DtoRoleSelectReq, IDtoOptionsRoleSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleSelectRes {
      fields?: TypeEntityOptionsFields<DtoRoleSelectRes, IDtoOptionsRoleSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleSelectResItem {
      fields?: TypeEntityOptionsFields<DtoRoleSelectResItem, IDtoOptionsRoleSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleUpdate {
      fields?: TypeEntityOptionsFields<DtoRoleUpdate, IDtoOptionsRoleUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleView {
      fields?: TypeEntityOptionsFields<DtoRoleView, IDtoOptionsRoleView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserRoleReplace {
      fields?: TypeEntityOptionsFields<DtoUserRoleReplace, IDtoOptionsUserRoleReplace[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/role.ts';
import type { IControllerOptionsRole } from '../controller/role.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'admin-role:role': IControllerOptionsRole;
    }

  
}
declare module 'vona-module-admin-role' {
  
        export interface ControllerRole {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface ControllerRole {
            get $beanFullName(): 'admin-role.controller.role';
            get $onionName(): 'admin-role:role';
            get $onionOptions(): IControllerOptionsRole;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerRole } from '../controller/role.ts';
declare module 'vona-module-admin-role' {
  
    export interface IControllerOptionsRole {
      actions?: TypeControllerOptionsActions<ControllerRole>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/admin/role': undefined;
    }
export interface IApiPathGetRecord{
        '/admin/role': undefined;
'/admin/role/:id': undefined;
    }
export interface IApiPathPatchRecord{
        '/admin/role/:id': undefined;
    }
export interface IApiPathDeleteRecord{
        '/admin/role/:id': undefined;
    }
export interface IApiPathPutRecord{
        '/admin/role/user/:userId/roles': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'admin-role:role': never;
    }
  }
  
/** controller: end */
/** zodRefine: begin */
export * from '../bean/zodRefine.siteIdsAvailable.ts';
import type { IZodRefineOptionsSiteIdsAvailable } from '../bean/zodRefine.siteIdsAvailable.ts';
import 'vona-module-a-zod';
declare module 'vona-module-a-zod' {
  
    export interface IZodRefineRecord {
      'admin-role:siteIdsAvailable': IZodRefineOptionsSiteIdsAvailable;
    }

  
}
declare module 'vona-module-admin-role' {
  
        export interface ZodRefineSiteIdsAvailable {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface ZodRefineSiteIdsAvailable {
            get $beanFullName(): 'admin-role.zodRefine.siteIdsAvailable';
            get $onionName(): 'admin-role:siteIdsAvailable';
            get $onionOptions(): IZodRefineOptionsSiteIdsAvailable;
          } 
}
/** zodRefine: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.role.ts';
import type { ISsrMenuOptionsRole } from '../bean/ssrMenu.role.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'admin-role:role': ISsrMenuOptionsRole;
    }

  
}
declare module 'vona-module-admin-role' {
  
        export interface SsrMenuRole {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface SsrMenuRole {
            get $beanFullName(): 'admin-role.ssrMenu.role';
            get $onionName(): 'admin-role:role';
            get $onionOptions(): ISsrMenuOptionsRole;
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
export class ScopeModuleAdminRole extends BeanScopeBase {}

export interface ScopeModuleAdminRole {
  util: BeanScopeUtil;
error: TypeModuleErrors<typeof errors>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
service: IModuleService;
redlock: MetaRedlock;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'admin-role': ScopeModuleAdminRole;
  }

  export interface IBeanScopeContainer {
    adminRole: ScopeModuleAdminRole;
  }
  
  

  export interface IBeanScopeLocale {
    'admin-role': (typeof locales)[TypeLocaleBase];
  }

  export interface IBeanScopeErrors {
    'admin-role': typeof errors;
  }
}
/** scope: end */
