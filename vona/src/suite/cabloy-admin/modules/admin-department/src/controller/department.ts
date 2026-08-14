import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import type { ModelDepartment } from '../model/department.ts';

import { DtoDepartmentActivation } from '../dto/departmentActivation.ts';
import { DtoDepartmentCreate } from '../dto/departmentCreate.tsx';
import { DtoDepartmentManagerUpdate } from '../dto/departmentManagerUpdate.ts';
import { DtoDepartmentMembershipCreate } from '../dto/departmentMembershipCreate.ts';
import { DtoDepartmentMembershipDelete } from '../dto/departmentMembershipDelete.ts';
import { DtoDepartmentMembershipPrimary } from '../dto/departmentMembershipPrimary.ts';
import { DtoDepartmentMembershipSelectRes } from '../dto/departmentMembershipSelectRes.ts';
import { DtoDepartmentMembershipUpdate } from '../dto/departmentMembershipUpdate.ts';
import { DtoDepartmentMove } from '../dto/departmentMove.ts';
import { DtoDepartmentReorder } from '../dto/departmentReorder.ts';
import { DtoDepartmentSelectReq } from '../dto/departmentSelectReq.tsx';
import { DtoDepartmentSelectRes } from '../dto/departmentSelectRes.tsx';
import { DtoDepartmentTree } from '../dto/departmentTree.ts';
import { DtoDepartmentUpdate } from '../dto/departmentUpdate.tsx';
import { DtoDepartmentView } from '../dto/departmentView.tsx';

export interface IControllerOptionsDepartment extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsDepartment>('department')
@Resource()
export class ControllerDepartment extends BeanBase {
  @Web.post()
  @Api.body(v.tableIdentity())
  @Passport.systemAdmin()
  async create(@Arg.body() command: DtoDepartmentCreate): Promise<TableIdentity> {
    return (await this.scope.service.department.create(command)).id;
  }

  @Web.get()
  @Api.body(DtoDepartmentSelectRes)
  @Core.serializer()
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoDepartmentSelectReq) params: IQueryParams<ModelDepartment>,
  ): Promise<DtoDepartmentSelectRes> {
    return await this.scope.service.department.select(params);
  }

  @Web.get('tree')
  @Api.body(DtoDepartmentTree)
  @Core.serializer()
  @Passport.systemAdmin()
  async tree(): Promise<DtoDepartmentTree> {
    return await this.scope.service.department.tree();
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoDepartmentView))
  @Core.serializer()
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoDepartmentView | undefined> {
    return await this.scope.service.department.view(id);
  }

  @Web.patch(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() command: DtoDepartmentUpdate,
  ): Promise<void> {
    await this.scope.service.department.update(id, command);
  }

  @Web.delete(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async delete(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.department.delete(id);
  }

  @Web.get(':departmentId/memberships')
  @Api.body(DtoDepartmentMembershipSelectRes)
  @Core.serializer()
  @Passport.systemAdmin()
  async selectMemberships(
    @Arg.param('departmentId', v.tableIdentity()) departmentId: TableIdentity,
  ): Promise<DtoDepartmentMembershipSelectRes> {
    return await this.scope.service.department.selectMemberships(departmentId);
  }

  @Web.post(':departmentId/memberships')
  @Api.body(v.tableIdentity())
  @Passport.systemAdmin()
  async createMembership(
    @Arg.param('departmentId', v.tableIdentity()) departmentId: TableIdentity,
    @Arg.body() command: DtoDepartmentMembershipCreate,
  ): Promise<TableIdentity> {
    return (await this.scope.service.department.createMembership(departmentId, command)).id;
  }

  @Web.patch(':departmentId/memberships/:membershipId')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async updateMembership(
    @Arg.param('departmentId', v.tableIdentity()) departmentId: TableIdentity,
    @Arg.param('membershipId', v.tableIdentity()) membershipId: TableIdentity,
    @Arg.body() command: DtoDepartmentMembershipUpdate,
  ): Promise<void> {
    await this.scope.service.department.updateMembership(departmentId, membershipId, command);
  }

  @Web.delete(':departmentId/memberships/:membershipId')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async deleteMembership(
    @Arg.param('departmentId', v.tableIdentity()) departmentId: TableIdentity,
    @Arg.param('membershipId', v.tableIdentity()) membershipId: TableIdentity,
    @Arg.body() command: DtoDepartmentMembershipDelete,
  ): Promise<void> {
    await this.scope.service.department.deleteMembership(departmentId, membershipId, command);
  }

  @Web.put(':departmentId/memberships/:membershipId/primary')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async updateMembershipPrimary(
    @Arg.param('departmentId', v.tableIdentity()) departmentId: TableIdentity,
    @Arg.param('membershipId', v.tableIdentity()) membershipId: TableIdentity,
    @Arg.body() command: DtoDepartmentMembershipPrimary,
  ): Promise<void> {
    await this.scope.service.department.updateMembershipPrimary(
      departmentId,
      membershipId,
      command,
    );
  }

  @Web.put(':id/manager')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async updateManager(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() command: DtoDepartmentManagerUpdate,
  ): Promise<void> {
    await this.scope.service.department.updateManager(id, command);
  }

  @Web.put(':id/move')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async move(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() command: DtoDepartmentMove,
  ): Promise<void> {
    await this.scope.service.department.move(id, command);
  }

  @Web.put(':id/reorder')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async reorder(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() command: DtoDepartmentReorder,
  ): Promise<void> {
    await this.scope.service.department.reorder(id, command);
  }

  @Web.put(':id/activation')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async updateActivation(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() command: DtoDepartmentActivation,
  ): Promise<void> {
    await this.scope.service.department.updateActivation(id, command);
  }
}
