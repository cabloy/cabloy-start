// eslint-disable
/** model: begin */
export * from '../model/department.ts';
import { IModelOptionsDepartment } from '../model/department.ts';
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
import type { ModelDepartment } from '../model/department.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-department.model.department': ModelDepartment;
  }
}
/** model: end */
/** api: begin */
export * from '../api/adminDepartment.ts';

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
import type { ApiAdminDepartment } from '../api/adminDepartment.ts';
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
export * from '../api/openapi/index.ts';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/adminDepartment.ts';

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
import type { ApiSchemaAdminDepartment } from '../apiSchema/adminDepartment.ts';
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
export * from '../component/actionCreateMembership/controller.tsx';
export * from '../component/actionEditDepartment/controller.tsx';
export * from '../component/blockDepartmentMemberships/controller.tsx';
export * from '../component/blockPageDepartments/controller.tsx';
export * from '../component/formFieldDepartmentTree/controller.tsx';

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
import type { ControllerActionCreateMembership } from '../component/actionCreateMembership/controller.tsx';
import type { ControllerActionEditDepartment } from '../component/actionEditDepartment/controller.tsx';
import type { ControllerBlockDepartmentMemberships } from '../component/blockDepartmentMemberships/controller.tsx';
import type { ControllerBlockPageDepartments } from '../component/blockPageDepartments/controller.tsx';
import type { ControllerFormFieldDepartmentTree } from '../component/formFieldDepartmentTree/controller.tsx';
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
export * from './component/actionCreateMembership.ts';
import { ZActionCreateMembership } from './component/actionCreateMembership.ts';
export * from './component/actionEditDepartment.ts';
import { ZActionEditDepartment } from './component/actionEditDepartment.ts';
export * from './component/blockDepartmentMemberships.ts';
import { ZBlockDepartmentMemberships } from './component/blockDepartmentMemberships.ts';
export * from './component/blockPageDepartments.ts';
import { ZBlockPageDepartments } from './component/blockPageDepartments.ts';
export * from './component/formFieldDepartmentTree.ts';
import { ZFormFieldDepartmentTree } from './component/formFieldDepartmentTree.ts';
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
export * from '../bean/tableCell.actionActivation.tsx';
export * from '../bean/tableCell.actionDeleteMembership.tsx';
export * from '../bean/tableCell.actionMove.tsx';
export * from '../bean/tableCell.actionReorder.tsx';
export * from '../bean/tableCell.actionToggleMembershipPrimary.tsx';
export * from '../bean/tableCell.actionUpdateMembership.tsx';
export * from '../bean/tableCell.actionUpdateMembershipManager.tsx';
export * from '../bean/tableCell.departmentName.tsx';
import { ITableCellOptionsActionActivation } from '../bean/tableCell.actionActivation.tsx';
import { ITableCellOptionsActionDeleteMembership } from '../bean/tableCell.actionDeleteMembership.tsx';
import { ITableCellOptionsActionMove } from '../bean/tableCell.actionMove.tsx';
import { ITableCellOptionsActionReorder } from '../bean/tableCell.actionReorder.tsx';
import { ITableCellOptionsActionToggleMembershipPrimary } from '../bean/tableCell.actionToggleMembershipPrimary.tsx';
import { ITableCellOptionsActionUpdateMembership } from '../bean/tableCell.actionUpdateMembership.tsx';
import { ITableCellOptionsActionUpdateMembershipManager } from '../bean/tableCell.actionUpdateMembershipManager.tsx';
import { ITableCellOptionsDepartmentName } from '../bean/tableCell.departmentName.tsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {

    export interface ITableCellRecord {
      'admin-department:actionActivation': ITableCellOptionsActionActivation;
'admin-department:actionDeleteMembership': ITableCellOptionsActionDeleteMembership;
'admin-department:actionMove': ITableCellOptionsActionMove;
'admin-department:actionReorder': ITableCellOptionsActionReorder;
'admin-department:actionToggleMembershipPrimary': ITableCellOptionsActionToggleMembershipPrimary;
'admin-department:actionUpdateMembership': ITableCellOptionsActionUpdateMembership;
'admin-department:actionUpdateMembershipManager': ITableCellOptionsActionUpdateMembershipManager;
'admin-department:departmentName': ITableCellOptionsDepartmentName;
    }


}
declare module 'zova-module-admin-department' {

        export interface TableCellActionActivation {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface TableCellActionActivation {
          get $beanFullName(): 'admin-department.tableCell.actionActivation';
          get $onionName(): 'admin-department:actionActivation';
          get $onionOptions(): ITableCellOptionsActionActivation;
        }

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

        export interface TableCellActionReorder {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface TableCellActionReorder {
          get $beanFullName(): 'admin-department.tableCell.actionReorder';
          get $onionName(): 'admin-department:actionReorder';
          get $onionOptions(): ITableCellOptionsActionReorder;
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

        export interface TableCellDepartmentName {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

        export interface TableCellDepartmentName {
          get $beanFullName(): 'admin-department.tableCell.departmentName';
          get $onionName(): 'admin-department:departmentName';
          get $onionOptions(): ITableCellOptionsDepartmentName;
        }
}
/** tableCell: end */
/** tableCell: begin */
import type { TableCellActionActivation } from '../bean/tableCell.actionActivation.tsx';
import type { TableCellActionDeleteMembership } from '../bean/tableCell.actionDeleteMembership.tsx';
import type { TableCellActionMove } from '../bean/tableCell.actionMove.tsx';
import type { TableCellActionReorder } from '../bean/tableCell.actionReorder.tsx';
import type { TableCellActionToggleMembershipPrimary } from '../bean/tableCell.actionToggleMembershipPrimary.tsx';
import type { TableCellActionUpdateMembership } from '../bean/tableCell.actionUpdateMembership.tsx';
import type { TableCellActionUpdateMembershipManager } from '../bean/tableCell.actionUpdateMembershipManager.tsx';
import type { TableCellDepartmentName } from '../bean/tableCell.departmentName.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'admin-department.tableCell.actionActivation': TableCellActionActivation;
'admin-department.tableCell.actionDeleteMembership': TableCellActionDeleteMembership;
'admin-department.tableCell.actionMove': TableCellActionMove;
'admin-department.tableCell.actionReorder': TableCellActionReorder;
'admin-department.tableCell.actionToggleMembershipPrimary': TableCellActionToggleMembershipPrimary;
'admin-department.tableCell.actionUpdateMembership': TableCellActionUpdateMembership;
'admin-department.tableCell.actionUpdateMembershipManager': TableCellActionUpdateMembershipManager;
'admin-department.tableCell.departmentName': TableCellDepartmentName;
  }
}
/** tableCell: end */
/** locale: begin */
import { locales } from './locales.ts';
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
