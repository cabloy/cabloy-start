import type { CurrencyOptions } from '@zhennann/currency';
import type { IComponentOptions } from 'zova';
import type {
  IFormFieldComponentOptions,
  IFormFieldValidatorsOptionsBase,
} from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { nextTick } from 'vue';
import { VTextField } from 'vuetify/components';
import { z } from 'zod';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ControllerForm, ZFormField } from 'zova-module-a-form';

import { currencyFormat, currencyUpdate } from '../../lib/utils.ts';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-currency:formFieldCurrency'?: IResourceFormFieldCurrencyOptions;
  }
}

export interface IResourceFormFieldCurrencyOptions
  extends IResourceFormFieldOptionsBase, CurrencyOptions {}

export interface ControllerFormFieldCurrencyProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldCurrencyOptions;
}

@Controller()
export class ControllerFormFieldCurrency extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  private _valueKeyboardInput: string | undefined;
  private _validators: IFormFieldValidatorsOptionsBase;

  @Use({ injectionScope: 'host' })
  $$form: ControllerForm;

  protected async __init__() {
    const inputSchema = z.unknown().superRefine((_, context) => {
      if (this._valueKeyboardInput === undefined) return;
      const parsed = currencyUpdate(this._valueKeyboardInput, this.$props.options);
      if (parsed !== undefined && (parsed === null || Number.isFinite(parsed))) return;
      const result = z.number().safeParse(this._valueKeyboardInput);
      if (!result.success) {
        for (const issue of result.error.issues) context.addIssue({ ...issue });
      }
    });
    this._validators = this.$computed(() => {
      const validators = this.$props.validators;
      const withInput = (schema?: boolean | z.ZodType) =>
        inputSchema.pipe(
          schema === true
            ? (this.$$form.getFieldZodSchema(this.$props.name!) ?? z.unknown())
            : schema || z.unknown(),
        );
      return {
        ...validators,
        onDynamic:
          validators?.onDynamic ??
          (validators?.onChange === undefined && validators?.onBlur === undefined),
        onChange: withInput(validators?.onChange),
        onBlur: withInput(validators?.onBlur),
      };
    });
  }

  protected render() {
    return (
      <ZFormField
        {...this.$props}
        validators={this._validators}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const { field } = $$formField;
          const error = field.state.meta.errors[0] as { message?: string } | undefined;
          const currencyOptions = this.$props.options;
          const propsNew: VTextField['$props'] = {
            ...propsBucket.options,
            ...props,
            'type': 'text',
            'label': propsBucket.layout?.label,
            'prependIcon': propsBucket.layout?.iconPrefix,
            'appendIcon': propsBucket.layout?.iconSuffix,
            'modelValue':
              this._valueKeyboardInput ?? currencyFormat(field.state.value, currencyOptions),
            'onUpdate:modelValue': value => {
              this._valueKeyboardInput = value == null ? '' : String(value);
              const parsed = currencyUpdate(this._valueKeyboardInput, currencyOptions);
              if (parsed !== undefined && (parsed === null || Number.isFinite(parsed))) {
                $$formField.setValue(parsed ?? undefined, propsBucket.disableNotifyChanged);
              } else {
                // Parsing errors belong to field validation, never the numeric business value.
                field.api.setMeta(previous => ({ ...previous, isTouched: true, isDirty: true }));
                void field.api.validate('change');
              }
            },
            'onUpdate:focused': (focused: boolean) => {
              if (focused) return;
              $$formField.handleBlur();
              const raw = this._valueKeyboardInput;
              if (raw === undefined) return;
              const parsed = currencyUpdate(raw, currencyOptions);
              if (parsed === undefined || (parsed !== null && !Number.isFinite(parsed))) {
                this.$logger.debug('currency.input.blur rejected invalid amount');
                return;
              }
              void nextTick(() => {
                if (this._valueKeyboardInput === raw) this._valueKeyboardInput = undefined;
              });
            },
            'errorMessages': !field.state.meta.isValid ? error?.message : undefined,
            'aria-invalid': !field.state.meta.isValid ? 'true' : undefined,
          };
          return <VTextField {...propsNew}></VTextField>;
        }}
      ></ZFormField>
    );
  }
}
