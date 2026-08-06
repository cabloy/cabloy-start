// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAdminDepartment extends BeanScopeBase {}

export interface ScopeModuleAdminDepartment {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'admin-department': ScopeModuleAdminDepartment;
  }

  export interface IBeanScopeContainer {
    adminDepartment: ScopeModuleAdminDepartment;
  }
  
  

  

  
}
/** scope: end */
