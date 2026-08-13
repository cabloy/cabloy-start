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
import { DtoDepartmentMove } from '../dto/departmentMove.ts';
import { DtoDepartmentReorder } from '../dto/departmentReorder.ts';
import { DtoDepartmentSelectReq } from '../dto/departmentSelectReq.tsx';
import { DtoDepartmentSelectRes } from '../dto/departmentSelectRes.tsx';
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
