import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import { ApiApiStartMetricssnapshotPath } from '../api/startMetrics.js';

@ApiSchema()
export class ApiSchemaStartMetrics extends BeanBase {
  snapshot(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiStartMetricssnapshotPath, 'get', options);
  }
}
