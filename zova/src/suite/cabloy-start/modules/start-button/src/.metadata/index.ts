// eslint-disable
/** controller: begin */
export * from '../component/button/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-button' {

        export interface ControllerButton {
          /** @internal */
          get scope(): ScopeModuleStartButton;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerButton } from '../component/button/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-button.controller.button': ControllerButton;
  }
}
/** controller: end */

/** components: begin */
export * from './component/button.ts';
import { ZButton } from './component/button.ts';
export const components = {
  'button': ZButton,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-button:button': ControllerButton;
}
export interface IZovaComponentRecord {
  'start-button:button': typeof ZButton;
}
}
/** components: end */
/** behavior: begin */
export * from '../bean/behavior.perform.ts';
import { IBehaviorOptionsPerform } from '../bean/behavior.perform.ts';
import 'zova-module-a-behavior';
declare module 'zova-module-a-behavior' {

    export interface IBehaviorRecord {
      'start-button:perform': IBehaviorOptionsPerform;
    }


}
declare module 'zova-module-start-button' {

        export interface BehaviorPerform {
          /** @internal */
          get scope(): ScopeModuleStartButton;
        }

        export interface BehaviorPerform {
          get $beanFullName(): 'start-button.behavior.perform';
          get $onionName(): 'start-button:perform';
          get $onionOptions(): IBehaviorOptionsPerform;
        }
}
/** behavior: end */
/** behavior: begin */
import type { BehaviorPerform } from '../bean/behavior.perform.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-button.behavior.perform': BehaviorPerform;
  }
}
/** behavior: end */
/** behaviors: begin */
import 'vue';
import 'vue/jsx-runtime';

declare module 'vue' {
  export interface InputHTMLAttributes {
    'bs-start-button-perform'?: IBehaviorOptionsPerform | '' | boolean;
  }
}

declare module 'vue/jsx-runtime' {
  namespace JSX {
    // need define class/style in IntrinsicAttributes
    export interface IntrinsicAttributes {
      'bs-start-button-perform'?: IBehaviorOptionsPerform | '' | boolean;
    }
  }
}
/** behaviors: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartButton extends BeanScopeBase {}

export interface ScopeModuleStartButton {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-button': ScopeModuleStartButton;
  }






}

/** scope: end */
