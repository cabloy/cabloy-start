import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** Paypal_getRecord */
export const ApiApiPaypalgetRecordPath = '/api/paypal/getRecord/{recordId}';
export type ApiApiPaypalgetRecordPath = '/api/paypal/getRecord/{recordId}';
export type ApiApiPaypalgetRecordMethod = 'get';
export type ApiApiPaypalgetRecordRequestParams =
  paths[ApiApiPaypalgetRecordPath][ApiApiPaypalgetRecordMethod]['parameters']['path'];
export type ApiApiPaypalgetRecordResponseBody =
  paths[ApiApiPaypalgetRecordPath][ApiApiPaypalgetRecordMethod]['responses']['200']['content']['application/json']['data'];

/** Paypal_captureOrder */
export const ApiApiPaypalcaptureOrderPath = '/api/paypal/captureOrder/{recordId}';
export type ApiApiPaypalcaptureOrderPath = '/api/paypal/captureOrder/{recordId}';
export type ApiApiPaypalcaptureOrderMethod = 'post';
export type ApiApiPaypalcaptureOrderRequestParams =
  paths[ApiApiPaypalcaptureOrderPath][ApiApiPaypalcaptureOrderMethod]['parameters']['path'];
export type ApiApiPaypalcaptureOrderResponseBody =
  paths[ApiApiPaypalcaptureOrderPath][ApiApiPaypalcaptureOrderMethod]['responses']['200']['content']['application/json']['data'];

/** Paypal_cancelOrder */
export const ApiApiPaypalcancelOrderPath = '/api/paypal/cancelOrder/{recordId}';
export type ApiApiPaypalcancelOrderPath = '/api/paypal/cancelOrder/{recordId}';
export type ApiApiPaypalcancelOrderMethod = 'post';
export type ApiApiPaypalcancelOrderRequestParams =
  paths[ApiApiPaypalcancelOrderPath][ApiApiPaypalcancelOrderMethod]['parameters']['path'];
export type ApiApiPaypalcancelOrderResponseBody =
  paths[ApiApiPaypalcancelOrderPath][ApiApiPaypalcancelOrderMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiPaypal extends BeanApiBase {
  getRecord(
    options: {
      params: ApiApiPaypalgetRecordRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiPaypalgetRecordResponseBody>(
      this.$pathTranslate(ApiApiPaypalgetRecordPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  captureOrder(
    body: undefined,
    options: {
      params: ApiApiPaypalcaptureOrderRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiPaypalcaptureOrderResponseBody>(
      this.$pathTranslate(ApiApiPaypalcaptureOrderPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  cancelOrder(
    body: undefined,
    options: {
      params: ApiApiPaypalcancelOrderRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiPaypalcancelOrderResponseBody>(
      this.$pathTranslate(ApiApiPaypalcancelOrderPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
