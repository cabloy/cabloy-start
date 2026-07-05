import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiPaypalgetRecordPath,
  ApiApiPaypalcaptureOrderPath,
  ApiApiPaypalcancelOrderPath,
} from '../api/paypal.js';

@ApiSchema()
export class ApiSchemaPaypal extends BeanBase {
  getRecord(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiPaypalgetRecordPath, 'get', options);
  }

  captureOrder(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiPaypalcaptureOrderPath, 'post', options);
  }

  cancelOrder(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiPaypalcancelOrderPath, 'post', options);
  }
}
