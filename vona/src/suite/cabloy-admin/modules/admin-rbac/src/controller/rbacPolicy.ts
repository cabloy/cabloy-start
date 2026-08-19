import type { TableIdentity } from 'table-identity';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoRbacPolicyCatalogRes } from '../dto/rbacPolicyCatalogRes.ts';
import { DtoRbacPolicyRoleConfigurationRes } from '../dto/rbacPolicyRoleConfigurationRes.ts';

export interface IControllerOptionsRbacPolicy extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsRbacPolicy>('rbacPolicy')
export class ControllerRbacPolicy extends BeanBase {
  @Web.get('catalog')
  @Api.body(DtoRbacPolicyCatalogRes)
  @Passport.systemAdmin()
  async catalog(): Promise<DtoRbacPolicyCatalogRes> {
    return await this.scope.service.rbacPolicyProjection.catalog();
  }

  @Web.get('roles/:roleId/configuration')
  @Api.body(DtoRbacPolicyRoleConfigurationRes)
  @Passport.systemAdmin()
  async roleConfiguration(
    @Arg.param('roleId', v.tableIdentity()) roleId: TableIdentity,
  ): Promise<DtoRbacPolicyRoleConfigurationRes> {
    return await this.scope.service.rbacPolicyProjection.roleConfiguration(roleId);
  }
}
