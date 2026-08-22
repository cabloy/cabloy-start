import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiAdminRbacRbacGrantDepartmentselectPath,
  ApiApiAdminRbacRbacGrantDepartmentcreatePath,
  ApiApiAdminRbacRbacGrantDepartmentviewPath,
  ApiApiAdminRbacRbacGrantDepartmentdeletePath,
} from '../api/adminRbacRbacGrantDepartment.js';

@ApiSchema()
export class ApiSchemaAdminRbacRbacGrantDepartment extends BeanBase {
  select(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRbacRbacGrantDepartmentselectPath, 'get', options);
  }

  create(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiAdminRbacRbacGrantDepartmentcreatePath,
      'post',
      options,
    );
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminRbacRbacGrantDepartmentviewPath, 'get', options);
  }

  delete(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiAdminRbacRbacGrantDepartmentdeletePath,
      'delete',
      options,
    );
  }
}
