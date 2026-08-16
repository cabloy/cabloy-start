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

/** AdminDepartment_tree */
export const ApiApiAdminDepartmenttreePath = '/api/admin/department/tree';
export type ApiApiAdminDepartmenttreePath = '/api/admin/department/tree';
export type ApiApiAdminDepartmenttreeMethod = 'get';
export type ApiApiAdminDepartmenttreeResponseBody =
  paths[ApiApiAdminDepartmenttreePath][ApiApiAdminDepartmenttreeMethod]['responses']['200']['content']['application/json']['data'];

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

/** AdminDepartment_selectMemberships */
export const ApiApiAdminDepartmentselectMembershipsPath =
  '/api/admin/department/{departmentId}/memberships';
export type ApiApiAdminDepartmentselectMembershipsPath =
  '/api/admin/department/{departmentId}/memberships';
export type ApiApiAdminDepartmentselectMembershipsMethod = 'get';
export type ApiApiAdminDepartmentselectMembershipsRequestParams =
  paths[ApiApiAdminDepartmentselectMembershipsPath][ApiApiAdminDepartmentselectMembershipsMethod]['parameters']['path'];
export type ApiApiAdminDepartmentselectMembershipsResponseBody =
  paths[ApiApiAdminDepartmentselectMembershipsPath][ApiApiAdminDepartmentselectMembershipsMethod]['responses']['200']['content']['application/json']['data'];

/** AdminDepartment_createMembership */
export const ApiApiAdminDepartmentcreateMembershipPath =
  '/api/admin/department/{departmentId}/memberships';
export type ApiApiAdminDepartmentcreateMembershipPath =
  '/api/admin/department/{departmentId}/memberships';
export type ApiApiAdminDepartmentcreateMembershipMethod = 'post';
export type ApiApiAdminDepartmentcreateMembershipRequestParams =
  paths[ApiApiAdminDepartmentcreateMembershipPath][ApiApiAdminDepartmentcreateMembershipMethod]['parameters']['path'];
export type ApiApiAdminDepartmentcreateMembershipRequestBody =
  components['schemas']['admin-department.dto.departmentMembershipCreate'];
export type ApiApiAdminDepartmentcreateMembershipResponseBody =
  paths[ApiApiAdminDepartmentcreateMembershipPath][ApiApiAdminDepartmentcreateMembershipMethod]['responses']['200']['content']['application/json']['data'];

/** AdminDepartment_deleteMembership */
export const ApiApiAdminDepartmentdeleteMembershipPath =
  '/api/admin/department/{departmentId}/memberships/{membershipId}';
export type ApiApiAdminDepartmentdeleteMembershipPath =
  '/api/admin/department/{departmentId}/memberships/{membershipId}';
export type ApiApiAdminDepartmentdeleteMembershipMethod = 'delete';
export type ApiApiAdminDepartmentdeleteMembershipRequestParams =
  paths[ApiApiAdminDepartmentdeleteMembershipPath][ApiApiAdminDepartmentdeleteMembershipMethod]['parameters']['path'];
