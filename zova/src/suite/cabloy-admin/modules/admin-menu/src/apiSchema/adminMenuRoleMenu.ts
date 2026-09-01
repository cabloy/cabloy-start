import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiAdminMenuRoleMenucatalogPath,
  ApiApiAdminMenuRoleMenuroleConfigurationPath,
  ApiApiAdminMenuRoleMenucreatePath,
  ApiApiAdminMenuRoleMenudeletePath,
  ApiApiAdminMenuRoleMenubatchPath,
} from '../api/adminMenuRoleMenu.js';

@ApiSchema()
export class ApiSchemaAdminMenuRoleMenu extends BeanBase {
  catalog(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminMenuRoleMenucatalogPath, 'get', options);
  }

  roleConfiguration(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminMenuRoleMenuroleConfigurationPath, 'get', options);
  }

  create(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminMenuRoleMenucreatePath, 'post', options);
  }

  delete(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminMenuRoleMenudeletePath, 'delete', options);
  }

  batch(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminMenuRoleMenubatchPath, 'put', options);
  }
}
