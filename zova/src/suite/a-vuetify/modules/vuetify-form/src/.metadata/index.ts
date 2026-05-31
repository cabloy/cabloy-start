// eslint-disable
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
      'vuetify-form:formField': IBehaviorOptionsFormField;
'vuetify-form:formFieldLayout': IBehaviorOptionsFormFieldLayout;
'vuetify-form:formFieldLayoutCol': IBehaviorOptionsFormFieldLayoutCol;
    }

  
}
declare module 'zova-module-vuetify-form' {
  
        export interface BehaviorFormField {
          /** @internal */
          get scope(): ScopeModuleVuetifyForm;
        }

        export interface BehaviorFormField {
          get $beanFullName(): 'vuetify-form.behavior.formField';
          get $onionName(): 'vuetify-form:formField';
          get $onionOptions(): IBehaviorOptionsFormField;
        }

        export interface BehaviorFormFieldLayout {
          /** @internal */
          get scope(): ScopeModuleVuetifyForm;
        }

        export interface BehaviorFormFieldLayout {
          get $beanFullName(): 'vuetify-form.behavior.formFieldLayout';
          get $onionName(): 'vuetify-form:formFieldLayout';
          get $onionOptions(): IBehaviorOptionsFormFieldLayout;
        }

        export interface BehaviorFormFieldLayoutCol {
          /** @internal */
          get scope(): ScopeModuleVuetifyForm;
        }

        export interface BehaviorFormFieldLayoutCol {
          get $beanFullName(): 'vuetify-form.behavior.formFieldLayoutCol';
          get $onionName(): 'vuetify-form:formFieldLayoutCol';
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
    'vuetify-form.behavior.formField': BehaviorFormField;
'vuetify-form.behavior.formFieldLayout': BehaviorFormFieldLayout;
'vuetify-form.behavior.formFieldLayoutCol': BehaviorFormFieldLayoutCol;
  }
}
/** behavior: end */
/** behaviors: begin */
import 'vue';
import 'vue/jsx-runtime';

declare module 'vue' {
  export interface InputHTMLAttributes {
    'bs-vuetify-form-formField'?: IBehaviorOptionsFormField | '' | boolean;
'bs-vuetify-form-formFieldLayout'?: IBehaviorOptionsFormFieldLayout | '' | boolean;
'bs-vuetify-form-formFieldLayoutCol'?: IBehaviorOptionsFormFieldLayoutCol | '' | boolean;
  }
}

declare module 'vue/jsx-runtime' {
  namespace JSX {
    // need define class/style in IntrinsicAttributes
    export interface IntrinsicAttributes {
      'bs-vuetify-form-formField'?: IBehaviorOptionsFormField | '' | boolean;
'bs-vuetify-form-formFieldLayout'?: IBehaviorOptionsFormFieldLayout | '' | boolean;
'bs-vuetify-form-formFieldLayoutCol'?: IBehaviorOptionsFormFieldLayoutCol | '' | boolean;
    }
  }
}
/** behaviors: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleVuetifyForm extends BeanScopeBase {}

export interface ScopeModuleVuetifyForm {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'vuetify-form': ScopeModuleVuetifyForm;
  }
  
  

  

  
}
  
/** scope: end */
