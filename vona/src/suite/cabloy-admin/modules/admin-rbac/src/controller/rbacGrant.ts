import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import type { ModelRbacGrant } from '../model/rbacGrant.ts';

import { DtoRbacGrantCreate } from '../dto/rbacGrantCreate.tsx';
import { DtoRbacGrantSelectReq } from '../dto/rbacGrantSelectReq.tsx';
import { DtoRbacGrantSelectRes } from '../dto/rbacGrantSelectRes.tsx';
import { DtoRbacGrantUpdate } from '../dto/rbacGrantUpdate.tsx';
import { DtoRbacGrantView } from '../dto/rbacGrantView.tsx';

export interface IControllerOptionsRbacGrant extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsRbacGrant>('rbacGrant')
@Resource()
export class ControllerRbacGrant extends BeanBase {
  @Web.post()
  @Api.body(v.tableIdentity())
  @Passport.systemAdmin()
  async create(@Arg.body() rbacGrant: DtoRbacGrantCreate): Promise<TableIdentity> {
    return (await this.scope.service.rbacGrant.create(rbacGrant)).id;
  }

  @Web.get()
  @Api.body(DtoRbacGrantSelectRes)
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoRbacGrantSelectReq) params: IQueryParams<ModelRbacGrant>,
  ): Promise<DtoRbacGrantSelectRes> {
    return await this.scope.service.rbacGrant.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoRbacGrantView))
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoRbacGrantView | undefined> {
    return await this.scope.service.rbacGrant.view(id);
  }

  @Web.patch(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() rbacGrant: DtoRbacGrantUpdate,
  ): Promise<void> {
    await this.scope.service.rbacGrant.update(id, rbacGrant);
  }

  @Web.delete(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async delete(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.rbacGrant.delete(id);
  }
}
