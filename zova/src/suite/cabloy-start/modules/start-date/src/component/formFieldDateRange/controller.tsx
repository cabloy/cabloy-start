import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { DateTime } from 'luxon';
import { DateInstance, useDate } from 'vuetify';
import { VDateInput } from 'vuetify/components';
import z from 'zod';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-date:formFieldDateRange'?: IResourceFormFieldDateRangeOptions;
  }
}

export interface IResourceFormFieldDateRangeOptions
  extends IResourceFormFieldOptionsBase, Omit<VDateInput['$props'], 'readonly' | 'style'> {
  separator?: string;
}

export interface ControllerFormFieldDateRangeProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldDateRangeOptions;
}

@Controller()
export class ControllerFormFieldDateRange extends BeanControllerBase {
  static $propsDefault = {
    options: { separator: '~', multiple: 'range' },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  dateUtils: DateInstance;

  protected async __init__() {
    this.dateUtils = useDate();
  }

  protected render() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const { field } = $$formField;
          const error = !field.state.meta.isValid;
          const errorObj = field.state.meta.errors[0] as z.ZodError | undefined;
          const propsNew: VDateInput['$props'] = {
            'label': propsBucket.layout?.label,
            'prependIcon': propsBucket.layout?.iconPrefix,
            'appendIcon': propsBucket.layout?.iconSuffix,
            'modelValue': this._parseValue(propsBucket.value),
            'onUpdate:modelValue': value => {
              const value2 = this._combineValue(value as any);
              $$formField.setValue(value2, propsBucket.disableNotifyChanged);
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
          return <VDateInput {...propsNew}></VDateInput>;
        }}
      ></ZFormField>
    );
  }

  _parseValue(value?: string) {
    if (!value) return [];
    const values = value.split(this.separator);
    const result: DateTime[] = [];
    if (values[0]) {
      result.push(this.dateUtils.date(values[0]));
    }
    if (values[1]) {
      result.push(this.dateUtils.date(values[1]));
    }
    return result;
  }

  _combineValue(values: DateTime[]) {
    const dateStartStr = values[0] ? this.dateUtils.format(values[0], 'keyboardDate') : '';
    const dateEndStr = values[values.length - 1]
      ? this.dateUtils.format(values[values.length - 1], 'keyboardDate')
      : '';
    return `${dateStartStr}${this.separator}${dateEndStr}`;
  }

  get separator() {
    return this.$props.options!.separator!;
  }
}
