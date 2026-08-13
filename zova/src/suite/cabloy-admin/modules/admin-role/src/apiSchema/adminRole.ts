import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiAdminRoleselectPath,
  ApiApiAdminRolecreatePath,
  ApiApiAdminRoleviewPath,
  ApiApiAdminRoledeletePath,
  ApiApiAdminRoleupdatePath,
  ApiApiAdminRolereplaceUserRolesPath,
  ApiApiAdminRoleissueSystemAdminFreshProofPath,
  ApiApiAdminRolegrantSystemAdminPath,
  ApiApiAdminRolerevokeSystemAdminPath,
  ApiApiAdminRoleupdateSystemAdminAccountStatusPath,
  ApiApiAdminRoleupdateSystemAdminActivationPath,
} from '../api/adminRole.js';

@ApiSchema()
export class ApiSchemaAdminRole extends BeanBase {
  select(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRoleselectPath, 'get', options);
  }

  create(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRolecreatePath, 'post', options);
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRoleviewPath, 'get', options);
  }

  delete(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRoledeletePath, 'delete', options);
  }

  update(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRoleupdatePath, 'patch', options);
  }

  replaceUserRoles(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRolereplaceUserRolesPath, 'put', options);
  }

  issueSystemAdminFreshProof(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiAdminRoleissueSystemAdminFreshProofPath,
      'post',
      options,
    );
  }

  grantSystemAdmin(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRolegrantSystemAdminPath, 'post', options);
  }

  revokeSystemAdmin(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRolerevokeSystemAdminPath, 'post', options);
  }

  updateSystemAdminAccountStatus(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiAdminRoleupdateSystemAdminAccountStatusPath,
      'put',
      options,
    );
  }

  updateSystemAdminActivation(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiAdminRoleupdateSystemAdminActivationPath,
      'put',
      options,
    );
  }
}
