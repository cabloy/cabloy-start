import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** AdminDepartment_select */
export const ApiApiAdminDepartmentselectPath = '/api/admin/department';
export type ApiApiAdminDepartmentselectPath = '/api/admin/department';
export type ApiApiAdminDepartmentselectMethod = 'get';
export type ApiApiAdminDepartmentselectRequestQuery =
  paths[ApiApiAdminDepartmentselectPath][ApiApiAdminDepartmentselectMethod]['parameters']['query'];
export type ApiApiAdminDepartmentselectResponseBody =
  paths[ApiApiAdminDepartmentselectPath][ApiApiAdminDepartmentselectMethod]['responses']['200']['content']['application/json']['data'];

/** AdminDepartment_create */
export const ApiApiAdminDepartmentcreatePath = '/api/admin/department';
export type ApiApiAdminDepartmentcreatePath = '/api/admin/department';
export type ApiApiAdminDepartmentcreateMethod = 'post';
export type ApiApiAdminDepartmentcreateRequestBody =
  components['schemas']['admin-department.dto.departmentCreate'];
export type ApiApiAdminDepartmentcreateResponseBody =
  paths[ApiApiAdminDepartmentcreatePath][ApiApiAdminDepartmentcreateMethod]['responses']['200']['content']['application/json']['data'];

/** AdminDepartment_view */
export const ApiApiAdminDepartmentviewPath = '/api/admin/department/{id}';
export type ApiApiAdminDepartmentviewPath = '/api/admin/department/{id}';
export type ApiApiAdminDepartmentviewMethod = 'get';
export type ApiApiAdminDepartmentviewRequestParams =
  paths[ApiApiAdminDepartmentviewPath][ApiApiAdminDepartmentviewMethod]['parameters']['path'];
export type ApiApiAdminDepartmentviewResponseBody =
  paths[ApiApiAdminDepartmentviewPath][ApiApiAdminDepartmentviewMethod]['responses']['200']['content']['application/json']['data'];

/** AdminDepartment_delete */
export const ApiApiAdminDepartmentdeletePath = '/api/admin/department/{id}';
export type ApiApiAdminDepartmentdeletePath = '/api/admin/department/{id}';
export type ApiApiAdminDepartmentdeleteMethod = 'delete';
export type ApiApiAdminDepartmentdeleteRequestParams =
  paths[ApiApiAdminDepartmentdeletePath][ApiApiAdminDepartmentdeleteMethod]['parameters']['path'];
export type ApiApiAdminDepartmentdeleteResponseBody =
  paths[ApiApiAdminDepartmentdeletePath][ApiApiAdminDepartmentdeleteMethod]['responses']['200']['content']['application/json']['data'];

/** AdminDepartment_update */
export const ApiApiAdminDepartmentupdatePath = '/api/admin/department/{id}';
export type ApiApiAdminDepartmentupdatePath = '/api/admin/department/{id}';
export type ApiApiAdminDepartmentupdateMethod = 'patch';
export type ApiApiAdminDepartmentupdateRequestParams =
  paths[ApiApiAdminDepartmentupdatePath][ApiApiAdminDepartmentupdateMethod]['parameters']['path'];
export type ApiApiAdminDepartmentupdateRequestBody =
  components['schemas']['admin-department.dto.departmentUpdate'];
export type ApiApiAdminDepartmentupdateResponseBody =
  paths[ApiApiAdminDepartmentupdatePath][ApiApiAdminDepartmentupdateMethod]['responses']['200']['content']['application/json']['data'];

/** AdminDepartment_move */
export const ApiApiAdminDepartmentmovePath = '/api/admin/department/{id}/move';
export type ApiApiAdminDepartmentmovePath = '/api/admin/department/{id}/move';
export type ApiApiAdminDepartmentmoveMethod = 'put';
export type ApiApiAdminDepartmentmoveRequestParams =
  paths[ApiApiAdminDepartmentmovePath][ApiApiAdminDepartmentmoveMethod]['parameters']['path'];
