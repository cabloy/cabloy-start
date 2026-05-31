// eslint-disable
/** controller: begin */
export * from '../component/actionBack/controller.jsx';
export * from '../component/actionSubmit/controller.jsx';

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
}
/** controller: end */
/** controller: begin */
import { ControllerActionBack } from '../component/actionBack/controller.jsx';
import { ControllerActionSubmit } from '../component/actionSubmit/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-form.controller.actionBack': ControllerActionBack;
'start-form.controller.actionSubmit': ControllerActionSubmit;
  }
}
/** controller: end */

/** components: begin */
export * from './component/actionBack.js';
import { ZActionBack } from './component/actionBack.js';
export * from './component/actionSubmit.js';
import { ZActionSubmit } from './component/actionSubmit.js';
export const components = {
  'actionBack': ZActionBack,
'actionSubmit': ZActionSubmit,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-form:actionBack': ControllerActionBack;
'start-form:actionSubmit': ControllerActionSubmit;
}
export interface IZovaComponentRecord {
  'start-form:actionBack': typeof ZActionBack;
'start-form:actionSubmit': typeof ZActionSubmit;
}
}
/** components: end */
/** behavior: begin */
export * from '../bean/behavior.formField.js';
export * from '../bean/behavior.formFieldLayout.jsx';
export * from '../bean/behavior.formFieldLayoutCol.jsx';
import { IBehaviorOptionsFormField } from '../bean/behavior.formField.js';
import { IBehaviorOptionsFormFieldLayout } from '../bean/behavior.formFieldLayout.jsx';
import { IBehaviorOptionsFormFieldLayoutCol } from '../bean/behavior.formFieldLayoutCol.jsx';
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
import { BehaviorFormField } from '../bean/behavior.formField.js';
import { BehaviorFormFieldLayout } from '../bean/behavior.formFieldLayout.jsx';
import { BehaviorFormFieldLayoutCol } from '../bean/behavior.formFieldLayoutCol.jsx';
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
import { locales } from './locales.js';
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
