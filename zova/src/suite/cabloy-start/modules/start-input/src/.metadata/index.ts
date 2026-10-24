// eslint-disable
/** controller: begin */
export * from '../component/formFieldInput/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-input' {

        export interface ControllerFormFieldInput {
          /** @internal */
          get scope(): ScopeModuleStartInput;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerFormFieldInput } from '../component/formFieldInput/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-input.controller.formFieldInput': ControllerFormFieldInput;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldInput.ts';
import { ZFormFieldInput } from './component/formFieldInput.ts';
export const components = {
  'formFieldInput': ZFormFieldInput,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-input:formFieldInput': ControllerFormFieldInput;
}
export interface IZovaComponentRecord {
  'start-input:formFieldInput': typeof ZFormFieldInput;
}
}
/** components: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartInput extends BeanScopeBase {}

export interface ScopeModuleStartInput {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-input': ScopeModuleStartInput;
  }






}

/** scope: end */
