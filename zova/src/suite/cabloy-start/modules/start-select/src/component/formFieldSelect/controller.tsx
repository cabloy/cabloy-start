import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { VSelect } from 'vuetify/components';
import z from 'zod';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField, ZFormFieldPreset } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-select:formFieldSelect'?: IResourceFormFieldSelectOptions;
  }
}

export interface IResourceFormFieldSelectOptions
  extends IResourceFormFieldOptionsBase, Omit<VSelect['$props'], 'readonly' | 'style'> {}

export interface ControllerFormFieldSelectProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldSelectOptions;
}

@Controller()
export class ControllerFormFieldSelect extends BeanControllerBase {
  static $propsDefault = {
    options: {
      itemValue: 'value',
      itemTitle: 'title',
    },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  protected async __init__() {}

  protected render() {
    if (this.$props.readonly) {
      return (
        <ZFormFieldPreset
          {...this.$props}
          render="start-input:formFieldInput"
          options={{ modelValue: this._getValueByItems() }}
        ></ZFormFieldPreset>
      );
    }
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const { field } = $$formField;
          const error = !field.state.meta.isValid;
          const errorObj = field.state.meta.errors[0] as z.ZodError | undefined;
          const propsNew: VSelect['$props'] = {
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
          return <VSelect {...propsNew}></VSelect>;
        }}
      ></ZFormField>
    );
  }

  private _getValueByItems() {
    const value = this.$props.value;
    const item = this.$props.options.items?.find(
      item => item[String(this.$props.options.itemValue)] === value,
    );
    return item?.[String(this.$props.options.itemTitle)];
  }
}
