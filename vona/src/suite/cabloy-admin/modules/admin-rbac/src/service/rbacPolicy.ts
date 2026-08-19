import type { TableIdentity } from 'table-identity';
import type {
  IRbacPolicyDecision,
  IRbacPolicyRequest,
  IRbacScopeTerm,
  TypeRbacDataScope,
} from 'vona-module-a-rbac';
import type { EntityDepartment } from 'vona-module-admin-department';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

@Service()
export class ServiceRbacPolicy extends BeanBase {
  async resolve(request: IRbacPolicyRequest): Promise<IRbacPolicyDecision> {
    const user = this.bean.passport.currentUser;
    if (!user || user.anonymous) return this.deny(request);

    const roleIds = (this.bean.passport.currentRoles ?? []).map(role => role.id);
    if (!roleIds.length) return this.deny(request);

    const grants = await this.scope.model.rbacGrant.select({
      where: {
        _and_: {
          roleId: { _in_: roleIds },
          actionKey: request.policyActionKey,
          enabled: true,
        },
      },
    });
    if (!grants.length) return this.deny(request);

    if (!request.action.options.dataScope) {
      return this.allow(request);
    }

    const terms: IRbacScopeTerm[] = [];
    const ownDepartmentScopes = new Set<TypeRbacDataScope>();
    const customGrantIds: TableIdentity[] = [];
    for (const grant of grants) {
      const dataScope = grant.dataScope as TypeRbacDataScope;
      if (!this.isDataScope(dataScope)) return this.deny(request);
      if (dataScope === 'all') return this.allow(request);
      if (dataScope === 'mine') {
        terms.push({ dataScope, ownerId: String(user.id) });
      } else if (dataScope === 'customDepartments') {
        customGrantIds.push(grant.id);
      } else {
        ownDepartmentScopes.add(dataScope);
      }
    }

    const [customDepartmentIds, membershipRoots] = await Promise.all([
      this.resolveCustomDepartmentIds(customGrantIds),
      ownDepartmentScopes.size ? this.resolveMembershipRoots(user.id) : Promise.resolve([]),
    ]);
    if (customDepartmentIds.length) {
      terms.push({ dataScope: 'customDepartments', departmentIds: customDepartmentIds });
    }
    if (membershipRoots.length && ownDepartmentScopes.has('ownDepartment')) {
      terms.push({ dataScope: 'ownDepartment', departmentIds: membershipRoots });
    }
    if (membershipRoots.length && ownDepartmentScopes.has('ownDepartmentAndDescendants')) {
      const departmentIds = await this.descendantClosure(membershipRoots);
      if (departmentIds.length) {
        terms.push({ dataScope: 'ownDepartmentAndDescendants', departmentIds });
      }
    }
    if (!terms.length) return this.deny(request);
    return { allowed: true, actionKey: request.action.actionKey, action: request.action, terms };
  }

  private allow(request: IRbacPolicyRequest): IRbacPolicyDecision {
    return { allowed: true, actionKey: request.action.actionKey, action: request.action };
  }

  private deny(request: IRbacPolicyRequest): IRbacPolicyDecision {
    return { allowed: false, actionKey: request.action.actionKey, action: request.action };
  }

  private isDataScope(value: unknown): value is TypeRbacDataScope {
    return [
      'all',
      'customDepartments',
      'ownDepartment',
      'ownDepartmentAndDescendants',
      'mine',
    ].includes(value as TypeRbacDataScope);
  }

  private async resolveCustomDepartmentIds(grantIds: TableIdentity[]): Promise<string[]> {
    if (!grantIds.length) return [];
    const rows = await this.scope.model.rbacGrantDepartment.select({
      where: { rbacGrantId: { _in_: grantIds } },
    });
    return await this.enabledDepartmentIds(rows.map(row => row.departmentId));
  }

  private async resolveMembershipRoots(userId: TableIdentity): Promise<string[]> {
    const memberships = await this.app.scope('admin-department').model.departmentMembership.select({
      where: { userId, enabled: true },
    });
    return await this.enabledDepartmentIds(memberships.map(item => item.departmentId));
  }

  private async enabledDepartmentIds(ids: TableIdentity[]): Promise<string[]> {
    const unique = [...new Set(ids.map(String))];
    if (!unique.length) return [];
    const departments = await this.app.scope('admin-department').model.department.select({
      where: { id: { _in_: unique }, enabled: true },
    });
    return departments.map(item => String(item.id));
  }

  private async descendantClosure(roots: string[]): Promise<string[]> {
    const departments = await this.app.scope('admin-department').model.department.select({
      where: { enabled: true },
    });
    const children = new Map<string, string[]>();
    for (const department of departments as EntityDepartment[]) {
      if (department.parentId === null || department.parentId === undefined) continue;
      const parentId = String(department.parentId);
      const values = children.get(parentId) ?? [];
      values.push(String(department.id));
      children.set(parentId, values);
    }
    const result = new Set<string>();
    const pending = [...roots];
    while (pending.length) {
      const id = pending.shift()!;
      if (result.has(id)) continue;
      result.add(id);
      pending.push(...(children.get(id) ?? []));
    }
    return [...result];
  }
}
