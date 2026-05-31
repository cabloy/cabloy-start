import { BeanBase } from 'zova';
import { ApiSchema, IApiSchemaOptions } from 'zova-module-a-api';

import {
  ApiApiPaypalcancelOrderPath,
  ApiApiPaypalcaptureOrderPath,
  ApiApiPaypalgetRecordPath,
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
