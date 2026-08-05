import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** AdminRole_select */
export const ApiApiAdminRoleselectPath = '/api/admin/role';
export type ApiApiAdminRoleselectPath = '/api/admin/role';
export type ApiApiAdminRoleselectMethod = 'get';
export type ApiApiAdminRoleselectRequestQuery =
  paths[ApiApiAdminRoleselectPath][ApiApiAdminRoleselectMethod]['parameters']['query'];
export type ApiApiAdminRoleselectResponseBody =
  paths[ApiApiAdminRoleselectPath][ApiApiAdminRoleselectMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRole_create */
export const ApiApiAdminRolecreatePath = '/api/admin/role';
export type ApiApiAdminRolecreatePath = '/api/admin/role';
export type ApiApiAdminRolecreateMethod = 'post';
export type ApiApiAdminRolecreateRequestBody = components['schemas']['admin-role.dto.roleCreate'];
export type ApiApiAdminRolecreateResponseBody =
  paths[ApiApiAdminRolecreatePath][ApiApiAdminRolecreateMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRole_view */
export const ApiApiAdminRoleviewPath = '/api/admin/role/{id}';
export type ApiApiAdminRoleviewPath = '/api/admin/role/{id}';
export type ApiApiAdminRoleviewMethod = 'get';
export type ApiApiAdminRoleviewRequestParams =
  paths[ApiApiAdminRoleviewPath][ApiApiAdminRoleviewMethod]['parameters']['path'];
export type ApiApiAdminRoleviewResponseBody =
  paths[ApiApiAdminRoleviewPath][ApiApiAdminRoleviewMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRole_delete */
export const ApiApiAdminRoledeletePath = '/api/admin/role/{id}';
export type ApiApiAdminRoledeletePath = '/api/admin/role/{id}';
export type ApiApiAdminRoledeleteMethod = 'delete';
export type ApiApiAdminRoledeleteRequestParams =
  paths[ApiApiAdminRoledeletePath][ApiApiAdminRoledeleteMethod]['parameters']['path'];
export type ApiApiAdminRoledeleteResponseBody =
  paths[ApiApiAdminRoledeletePath][ApiApiAdminRoledeleteMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRole_update */
export const ApiApiAdminRoleupdatePath = '/api/admin/role/{id}';
export type ApiApiAdminRoleupdatePath = '/api/admin/role/{id}';
export type ApiApiAdminRoleupdateMethod = 'patch';
export type ApiApiAdminRoleupdateRequestParams =
  paths[ApiApiAdminRoleupdatePath][ApiApiAdminRoleupdateMethod]['parameters']['path'];
export type ApiApiAdminRoleupdateRequestBody = components['schemas']['admin-role.dto.roleUpdate'];
export type ApiApiAdminRoleupdateResponseBody =
  paths[ApiApiAdminRoleupdatePath][ApiApiAdminRoleupdateMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRole_replaceUserRoles */
export const ApiApiAdminRolereplaceUserRolesPath = '/api/admin/role/user/{userId}/roles';
export type ApiApiAdminRolereplaceUserRolesPath = '/api/admin/role/user/{userId}/roles';
export type ApiApiAdminRolereplaceUserRolesMethod = 'put';
export type ApiApiAdminRolereplaceUserRolesRequestParams =
  paths[ApiApiAdminRolereplaceUserRolesPath][ApiApiAdminRolereplaceUserRolesMethod]['parameters']['path'];
export type ApiApiAdminRolereplaceUserRolesRequestBody =
  components['schemas']['admin-role.dto.userRoleReplace'];
export type ApiApiAdminRolereplaceUserRolesResponseBody =
  paths[ApiApiAdminRolereplaceUserRolesPath][ApiApiAdminRolereplaceUserRolesMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiAdminRole extends BeanApiBase {
  select(
    options?: {
      query?: ApiApiAdminRoleselectRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiAdminRoleselectResponseBody>(
      ApiApiAdminRoleselectPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  create(body: ApiApiAdminRolecreateRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiAdminRolecreateResponseBody>(
      ApiApiAdminRolecreatePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  view(
    options: {
      params: ApiApiAdminRoleviewRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiAdminRoleviewResponseBody>(
      this.$pathTranslate(ApiApiAdminRoleviewPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  delete(
    options: {
      params: ApiApiAdminRoledeleteRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiAdminRoledeleteResponseBody>(
      this.$pathTranslate(ApiApiAdminRoledeletePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  update(
    body: ApiApiAdminRoleupdateRequestBody,
    options: {
      params: ApiApiAdminRoleupdateRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.patch<any, ApiApiAdminRoleupdateResponseBody>(
      this.$pathTranslate(ApiApiAdminRoleupdatePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  replaceUserRoles(
    body: ApiApiAdminRolereplaceUserRolesRequestBody,
    options: {
      params: ApiApiAdminRolereplaceUserRolesRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.put<any, ApiApiAdminRolereplaceUserRolesResponseBody>(
      this.$pathTranslate(ApiApiAdminRolereplaceUserRolesPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
