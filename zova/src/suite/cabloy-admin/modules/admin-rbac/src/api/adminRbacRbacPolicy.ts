import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** AdminRbacRbacPolicy_catalog */
export const ApiApiAdminRbacRbacPolicycatalogPath = '/api/admin/rbac/rbacPolicy/catalog';
export type ApiApiAdminRbacRbacPolicycatalogPath = '/api/admin/rbac/rbacPolicy/catalog';
export type ApiApiAdminRbacRbacPolicycatalogMethod = 'get';
export type ApiApiAdminRbacRbacPolicycatalogResponseBody =
  paths[ApiApiAdminRbacRbacPolicycatalogPath][ApiApiAdminRbacRbacPolicycatalogMethod]['responses']['200']['content']['application/json']['data'];

/** AdminRbacRbacPolicy_roleConfiguration */
export const ApiApiAdminRbacRbacPolicyroleConfigurationPath =
  '/api/admin/rbac/rbacPolicy/roles/{roleId}/configuration';
export type ApiApiAdminRbacRbacPolicyroleConfigurationPath =
  '/api/admin/rbac/rbacPolicy/roles/{roleId}/configuration';
export type ApiApiAdminRbacRbacPolicyroleConfigurationMethod = 'get';
export type ApiApiAdminRbacRbacPolicyroleConfigurationRequestParams =
  paths[ApiApiAdminRbacRbacPolicyroleConfigurationPath][ApiApiAdminRbacRbacPolicyroleConfigurationMethod]['parameters']['path'];
export type ApiApiAdminRbacRbacPolicyroleConfigurationResponseBody =
  paths[ApiApiAdminRbacRbacPolicyroleConfigurationPath][ApiApiAdminRbacRbacPolicyroleConfigurationMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiAdminRbacRbacPolicy extends BeanApiBase {
  catalog(options?: IApiActionOptions) {
    return this.$fetch.get<any, ApiApiAdminRbacRbacPolicycatalogResponseBody>(
      ApiApiAdminRbacRbacPolicycatalogPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  roleConfiguration(
    options: {
      params: ApiApiAdminRbacRbacPolicyroleConfigurationRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiAdminRbacRbacPolicyroleConfigurationResponseBody>(
      this.$pathTranslate(ApiApiAdminRbacRbacPolicyroleConfigurationPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
