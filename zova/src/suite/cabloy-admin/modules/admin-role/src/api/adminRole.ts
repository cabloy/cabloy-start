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

/** AdminRole_issueSystemAdminFreshProof */
export const ApiApiAdminRoleissueSystemAdminFreshProofPath =
  '/api/admin/role/system-admin/fresh-proof';
export type ApiApiAdminRoleissueSystemAdminFreshProofPath =
  '/api/admin/role/system-admin/fresh-proof';
export type ApiApiAdminRoleissueSystemAdminFreshProofMethod = 'post';
export type ApiApiAdminRoleissueSystemAdminFreshProofRequestBody =
  components['schemas']['admin-role.dto.systemAdminFreshProofIssue'];
export type ApiApiAdminRoleissueSystemAdminFreshProofResponseBody =
  paths[ApiApiAdminRoleissueSystemAdminFreshProofPath][ApiApiAdminRoleissueSystemAdminFreshProofMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRole_grantSystemAdmin */
export const ApiApiAdminRolegrantSystemAdminPath = '/api/admin/role/system-admin/grant/{userId}';
export type ApiApiAdminRolegrantSystemAdminPath = '/api/admin/role/system-admin/grant/{userId}';
export type ApiApiAdminRolegrantSystemAdminMethod = 'post';
export type ApiApiAdminRolegrantSystemAdminRequestParams =
  paths[ApiApiAdminRolegrantSystemAdminPath][ApiApiAdminRolegrantSystemAdminMethod]['parameters']['path'];
export type ApiApiAdminRolegrantSystemAdminRequestBody =
  components['schemas']['admin-role.dto.systemAdminGrant'];
export type ApiApiAdminRolegrantSystemAdminResponseBody =
  paths[ApiApiAdminRolegrantSystemAdminPath][ApiApiAdminRolegrantSystemAdminMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRole_revokeSystemAdmin */
export const ApiApiAdminRolerevokeSystemAdminPath = '/api/admin/role/system-admin/revoke/{userId}';
export type ApiApiAdminRolerevokeSystemAdminPath = '/api/admin/role/system-admin/revoke/{userId}';
export type ApiApiAdminRolerevokeSystemAdminMethod = 'post';
export type ApiApiAdminRolerevokeSystemAdminRequestParams =
  paths[ApiApiAdminRolerevokeSystemAdminPath][ApiApiAdminRolerevokeSystemAdminMethod]['parameters']['path'];
export type ApiApiAdminRolerevokeSystemAdminRequestBody =
  components['schemas']['admin-role.dto.systemAdminRevoke'];
export type ApiApiAdminRolerevokeSystemAdminResponseBody =
  paths[ApiApiAdminRolerevokeSystemAdminPath][ApiApiAdminRolerevokeSystemAdminMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRole_updateSystemAdminAccountStatus */
export const ApiApiAdminRoleupdateSystemAdminAccountStatusPath =
  '/api/admin/role/system-admin/account-status/{userId}';
export type ApiApiAdminRoleupdateSystemAdminAccountStatusPath =
  '/api/admin/role/system-admin/account-status/{userId}';
export type ApiApiAdminRoleupdateSystemAdminAccountStatusMethod = 'put';
export type ApiApiAdminRoleupdateSystemAdminAccountStatusRequestParams =
  paths[ApiApiAdminRoleupdateSystemAdminAccountStatusPath][ApiApiAdminRoleupdateSystemAdminAccountStatusMethod]['parameters']['path'];
export type ApiApiAdminRoleupdateSystemAdminAccountStatusRequestBody =
  components['schemas']['admin-role.dto.systemAdminAccountStatus'];
export type ApiApiAdminRoleupdateSystemAdminAccountStatusResponseBody =
  paths[ApiApiAdminRoleupdateSystemAdminAccountStatusPath][ApiApiAdminRoleupdateSystemAdminAccountStatusMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRole_updateSystemAdminActivation */
export const ApiApiAdminRoleupdateSystemAdminActivationPath =
  '/api/admin/role/system-admin/activation/{userId}';
export type ApiApiAdminRoleupdateSystemAdminActivationPath =
  '/api/admin/role/system-admin/activation/{userId}';
export type ApiApiAdminRoleupdateSystemAdminActivationMethod = 'put';
export type ApiApiAdminRoleupdateSystemAdminActivationRequestParams =
  paths[ApiApiAdminRoleupdateSystemAdminActivationPath][ApiApiAdminRoleupdateSystemAdminActivationMethod]['parameters']['path'];
export type ApiApiAdminRoleupdateSystemAdminActivationRequestBody =
  components['schemas']['admin-role.dto.systemAdminActivation'];
export type ApiApiAdminRoleupdateSystemAdminActivationResponseBody =
  paths[ApiApiAdminRoleupdateSystemAdminActivationPath][ApiApiAdminRoleupdateSystemAdminActivationMethod]['responses']['200']['content']['application/json']['data'];

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

  issueSystemAdminFreshProof(
    body: ApiApiAdminRoleissueSystemAdminFreshProofRequestBody,
    options?: IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiAdminRoleissueSystemAdminFreshProofResponseBody>(
      ApiApiAdminRoleissueSystemAdminFreshProofPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  grantSystemAdmin(
    body: ApiApiAdminRolegrantSystemAdminRequestBody,
    options: {
      params: ApiApiAdminRolegrantSystemAdminRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiAdminRolegrantSystemAdminResponseBody>(
      this.$pathTranslate(ApiApiAdminRolegrantSystemAdminPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  revokeSystemAdmin(
    body: ApiApiAdminRolerevokeSystemAdminRequestBody,
    options: {
      params: ApiApiAdminRolerevokeSystemAdminRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiAdminRolerevokeSystemAdminResponseBody>(
      this.$pathTranslate(ApiApiAdminRolerevokeSystemAdminPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  updateSystemAdminAccountStatus(
    body: ApiApiAdminRoleupdateSystemAdminAccountStatusRequestBody,
    options: {
      params: ApiApiAdminRoleupdateSystemAdminAccountStatusRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.put<any, ApiApiAdminRoleupdateSystemAdminAccountStatusResponseBody>(
      this.$pathTranslate(ApiApiAdminRoleupdateSystemAdminAccountStatusPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  updateSystemAdminActivation(
    body: ApiApiAdminRoleupdateSystemAdminActivationRequestBody,
    options: {
      params: ApiApiAdminRoleupdateSystemAdminActivationRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.put<any, ApiApiAdminRoleupdateSystemAdminActivationResponseBody>(
      this.$pathTranslate(ApiApiAdminRoleupdateSystemAdminActivationPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
