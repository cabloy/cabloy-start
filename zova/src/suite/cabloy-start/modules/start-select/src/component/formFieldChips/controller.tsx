import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { pickObject } from '@cabloy/utils';
import { classes } from 'typestyle';
import { VChip, VChipGroup, VSelect, VTextField } from 'vuetify/components';
import z from 'zod';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-select:formFieldChips'?: IResourceFormFieldChipsOptions;
  }
}

export interface IResourceFormFieldChipsOptions
  extends
    IResourceFormFieldOptionsBase,
    Pick<VSelect['$props'], 'items' | 'itemProps' | 'itemTitle' | 'itemValue' | 'multiple'> {
  chipGroupOptions?: Omit<VChipGroup['$props'], 'readonly' | 'style' | 'class' | 'multiple'>;
  chipOptions?: Omit<VChip['$props'], 'readonly' | 'style' | 'class'>;
}

export interface ControllerFormFieldChipsProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldChipsOptions;
}

@Controller()
export class ControllerFormFieldChips extends BeanControllerBase {
  static $propsDefault = {
    options: {
      itemProps: 'props',
      itemValue: 'value',
      itemTitle: 'title',
    },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  private cSelectChips: string;

  protected async __init__() {
    this.cSelectChips = this.$style({
      $nest: {
        '.v-field .v-field__input > input': {
          opacity: 0,
        },
      },
    });
  }

  protected render() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const { field } = $$formField;
          const error = !field.state.meta.isValid;
          const errorObj = field.state.meta.errors[0] as z.ZodError | undefined;
          const propsChipGroup: VChipGroup['$props'] = {
            'modelValue': propsBucket.value,
            'onUpdate:modelValue': value => {
              $$formField.setValue(value, propsBucket.disableNotifyChanged);
            },
            'multiple': this.$props.options?.multiple,
            ...this.$props.options?.chipGroupOptions,
            ...propsBucket.options?.chipGroupOptions,
            ...pickObject(props, ['readonly']),
          };
          const slots = {
            default: () => {
              const selectOptions = propsBucket.options;
              return (
                <VChipGroup {...propsChipGroup}>
                  {selectOptions?.items?.map(item => {
                    const title = item[selectOptions.itemTitle];
                    const value = item[selectOptions.itemValue];
                    const itemProps = item[selectOptions.itemProps];
                    return (
                      <VChip
                        {...propsBucket.options.chipOptions}
                        {...itemProps}
                        key={value}
                        text={title}
                        value={value}
                      ></VChip>
                    );
                  })}
                </VChipGroup>
              );
            },
          };
          const propsTextField: VTextField['$props'] = {
            active: true,
            label: propsBucket.layout?.label as string | undefined,
            prependIcon: propsBucket.layout?.iconPrefix,
            appendIcon: propsBucket.layout?.iconSuffix,
            errorMessages: error ? errorObj?.message : undefined,
            class: classes(this.cSelectChips, props.class),
          };
          return <VTextField {...propsTextField} v-slots={slots}></VTextField>;
        }}
      ></ZFormField>
    );
  }
}
