import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions, IJsxRenderContextFormField } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase, ITableQuery } from 'zova-module-a-openapi';

import { pickObject } from '@cabloy/utils';
import { classes } from 'typestyle';
import { VChip, VChipGroup, VSelect, VTextField } from 'vuetify/components';
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
  display?: 'select' | 'chips';
  resource?: string;
  actionPath?: string;
  query?: ITableQuery;
  relationName?: string;
  selectOptions?: Omit<VSelect['$props'], 'readonly' | 'style' | 'class'>;
  chipGroupOptions?: Omit<VChipGroup['$props'], 'readonly' | 'style' | 'class' | 'multiple'>;
  chipOptions?: Omit<VChip['$props'], 'readonly' | 'style' | 'class'>;
}

export interface ControllerFormFieldResourcePickerProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldResourcePickerOptions;
}

interface IResourcePickerReadonlyItem {
  props?: unknown;
  title: string;
  value: unknown;
}

@Controller()
export class ControllerFormFieldResourcePicker extends BeanControllerBase {
  static $propsDefault = {
    options: { selectOptions: { itemValue: 'id', itemTitle: 'name' } },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  $$modelResource: ModelResource;
  private cSelectChips: string;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextFormField;

  protected async __init__() {
    if (this.isReadonly) return;
    const { ctx } = this.$$renderContext;
    this.$$modelResource = await ctx.bean._getBeanSelector(
      'rest-resource.model.resource',
      true,
      this.resource,
    );
    await $QueryEnsureLoaded(() => this.queryData);
    if (this.isChips) {
      this.cSelectChips = this.$style({
        $nest: {
          '.v-field .v-field__input > input': {
            opacity: 0,
          },
          '.v-chip.v-chip--selected': {
            backgroundColor: 'rgb(var(--v-theme-primary))',
            color: 'rgb(var(--v-theme-on-primary))',
            opacity: 1,
          },
        },
      });
    }
  }

  get resource() {
    const resource = this.resourcePickerOptions?.resource;
    if (!resource) throw new Error('should specify resource name');
    return resource;
  }

  get resourcePickerOptions() {
    return this.$props.options;
  }

  get isChips() {
    return this.resourcePickerOptions?.display === 'chips';
  }

  get isReadonly() {
    return this.$props.readonly;
  }

  get queryData() {
    return this.$$modelResource.selectGeneral(
      this.resourcePickerOptions?.actionPath,
      this.resourcePickerOptions?.query,
    );
  }

  get items() {
    const data = this.queryData.data;
    return Array.isArray(data) ? data : data?.list;
  }

  protected render() {
    if (this.isChips) return this._renderChips();
    if (this.isReadonly) {
      return (
        <ZFormFieldPreset
          {...this.$props}
          render="start-input:formFieldInput"
          options={{
            modelValue: this._getReadonlyItems()
              .map(item => item.title)
              .join(', '),
          }}
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

  private _renderChips() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const { field } = $$formField;
          const error = !field.state.meta.isValid;
          const errorObj = field.state.meta.errors[0] as z.ZodError | undefined;
          const selectOptions = {
            ...this.$props.options?.selectOptions,
            ...propsBucket.options?.selectOptions,
          };
          const itemValue = selectOptions.itemValue ?? 'id';
          const itemTitle = selectOptions.itemTitle ?? 'name';
          const itemProps = selectOptions.itemProps;
          const readonlyItems = this.isReadonly ? this._getReadonlyItems() : undefined;
          const propsChipGroup: VChipGroup['$props'] = {
            modelValue: propsBucket.value,
            ...(this.isReadonly
              ? {}
              : {
                  'onUpdate:modelValue': value => {
                    $$formField.setValue(value, propsBucket.disableNotifyChanged);
                  },
                  'filter': true,
                }),
            multiple: selectOptions.multiple,
            ...this.$props.options?.chipGroupOptions,
            ...propsBucket.options?.chipGroupOptions,
            ...pickObject(props, ['readonly']),
          };
          const slots = {
            default: () => {
              return (
                <VChipGroup {...propsChipGroup}>
                  {(readonlyItems ?? this.items ?? []).map(item => {
                    const title = readonlyItems ? item.title : item[itemTitle];
                    const value = readonlyItems ? item.value : item[itemValue];
                    const propsItem = readonlyItems ? item.props : item[itemProps];
                    return (
                      <VChip
                        {...this.$props.options?.chipOptions}
                        {...propsBucket.options?.chipOptions}
                        {...propsItem}
                        key={String(value)}
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

  private _getReadonlyItems(): IResourcePickerReadonlyItem[] {
    const values = this._normalizeValues(
      this.$$renderContext.$$form.getFieldValue(this.$props.name as never),
    );
    const { itemProps, itemTitle, itemValue } = this.resourcePickerOptions?.selectOptions ?? {};
    const itemPropsName = typeof itemProps === 'string' ? itemProps : undefined;
    const itemTitleName = typeof itemTitle === 'string' ? itemTitle : 'name';
    const itemValueName = typeof itemValue === 'string' ? itemValue : 'id';
    const relationName = this._getRelationName();
    const relationValues = relationName
      ? this._normalizeValues(this.$$renderContext.$$form.getFieldValue(relationName as never))
      : [];
    const relationItems = new Map(
      relationValues.filter(this._isRecord).map(item => [String(item[itemValueName]), item]),
    );
    return values.map(value => {
      const item = relationItems.get(String(value));
      return {
        value,
        title: item?.[itemTitleName] ? String(item[itemTitleName]) : String(value),
        props: itemPropsName ? item?.[itemPropsName] : undefined,
      };
    });
  }

  private _getRelationName() {
    const relationName = this.resourcePickerOptions?.relationName;
    if (relationName) return relationName;
    const name = this.$props.name;
    return name?.endsWith('Id') ? name.slice(0, -2) : undefined;
  }

  private _normalizeValues(value: unknown): unknown[] {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
  }

  private _isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
