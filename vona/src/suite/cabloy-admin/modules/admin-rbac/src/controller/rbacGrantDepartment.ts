import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import type { ModelRbacGrantDepartment } from '../model/rbacGrantDepartment.ts';

import { DtoRbacGrantDepartmentCreate } from '../dto/rbacGrantDepartmentCreate.tsx';
import { DtoRbacGrantDepartmentSelectReq } from '../dto/rbacGrantDepartmentSelectReq.tsx';
import { DtoRbacGrantDepartmentSelectRes } from '../dto/rbacGrantDepartmentSelectRes.tsx';
import { DtoRbacGrantDepartmentView } from '../dto/rbacGrantDepartmentView.tsx';

export interface IControllerOptionsRbacGrantDepartment extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsRbacGrantDepartment>('rbacGrantDepartment')
@Resource()
export class ControllerRbacGrantDepartment extends BeanBase {
  @Web.post()
  @Api.body(v.tableIdentity())
  @Passport.systemAdmin()
  async create(
    @Arg.body() rbacGrantDepartment: DtoRbacGrantDepartmentCreate,
  ): Promise<TableIdentity> {
    return (await this.scope.service.rbacGrantDepartment.create(rbacGrantDepartment)).id;
  }

  @Web.get()
  @Api.body(DtoRbacGrantDepartmentSelectRes)
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoRbacGrantDepartmentSelectReq) params: IQueryParams<ModelRbacGrantDepartment>,
  ): Promise<DtoRbacGrantDepartmentSelectRes> {
    return await this.scope.service.rbacGrantDepartment.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoRbacGrantDepartmentView))
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoRbacGrantDepartmentView | undefined> {
    return await this.scope.service.rbacGrantDepartment.view(id);
  }

  @Web.delete(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async delete(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.rbacGrantDepartment.delete(id);
  }
}
