import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** AdminMenuRoleMenu_catalog */
export const ApiApiAdminMenuRoleMenucatalogPath = '/api/admin/menu/roleMenu/catalog';
export type ApiApiAdminMenuRoleMenucatalogPath = '/api/admin/menu/roleMenu/catalog';
export type ApiApiAdminMenuRoleMenucatalogMethod = 'get';
export type ApiApiAdminMenuRoleMenucatalogResponseBody =
  paths[ApiApiAdminMenuRoleMenucatalogPath][ApiApiAdminMenuRoleMenucatalogMethod]['responses']['200']['content']['application/json']['data'];

/** AdminMenuRoleMenu_roleConfiguration */
export const ApiApiAdminMenuRoleMenuroleConfigurationPath =
  '/api/admin/menu/roleMenu/roles/{roleId}/configuration';
export type ApiApiAdminMenuRoleMenuroleConfigurationPath =
  '/api/admin/menu/roleMenu/roles/{roleId}/configuration';
export type ApiApiAdminMenuRoleMenuroleConfigurationMethod = 'get';
export type ApiApiAdminMenuRoleMenuroleConfigurationRequestParams =
  paths[ApiApiAdminMenuRoleMenuroleConfigurationPath][ApiApiAdminMenuRoleMenuroleConfigurationMethod]['parameters']['path'];
export type ApiApiAdminMenuRoleMenuroleConfigurationResponseBody =
  paths[ApiApiAdminMenuRoleMenuroleConfigurationPath][ApiApiAdminMenuRoleMenuroleConfigurationMethod]['responses']['200']['content']['application/json']['data'];

/** AdminMenuRoleMenu_create */
export const ApiApiAdminMenuRoleMenucreatePath = '/api/admin/menu/roleMenu';
export type ApiApiAdminMenuRoleMenucreatePath = '/api/admin/menu/roleMenu';
export type ApiApiAdminMenuRoleMenucreateMethod = 'post';
export type ApiApiAdminMenuRoleMenucreateRequestBody =
  components['schemas']['admin-menu.dto.roleMenuCreate'];
export type ApiApiAdminMenuRoleMenucreateResponseBody =
  paths[ApiApiAdminMenuRoleMenucreatePath][ApiApiAdminMenuRoleMenucreateMethod]['responses']['200']['content']['application/json']['data'];

/** AdminMenuRoleMenu_delete */
export const ApiApiAdminMenuRoleMenudeletePath = '/api/admin/menu/roleMenu';
export type ApiApiAdminMenuRoleMenudeletePath = '/api/admin/menu/roleMenu';
export type ApiApiAdminMenuRoleMenudeleteMethod = 'delete';
export type ApiApiAdminMenuRoleMenudeleteRequestBody =
  components['schemas']['admin-menu.dto.roleMenuDelete'];
export type ApiApiAdminMenuRoleMenudeleteResponseBody =
  paths[ApiApiAdminMenuRoleMenudeletePath][ApiApiAdminMenuRoleMenudeleteMethod]['responses']['200']['content']['application/json']['data'];

/** AdminMenuRoleMenu_batch */
export const ApiApiAdminMenuRoleMenubatchPath = '/api/admin/menu/roleMenu/batch';
export type ApiApiAdminMenuRoleMenubatchPath = '/api/admin/menu/roleMenu/batch';
export type ApiApiAdminMenuRoleMenubatchMethod = 'put';
export type ApiApiAdminMenuRoleMenubatchRequestBody =
  components['schemas']['admin-menu.dto.roleMenuBatch'];
export type ApiApiAdminMenuRoleMenubatchResponseBody =
  paths[ApiApiAdminMenuRoleMenubatchPath][ApiApiAdminMenuRoleMenubatchMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiAdminMenuRoleMenu extends BeanApiBase {
  catalog(options?: IApiActionOptions) {
    return this.$fetch.get<any, ApiApiAdminMenuRoleMenucatalogResponseBody>(
      ApiApiAdminMenuRoleMenucatalogPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  roleConfiguration(
    options: {
      params: ApiApiAdminMenuRoleMenuroleConfigurationRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiAdminMenuRoleMenuroleConfigurationResponseBody>(
      this.$pathTranslate(ApiApiAdminMenuRoleMenuroleConfigurationPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  create(body: ApiApiAdminMenuRoleMenucreateRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiAdminMenuRoleMenucreateResponseBody>(
      ApiApiAdminMenuRoleMenucreatePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  delete(body: ApiApiAdminMenuRoleMenudeleteRequestBody, options?: IApiActionOptions) {
    return this.$fetch.delete<any, ApiApiAdminMenuRoleMenudeleteResponseBody>(
      ApiApiAdminMenuRoleMenudeletePath,
      {
        ...this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
        data: body,
      },
    );
  }

  batch(body: ApiApiAdminMenuRoleMenubatchRequestBody, options?: IApiActionOptions) {
    return this.$fetch.put<any, ApiApiAdminMenuRoleMenubatchResponseBody>(
      ApiApiAdminMenuRoleMenubatchPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
