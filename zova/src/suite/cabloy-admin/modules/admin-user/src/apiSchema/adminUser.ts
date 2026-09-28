import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiAdminUserselectPath,
  ApiApiAdminUserviewPath,
  ApiApiAdminUserupdatePath,
  ApiApiAdminUseractivatePath,
  ApiApiAdminUserupdateAccountStatusPath,
  ApiApiAdminUserreplaceUserRolesPath,
  ApiApiAdminUsergrantSystemAdminPath,
  ApiApiAdminUserrevokeSystemAdminPath,
} from '../api/adminUser.js';

@ApiSchema()
export class ApiSchemaAdminUser extends BeanBase {
  select(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminUserselectPath, 'get', options);
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminUserviewPath, 'get', options);
  }

  update(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminUserupdatePath, 'patch', options);
  }

  activate(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminUseractivatePath, 'post', options);
  }

  updateAccountStatus(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminUserupdateAccountStatusPath, 'put', options);
  }

  replaceUserRoles(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminUserreplaceUserRolesPath, 'put', options);
  }

  grantSystemAdmin(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminUsergrantSystemAdminPath, 'post', options);
  }

  revokeSystemAdmin(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminUserrevokeSystemAdminPath, 'post', options);
  }
}
