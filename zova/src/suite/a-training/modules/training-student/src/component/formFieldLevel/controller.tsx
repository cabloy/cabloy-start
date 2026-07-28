import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { VChip, VChipGroup, VTextField } from 'vuetify/components';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'training-student:formFieldLevel'?: IResourceFormFieldLevelOptions;
  }
}

export interface IResourceFormFieldLevelItem {
  value?: unknown;
  title?: string;
}

export interface IResourceFormFieldLevelOptions extends IResourceFormFieldOptionsBase {
  items?: IResourceFormFieldLevelItem[];
  itemValue?: string;
  itemTitle?: string;
  placeholder?: string;
}

export interface ControllerFormFieldLevelProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldLevelOptions;
}

@Controller()
export class ControllerFormFieldLevel extends BeanControllerBase {
  static $propsDefault = {
    options: {
      itemValue: 'value',
      itemTitle: 'title',
    },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  protected render() {
    return (
      <ZFormField
        {...(this.$props as ControllerFormFieldLevelProps)}
        slotDefault={({ propsBucket }, $$formField) => {
          const options = propsBucket.options;
          const items = options.items ?? [];
          const value = propsBucket.value;
          const itemValue = String(options.itemValue);
          const itemTitle = String(options.itemTitle);
          const selected = items.find(item => String(item[itemValue]) === String(value));
          if (propsBucket.readonly) {
            return (
              <VChip color={this._color(value)}>
                {selected?.[itemTitle] ?? options.placeholder ?? ''}
              </VChip>
            );
          }
          return (
            <VTextField
              active
              label={propsBucket.layout?.label as string | undefined}
              error={!$$formField.field.state.meta.isValid}
            >
              {{
                default: () => (
                  <VChipGroup
                    modelValue={value}
                    onUpdate:modelValue={value => {
                      $$formField.setValue(value, propsBucket.disableNotifyChanged);
                      $$formField.handleBlur();
                    }}
                  >
                    {items.map(item => (
                      <VChip key={String(item[itemValue])} value={item[itemValue]} color={this._color(item[itemValue])}>
                        {item[itemTitle]}
                      </VChip>
                    ))}
                  </VChipGroup>
                ),
              }}
            </VTextField>
          );
        }}
      ></ZFormField>
    );
  }

  private _color(value: unknown) {
    if (String(value) === '1') return 'warning';
    if (String(value) === '2') return 'info';
    if (String(value) === '3') return 'success';
    return undefined;
  }
}
