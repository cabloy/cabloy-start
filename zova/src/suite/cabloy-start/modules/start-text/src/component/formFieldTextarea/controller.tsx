import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { VTextarea } from 'vuetify/components';
import z from 'zod';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-text:formFieldTextarea'?: IResourceFormFieldTextareaOptions;
  }
}

export interface IResourceFormFieldTextareaOptions
  extends IResourceFormFieldOptionsBase, Omit<VTextarea['$props'], 'readonly' | 'style'> {}

export interface ControllerFormFieldTextareaProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldTextareaOptions;
}

@Controller()
export class ControllerFormFieldTextarea extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  protected async __init__() {}

  protected render() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const { field } = $$formField;
          const error = !field.state.meta.isValid;
          const errorObj = field.state.meta.errors[0] as z.ZodError | undefined;
          const propsNew: VTextarea['$props'] = {
            'label': propsBucket.layout?.label,
            'prependIcon': propsBucket.layout?.iconPrefix,
            'appendIcon': propsBucket.layout?.iconSuffix,
            'modelValue': propsBucket.value,
            'onUpdate:modelValue': value => {
              $$formField.setValue(value, propsBucket.disableNotifyChanged);
            },
            'errorMessages': error ? errorObj?.message : undefined,
            ...propsBucket.options,
            ...props,
          };
          return <VTextarea {...propsNew}></VTextarea>;
        }}
      ></ZFormField>
    );
  }
}
