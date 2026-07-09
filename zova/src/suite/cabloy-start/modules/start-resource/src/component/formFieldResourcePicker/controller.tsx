import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions, IJsxRenderContextFormField } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase, ITableQuery } from 'zova-module-a-openapi';

import { VSelect } from 'vuetify/components';
import z from 'zod';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField, ZFormFieldPreset } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ModelResource } from 'zova-module-rest-resource';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-resource:formFieldResourcePicker'?: IResourceFormFieldResourcePickerOptions;
  }
}

export interface IResourceFormFieldResourcePickerOptions extends IResourceFormFieldOptionsBase {
  resource?: string;
  actionPath?: string;
  query?: ITableQuery;
  relationName?: string;
  selectOptions?: Omit<VSelect['$props'], 'readonly' | 'style' | 'class'>;
}

export interface ControllerFormFieldResourcePickerProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldResourcePickerOptions;
}

@Controller()
export class ControllerFormFieldResourcePicker extends BeanControllerBase {
  static $propsDefault = {
    options: { selectOptions: { itemValue: 'id', itemTitle: 'name' } },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  $$modelResource: ModelResource;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextFormField;

  protected async __init__() {
    const { ctx } = this.$$renderContext;
    // readonly
    if (this.$props.readonly) return;
    // modelResource
    this.$$modelResource = await ctx.bean._getBeanSelector(
      'rest-resource.model.resource',
      true,
      this.resource,
    );
    // load data
    await $QueryEnsureLoaded(() => this.queryData);
  }

  get resource() {
    const resource = this.resourcePickerOptions?.resource;
    if (!resource) throw new Error('should specify resource name');
    return resource;
  }

  get resourcePickerOptions() {
    return this.$props.options;
  }

  get queryData() {
    return this.$$modelResource.selectGeneral(
      this.resourcePickerOptions?.actionPath,
      this.resourcePickerOptions?.query,
    );
  }

  get items() {
    return Array.isArray(this.queryData.data) ? this.queryData.data : this.queryData.data?.list;
  }

  protected render() {
    if (this.$props.readonly) {
      return (
        <ZFormFieldPreset
          {...this.$props}
          render="start-input:formFieldInput"
          options={{ modelValue: this._getValueByRelation() }}
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
            'items': this.items,
            // force default values take effect because selectOptions is nested props
            ...this.$props.options?.selectOptions,
            ...propsBucket.options?.selectOptions,
            ...props,
          };
          return <VSelect {...propsNew}></VSelect>;
        }}
      ></ZFormField>
    );
  }

  private _getValueByRelation() {
    const { $$form } = this.$$renderContext;
    let relationName = this.$props.options.relationName;
    if (!relationName) {
      relationName = this.$props.name!.substring(0, this.$props.name!.lastIndexOf('Id'));
    }
    const obj = $$form.getFieldValue(relationName);
    return obj?.[String(this.$props.options.selectOptions!.itemTitle)];
  }
}
