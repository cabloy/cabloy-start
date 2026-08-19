// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAdminRbac extends BeanScopeBase {}

export interface ScopeModuleAdminRbac {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'admin-rbac': ScopeModuleAdminRbac;
  }
  
  

  

  
}

/** scope: end */
