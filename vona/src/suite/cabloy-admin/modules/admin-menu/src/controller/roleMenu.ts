import type { TableIdentity } from 'table-identity';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import { DtoRoleMenuBatch } from '../dto/roleMenuBatch.ts';
import { DtoRoleMenuCatalogRes } from '../dto/roleMenuCatalogRes.ts';
import { DtoRoleMenuCreate } from '../dto/roleMenuCreate.ts';
import { DtoRoleMenuDelete } from '../dto/roleMenuDelete.ts';
import { DtoRoleMenuRoleConfigurationRes } from '../dto/roleMenuRoleConfigurationRes.ts';

export interface IControllerOptionsRoleMenu extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsRoleMenu>('roleMenu')
export class ControllerRoleMenu extends BeanBase {
  @Web.get('catalog')
  @Api.body(DtoRoleMenuCatalogRes)
  @Passport.systemAdmin()
  async catalog(): Promise<DtoRoleMenuCatalogRes> {
    return await this.scope.service.roleMenuProjection.catalog();
  }

  @Web.get('roles/:roleId/configuration')
  @Api.body(DtoRoleMenuRoleConfigurationRes)
  @Passport.systemAdmin()
  async roleConfiguration(
    @Arg.param('roleId', v.tableIdentity()) roleId: TableIdentity,
  ): Promise<DtoRoleMenuRoleConfigurationRes> {
    return await this.scope.service.roleMenuProjection.roleConfiguration(roleId);
  }

  @Web.post()
  @Api.body(z.null())
  @Passport.systemAdmin()
  async create(@Arg.body() command: DtoRoleMenuCreate): Promise<void> {
    await this.scope.service.roleMenu.create(command);
  }

  @Web.put('batch')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async batch(@Arg.body() command: DtoRoleMenuBatch): Promise<void> {
    await this.scope.service.roleMenu.batch(command);
  }

  @Web.delete()
  @Api.body(z.null())
  @Passport.systemAdmin()
  async delete(@Arg.body() command: DtoRoleMenuDelete): Promise<void> {
    await this.scope.service.roleMenu.delete(command);
  }
}
