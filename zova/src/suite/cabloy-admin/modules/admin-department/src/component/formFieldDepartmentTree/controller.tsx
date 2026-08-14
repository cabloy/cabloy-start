import type { TableIdentity } from 'table-identity';
import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { VTextField, VTreeview, VTreeviewItem } from 'vuetify/components';
import z from 'zod';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField, ZFormFieldPreset } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';

import type { ModelDepartment } from '../../model/department.ts';

interface DepartmentTreeItem {
  id: TableIdentity | typeof RootDepartment;
  name: string;
  children: DepartmentTreeItem[];
}

const RootDepartment = '__root__';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'admin-department:formFieldDepartmentTree'?: IResourceFormFieldDepartmentTreeOptions;
  }
}

export interface IResourceFormFieldDepartmentTreeOptions extends IResourceFormFieldOptionsBase {
  excludeId?: TableIdentity;
}

export interface ControllerFormFieldDepartmentTreeProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldDepartmentTreeOptions;
}

@Controller()
export class ControllerFormFieldDepartmentTree extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  modelDepartment: ModelDepartment;

  protected async __init__() {
    this.modelDepartment = (await this.bean._getBeanSelector(
      'admin-department.model.department',
      true,
    )) as ModelDepartment;
    await $QueryEnsureLoaded(() => this.modelDepartment.tree());
  }

  get treeData(): DepartmentTreeItem[] {
    return (this.modelDepartment.tree().data?.list ?? []) as DepartmentTreeItem[];
  }

  protected render() {
    if (this.$props.readonly) {
      return (
        <ZFormFieldPreset
          {...this.$props}
          render="start-input:formFieldInput"
          options={{ modelValue: this._getTitle(this.$props.value) }}
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
          const treeItems: DepartmentTreeItem[] = [
            {
              id: RootDepartment,
              name: this.scope.locale.RootDepartment(),
              children: this._getTreeData(propsBucket.options?.excludeId),
            },
          ];
          const propsTextField: VTextField['$props'] = {
            active: true,
            label: propsBucket.layout?.label as string | undefined,
            prependIcon: propsBucket.layout?.iconPrefix,
            appendIcon: propsBucket.layout?.iconSuffix,
            errorMessages: error ? errorObj?.message : undefined,
            ...propsBucket.options,
            ...props,
          };
          const selectDepartment = (id: TableIdentity | typeof RootDepartment) => {
            $$formField.setValue(
              id === RootDepartment ? null : id,
              propsBucket.disableNotifyChanged,
            );
            $$formField.handleBlur();
          };
          function renderTreeItem({ props: itemProps, item }: any) {
            return (
              <VTreeviewItem
                {...itemProps}
                onClick={(event: MouseEvent) => {
                  itemProps.onClick?.(event);
                  selectDepartment(item.id);
                }}
              ></VTreeviewItem>
            );
          }
          return (
            <VTextField {...propsTextField}>
              {{
                default: () => (
                  <VTreeview
                    items={treeItems}
                    itemTitle="name"
                    itemValue="id"
                    itemChildren="children"
                    activatable
                    activated={[this._getActivatedId(propsBucket.value)]}
                    activeStrategy="single-independent"
                    openAll
                    density="compact"
                    onUpdate:activated={value => {
                      const id = this._getActivatedId(value);
                      selectDepartment(id);
                    }}
                    v-slots={{
                      header: renderTreeItem,
                      item: renderTreeItem,
                    }}
                  ></VTreeview>
                ),
              }}
            </VTextField>
          );
        }}
      ></ZFormField>
    );
  }

  private _getTreeData(excludeId?: TableIdentity) {
    if (excludeId === undefined) return this.treeData;
    return this._filterTreeItems(this.treeData, excludeId);
  }

  private _filterTreeItems(items: DepartmentTreeItem[], excludeId: TableIdentity) {
    return items
      .filter(item => String(item.id) !== String(excludeId))
      .map(item => ({
        ...item,
        children: this._filterTreeItems(item.children, excludeId),
      }));
  }

  private _getActivatedId(value: unknown): TableIdentity | typeof RootDepartment {
    const activated =
      value instanceof Set ? value.values().next().value : Array.isArray(value) ? value[0] : value;
    if (typeof activated === 'number' || typeof activated === 'string') return activated;
    return RootDepartment;
  }

  private _getTitle(value: unknown) {
    const id = this._getActivatedId(value);
    if (id === RootDepartment) return this.scope.locale.RootDepartment();
    return this._findTreeItem(this.treeData, id)?.name ?? String(id);
  }

  private _findTreeItem(items: DepartmentTreeItem[], id: TableIdentity) {
    for (const item of items) {
      if (String(item.id) === String(id)) return item;
      const child = this._findTreeItem(item.children, id);
      if (child) return child;
    }
  }
}
