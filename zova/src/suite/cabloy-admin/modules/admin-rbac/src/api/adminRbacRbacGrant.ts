import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** AdminRbacRbacGrant_select */
export const ApiApiAdminRbacRbacGrantselectPath = '/api/admin/rbac/rbacGrant';
export type ApiApiAdminRbacRbacGrantselectPath = '/api/admin/rbac/rbacGrant';
export type ApiApiAdminRbacRbacGrantselectMethod = 'get';
export type ApiApiAdminRbacRbacGrantselectRequestQuery =
  paths[ApiApiAdminRbacRbacGrantselectPath][ApiApiAdminRbacRbacGrantselectMethod]['parameters']['query'];
export type ApiApiAdminRbacRbacGrantselectResponseBody =
  paths[ApiApiAdminRbacRbacGrantselectPath][ApiApiAdminRbacRbacGrantselectMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRbacRbacGrant_create */
export const ApiApiAdminRbacRbacGrantcreatePath = '/api/admin/rbac/rbacGrant';
export type ApiApiAdminRbacRbacGrantcreatePath = '/api/admin/rbac/rbacGrant';
export type ApiApiAdminRbacRbacGrantcreateMethod = 'post';
export type ApiApiAdminRbacRbacGrantcreateRequestBody =
  components['schemas']['admin-rbac.dto.rbacGrantCreate'];
export type ApiApiAdminRbacRbacGrantcreateResponseBody =
  paths[ApiApiAdminRbacRbacGrantcreatePath][ApiApiAdminRbacRbacGrantcreateMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRbacRbacGrant_view */
export const ApiApiAdminRbacRbacGrantviewPath = '/api/admin/rbac/rbacGrant/{id}';
export type ApiApiAdminRbacRbacGrantviewPath = '/api/admin/rbac/rbacGrant/{id}';
export type ApiApiAdminRbacRbacGrantviewMethod = 'get';
export type ApiApiAdminRbacRbacGrantviewRequestParams =
  paths[ApiApiAdminRbacRbacGrantviewPath][ApiApiAdminRbacRbacGrantviewMethod]['parameters']['path'];
export type ApiApiAdminRbacRbacGrantviewResponseBody =
  paths[ApiApiAdminRbacRbacGrantviewPath][ApiApiAdminRbacRbacGrantviewMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRbacRbacGrant_delete */
export const ApiApiAdminRbacRbacGrantdeletePath = '/api/admin/rbac/rbacGrant/{id}';
export type ApiApiAdminRbacRbacGrantdeletePath = '/api/admin/rbac/rbacGrant/{id}';
export type ApiApiAdminRbacRbacGrantdeleteMethod = 'delete';
export type ApiApiAdminRbacRbacGrantdeleteRequestParams =
  paths[ApiApiAdminRbacRbacGrantdeletePath][ApiApiAdminRbacRbacGrantdeleteMethod]['parameters']['path'];
export type ApiApiAdminRbacRbacGrantdeleteResponseBody =
  paths[ApiApiAdminRbacRbacGrantdeletePath][ApiApiAdminRbacRbacGrantdeleteMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRbacRbacGrant_update */
export const ApiApiAdminRbacRbacGrantupdatePath = '/api/admin/rbac/rbacGrant/{id}';
export type ApiApiAdminRbacRbacGrantupdatePath = '/api/admin/rbac/rbacGrant/{id}';
export type ApiApiAdminRbacRbacGrantupdateMethod = 'patch';
export type ApiApiAdminRbacRbacGrantupdateRequestParams =
  paths[ApiApiAdminRbacRbacGrantupdatePath][ApiApiAdminRbacRbacGrantupdateMethod]['parameters']['path'];
export type ApiApiAdminRbacRbacGrantupdateRequestBody =
  components['schemas']['admin-rbac.dto.rbacGrantUpdate'];
export type ApiApiAdminRbacRbacGrantupdateResponseBody =
  paths[ApiApiAdminRbacRbacGrantupdatePath][ApiApiAdminRbacRbacGrantupdateMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiAdminRbacRbacGrant extends BeanApiBase {
  select(
    options?: {
      query?: ApiApiAdminRbacRbacGrantselectRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiAdminRbacRbacGrantselectResponseBody>(
      ApiApiAdminRbacRbacGrantselectPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  create(body: ApiApiAdminRbacRbacGrantcreateRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiAdminRbacRbacGrantcreateResponseBody>(
      ApiApiAdminRbacRbacGrantcreatePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  view(
    options: {
      params: ApiApiAdminRbacRbacGrantviewRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiAdminRbacRbacGrantviewResponseBody>(
      this.$pathTranslate(ApiApiAdminRbacRbacGrantviewPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  delete(
    options: {
      params: ApiApiAdminRbacRbacGrantdeleteRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiAdminRbacRbacGrantdeleteResponseBody>(
      this.$pathTranslate(ApiApiAdminRbacRbacGrantdeletePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  update(
    body: ApiApiAdminRbacRbacGrantupdateRequestBody,
    options: {
      params: ApiApiAdminRbacRbacGrantupdateRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.patch<any, ApiApiAdminRbacRbacGrantupdateResponseBody>(
      this.$pathTranslate(ApiApiAdminRbacRbacGrantupdatePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
