// eslint-disable
/** controller: begin */
export * from '../component/paymentNextAction/controller.jsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-pay' {

        export interface ControllerPaymentNextAction {
          /** @internal */
          get scope(): ScopeModuleStartPay;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerPaymentNextAction } from '../component/paymentNextAction/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-pay.controller.paymentNextAction': ControllerPaymentNextAction;
  }
}
/** controller: end */

/** components: begin */
export * from './component/paymentNextAction.js';
import { ZPaymentNextAction } from './component/paymentNextAction.js';
export const components = {
  'paymentNextAction': ZPaymentNextAction,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-pay:paymentNextAction': ControllerPaymentNextAction;
}
export interface IZovaComponentRecord {
  'start-pay:paymentNextAction': typeof ZPaymentNextAction;
}
}
/** components: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartPay extends BeanScopeBase {}

export interface ScopeModuleStartPay {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-pay': ScopeModuleStartPay;
  }






}

/** scope: end */
