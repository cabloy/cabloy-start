import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiAdminRbacRbacGrantselectPath,
  ApiApiAdminRbacRbacGrantcreatePath,
  ApiApiAdminRbacRbacGrantviewPath,
  ApiApiAdminRbacRbacGrantdeletePath,
  ApiApiAdminRbacRbacGrantupdatePath,
} from '../api/adminRbacRbacGrant.js';

@ApiSchema()
export class ApiSchemaAdminRbacRbacGrant extends BeanBase {
  select(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRbacRbacGrantselectPath, 'get', options);
  }

  create(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRbacRbacGrantcreatePath, 'post', options);
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRbacRbacGrantviewPath, 'get', options);
  }

  delete(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRbacRbacGrantdeletePath, 'delete', options);
  }

  update(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRbacRbacGrantupdatePath, 'patch', options);
  }
}
