import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoDepartmentActivation } from '../dto/departmentActivation.ts';
import type { DtoDepartmentCreate } from '../dto/departmentCreate.tsx';
import type { DtoDepartmentMove } from '../dto/departmentMove.ts';
import type { DtoDepartmentReorder } from '../dto/departmentReorder.ts';
import type { DtoDepartmentSelectRes } from '../dto/departmentSelectRes.tsx';
import type { DtoDepartmentTree, DtoDepartmentTreeItem } from '../dto/departmentTree.ts';
import type { DtoDepartmentUpdate } from '../dto/departmentUpdate.tsx';
import type { DtoDepartmentView } from '../dto/departmentView.tsx';
import type { EntityDepartment } from '../entity/department.tsx';
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
      return await this.scope.model.department.insert({
        name: command.name,
        parentId,
        enabled: true,
        sortOrder: await this.getNextSortOrder(parentId),
      });
    });
  }

  async select(params?: IQueryParams<ModelDepartment>): Promise<DtoDepartmentSelectRes> {
    return await this.scope.model.department.selectAndCount({
      ...params,
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
    return await this.scope.model.department.getById(id);
  }

  @Core.transaction()
  async update(id: TableIdentity, command: DtoDepartmentUpdate): Promise<void> {
    const department = await this.requireDepartmentForUpdate(id);
    await this.withNamespaces([department.parentId], async () => {
      const current = await this.requireDepartmentForUpdate(id);
      await this.ensureNameAvailable(command.name, current.parentId, current.id);
      await this.scope.model.department.updateById(current.id, { name: command.name });
    });
  }

  @Core.transaction()
  async move(id: TableIdentity, command: DtoDepartmentMove): Promise<void> {
    const department = await this.requireDepartmentForUpdate(id);
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
    });
  }

  @Core.transaction()
  async reorder(id: TableIdentity, command: DtoDepartmentReorder): Promise<void> {
    const department = await this.requireDepartmentForUpdate(id);
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
    const department = await this.requireDepartmentForUpdate(id);
    await this.withNamespaces([department.id], async () => {
      const current = await this.requireDepartmentForUpdate(id);
      if (current.enabled && !command.enabled) {
        await this.assertLifecycleChangeAllowed(current);
      }
      await this.scope.model.department.updateById(current.id, { enabled: command.enabled });
    });
  }

  @Core.transaction()
  async delete(id: TableIdentity): Promise<void> {
    const department = await this.requireDepartmentForUpdate(id);
    await this.withNamespaces([department.id], async () => {
      const current = await this.requireDepartmentForUpdate(id);
      await this.assertLifecycleChangeAllowed(current);
      await this.scope.model.department.deleteById(current.id);
    });
  }

  private normalizeParentId(parentId: TableIdentity | null | undefined): TableIdentity | null {
    if (parentId === undefined || parentId === null) return null;
    if (String(parentId) === '0') this.scope.error.DepartmentParentInvalid.throw();
    return parentId;
  }

  private async requireDepartmentForUpdate(id: TableIdentity): Promise<EntityDepartment> {
    const department = await this.scope.model.department.getByIdForUpdate(id);
    if (!department) this.app.throw(404, 'Department not found');
    return department;
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
    const existing = await this.scope.model.department.getForUpdate({
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
    const children = await this.scope.model.department.select({
      where: { parentId: department.id },
      limit: 1,
    });
    if (children.length || department.managerMembershipId != null) {
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
}
