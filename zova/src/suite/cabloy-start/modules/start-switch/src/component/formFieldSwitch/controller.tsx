import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { VSwitch } from 'vuetify/components';
import z from 'zod';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-switch:formFieldSwitch'?: IResourceFormFieldSwitchOptions;
  }
}

export interface IResourceFormFieldSwitchOptions
  extends IResourceFormFieldOptionsBase, Omit<VSwitch['$props'], 'readonly' | 'style'> {}

export interface ControllerFormFieldSwitchProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldSwitchOptions;
}

@Controller()
export class ControllerFormFieldSwitch extends BeanControllerBase {
  static $propsDefault = {
    options: {
      inset: true,
      color: 'secondary',
    },
  };

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
          const propsNew: VSwitch['$props'] = {
            'label': propsBucket.layout?.label,
            'prependIcon': propsBucket.layout?.iconPrefix,
            'appendIcon': propsBucket.layout?.iconSuffix,
            'modelValue': Boolean(propsBucket.value),
            'onUpdate:modelValue': value => {
              $$formField.setValue(value, propsBucket.disableNotifyChanged);
            },
            'errorMessages': error ? errorObj?.message : undefined,
            ...propsBucket.options,
            ...props,
          };
          return <VSwitch {...propsNew}></VSwitch>;
        }}
      ></ZFormField>
    );
  }
}
