import type { ContextRoute } from 'vona-module-a-web';

import type { IGuardOptionsRbac } from '../bean/guard.rbac.ts';

export type TypeRbacDataScope =
  | 'all'
  | 'customDepartments'
  | 'ownDepartment'
  | 'ownDepartmentAndDescendants'
  | 'mine';

export interface IRbacActionDescriptor {
  actionKey: string;
  controllerBeanFullName: string;
  action: string;
  actionInheritKey?: string;
  route: ContextRoute;
  options: IGuardOptionsRbac;
}

export interface IRbacPolicyRequest {
  action: IRbacActionDescriptor;
}

export interface IRbacScopeTerm {
  dataScope: TypeRbacDataScope;
  departmentIds?: string[];
  ownerId?: string;
}

export interface IRbacPolicyDecision {
  allowed: boolean;
  actionKey: string;
  action: IRbacActionDescriptor;
  terms?: IRbacScopeTerm[];
  revision?: string;
}
