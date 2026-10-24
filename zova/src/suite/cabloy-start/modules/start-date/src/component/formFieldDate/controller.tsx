import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { VTextField } from 'vuetify/components';
import z from 'zod';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';

import { dateFormatUtil } from '../../lib/utils.ts';
import { TypeDateFormatPreset } from '../../types/date.ts';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-date:formFieldDate'?: IResourceFormFieldDateOptions;
  }
}

export interface IResourceFormFieldDateOptions extends IResourceFormFieldOptionsBase {
  preset?: TypeDateFormatPreset;
  format?: string;
}

export interface ControllerFormFieldDateProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldDateOptions;
}

@Controller()
export class ControllerFormFieldDate extends BeanControllerBase {
  static $propsDefault = {
    options: {
      preset: 'DATETIME_SHORT',
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
          const propsNew: VTextField['$props'] = {
            'type': 'text',
            'label': propsBucket.layout?.label,
            'prependIcon': propsBucket.layout?.iconPrefix,
            'appendIcon': propsBucket.layout?.iconSuffix,
            'modelValue': dateFormatUtil(propsBucket.value, this.dateFormat),
            'onUpdate:modelValue': value => {
              $$formField.setValue(
                value === '' ? undefined : value,
                propsBucket.disableNotifyChanged,
              );
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
          return <VTextField {...propsNew}></VTextField>;
        }}
      ></ZFormField>
    );
  }

  get dateFormat(): IResourceFormFieldDateOptions | undefined {
    return this.$props.options;
  }
}
