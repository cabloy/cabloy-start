import type { TableIdentity } from 'table-identity';
import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions, IJsxRenderContextFormField } from 'zova-module-a-form';
import type {
  IResourceFormFieldOptionsBase,
  IResourceTableSelectionPayload,
  ITableQuery,
} from 'zova-module-a-openapi';
import type {
  IResourcePickerPageOptions,
  IResourcePickerPageSession,
} from 'zova-module-rest-resource';

import { pickObject } from '@cabloy/utils';
import { classes } from 'typestyle';
import { VBtn, VChip, VChipGroup, VSelect, VTextField } from 'vuetify/components';
import z from 'zod';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField, ZFormFieldPreset } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { resourcePickerPageHostKey } from 'zova-module-rest-resource';
import { ModelResource } from 'zova-module-rest-resource';
import {
  createCompoundFormFieldState,
  renderCompoundFormField,
} from 'zova-module-start-form';
import { resolvePickerSelectionMax } from 'zova-module-start-page';

import type { TypeResourcePickerSelectionMode } from '../../lib/resourcePicker.js';

import {
  normalizeResourcePickerIds,
  resolveResourcePickerValue,
} from '../../lib/resourcePicker.js';
import { createResourcePickerPageHost } from '../../lib/resourcePickerPageHost.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-resource:formFieldResourcePicker'?: IResourceFormFieldResourcePickerOptions;
  }
}

export type TypeResourcePickerMode = 'select' | 'routedDialog';

export interface IResourceFormFieldResourcePickerOptions extends IResourceFormFieldOptionsBase {
  display?: 'select' | 'chips';
  resource?: string;
  actionPath?: string;
  query?: ITableQuery;
  relationName?: string;
  selectOptions?: Omit<VSelect['$props'], 'readonly' | 'style' | 'class'>;
  chipGroupOptions?: Omit<VChipGroup['$props'], 'readonly' | 'style' | 'class' | 'multiple'>;
  chipOptions?: Omit<VChip['$props'], 'readonly' | 'style' | 'class'>;
  pickerMode?: TypeResourcePickerMode;
  selectionMode?: TypeResourcePickerSelectionMode;
  selectionMax?: number;
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
  private _openingDialog = false;
  private _compoundFormFieldState = createCompoundFormFieldState();
  private _pendingLabelIds = new Set<string>();
  private _labelHydrationAttemptedIds = new Set<string>();

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextFormField;

