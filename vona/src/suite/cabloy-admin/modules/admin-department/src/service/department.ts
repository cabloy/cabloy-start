import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoDepartmentActivation } from '../dto/departmentActivation.ts';
import type { DtoDepartmentCreate } from '../dto/departmentCreate.tsx';
import type { DtoDepartmentManagerUpdate } from '../dto/departmentManagerUpdate.ts';
import type { DtoDepartmentMembershipCreate } from '../dto/departmentMembershipCreate.ts';
import type { DtoDepartmentMembershipDelete } from '../dto/departmentMembershipDelete.ts';
import type { DtoDepartmentMembershipPrimary } from '../dto/departmentMembershipPrimary.ts';
import type { DtoDepartmentMembershipSelectRes } from '../dto/departmentMembershipSelectRes.ts';
import type { DtoDepartmentMembershipUpdate } from '../dto/departmentMembershipUpdate.ts';
import type { DtoDepartmentMove } from '../dto/departmentMove.ts';
import type { DtoDepartmentReorder } from '../dto/departmentReorder.ts';
import type { DtoDepartmentSelectRes } from '../dto/departmentSelectRes.tsx';
import type { DtoDepartmentTree, DtoDepartmentTreeItem } from '../dto/departmentTree.ts';
import type { DtoDepartmentUpdate } from '../dto/departmentUpdate.tsx';
import type { DtoDepartmentView } from '../dto/departmentView.tsx';
import type { EntityDepartment } from '../entity/department.tsx';
import type { EntityDepartmentMembership } from '../entity/departmentMembership.tsx';
import type { ModelDepartment } from '../model/department.ts';

const RootNamespace = 'root';
const SortOrderGap = 1024;

@Service()
export class ServiceDepartment extends BeanBase {
  @Core.transaction()
  async create(command: DtoDepartmentCreate): Promise<EntityDepartment> {
    const parentId = this.normalizeParentId(command.parentId);
    await this.ensureParent(parentId);
    return await this.withNamespaces([parentId], async () => {
      await this.ensureParent(parentId);
      await this.ensureNameAvailable(command.name, parentId);
      const department = await this.scope.model.department.insert({
        name: command.name,
        parentId,
        enabled: true,
        sortOrder: await this.getNextSortOrder(parentId),
      });
      await this.invalidatePolicy();
      return department;
    });
  }

  async select(params?: IQueryParams<ModelDepartment>): Promise<DtoDepartmentSelectRes> {
    return await this.scope.model.department.selectAndCount({
      ...params,
      include: { parent: true },
      orders: [
        ['sortOrder', 'asc'],
        ['id', 'asc'],
      ],
    });
  }

