import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** AdminUser_select */
export const ApiApiAdminUserselectPath = '/api/admin/user';
export type ApiApiAdminUserselectPath = '/api/admin/user';
export type ApiApiAdminUserselectMethod = 'get';
export type ApiApiAdminUserselectRequestQuery =
  paths[ApiApiAdminUserselectPath][ApiApiAdminUserselectMethod]['parameters']['query'];
export type ApiApiAdminUserselectResponseBody =
  paths[ApiApiAdminUserselectPath][ApiApiAdminUserselectMethod]['responses']['200']['content']['application/json']['data'];

/** AdminUser_view */
export const ApiApiAdminUserviewPath = '/api/admin/user/{id}';
export type ApiApiAdminUserviewPath = '/api/admin/user/{id}';
export type ApiApiAdminUserviewMethod = 'get';
export type ApiApiAdminUserviewRequestParams =
  paths[ApiApiAdminUserviewPath][ApiApiAdminUserviewMethod]['parameters']['path'];
export type ApiApiAdminUserviewResponseBody =
  paths[ApiApiAdminUserviewPath][ApiApiAdminUserviewMethod]['responses']['200']['content']['application/json']['data'];

/** AdminUser_update */
export const ApiApiAdminUserupdatePath = '/api/admin/user/{id}';
export type ApiApiAdminUserupdatePath = '/api/admin/user/{id}';
export type ApiApiAdminUserupdateMethod = 'patch';
export type ApiApiAdminUserupdateRequestParams =
  paths[ApiApiAdminUserupdatePath][ApiApiAdminUserupdateMethod]['parameters']['path'];
export type ApiApiAdminUserupdateRequestBody = components['schemas']['admin-user.dto.userUpdate'];
export type ApiApiAdminUserupdateResponseBody =
  paths[ApiApiAdminUserupdatePath][ApiApiAdminUserupdateMethod]['responses']['200']['content']['application/json']['data'];

/** AdminUser_activate */
export const ApiApiAdminUseractivatePath = '/api/admin/user/activate/{id}';
export type ApiApiAdminUseractivatePath = '/api/admin/user/activate/{id}';
export type ApiApiAdminUseractivateMethod = 'post';
export type ApiApiAdminUseractivateRequestParams =
  paths[ApiApiAdminUseractivatePath][ApiApiAdminUseractivateMethod]['parameters']['path'];
export type ApiApiAdminUseractivateResponseBody =
  paths[ApiApiAdminUseractivatePath][ApiApiAdminUseractivateMethod]['responses']['200']['content']['application/json']['data'];

/** AdminUser_updateAccountStatus */
export const ApiApiAdminUserupdateAccountStatusPath = '/api/admin/user/account-status/{id}';
export type ApiApiAdminUserupdateAccountStatusPath = '/api/admin/user/account-status/{id}';
export type ApiApiAdminUserupdateAccountStatusMethod = 'put';
export type ApiApiAdminUserupdateAccountStatusRequestParams =
  paths[ApiApiAdminUserupdateAccountStatusPath][ApiApiAdminUserupdateAccountStatusMethod]['parameters']['path'];
export type ApiApiAdminUserupdateAccountStatusRequestBody =
  components['schemas']['admin-user.dto.userAccountStatusUpdate'];
export type ApiApiAdminUserupdateAccountStatusResponseBody =
  paths[ApiApiAdminUserupdateAccountStatusPath][ApiApiAdminUserupdateAccountStatusMethod]['responses']['200']['content']['application/json']['data'];

/** AdminUser_replaceUserRoles */
export const ApiApiAdminUserreplaceUserRolesPath = '/api/admin/user/{userId}/roles';
export type ApiApiAdminUserreplaceUserRolesPath = '/api/admin/user/{userId}/roles';
export type ApiApiAdminUserreplaceUserRolesMethod = 'put';
export type ApiApiAdminUserreplaceUserRolesRequestParams =
  paths[ApiApiAdminUserreplaceUserRolesPath][ApiApiAdminUserreplaceUserRolesMethod]['parameters']['path'];
export type ApiApiAdminUserreplaceUserRolesRequestBody =
  components['schemas']['admin-role.dto.userRoleReplace'];