  protected async __init__() {
    const { ctx } = this.$$renderContext;
    if (this.isReadonly || this.pickerMode === 'routedDialog') return;
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

  get pickerMode(): TypeResourcePickerMode {
    return this.resourcePickerOptions?.pickerMode ?? 'select';
  }

  get selectionMode(): TypeResourcePickerSelectionMode {
    return this.resourcePickerOptions?.selectionMode ?? 'single';
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
    if (this.pickerMode === 'routedDialog' && !this.isReadonly) {
      return this._renderRoutedDialogField();
    }
    if (this.isChips) return this._renderChips();
    if (this.isReadonly) return this._renderReadonlyField();
    return this._renderSelectField();
  }

  private _renderReadonlyField() {
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

  private _renderSelectField() {
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
            ...this.$props.options?.selectOptions,
            ...propsBucket.options?.selectOptions,
            ...props,
          };
          return <VSelect {...propsNew}></VSelect>;
        }}
      ></ZFormField>
    );
  }

  private _renderRoutedDialogField() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={(renderContext, $$formField) => {
          const { propsBucket } = renderContext;
          return renderCompoundFormField(renderContext, $$formField, {
            state: this._compoundFormFieldState,
            renderControl: ({ props, disabled, readonly }) => {
              const propsBtn: VBtn['$props'] = {
                ...props,
                block: true,
                variant: 'text',
                color: '',
                rounded: false,
                class: classes(props.class as string | undefined, 'justify-start'),
                style: {
                  justifyContent: 'flex-start',
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  letterSpacing: 'inherit',
                },
                disabled: disabled || readonly,
                nativeOnClick: () => {
                  void this._openPicker(propsBucket.value, value => {
                    $$formField.setValue(value, propsBucket.disableNotifyChanged);
                  }).catch(error => {
                    this.$errorHandler(error, 'ControllerFormFieldResourcePicker.openPicker');
                  });
                },
              };
              return (
                <VBtn {...propsBtn}>
                  {this._formatPickerValue(propsBucket.value) || this.scope.locale.PleaseSelect()}
                </VBtn>
              );
            },
          });
        }}
      ></ZFormField>
    );
  }

  private async _openPicker(value: unknown, setValue: (value: unknown) => void) {
    if (this._openingDialog) return;
    this._openingDialog = true;
    try {
      const selectedIds = normalizeResourcePickerIds(value);
      const options: IResourcePickerPageOptions = {
        resource: this.resource,
        actionPath: this.resourcePickerOptions?.actionPath,
        query: this.resourcePickerOptions?.query,
        selectionMode: this.selectionMode,
        selectionMax: this.resourcePickerOptions?.selectionMax,
        selectedIds,
      };
      const session: IResourcePickerPageSession = {
        selectedIds: [...selectedIds],
        selectedRows: [],
      };
      const handle = this.$appModal.routedDialog<
        IResourceTableSelectionPayload,
        IResourcePickerPageOptions,
        IResourcePickerPageSession
      >({
        route: {
          name: 'rest-resource:resourcePicker',
          params: { resource: this.resource },
        },
        props: options,
        session,
        createPageHostProviders: dialog => ({
          [resourcePickerPageHostKey]: createResourcePickerPageHost(dialog),
        }),
      });
      const result = await handle.result;
      if (!result) return;
      const nextValue = resolveResourcePickerValue(
        result.ids,
        this.selectionMode,
        resolvePickerSelectionMax(this.selectionMode, this.resourcePickerOptions?.selectionMax),
      );
      this._syncRelationField(nextValue, result.rows);
      setValue(nextValue);
    } finally {
      this._openingDialog = false;
    }
  }

  private _formatPickerValue(value: unknown) {
    const selectedIds = normalizeResourcePickerIds(value);
    if (selectedIds.length === 0) return '';
    const relationItems = this._getRelationItems();
    const relationMap = new Map(
      relationItems.map(item => [String(item.id as TableIdentity), item] as const),
    );
    const itemTitle = this._itemTitle;
    const missingIds = selectedIds.filter(id => {
      const item = relationMap.get(String(id));
      return (
        (item?.[itemTitle] === undefined || item[itemTitle] === null) &&
        !this._labelHydrationAttemptedIds.has(String(id))
      );
    });
    if (missingIds.length > 0) void this._hydrateMissingLabels(missingIds);
    return selectedIds
      .map(id => {
        const title = relationMap.get(String(id))?.[itemTitle];
        return title === undefined || title === null ? String(id) : String(title);
      })
      .join(', ');
  }

  private get _itemTitle() {
    return String(this.resourcePickerOptions?.selectOptions?.itemTitle ?? 'name');
  }

  private get _relationName() {
    const relationName = this.resourcePickerOptions?.relationName;
    if (relationName) return relationName;
    const fieldName = this.$props.name;
    const index = fieldName?.lastIndexOf('Id') ?? -1;
    return index > 0 ? fieldName!.substring(0, index) : undefined;
  }

  private _getRelationItems() {
    const relationName = this._relationName;
    if (!relationName) return [] as Record<string, unknown>[];
    const value = this.$$renderContext.$$form.getFieldValue(relationName as never);
    const items = Array.isArray(value) ? value : value ? [value] : [];
    return items.filter(item => !!item && typeof item === 'object') as Record<string, unknown>[];
  }

  private _syncRelationField(value: unknown, rows: readonly Record<string, unknown>[]) {
    const relationName = this._relationName;
    if (!relationName) return;
    const selectedIds = normalizeResourcePickerIds(value);
    const itemTitle = this._itemTitle;
    const rowMap = new Map(
      this._getRelationItems().map(item => [String(item.id as TableIdentity), item] as const),
    );
    for (const row of rows) {
      const id = row.id as TableIdentity;
      if (id === undefined || id === null || id === '') continue;
      const title = row[itemTitle];
      if (title === undefined || title === null) continue;
      rowMap.set(String(id), { id, [itemTitle]: title });
    }
    const relationItems = selectedIds.map(id => rowMap.get(String(id)) ?? { id });
    const relationValue = this.selectionMode === 'multiple' ? relationItems : relationItems[0];
    this.$$renderContext.$$form.setFieldValue(relationName as never, relationValue, true);
  }

  private async _hydrateMissingLabels(ids: readonly TableIdentity[]) {
    const relationName = this._relationName;
    if (!relationName) return;
    const idsToLoad = ids.filter(id => {
      const key = String(id);
      if (this._pendingLabelIds.has(key) || this._labelHydrationAttemptedIds.has(key)) return false;
      this._pendingLabelIds.add(key);
      this._labelHydrationAttemptedIds.add(key);
      return true;
    });
    if (idsToLoad.length === 0) return;
    try {
      const model = (await this.bean._getBeanSelector(
        'rest-resource.model.resource',
        true,
        this.resource,
      )) as ModelResource;
      const rows = await Promise.all(
        idsToLoad.map(async id => (await model.view(id).refetch()).data),
      );
      const currentIds = normalizeResourcePickerIds(
        this.$$renderContext.$$form.getFieldValue(this.$props.name as never),
      );
      this._syncRelationField(currentIds, rows.filter(Boolean) as Record<string, unknown>[]);
    } catch (error) {
      this.$errorHandler(error, 'ControllerFormFieldResourcePicker.hydrateMissingLabels');
    } finally {
      for (const id of idsToLoad) this._pendingLabelIds.delete(String(id));
    }
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