  async tree(): Promise<DtoDepartmentTree> {
    const departments = await this.scope.model.department.select({
      orders: [
        ['sortOrder', 'asc'],
        ['id', 'asc'],
      ],
    });
    const nodes = new Map<string, DtoDepartmentTreeItem>();
    for (const department of departments) {
      nodes.set(String(department.id), {
        id: department.id,
        name: department.name,
        parentId: department.parentId ?? null,
        enabled: department.enabled,
        sortOrder: department.sortOrder,
        children: [],
      });
    }
    const roots: DtoDepartmentTreeItem[] = [];
    for (const node of nodes.values()) {
      const parent = node.parentId === null ? undefined : nodes.get(String(node.parentId));
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return { list: roots };
  }

  async view(id: TableIdentity): Promise<DtoDepartmentView | undefined> {
    const department = await this.scope.model.department.getById(id, {
      include: { parent: true },
    });
    if (!department) return undefined;

    return department as DtoDepartmentView;
  }

  @Core.transaction()
  async update(id: TableIdentity, command: DtoDepartmentUpdate): Promise<void> {
    const department = await this.requireDepartment(id);
    await this.withNamespaces([department.parentId], async () => {
      const current = await this.requireDepartmentForUpdate(id);
      if (current.name === command.name) return;
      await this.ensureNameAvailable(command.name, current.parentId, current.id);
      await this.scope.model.department.updateById(current.id, { name: command.name });
    });
  }

  @Core.transaction()
  async move(id: TableIdentity, command: DtoDepartmentMove): Promise<void> {
    const department = await this.requireDepartment(id);
    const parentId = this.normalizeParentId(command.parentId);
    if (parentId !== null && String(parentId) === String(department.id)) {
      this.scope.error.DepartmentCycleDetected.throw();
    }
    await this.withNamespaces([department.parentId, parentId], async () => {
      const current = await this.requireDepartmentForUpdate(id);
      await this.ensureParent(parentId);
      await this.ensureNoCycle(current.id, parentId);
      await this.ensureNameAvailable(current.name, parentId, current.id);
      await this.scope.model.department.updateById(current.id, {
        parentId,
        sortOrder: await this.getNextSortOrder(parentId),
      });
      await this.invalidatePolicy();
    });
  }

  @Core.transaction()
  async reorder(id: TableIdentity, command: DtoDepartmentReorder): Promise<void> {
    const department = await this.requireDepartment(id);
    await this.withNamespaces([department.parentId], async () => {
      const current = await this.requireDepartmentForUpdate(id);
      let beforeId = command.beforeId;
      if (beforeId !== null) {
        if (String(beforeId) === String(current.id)) {
          this.scope.error.DepartmentReorderInvalid.throw();
        }
        const before = await this.scope.model.department.getByIdForUpdate(beforeId);
        if (!before || !this.sameParent(before.parentId, current.parentId)) {
          this.scope.error.DepartmentReorderInvalid.throw();
        }
        beforeId = before!.id;
      }
      await this.resequenceSiblings(current.parentId, current.id, beforeId);
    });
  }

  @Core.transaction()
  async updateActivation(id: TableIdentity, command: DtoDepartmentActivation): Promise<void> {
    await this.withNamespaces([id], async () => {
      const current = await this.requireDepartmentForUpdate(id);
      if (current.enabled && !command.enabled) {
        await this.assertLifecycleChangeAllowed(current);
      }
      await this.scope.model.department.updateById(current.id, { enabled: command.enabled });
      await this.invalidatePolicy();
    });
  }

  @Core.transaction()
  async delete(id: TableIdentity): Promise<void> {
    await this.withNamespaces([id], async () => {
      const current = await this.requireDepartmentForUpdate(id);
      await this.assertLifecycleChangeAllowed(current);
      await this.scope.model.department.deleteById(current.id);
      await this.invalidatePolicy([String(current.id)]);
    });
  }

  async selectMemberships(departmentId: TableIdentity): Promise<DtoDepartmentMembershipSelectRes> {
    const department = await this.scope.model.department.getById(departmentId);
    if (!department) this.app.throw(404, 'Department not found');
    const memberships = await this.scope.model.departmentMembership.select({
      columns: ['id', 'userId', 'position', 'enabled', 'primary'],
      where: { departmentId: department.id },
      include: { user: true },
      orders: [['id', 'asc']],
    });
    return {
      list: memberships
        .filter(membership => membership.user)
        .map(membership => ({
          ...membership,
          manager: String(department.managerId) === String(membership.userId),
        })),
    };
  }

  async createMembership(
    departmentId: TableIdentity,
    command: DtoDepartmentMembershipCreate,
  ): Promise<EntityDepartmentMembership> {
    return await this.withMembershipPair(departmentId, command.userId, async () => {
      return await this.createMembershipInTransaction(departmentId, command);
    });
  }

  @Core.transaction()
  async createMembershipInTransaction(
    departmentId: TableIdentity,
    command: DtoDepartmentMembershipCreate,
  ): Promise<EntityDepartmentMembership> {
    const department = await this.requireDepartmentForUpdate(departmentId);
    this.assertDepartmentEnabledForMembershipMutation(department);
    const user = await this.$scope.homeUser.model.user.getByIdForUpdate(command.userId);
    if (!user) this.scope.error.DepartmentMembershipUnavailable.throw();
    const userId = user!.id;
    const existing = await this.scope.model.departmentMembership.getForUpdate({
      departmentId: department.id,
      userId,
    });
    if (existing) this.scope.error.DepartmentMembershipAlreadyExists.throw();
    const membership = await this.scope.model.departmentMembership.insert({
      departmentId: department.id,
      userId,
      position: command.position || undefined,
      enabled: true,
      primary: false,
    });
    await this.invalidatePolicy();
    return membership;
  }

  async updateMembership(
    departmentId: TableIdentity,
    membershipId: TableIdentity,
    command: DtoDepartmentMembershipUpdate,
  ): Promise<void> {
    if (command.enabled !== false) {
      await this.updateMembershipInTransaction(departmentId, membershipId, command);
      return;
    }
    const membership = await this.requireMembership(departmentId, membershipId);
    await this.withPrimaryUser(membership.userId, async () => {
      await this.updateMembershipInTransaction(departmentId, membershipId, command);
    });
  }

  @Core.transaction()
  async updateMembershipInTransaction(
    departmentId: TableIdentity,
    membershipId: TableIdentity,
    command: DtoDepartmentMembershipUpdate,
  ): Promise<void> {
    const department = await this.requireDepartmentForUpdate(departmentId);
    const membership = await this.requireMembershipForUpdate(department.id, membershipId);
    const enabling = command.enabled === true && !membership.enabled;
    if (enabling) this.assertDepartmentEnabledForMembershipMutation(department);
    const disabling = command.enabled === false && membership.enabled;
    await this.applyManagerMembershipLifecycle(department, membership, command, disabling);
    const patch: Partial<Pick<EntityDepartmentMembership, 'position' | 'enabled' | 'primary'>> = {};
    if (command.position !== undefined) patch.position = command.position || undefined;
    if (command.enabled !== undefined) patch.enabled = command.enabled;
    if (disabling && membership.primary) patch.primary = false;
    await this.scope.model.departmentMembership.updateById(membership.id, patch);
    await this.invalidatePolicy();
  }

  async deleteMembership(
    departmentId: TableIdentity,
    membershipId: TableIdentity,
    command: DtoDepartmentMembershipDelete,
  ): Promise<void> {
    const membership = await this.requireMembership(departmentId, membershipId);
    await this.withPrimaryUser(membership.userId, async () => {
      await this.deleteMembershipInTransaction(departmentId, membershipId, command);
    });
  }

  @Core.transaction()
  async deleteMembershipInTransaction(
    departmentId: TableIdentity,
    membershipId: TableIdentity,
    command: DtoDepartmentMembershipDelete,
  ): Promise<void> {
    const department = await this.requireDepartmentForUpdate(departmentId);
    const membership = await this.requireMembershipForUpdate(department.id, membershipId);
    await this.applyManagerMembershipLifecycle(department, membership, command, true);
    if (membership.primary) {
      await this.scope.model.departmentMembership.updateById(membership.id, { primary: false });
    }
    await this.scope.model.departmentMembership.deleteById(membership.id);
    await this.invalidatePolicy();
  }

  async updateMembershipPrimary(
    departmentId: TableIdentity,
    membershipId: TableIdentity,
    command: DtoDepartmentMembershipPrimary,
  ): Promise<void> {
    const membership = await this.requireMembership(departmentId, membershipId);
    await this.withPrimaryUser(membership.userId, async () => {
      await this.updateMembershipPrimaryInTransaction(departmentId, membershipId, command);
    });
  }

  @Core.transaction()
  async updateMembershipPrimaryInTransaction(
    departmentId: TableIdentity,
    membershipId: TableIdentity,
    command: DtoDepartmentMembershipPrimary,
  ): Promise<void> {
    const department = await this.requireDepartmentForUpdate(departmentId);
    const membership = await this.requireMembershipForUpdate(department.id, membershipId);
    if (!command.primary) {
      if (membership.primary) {
        await this.scope.model.departmentMembership.updateById(membership.id, { primary: false });
        await this.invalidatePolicy();
      }
      return;
    }
    if (!membership.enabled) this.scope.error.DepartmentMembershipPrimaryRequiresEnabled.throw();
    const primaries = await this.scope.model.departmentMembership.select({
      where: { userId: membership.userId, enabled: true, primary: true },
      orders: [['id', 'asc']],
    });
    for (const primary of primaries) {
      const current = await this.scope.model.departmentMembership.getByIdForUpdate(primary.id);
      if (current && String(current.id) !== String(membership.id)) {
        await this.scope.model.departmentMembership.updateById(current.id, { primary: false });
      }
    }
    await this.scope.model.departmentMembership.updateById(membership.id, { primary: true });
    await this.invalidatePolicy();
  }

  @Core.transaction()
  async updateManager(id: TableIdentity, command: DtoDepartmentManagerUpdate): Promise<void> {
    const department = await this.requireDepartmentForUpdate(id);
    if (command.membershipId === null) {
      await this.scope.model.department.updateById(department.id, {
        managerId: undefined,
      });
      return;
    }
    this.assertDepartmentEnabledForMembershipMutation(department);
    const membership = await this.requireEnabledMembershipForManager(
      department,
      command.membershipId,
    );
    await this.scope.model.department.updateById(department.id, {
      managerId: membership.userId,
    });
  }

  private async invalidatePolicy(removedScopeIds?: string[]): Promise<void> {
    await this.app.scope('a-rbac').event.policyInvalidated.emit({
      kind: 'scopeTopology',
      ...(removedScopeIds?.length ? { removedScopeIds } : {}),
    });
  }

  private assertDepartmentEnabledForMembershipMutation(department: EntityDepartment): void {
    if (!department.enabled) this.scope.error.DepartmentMembershipDepartmentDisabled.throw();
  }

  private normalizeParentId(parentId: TableIdentity | null | undefined): TableIdentity | null {
    if (parentId === undefined || parentId === null) return null;
    if (String(parentId) === '0') this.scope.error.DepartmentParentInvalid.throw();
    return parentId;
  }

  private async requireDepartment(id: TableIdentity): Promise<EntityDepartment> {
    const department = await this.scope.model.department.getById(id, {
      disableCacheEntity: true,
      disableCacheQuery: true,
    });
    if (!department) this.app.throw(404, 'Department not found');
    return department as EntityDepartment;
  }

  private async requireDepartmentForUpdate(id: TableIdentity): Promise<EntityDepartment> {
    const department = await this.scope.model.department.getByIdForUpdate(id);
    if (!department) this.app.throw(404, 'Department not found');
    return department;
  }

  private async requireMembership(
    departmentId: TableIdentity,
    membershipId: TableIdentity,
  ): Promise<EntityDepartmentMembership> {
    const membership = await this.scope.model.departmentMembership.getById(membershipId);
    if (!membership || String(membership.departmentId) !== String(departmentId)) {
      this.app.throw(404, 'Department membership not found');
    }
    return membership;
  }

  private async requireMembershipForUpdate(
    departmentId: TableIdentity,
    membershipId: TableIdentity,
  ): Promise<EntityDepartmentMembership> {
    const membership = await this.scope.model.departmentMembership.getByIdForUpdate(membershipId);
    if (!membership || String(membership.departmentId) !== String(departmentId)) {
      this.app.throw(404, 'Department membership not found');
    }
    return membership;
  }

  private async requireEnabledMembershipForManager(
    department: EntityDepartment,
    membershipId: TableIdentity,
  ): Promise<EntityDepartmentMembership> {
    const membership = await this.scope.model.departmentMembership.getByIdForUpdate(membershipId);
    if (!membership) this.app.throw(404, 'Department membership not found');
    if (String(membership.departmentId) !== String(department.id) || !membership.enabled) {
      this.scope.error.DepartmentManagerMembershipInvalid.throw();
    }
    return membership;
  }

  private async applyManagerMembershipLifecycle(
    department: EntityDepartment,
    membership: EntityDepartmentMembership,
    command: { managerMembershipId?: TableIdentity | null },
    changing: boolean,
  ): Promise<void> {
    if (!changing) {
      if (command.managerMembershipId !== undefined) {
        this.scope.error.DepartmentMembershipManagerTransitionInvalid.throw();
      }
      return;
    }
    const currentManager = String(department.managerId) === String(membership.userId);
    if (!currentManager) {
      if (command.managerMembershipId !== undefined) {
        this.scope.error.DepartmentMembershipManagerTransitionInvalid.throw();
      }
      return;
    }
    if (command.managerMembershipId === undefined) {
      this.scope.error.DepartmentMembershipManagerReplacementRequired.throw();
    }
    if (command.managerMembershipId === null) {
      await this.scope.model.department.updateById(department.id, {
        managerId: undefined,
      });
      return;
    }
    const replacement = await this.requireEnabledMembershipForManager(
      department,
      command.managerMembershipId!,
    );
    if (String(replacement.id) === String(membership.id)) {
      this.scope.error.DepartmentManagerMembershipInvalid.throw();
    }
    await this.scope.model.department.updateById(department.id, {
      managerId: replacement.userId,
    });
  }

  private async ensureParent(parentId: TableIdentity | null | undefined): Promise<void> {
    if (parentId === null || parentId === undefined) return;
    const parent = await this.scope.model.department.getByIdForUpdate(parentId);
    if (!parent) this.scope.error.DepartmentParentInvalid.throw();
  }

  private async ensureNoCycle(
    id: TableIdentity,
    parentId: TableIdentity | null | undefined,
  ): Promise<void> {
    const visited = new Set<string>();
    let currentId = parentId;
    while (currentId !== null && currentId !== undefined) {
      const key = String(currentId);
      if (key === String(id) || visited.has(key)) this.scope.error.DepartmentCycleDetected.throw();
      visited.add(key);
      const current = await this.scope.model.department.getByIdForUpdate(currentId);
      if (!current) this.scope.error.DepartmentParentInvalid.throw();
      currentId = current!.parentId ?? null;
    }
  }

  private async ensureNameAvailable(
    name: string,
    parentId: TableIdentity | null | undefined,
    excludeId?: TableIdentity,
  ): Promise<void> {
    const existing = await this.scope.model.department.get({
      parentId,
      name: { _eqI_: name },
    });
    if (existing && String(existing.id) !== String(excludeId)) {
      this.scope.error.DepartmentNameAlreadyInUse.throw();
    }
  }

  private async getNextSortOrder(parentId: TableIdentity | null | undefined): Promise<number> {
    const siblings = await this.scope.model.department.select({
      where: { parentId },
      orders: [
        ['sortOrder', 'desc'],
        ['id', 'desc'],
      ],
      limit: 1,
    });
    return (siblings[0]?.sortOrder ?? 0) + SortOrderGap;
  }

  private async resequenceSiblings(
    parentId: TableIdentity | null | undefined,
    movingId: TableIdentity,
    beforeId: TableIdentity | null | undefined,
  ): Promise<void> {
    const siblings = await this.scope.model.department.select({
      where: { parentId },
      orders: [
        ['sortOrder', 'asc'],
        ['id', 'asc'],
      ],
    });
    const moving = siblings.find(item => String(item.id) === String(movingId));
    if (!moving) this.app.throw(404, 'Department not found');
    const ordered = siblings.filter(item => String(item.id) !== String(moving!.id));
    const targetIndex =
      beforeId === null
        ? ordered.length
        : ordered.findIndex(item => String(item.id) === String(beforeId));
    if (targetIndex < 0) this.scope.error.DepartmentReorderInvalid.throw();
    ordered.splice(targetIndex, 0, moving);
    for (const [index, sibling] of ordered.entries()) {
      await this.scope.model.department.updateById(sibling.id, {
        sortOrder: (index + 1) * SortOrderGap,
      });
    }
  }

  private async assertLifecycleChangeAllowed(department: EntityDepartment): Promise<void> {
    const [children, memberships] = await Promise.all([
      this.scope.model.department.select({
        where: { parentId: department.id },
        limit: 1,
      }),
      this.scope.model.departmentMembership.select({
        where: { departmentId: department.id, enabled: true },
        limit: 1,
      }),
    ]);
    if (children.length || memberships.length || department.managerId != null) {
      this.scope.error.DepartmentLifecycleBlocked.throw();
    }
  }

  private sameParent(
    left: TableIdentity | null | undefined,
    right: TableIdentity | null | undefined,
  ): boolean {
    return String(left ?? '') === String(right ?? '');
  }

  private namespace(parentId: TableIdentity | null | undefined): string {
    return String(parentId ?? RootNamespace);
  }

  private async withNamespaces<T>(
    parentIds: Array<TableIdentity | null | undefined>,
    fn: () => Promise<T>,
  ): Promise<T> {
    const namespaces = [...new Set(parentIds.map(parentId => this.namespace(parentId)))].toSorted();
    const lock = async (index: number): Promise<T> => {
      if (index === namespaces.length) return await fn();
      return await this.$scope.redlock.service.redlock.lock(
        `department.siblings.${namespaces[index]}`,
        async () => await lock(index + 1),
      );
    };
    return await lock(0);
  }

  private async withMembershipPair<T>(
    departmentId: TableIdentity,
    userId: TableIdentity,
    fn: () => Promise<T>,
  ): Promise<T> {
    return await this.$scope.redlock.service.redlock.lock(
      `department.membership.${departmentId}.${userId}`,
      fn,
    );
  }

  private async withPrimaryUser<T>(userId: TableIdentity, fn: () => Promise<T>): Promise<T> {
    return await this.$scope.redlock.service.redlock.lock(
      `department.membership-primary.${userId}`,
      fn,
    );
  }
}
