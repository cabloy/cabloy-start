// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAdminDepartment extends BeanScopeBase {}

export interface ScopeModuleAdminDepartment {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'admin-department': ScopeModuleAdminDepartment;
  }
  
  

  

  
}

/** scope: end */