export type ApiApiAdminDepartmentdeleteMembershipRequestBody =
  components['schemas']['admin-department.dto.departmentMembershipDelete_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
export type ApiApiAdminDepartmentdeleteMembershipResponseBody =
  paths[ApiApiAdminDepartmentdeleteMembershipPath][ApiApiAdminDepartmentdeleteMembershipMethod]['responses']['200']['content']['application/json']['data'];

/** AdminDepartment_updateMembership */
export const ApiApiAdminDepartmentupdateMembershipPath =
  '/api/admin/department/{departmentId}/memberships/{membershipId}';
export type ApiApiAdminDepartmentupdateMembershipPath =
  '/api/admin/department/{departmentId}/memberships/{membershipId}';
export type ApiApiAdminDepartmentupdateMembershipMethod = 'patch';
export type ApiApiAdminDepartmentupdateMembershipRequestParams =
  paths[ApiApiAdminDepartmentupdateMembershipPath][ApiApiAdminDepartmentupdateMembershipMethod]['parameters']['path'];
export type ApiApiAdminDepartmentupdateMembershipRequestBody =
  components['schemas']['admin-department.dto.departmentMembershipUpdate'];
export type ApiApiAdminDepartmentupdateMembershipResponseBody =
  paths[ApiApiAdminDepartmentupdateMembershipPath][ApiApiAdminDepartmentupdateMembershipMethod]['responses']['200']['content']['application/json']['data'];

/** AdminDepartment_updateMembershipPrimary */
export const ApiApiAdminDepartmentupdateMembershipPrimaryPath =
  '/api/admin/department/{departmentId}/memberships/{membershipId}/primary';
export type ApiApiAdminDepartmentupdateMembershipPrimaryPath =
  '/api/admin/department/{departmentId}/memberships/{membershipId}/primary';
export type ApiApiAdminDepartmentupdateMembershipPrimaryMethod = 'put';
export type ApiApiAdminDepartmentupdateMembershipPrimaryRequestParams =
  paths[ApiApiAdminDepartmentupdateMembershipPrimaryPath][ApiApiAdminDepartmentupdateMembershipPrimaryMethod]['parameters']['path'];
export type ApiApiAdminDepartmentupdateMembershipPrimaryRequestBody =
  components['schemas']['admin-department.dto.departmentMembershipPrimary'];
export type ApiApiAdminDepartmentupdateMembershipPrimaryResponseBody =
  paths[ApiApiAdminDepartmentupdateMembershipPrimaryPath][ApiApiAdminDepartmentupdateMembershipPrimaryMethod]['responses']['200']['content']['application/json']['data'];

/** AdminDepartment_updateManager */
export const ApiApiAdminDepartmentupdateManagerPath = '/api/admin/department/{id}/manager';
export type ApiApiAdminDepartmentupdateManagerPath = '/api/admin/department/{id}/manager';
export type ApiApiAdminDepartmentupdateManagerMethod = 'put';
export type ApiApiAdminDepartmentupdateManagerRequestParams =
  paths[ApiApiAdminDepartmentupdateManagerPath][ApiApiAdminDepartmentupdateManagerMethod]['parameters']['path'];
export type ApiApiAdminDepartmentupdateManagerRequestBody =
  components['schemas']['admin-department.dto.departmentManagerUpdate'];
export type ApiApiAdminDepartmentupdateManagerResponseBody =
  paths[ApiApiAdminDepartmentupdateManagerPath][ApiApiAdminDepartmentupdateManagerMethod]['responses']['200']['content']['application/json']['data'];

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

  tree(options?: IApiActionOptions) {
    return this.$fetch.get<any, ApiApiAdminDepartmenttreeResponseBody>(
      ApiApiAdminDepartmenttreePath,
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

  selectMemberships(
    options: {
      params: ApiApiAdminDepartmentselectMembershipsRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiAdminDepartmentselectMembershipsResponseBody>(
      this.$pathTranslate(ApiApiAdminDepartmentselectMembershipsPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  createMembership(
    body: ApiApiAdminDepartmentcreateMembershipRequestBody,
    options: {
      params: ApiApiAdminDepartmentcreateMembershipRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiAdminDepartmentcreateMembershipResponseBody>(
      this.$pathTranslate(ApiApiAdminDepartmentcreateMembershipPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  deleteMembership(
    options: {
      params: ApiApiAdminDepartmentdeleteMembershipRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiAdminDepartmentdeleteMembershipResponseBody>(
      this.$pathTranslate(ApiApiAdminDepartmentdeleteMembershipPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  updateMembership(
    body: ApiApiAdminDepartmentupdateMembershipRequestBody,
    options: {
      params: ApiApiAdminDepartmentupdateMembershipRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.patch<any, ApiApiAdminDepartmentupdateMembershipResponseBody>(
      this.$pathTranslate(ApiApiAdminDepartmentupdateMembershipPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  updateMembershipPrimary(
    body: ApiApiAdminDepartmentupdateMembershipPrimaryRequestBody,
    options: {
      params: ApiApiAdminDepartmentupdateMembershipPrimaryRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.put<any, ApiApiAdminDepartmentupdateMembershipPrimaryResponseBody>(
      this.$pathTranslate(ApiApiAdminDepartmentupdateMembershipPrimaryPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  updateManager(
    body: ApiApiAdminDepartmentupdateManagerRequestBody,
    options: {
      params: ApiApiAdminDepartmentupdateManagerRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.put<any, ApiApiAdminDepartmentupdateManagerResponseBody>(
      this.$pathTranslate(ApiApiAdminDepartmentupdateManagerPath, options.params),
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
