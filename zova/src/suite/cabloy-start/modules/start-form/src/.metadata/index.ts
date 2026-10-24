// eslint-disable
/** controller: begin */
export * from '../component/actionBack/controller.tsx';
export * from '../component/actionSubmit/controller.tsx';
export * from '../component/blockFormLayout/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-form' {

        export interface ControllerActionBack {
          /** @internal */
          get scope(): ScopeModuleStartForm;
        }

        export interface ControllerActionSubmit {
          /** @internal */
          get scope(): ScopeModuleStartForm;
        }

        export interface ControllerBlockFormLayout {
          /** @internal */
          get scope(): ScopeModuleStartForm;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerActionBack } from '../component/actionBack/controller.tsx';
import type { ControllerActionSubmit } from '../component/actionSubmit/controller.tsx';
import type { ControllerBlockFormLayout } from '../component/blockFormLayout/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-form.controller.actionBack': ControllerActionBack;
'start-form.controller.actionSubmit': ControllerActionSubmit;
'start-form.controller.blockFormLayout': ControllerBlockFormLayout;
  }
}
/** controller: end */

/** components: begin */
export * from './component/actionBack.ts';
import { ZActionBack } from './component/actionBack.ts';
export * from './component/actionSubmit.ts';
import { ZActionSubmit } from './component/actionSubmit.ts';
export * from './component/blockFormLayout.ts';
import { ZBlockFormLayout } from './component/blockFormLayout.ts';
export const components = {
  'actionBack': ZActionBack,
'actionSubmit': ZActionSubmit,
'blockFormLayout': ZBlockFormLayout,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-form:actionBack': ControllerActionBack;
'start-form:actionSubmit': ControllerActionSubmit;
'start-form:blockFormLayout': ControllerBlockFormLayout;
}
export interface IZovaComponentRecord {
  'start-form:actionBack': typeof ZActionBack;
'start-form:actionSubmit': typeof ZActionSubmit;
'start-form:blockFormLayout': typeof ZBlockFormLayout;
}
}
/** components: end */
/** behavior: begin */
export * from '../bean/behavior.formField.ts';
export * from '../bean/behavior.formFieldLayout.tsx';
export * from '../bean/behavior.formFieldLayoutCol.tsx';
import { IBehaviorOptionsFormField } from '../bean/behavior.formField.ts';
import { IBehaviorOptionsFormFieldLayout } from '../bean/behavior.formFieldLayout.tsx';
import { IBehaviorOptionsFormFieldLayoutCol } from '../bean/behavior.formFieldLayoutCol.tsx';
import 'zova-module-a-behavior';
declare module 'zova-module-a-behavior' {

    export interface IBehaviorRecord {
      'start-form:formField': IBehaviorOptionsFormField;
'start-form:formFieldLayout': IBehaviorOptionsFormFieldLayout;
'start-form:formFieldLayoutCol': IBehaviorOptionsFormFieldLayoutCol;
    }


}
declare module 'zova-module-start-form' {

        export interface BehaviorFormField {
          /** @internal */
          get scope(): ScopeModuleStartForm;
        }

        export interface BehaviorFormField {
          get $beanFullName(): 'start-form.behavior.formField';
          get $onionName(): 'start-form:formField';
          get $onionOptions(): IBehaviorOptionsFormField;
        }

        export interface BehaviorFormFieldLayout {
          /** @internal */
          get scope(): ScopeModuleStartForm;
        }

        export interface BehaviorFormFieldLayout {
          get $beanFullName(): 'start-form.behavior.formFieldLayout';
          get $onionName(): 'start-form:formFieldLayout';
          get $onionOptions(): IBehaviorOptionsFormFieldLayout;
        }

        export interface BehaviorFormFieldLayoutCol {
          /** @internal */
          get scope(): ScopeModuleStartForm;
        }

        export interface BehaviorFormFieldLayoutCol {
          get $beanFullName(): 'start-form.behavior.formFieldLayoutCol';
          get $onionName(): 'start-form:formFieldLayoutCol';
          get $onionOptions(): IBehaviorOptionsFormFieldLayoutCol;
        }
}
/** behavior: end */
/** behavior: begin */
import type { BehaviorFormField } from '../bean/behavior.formField.ts';
import type { BehaviorFormFieldLayout } from '../bean/behavior.formFieldLayout.tsx';
import type { BehaviorFormFieldLayoutCol } from '../bean/behavior.formFieldLayoutCol.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-form.behavior.formField': BehaviorFormField;
'start-form.behavior.formFieldLayout': BehaviorFormFieldLayout;
'start-form.behavior.formFieldLayoutCol': BehaviorFormFieldLayoutCol;
  }
}
/** behavior: end */
/** behaviors: begin */
import 'vue';
import 'vue/jsx-runtime';

declare module 'vue' {
  export interface InputHTMLAttributes {
    'bs-start-form-formField'?: IBehaviorOptionsFormField | '' | boolean;
'bs-start-form-formFieldLayout'?: IBehaviorOptionsFormFieldLayout | '' | boolean;
'bs-start-form-formFieldLayoutCol'?: IBehaviorOptionsFormFieldLayoutCol | '' | boolean;
  }
}

declare module 'vue/jsx-runtime' {
  namespace JSX {
    // need define class/style in IntrinsicAttributes
    export interface IntrinsicAttributes {
      'bs-start-form-formField'?: IBehaviorOptionsFormField | '' | boolean;
'bs-start-form-formFieldLayout'?: IBehaviorOptionsFormFieldLayout | '' | boolean;
'bs-start-form-formFieldLayoutCol'?: IBehaviorOptionsFormFieldLayoutCol | '' | boolean;
    }
  }
}
/** behaviors: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartForm extends BeanScopeBase {}

export interface ScopeModuleStartForm {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-form': ScopeModuleStartForm;
  }



  export interface IBeanScopeLocale {
    'start-form': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `start-form::${K}` {
  return `start-form::${key}`;
}
/** scope: end */
