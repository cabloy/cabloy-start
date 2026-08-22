import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** AdminRbacRbacGrantDepartment_select */
export const ApiApiAdminRbacRbacGrantDepartmentselectPath = '/api/admin/rbac/rbacGrantDepartment';
export type ApiApiAdminRbacRbacGrantDepartmentselectPath = '/api/admin/rbac/rbacGrantDepartment';
export type ApiApiAdminRbacRbacGrantDepartmentselectMethod = 'get';
export type ApiApiAdminRbacRbacGrantDepartmentselectRequestQuery =
  paths[ApiApiAdminRbacRbacGrantDepartmentselectPath][ApiApiAdminRbacRbacGrantDepartmentselectMethod]['parameters']['query'];
export type ApiApiAdminRbacRbacGrantDepartmentselectResponseBody =
  paths[ApiApiAdminRbacRbacGrantDepartmentselectPath][ApiApiAdminRbacRbacGrantDepartmentselectMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRbacRbacGrantDepartment_create */
export const ApiApiAdminRbacRbacGrantDepartmentcreatePath = '/api/admin/rbac/rbacGrantDepartment';
export type ApiApiAdminRbacRbacGrantDepartmentcreatePath = '/api/admin/rbac/rbacGrantDepartment';
export type ApiApiAdminRbacRbacGrantDepartmentcreateMethod = 'post';
export type ApiApiAdminRbacRbacGrantDepartmentcreateRequestBody =
  components['schemas']['admin-rbac.dto.rbacGrantDepartmentCreate'];
export type ApiApiAdminRbacRbacGrantDepartmentcreateResponseBody =
  paths[ApiApiAdminRbacRbacGrantDepartmentcreatePath][ApiApiAdminRbacRbacGrantDepartmentcreateMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRbacRbacGrantDepartment_view */
export const ApiApiAdminRbacRbacGrantDepartmentviewPath =
  '/api/admin/rbac/rbacGrantDepartment/{id}';
export type ApiApiAdminRbacRbacGrantDepartmentviewPath = '/api/admin/rbac/rbacGrantDepartment/{id}';
export type ApiApiAdminRbacRbacGrantDepartmentviewMethod = 'get';
export type ApiApiAdminRbacRbacGrantDepartmentviewRequestParams =
  paths[ApiApiAdminRbacRbacGrantDepartmentviewPath][ApiApiAdminRbacRbacGrantDepartmentviewMethod]['parameters']['path'];
export type ApiApiAdminRbacRbacGrantDepartmentviewResponseBody =
  paths[ApiApiAdminRbacRbacGrantDepartmentviewPath][ApiApiAdminRbacRbacGrantDepartmentviewMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRbacRbacGrantDepartment_delete */
export const ApiApiAdminRbacRbacGrantDepartmentdeletePath =
  '/api/admin/rbac/rbacGrantDepartment/{id}';
export type ApiApiAdminRbacRbacGrantDepartmentdeletePath =
  '/api/admin/rbac/rbacGrantDepartment/{id}';
export type ApiApiAdminRbacRbacGrantDepartmentdeleteMethod = 'delete';
export type ApiApiAdminRbacRbacGrantDepartmentdeleteRequestParams =
  paths[ApiApiAdminRbacRbacGrantDepartmentdeletePath][ApiApiAdminRbacRbacGrantDepartmentdeleteMethod]['parameters']['path'];
export type ApiApiAdminRbacRbacGrantDepartmentdeleteResponseBody =
  paths[ApiApiAdminRbacRbacGrantDepartmentdeletePath][ApiApiAdminRbacRbacGrantDepartmentdeleteMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiAdminRbacRbacGrantDepartment extends BeanApiBase {
  select(
    options?: {
      query?: ApiApiAdminRbacRbacGrantDepartmentselectRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiAdminRbacRbacGrantDepartmentselectResponseBody>(
      ApiApiAdminRbacRbacGrantDepartmentselectPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  create(body: ApiApiAdminRbacRbacGrantDepartmentcreateRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiAdminRbacRbacGrantDepartmentcreateResponseBody>(
      ApiApiAdminRbacRbacGrantDepartmentcreatePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  view(
    options: {
      params: ApiApiAdminRbacRbacGrantDepartmentviewRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiAdminRbacRbacGrantDepartmentviewResponseBody>(
      this.$pathTranslate(ApiApiAdminRbacRbacGrantDepartmentviewPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  delete(
    options: {
      params: ApiApiAdminRbacRbacGrantDepartmentdeleteRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiAdminRbacRbacGrantDepartmentdeleteResponseBody>(
      this.$pathTranslate(ApiApiAdminRbacRbacGrantDepartmentdeletePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