export type ApiApiAdminUserreplaceUserRolesResponseBody =
  paths[ApiApiAdminUserreplaceUserRolesPath][ApiApiAdminUserreplaceUserRolesMethod]['responses']['200']['content']['application/json']['data'];

/** AdminUser_grantSystemAdmin */
export const ApiApiAdminUsergrantSystemAdminPath = '/api/admin/user/system-admin/grant/{userId}';
export type ApiApiAdminUsergrantSystemAdminPath = '/api/admin/user/system-admin/grant/{userId}';
export type ApiApiAdminUsergrantSystemAdminMethod = 'post';
export type ApiApiAdminUsergrantSystemAdminRequestParams =
  paths[ApiApiAdminUsergrantSystemAdminPath][ApiApiAdminUsergrantSystemAdminMethod]['parameters']['path'];
export type ApiApiAdminUsergrantSystemAdminRequestBody =
  components['schemas']['admin-role.dto.systemAdminGrant'];
export type ApiApiAdminUsergrantSystemAdminResponseBody =
  paths[ApiApiAdminUsergrantSystemAdminPath][ApiApiAdminUsergrantSystemAdminMethod]['responses']['200']['content']['application/json']['data'];

/** AdminUser_revokeSystemAdmin */
export const ApiApiAdminUserrevokeSystemAdminPath = '/api/admin/user/system-admin/revoke/{userId}';
export type ApiApiAdminUserrevokeSystemAdminPath = '/api/admin/user/system-admin/revoke/{userId}';
export type ApiApiAdminUserrevokeSystemAdminMethod = 'post';
export type ApiApiAdminUserrevokeSystemAdminRequestParams =
  paths[ApiApiAdminUserrevokeSystemAdminPath][ApiApiAdminUserrevokeSystemAdminMethod]['parameters']['path'];
export type ApiApiAdminUserrevokeSystemAdminRequestBody =
  components['schemas']['admin-role.dto.systemAdminRevoke'];
export type ApiApiAdminUserrevokeSystemAdminResponseBody =
  paths[ApiApiAdminUserrevokeSystemAdminPath][ApiApiAdminUserrevokeSystemAdminMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiAdminUser extends BeanApiBase {
  select(
    options?: {
      query?: ApiApiAdminUserselectRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiAdminUserselectResponseBody>(
      ApiApiAdminUserselectPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  view(
    options: {
      params: ApiApiAdminUserviewRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiAdminUserviewResponseBody>(
      this.$pathTranslate(ApiApiAdminUserviewPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  update(
    body: ApiApiAdminUserupdateRequestBody,
    options: {
      params: ApiApiAdminUserupdateRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.patch<any, ApiApiAdminUserupdateResponseBody>(
      this.$pathTranslate(ApiApiAdminUserupdatePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  activate(
    body: undefined,
    options: {
      params: ApiApiAdminUseractivateRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiAdminUseractivateResponseBody>(
      this.$pathTranslate(ApiApiAdminUseractivatePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  updateAccountStatus(
    body: ApiApiAdminUserupdateAccountStatusRequestBody,
    options: {
      params: ApiApiAdminUserupdateAccountStatusRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.put<any, ApiApiAdminUserupdateAccountStatusResponseBody>(
      this.$pathTranslate(ApiApiAdminUserupdateAccountStatusPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  replaceUserRoles(
    body: ApiApiAdminUserreplaceUserRolesRequestBody,
    options: {
      params: ApiApiAdminUserreplaceUserRolesRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.put<any, ApiApiAdminUserreplaceUserRolesResponseBody>(
      this.$pathTranslate(ApiApiAdminUserreplaceUserRolesPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  grantSystemAdmin(
    body: ApiApiAdminUsergrantSystemAdminRequestBody,
    options: {
      params: ApiApiAdminUsergrantSystemAdminRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiAdminUsergrantSystemAdminResponseBody>(
      this.$pathTranslate(ApiApiAdminUsergrantSystemAdminPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  revokeSystemAdmin(
    body: ApiApiAdminUserrevokeSystemAdminRequestBody,
    options: {
      params: ApiApiAdminUserrevokeSystemAdminRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiAdminUserrevokeSystemAdminResponseBody>(
      this.$pathTranslate(ApiApiAdminUserrevokeSystemAdminPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
