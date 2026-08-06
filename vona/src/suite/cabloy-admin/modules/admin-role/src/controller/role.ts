import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';
import type { ModelRole } from 'vona-module-home-user';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import { DtoRoleCreate } from '../dto/roleCreate.tsx';
import { DtoRoleSelectReq } from '../dto/roleSelectReq.tsx';
import { DtoRoleSelectRes } from '../dto/roleSelectRes.tsx';
import { DtoRoleUpdate } from '../dto/roleUpdate.tsx';
import { DtoRoleView } from '../dto/roleView.tsx';
import { DtoUserRoleReplace } from '../dto/userRoleReplace.ts';

export interface IControllerOptionsRole extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsRole>('role')
@Resource()
export class ControllerRole extends BeanBase {
  @Web.post()
  @Api.body(DtoRoleView)
  @Core.serializer()
  @Passport.systemAdmin()
  async create(@Arg.body() role: DtoRoleCreate): Promise<DtoRoleView> {
    return await this.scope.service.role.create(role);
  }

  @Web.get()
  @Api.body(DtoRoleSelectRes)
  @Core.serializer()
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoRoleSelectReq) params: IQueryParams<ModelRole>,
  ): Promise<DtoRoleSelectRes> {
    return await this.scope.service.role.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoRoleView))
  @Core.serializer()
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoRoleView | undefined> {
    return await this.scope.service.role.view(id);
  }

  @Web.patch(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() role: DtoRoleUpdate,
  ): Promise<void> {
    await this.scope.service.role.update(id, role);
  }

  @Web.delete(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async delete(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.role.delete(id);
  }

  @Web.put('user/:userId/roles')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async replaceUserRoles(
    @Arg.param('userId', v.tableIdentity()) userId: TableIdentity,
    @Arg.body() command: DtoUserRoleReplace,
  ): Promise<void> {
    await this.scope.service.role.replaceUserRoles(userId, command);
  }
}
