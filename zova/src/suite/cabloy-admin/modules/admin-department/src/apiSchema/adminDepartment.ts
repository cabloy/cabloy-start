import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiAdminDepartmentselectPath,
  ApiApiAdminDepartmentcreatePath,
  ApiApiAdminDepartmenttreePath,
  ApiApiAdminDepartmentviewPath,
  ApiApiAdminDepartmentdeletePath,
  ApiApiAdminDepartmentupdatePath,
  ApiApiAdminDepartmentselectMembershipsPath,
  ApiApiAdminDepartmentcreateMembershipPath,
  ApiApiAdminDepartmentdeleteMembershipPath,
  ApiApiAdminDepartmentupdateMembershipPath,
  ApiApiAdminDepartmentmovePath,
  ApiApiAdminDepartmentreorderPath,
  ApiApiAdminDepartmentupdateActivationPath,
} from '../api/adminDepartment.js';

@ApiSchema()
export class ApiSchemaAdminDepartment extends BeanBase {
  select(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminDepartmentselectPath, 'get', options);
  }

  create(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminDepartmentcreatePath, 'post', options);
  }

  tree(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminDepartmenttreePath, 'get', options);
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminDepartmentviewPath, 'get', options);
  }

  delete(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminDepartmentdeletePath, 'delete', options);
  }

  update(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminDepartmentupdatePath, 'patch', options);
  }

  selectMemberships(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminDepartmentselectMembershipsPath, 'get', options);
  }

  createMembership(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminDepartmentcreateMembershipPath, 'post', options);
  }

  deleteMembership(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminDepartmentdeleteMembershipPath, 'delete', options);
  }

  updateMembership(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminDepartmentupdateMembershipPath, 'patch', options);
  }

  move(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminDepartmentmovePath, 'put', options);
  }

  reorder(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminDepartmentreorderPath, 'put', options);
  }

  updateActivation(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAdminDepartmentupdateActivationPath, 'put', options);
  }
}
