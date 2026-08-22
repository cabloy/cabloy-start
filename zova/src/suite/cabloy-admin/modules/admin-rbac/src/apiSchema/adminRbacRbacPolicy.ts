import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiAdminRbacRbacPolicycatalogPath,
  ApiApiAdminRbacRbacPolicyroleConfigurationPath,
} from '../api/adminRbacRbacPolicy.js';

@ApiSchema()
export class ApiSchemaAdminRbacRbacPolicy extends BeanBase {
  catalog(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRbacRbacPolicycatalogPath, 'get', options);
  }

  roleConfiguration(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiAdminRbacRbacPolicyroleConfigurationPath,
      'get',
      options,
    );
  }
}
