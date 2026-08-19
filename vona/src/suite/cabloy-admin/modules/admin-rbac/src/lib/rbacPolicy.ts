import type { IRbacActionDescriptor, TypeRbacDataScope } from 'vona-module-a-rbac';

const RbacDataScopes: readonly TypeRbacDataScope[] = [
  'all',
  'customDepartments',
  'ownDepartment',
  'ownDepartmentAndDescendants',
  'mine',
];

const DataScopeFieldPattern = /^[a-z_]\w*$/i;

export interface IRbacGrantablePolicyAction {
  action: IRbacActionDescriptor;
  dataScopes: TypeRbacDataScope[];
}

export function getRbacPolicyActions(
  catalog: ReadonlyMap<string, IRbacActionDescriptor>,
  policyActionKey: string,
): IRbacActionDescriptor[] {
  return [...catalog.values()].filter(
    action => (action.actionInheritKey ?? action.actionKey) === policyActionKey,
  );
}

export function getRbacGrantablePolicyAction(
  catalog: ReadonlyMap<string, IRbacActionDescriptor>,
  policyActionKey: string,
): IRbacGrantablePolicyAction | undefined {
  const actions = getRbacPolicyActions(catalog, policyActionKey);
  const [action, ...aliases] = actions;
  if (!action || !aliases.every(alias => hasCompatibleRbacDataScopeOptions(alias, action))) {
    return undefined;
  }
  return { action, dataScopes: getSupportedRbacDataScopes(action) };
}

export function getSupportedRbacDataScopes(action: IRbacActionDescriptor): TypeRbacDataScope[] {
  return RbacDataScopes.filter(dataScope => isRbacDataScopeCompatible(action, dataScope));
}

export function hasCompatibleRbacDataScopeOptions(
  left: IRbacActionDescriptor,
  right: IRbacActionDescriptor,
): boolean {
  return (
    left.options.dataScope === right.options.dataScope &&
    left.options.dataScopeField === right.options.dataScopeField &&
    left.options.dataScopeMineField === right.options.dataScopeMineField
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

export function isRbacPolicyRoleAvailable(
  role: { name: string } | undefined,
): role is { name: string } {
  return !!role && role.name !== 'systemAdmin';
}

function isDataScopeField(value: unknown): value is string {
  return typeof value === 'string' && DataScopeFieldPattern.test(value);
}