export type ApiApiAdminDepartmentmoveRequestBody =
  components['schemas']['admin-department.dto.departmentMove'];
export type ApiApiAdminDepartmentmoveResponseBody =
  paths[ApiApiAdminDepartmentmovePath][ApiApiAdminDepartmentmoveMethod]['responses']['200']['content']['application/json']['data'];

/** AdminDepartment_reorder */
export const ApiApiAdminDepartmentreorderPath = '/api/admin/department/{id}/reorder';
export type ApiApiAdminDepartmentreorderPath = '/api/admin/department/{id}/reorder';
export type ApiApiAdminDepartmentreorderMethod = 'put';
export type ApiApiAdminDepartmentreorderRequestParams =
  paths[ApiApiAdminDepartmentreorderPath][ApiApiAdminDepartmentreorderMethod]['parameters']['path'];
export type ApiApiAdminDepartmentreorderRequestBody =
  components['schemas']['admin-department.dto.departmentReorder'];
export type ApiApiAdminDepartmentreorderResponseBody =
  paths[ApiApiAdminDepartmentreorderPath][ApiApiAdminDepartmentreorderMethod]['responses']['200']['content']['application/json']['data'];

/** AdminDepartment_updateActivation */
export const ApiApiAdminDepartmentupdateActivationPath = '/api/admin/department/{id}/activation';
export type ApiApiAdminDepartmentupdateActivationPath = '/api/admin/department/{id}/activation';
export type ApiApiAdminDepartmentupdateActivationMethod = 'put';
export type ApiApiAdminDepartmentupdateActivationRequestParams =
  paths[ApiApiAdminDepartmentupdateActivationPath][ApiApiAdminDepartmentupdateActivationMethod]['parameters']['path'];
export type ApiApiAdminDepartmentupdateActivationRequestBody =
  components['schemas']['admin-department.dto.departmentActivation'];
export type ApiApiAdminDepartmentupdateActivationResponseBody =
  paths[ApiApiAdminDepartmentupdateActivationPath][ApiApiAdminDepartmentupdateActivationMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiAdminDepartment extends BeanApiBase {
  select(
    options?: {
      query?: ApiApiAdminDepartmentselectRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiAdminDepartmentselectResponseBody>(
      ApiApiAdminDepartmentselectPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  create(body: ApiApiAdminDepartmentcreateRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiAdminDepartmentcreateResponseBody>(
      ApiApiAdminDepartmentcreatePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  view(
    options: {
      params: ApiApiAdminDepartmentviewRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiAdminDepartmentviewResponseBody>(
      this.$pathTranslate(ApiApiAdminDepartmentviewPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  delete(
    options: {
      params: ApiApiAdminDepartmentdeleteRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiAdminDepartmentdeleteResponseBody>(
      this.$pathTranslate(ApiApiAdminDepartmentdeletePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  update(
    body: ApiApiAdminDepartmentupdateRequestBody,
    options: {
      params: ApiApiAdminDepartmentupdateRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.patch<any, ApiApiAdminDepartmentupdateResponseBody>(
      this.$pathTranslate(ApiApiAdminDepartmentupdatePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  move(
    body: ApiApiAdminDepartmentmoveRequestBody,
    options: {
      params: ApiApiAdminDepartmentmoveRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.put<any, ApiApiAdminDepartmentmoveResponseBody>(
      this.$pathTranslate(ApiApiAdminDepartmentmovePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  reorder(
    body: ApiApiAdminDepartmentreorderRequestBody,
    options: {
      params: ApiApiAdminDepartmentreorderRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.put<any, ApiApiAdminDepartmentreorderResponseBody>(
      this.$pathTranslate(ApiApiAdminDepartmentreorderPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  updateActivation(
    body: ApiApiAdminDepartmentupdateActivationRequestBody,
    options: {
      params: ApiApiAdminDepartmentupdateActivationRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.put<any, ApiApiAdminDepartmentupdateActivationResponseBody>(
      this.$pathTranslate(ApiApiAdminDepartmentupdateActivationPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
