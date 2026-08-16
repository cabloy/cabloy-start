// eslint-disable
/** model: begin */
export * from '../model/department.js';
import { IModelOptionsDepartment } from '../model/department.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'admin-department:department': IModelOptionsDepartment;
    }

  
}
declare module 'zova-module-admin-department' {
  
        export interface ModelDepartment {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface ModelDepartment {
          get $beanFullName(): 'admin-department.model.department';
          get $onionName(): 'admin-department:department';
          get $onionOptions(): IModelOptionsDepartment;
        } 
}
/** model: end */
/** model: begin */
import { ModelDepartment } from '../model/department.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-department.model.department': ModelDepartment;
  }
}
/** model: end */
/** api: begin */
export * from '../api/adminDepartment.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-admin-department' {
  
        export interface ApiAdminDepartment {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface ApiAdminDepartment {
          get $beanFullName(): 'admin-department.api.adminDepartment';
          get $onionName(): 'admin-department:adminDepartment';
          
        } 
}
/** api: end */
/** api: begin */
import { ApiAdminDepartment } from '../api/adminDepartment.js';
export interface IModuleApi {
  'adminDepartment': ApiAdminDepartment;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-department.api.adminDepartment': ApiAdminDepartment;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/adminDepartment.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-admin-department' {
  
        export interface ApiSchemaAdminDepartment {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface ApiSchemaAdminDepartment {
          get $beanFullName(): 'admin-department.apiSchema.adminDepartment';
          get $onionName(): 'admin-department:adminDepartment';
          
        } 
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaAdminDepartment } from '../apiSchema/adminDepartment.js';
export interface IModuleApiSchema {
  'adminDepartment': ApiSchemaAdminDepartment;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-department.apiSchema.adminDepartment': ApiSchemaAdminDepartment;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../component/actionCreateMembership/controller.jsx';
export * from '../component/actionEditDepartment/controller.jsx';
export * from '../component/blockDepartmentMemberships/controller.jsx';
export * from '../component/blockPageDepartments/controller.jsx';
export * from '../component/formFieldDepartmentTree/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-admin-department' {
  
        export interface ControllerActionCreateMembership {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface ControllerActionEditDepartment {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface ControllerBlockDepartmentMemberships {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface ControllerBlockPageDepartments {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface ControllerFormFieldDepartmentTree {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerActionCreateMembership } from '../component/actionCreateMembership/controller.jsx';
import { ControllerActionEditDepartment } from '../component/actionEditDepartment/controller.jsx';
import { ControllerBlockDepartmentMemberships } from '../component/blockDepartmentMemberships/controller.jsx';
import { ControllerBlockPageDepartments } from '../component/blockPageDepartments/controller.jsx';
import { ControllerFormFieldDepartmentTree } from '../component/formFieldDepartmentTree/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'admin-department.controller.actionCreateMembership': ControllerActionCreateMembership;
'admin-department.controller.actionEditDepartment': ControllerActionEditDepartment;
'admin-department.controller.blockDepartmentMemberships': ControllerBlockDepartmentMemberships;
'admin-department.controller.blockPageDepartments': ControllerBlockPageDepartments;
'admin-department.controller.formFieldDepartmentTree': ControllerFormFieldDepartmentTree;
  }
}
/** controller: end */

/** components: begin */
export * from './component/actionCreateMembership.js';
import { ZActionCreateMembership } from './component/actionCreateMembership.js';
export * from './component/actionEditDepartment.js';
import { ZActionEditDepartment } from './component/actionEditDepartment.js';
export * from './component/blockDepartmentMemberships.js';
import { ZBlockDepartmentMemberships } from './component/blockDepartmentMemberships.js';
export * from './component/blockPageDepartments.js';
import { ZBlockPageDepartments } from './component/blockPageDepartments.js';
export * from './component/formFieldDepartmentTree.js';
import { ZFormFieldDepartmentTree } from './component/formFieldDepartmentTree.js';
export const components = {
  'actionCreateMembership': ZActionCreateMembership,
'actionEditDepartment': ZActionEditDepartment,
'blockDepartmentMemberships': ZBlockDepartmentMemberships,
'blockPageDepartments': ZBlockPageDepartments,
'formFieldDepartmentTree': ZFormFieldDepartmentTree,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'admin-department:actionCreateMembership': ControllerActionCreateMembership;
'admin-department:actionEditDepartment': ControllerActionEditDepartment;
'admin-department:blockDepartmentMemberships': ControllerBlockDepartmentMemberships;
'admin-department:blockPageDepartments': ControllerBlockPageDepartments;
'admin-department:formFieldDepartmentTree': ControllerFormFieldDepartmentTree;
}
export interface IZovaComponentRecord {
  'admin-department:actionCreateMembership': typeof ZActionCreateMembership;
'admin-department:actionEditDepartment': typeof ZActionEditDepartment;
'admin-department:blockDepartmentMemberships': typeof ZBlockDepartmentMemberships;
'admin-department:blockPageDepartments': typeof ZBlockPageDepartments;
'admin-department:formFieldDepartmentTree': typeof ZFormFieldDepartmentTree;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.actionDeleteMembership.jsx';
export * from '../bean/tableCell.actionMove.jsx';
export * from '../bean/tableCell.actionToggleMembershipPrimary.jsx';
export * from '../bean/tableCell.actionUpdateMembership.jsx';
export * from '../bean/tableCell.actionUpdateMembershipManager.jsx';
import { ITableCellOptionsActionDeleteMembership } from '../bean/tableCell.actionDeleteMembership.jsx';
import { ITableCellOptionsActionMove } from '../bean/tableCell.actionMove.jsx';
import { ITableCellOptionsActionToggleMembershipPrimary } from '../bean/tableCell.actionToggleMembershipPrimary.jsx';
import { ITableCellOptionsActionUpdateMembership } from '../bean/tableCell.actionUpdateMembership.jsx';
import { ITableCellOptionsActionUpdateMembershipManager } from '../bean/tableCell.actionUpdateMembershipManager.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'admin-department:actionDeleteMembership': ITableCellOptionsActionDeleteMembership;
'admin-department:actionMove': ITableCellOptionsActionMove;
'admin-department:actionToggleMembershipPrimary': ITableCellOptionsActionToggleMembershipPrimary;
'admin-department:actionUpdateMembership': ITableCellOptionsActionUpdateMembership;
'admin-department:actionUpdateMembershipManager': ITableCellOptionsActionUpdateMembershipManager;
    }

  
}
declare module 'zova-module-admin-department' {
  
        export interface TableCellActionDeleteMembership {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface TableCellActionDeleteMembership {
          get $beanFullName(): 'admin-department.tableCell.actionDeleteMembership';
          get $onionName(): 'admin-department:actionDeleteMembership';
          get $onionOptions(): ITableCellOptionsActionDeleteMembership;
        }

        export interface TableCellActionMove {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface TableCellActionMove {
          get $beanFullName(): 'admin-department.tableCell.actionMove';
          get $onionName(): 'admin-department:actionMove';
          get $onionOptions(): ITableCellOptionsActionMove;
        }

        export interface TableCellActionToggleMembershipPrimary {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface TableCellActionToggleMembershipPrimary {
          get $beanFullName(): 'admin-department.tableCell.actionToggleMembershipPrimary';
          get $onionName(): 'admin-department:actionToggleMembershipPrimary';
          get $onionOptions(): ITableCellOptionsActionToggleMembershipPrimary;
        }

        export interface TableCellActionUpdateMembership {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface TableCellActionUpdateMembership {
          get $beanFullName(): 'admin-department.tableCell.actionUpdateMembership';
          get $onionName(): 'admin-department:actionUpdateMembership';
          get $onionOptions(): ITableCellOptionsActionUpdateMembership;
        }

        export interface TableCellActionUpdateMembershipManager {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface TableCellActionUpdateMembershipManager {
          get $beanFullName(): 'admin-department.tableCell.actionUpdateMembershipManager';
          get $onionName(): 'admin-department:actionUpdateMembershipManager';
          get $onionOptions(): ITableCellOptionsActionUpdateMembershipManager;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellActionDeleteMembership } from '../bean/tableCell.actionDeleteMembership.jsx';
import { TableCellActionMove } from '../bean/tableCell.actionMove.jsx';
import { TableCellActionToggleMembershipPrimary } from '../bean/tableCell.actionToggleMembershipPrimary.jsx';
import { TableCellActionUpdateMembership } from '../bean/tableCell.actionUpdateMembership.jsx';
import { TableCellActionUpdateMembershipManager } from '../bean/tableCell.actionUpdateMembershipManager.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-department.tableCell.actionDeleteMembership': TableCellActionDeleteMembership;
'admin-department.tableCell.actionMove': TableCellActionMove;
'admin-department.tableCell.actionToggleMembershipPrimary': TableCellActionToggleMembershipPrimary;
'admin-department.tableCell.actionUpdateMembership': TableCellActionUpdateMembership;
'admin-department.tableCell.actionUpdateMembershipManager': TableCellActionUpdateMembershipManager;
  }
}
/** tableCell: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAdminDepartment extends BeanScopeBase {}

export interface ScopeModuleAdminDepartment {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'admin-department': ScopeModuleAdminDepartment;
  }
  
  

  export interface IBeanScopeLocale {
    'admin-department': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `admin-department::${K}` {
  return `admin-department::${key}`;
}
/** scope: end */
