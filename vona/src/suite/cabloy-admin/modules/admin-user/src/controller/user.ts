import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';
import type { ModelUser } from 'vona-module-home-user';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import { DtoUserSelectReq } from '../dto/userSelectReq.tsx';
import { DtoUserSelectRes } from '../dto/userSelectRes.tsx';
import { DtoUserUpdate } from '../dto/userUpdate.tsx';
import { DtoUserView } from '../dto/userView.tsx';

export interface IControllerOptionsUser extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsUser>('user')
@Resource()
export class ControllerUser extends BeanBase {
  @Web.get()
  @Api.body(DtoUserSelectRes)
  @Core.serializer()
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoUserSelectReq) params: IQueryParams<ModelUser>,
  ): Promise<DtoUserSelectRes> {
    return await this.scope.service.user.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoUserView))
  @Core.serializer()
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoUserView | undefined> {
    return await this.scope.service.user.view(id);
  }

  @Web.patch(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() user: DtoUserUpdate,
  ): Promise<void> {
    await this.scope.service.user.update(id, user);
  }

  @Web.post('activate/:id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async activate(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.user.activate(id);
  }

  @Web.post('deactivate/:id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async deactivate(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.user.deactivate(id);
  }
}
