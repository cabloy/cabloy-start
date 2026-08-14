import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { reactive } from 'vue';
import { VBtn, VTextField } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';
import { $iconName } from 'zova-module-a-icon';

import { normalizeLocalizedTextMap, resolveLocalizedText } from '../../lib/localizedText.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-fieldlocales:formFieldLocalizedText'?: IResourceFormFieldLocalizedTextOptions;
  }
}

export interface IResourceFormFieldLocalizedTextOptions extends IResourceFormFieldOptionsBase {
  localesField: string;
  readonly?: boolean;
}

export interface ControllerFormFieldLocalizedTextProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldLocalizedTextOptions;
}

@Controller()
export class ControllerFormFieldLocalizedText extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  protected async __init__() {}

  protected render() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const currentLocale = this.app.meta.locale.current;
          const localesField = this.$props.options?.localesField;
          const locales = localesField ? this.$$form.getFieldValue(localesField) : undefined;
          const readonly = propsBucket.readonly || this.$props.options?.readonly;
          const displayValue = readonly
            ? resolveLocalizedText(propsBucket.value, locales, currentLocale)
            : propsBucket.value;
          const propsNew: VTextField['$props'] = {
            'type': 'text',
            'label': propsBucket.layout?.label,
            'modelValue': displayValue as any,
            readonly,
            'onUpdate:modelValue': value => {
              if (!readonly) $$formField.setValue(value, propsBucket.disableNotifyChanged);
            },
            'onUpdate:focused': (focused: boolean) => {
              if (!focused) $$formField.handleBlur();
            },
            ...propsBucket.options,
            ...props,
          };
          return (
            <VTextField {...propsNew}>
              {{
                'append-inner': () => (
                  <VBtn
                    icon={$iconName('::language')}
                    color="primary"
                    variant="text"
                    size="small"
                    aria-label={this.scope.locale.EditLocales()}
                    disabled={!localesField}
                    nativeOnClick={() => this.openLocalesDialog()}
                  ></VBtn>
                ),
              }}
            </VTextField>
          );
        }}
      ></ZFormField>
    );
  }

  @Use({ injectionScope: 'host' })
  $$form: any;

  private openLocalesDialog() {
    const localesField = this.$props.options?.localesField;
    if (!localesField) return;
    const form = this.$$form;
    const draft = normalizeLocalizedTextMap(form.getFieldValue(localesField));
    const items = this.sys.config.locale.items;
    const rows = [...new Set([...Object.keys(items), ...Object.keys(draft)])].filter(
      locale => locale !== this.sys.config.locale.default,
    );
    const values = reactive({ ...draft });
    const dialog = this.$appModal.dialog({
      title: this.scope.locale.Locales(),
      slotDefault: () => (
        <div class="d-flex flex-column ga-2">
          {rows.map(locale => (
            <VTextField
              key={locale}
              label={items[locale] ? this.$scopeBase.locale[items[locale]]() : locale}
              modelValue={values[locale] ?? ''}
              readonly={!Object.prototype.hasOwnProperty.call(items, locale)}
              onUpdate:modelValue={value => {
                if (Object.prototype.hasOwnProperty.call(items, locale)) values[locale] = value;
              }}
            ></VTextField>
          ))}
        </div>
      ),
      slotActions: modal => (
        <>
          <VBtn variant="text" nativeOnClick={() => modal.close()}>
            {this.scope.locale.Cancel()}
          </VBtn>
          <VBtn
            color="primary"
            nativeOnClick={() => {
              form.setFieldValue(localesField, normalizeLocalizedTextMap(values), false);
              modal.close();
            }}
          >
            {this.scope.locale.Ok()}
          </VBtn>
        </>
      ),
    });
    return dialog;
  }
}
