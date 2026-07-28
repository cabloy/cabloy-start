import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** StartMetrics_snapshot */
export const ApiApiStartMetricssnapshotPath = '/api/start/metrics/snapshot';
export type ApiApiStartMetricssnapshotPath = '/api/start/metrics/snapshot';
export type ApiApiStartMetricssnapshotMethod = 'get';
export type ApiApiStartMetricssnapshotResponseBody =
  paths[ApiApiStartMetricssnapshotPath][ApiApiStartMetricssnapshotMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiStartMetrics extends BeanApiBase {
  snapshot(options?: IApiActionOptions) {
    return this.$fetch.get<any, ApiApiStartMetricssnapshotResponseBody>(
      ApiApiStartMetricssnapshotPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
