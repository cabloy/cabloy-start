import type { IRbacActionDescriptor, TypeRbacDataScope } from 'vona-module-a-rbac';

const RbacDataScopes: readonly TypeRbacDataScope[] = [
  'all',
  'customDepartments',
  'ownDepartment',
  'ownDepartmentAndDescendants',
  'mine',
];

const DataScopeFieldPattern = /^[a-z_]\w*$/i;

export function getRbacPolicyActions(
  catalog: ReadonlyMap<string, IRbacActionDescriptor>,
  policyActionKey: string,
): IRbacActionDescriptor[] {
  return [...catalog.values()].filter(
    action => (action.actionInheritKey ?? action.actionKey) === policyActionKey,
  );
}

export function isRbacDataScope(value: unknown): value is TypeRbacDataScope {
  return RbacDataScopes.includes(value as TypeRbacDataScope);
}

export function isRbacDataScopeCompatible(
  action: IRbacActionDescriptor,
  dataScope: TypeRbacDataScope,
): boolean {
  if (!action.options.dataScope) return dataScope === 'all';
  if (dataScope === 'all') return true;
  if (dataScope === 'mine') {
    return isDataScopeField(action.options.dataScopeMineField ?? 'userIdOwner');
  }
  return isDataScopeField(action.options.dataScopeField ?? 'departmentId');
}

function isDataScopeField(value: unknown): value is string {
  return typeof value === 'string' && DataScopeFieldPattern.test(value);
}
