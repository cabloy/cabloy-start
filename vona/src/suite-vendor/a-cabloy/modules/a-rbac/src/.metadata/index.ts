// eslint-disable
/** guard: begin */
export * from '../bean/guard.rbac.ts';
import type { IGuardOptionsRbac } from '../bean/guard.rbac.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
  
export interface IGuardRecordLocal {
  'a-rbac:rbac': IGuardOptionsRbac;
}

}
declare module 'vona-module-a-rbac' {
  
        export interface GuardRbac {
          /** @internal */
          get scope(): ScopeModuleARbac;
        }

          export interface GuardRbac {
            get $beanFullName(): 'a-rbac.guard.rbac';
            get $onionName(): 'a-rbac:rbac';
            get $onionOptions(): IGuardOptionsRbac;
          } 
}
/** guard: end */
/** bean: begin */
export * from '../bean/bean.rbacCatalog.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-rbac' {
  
        export interface BeanRbacCatalog {
          /** @internal */
          get scope(): ScopeModuleARbac;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanRbacCatalog } from '../bean/bean.rbacCatalog.ts';
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'rbacCatalog': BeanRbacCatalog;
  }
}
/** bean: end */
/** event: begin */
export * from '../bean/event.resolvePolicy.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-rbac' {
  
        export interface EventResolvePolicy {
          /** @internal */
          get scope(): ScopeModuleARbac;
        }

          export interface EventResolvePolicy {
            get $beanFullName(): 'a-rbac.event.resolvePolicy';
            get $onionName(): 'a-rbac:resolvePolicy';
            
          } 
}
/** event: end */
/** event: begin */
import type { EventResolvePolicy } from '../bean/event.resolvePolicy.ts';
export interface IModuleEvent {
  'resolvePolicy': EventResolvePolicy;
}
/** event: end */
/** event: begin */
import type { TypeEventResolvePolicyData, TypeEventResolvePolicyResult } from '../bean/event.resolvePolicy.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'a-rbac:resolvePolicy': EventOn<TypeEventResolvePolicyData, TypeEventResolvePolicyResult>;
  }
}
/** event: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleARbac extends BeanScopeBase {}

export interface ScopeModuleARbac {
  util: BeanScopeUtil;
event: IModuleEvent;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-rbac': ScopeModuleARbac;
  }

  export interface IBeanScopeContainer {
    rbac: ScopeModuleARbac;
  }
  
  

  

  
}
/** scope: end */
