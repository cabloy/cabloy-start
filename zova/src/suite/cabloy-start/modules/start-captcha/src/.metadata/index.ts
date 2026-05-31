// eslint-disable
/** controller: begin */
export * from '../component/formFieldCaptcha/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-captcha' {
  
        export interface ControllerFormFieldCaptcha {
          /** @internal */
          get scope(): ScopeModuleStartCaptcha;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldCaptcha } from '../component/formFieldCaptcha/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-captcha.controller.formFieldCaptcha': ControllerFormFieldCaptcha;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldCaptcha.js';
import { ZFormFieldCaptcha } from './component/formFieldCaptcha.js';
export const components = {
  'formFieldCaptcha': ZFormFieldCaptcha,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-captcha:formFieldCaptcha': ControllerFormFieldCaptcha;
}
export interface IZovaComponentRecord {
  'start-captcha:formFieldCaptcha': typeof ZFormFieldCaptcha;
}
}
/** components: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartCaptcha extends BeanScopeBase {}

export interface ScopeModuleStartCaptcha {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-captcha': ScopeModuleStartCaptcha;
  }
  
  

  export interface IBeanScopeLocale {
    'start-captcha': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `start-captcha::${K}` {
  return `start-captcha::${key}`;
}  
/** scope: end */
