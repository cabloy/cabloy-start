import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { VIcon, VTextField } from 'vuetify/components';
import z from 'zod';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'admin-user:formFieldAvatar'?: IResourceFormFieldAvatarOptions;
  }
}

export interface IResourceFormFieldAvatarOptions
  extends IResourceFormFieldOptionsBase, Omit<VTextField['$props'], 'readonly' | 'style'> {}

export interface ControllerFormFieldAvatarProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldAvatarOptions;
}

@Controller()
export class ControllerFormFieldAvatar extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  protected async __init__() {}

  protected render() {
    return (
      <ZFormField
        {...(this.$props as ControllerFormFieldAvatarProps)}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const { field } = $$formField;
          const error = !field.state.meta.isValid;
          const errorObj = field.state.meta.errors[0] as z.ZodError | undefined;
          const propsNew: VTextField['$props'] = {
            'type': 'text',
            'label': propsBucket.layout?.label,
            'prependIcon': propsBucket.layout?.iconPrefix,
            'modelValue': propsBucket.value,
            'onUpdate:modelValue': value => {
              $$formField.setValue(value, propsBucket.disableNotifyChanged);
            },
            'onUpdate:focused': (focused: boolean) => {
              if (!focused) {
                $$formField.handleBlur();
              }
            },
            'errorMessages': error ? errorObj?.message : undefined,
            ...propsBucket.options,
            ...props,
          };
          const avatar = propsBucket.value as string | undefined;
          return (
            <VTextField {...propsNew}>
              {{
                'append-inner': () => avatar && <VIcon icon={avatar as any}></VIcon>,
              }}
            </VTextField>
          );
        }}
      ></ZFormField>
    );
  }
}
