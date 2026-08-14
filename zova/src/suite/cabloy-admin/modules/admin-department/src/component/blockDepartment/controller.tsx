import type { TableIdentity } from 'table-identity';
import type { IComponentOptions } from 'zova';
import type {
  IResourceBlockOptionsBase,
  IResourceRenderBlockOptionsBlock,
} from 'zova-module-a-openapi';
import type { ControllerBlockPage } from 'zova-module-start-page';

import { VCard, VCardText, VTreeview, VTreeviewItem } from 'vuetify/components';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZBlockPage } from 'zova-module-start-page';

import type { ModelDepartment } from '../../model/department.ts';

interface DepartmentTreeItem {
  id: TableIdentity | string;
  name: string;
  children: DepartmentTreeItem[];
}

const AllDepartments = '__all__';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'admin-department:blockDepartment'?: ControllerBlockDepartmentProps;
  }
}

export interface ControllerBlockDepartmentProps extends IResourceBlockOptionsBase {
  blocks?: IResourceRenderBlockOptionsBlock[];
  resource?: string;
}

@Controller()
export class ControllerBlockDepartment extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  pageRef: ControllerBlockPage | undefined;
  modelDepartment: ModelDepartment;
  selectedKey: TableIdentity | typeof AllDepartments = AllDepartments;

  protected async __init__() {
    this.modelDepartment = (await this.bean._getBeanSelector(
      'admin-department.model.department',
      true,
    )) as ModelDepartment;
    await this.modelDepartment.tree().suspense();
  }

  get treeData(): DepartmentTreeItem[] {
    return (this.modelDepartment.tree().data?.list ?? []) as DepartmentTreeItem[];
  }

  get selectedId(): TableIdentity | undefined {
    return this.selectedKey === AllDepartments ? undefined : this.selectedKey;
  }

  get queryFixed() {
    return this.selectedId === undefined ? {} : { where: { parentId: this.selectedId } };
  }

  onActivated(value: unknown) {
    const activated =
      value instanceof Set
        ? value.values().next().value
        : Array.isArray(value)
          ? value[0]
          : value;
    if (typeof activated !== 'number' && typeof activated !== 'string') return;
    this.selectDepartment(activated);
  }

  selectDepartment(id: TableIdentity | typeof AllDepartments) {
    if (this.selectedKey === id) return;
    this.selectedKey = id;
    this.pageRef?.setQueryFixed(this.queryFixed);
  }

  protected render() {
    const treeItems: DepartmentTreeItem[] = [
      {
        id: AllDepartments,
        name: (this.scope as any).locale.AllDepartments(),
        children: this.treeData,
      },
    ];
    const props = this.$props as ControllerBlockDepartmentProps;
    return (
      <div class={`${props.class ?? ''} d-flex flex-column flex-md-row align-stretch ga-4 h-100`}>
        <VCard class="flex-shrink-0 h-100" width="280" variant="outlined">
          <VCardText class="h-100 overflow-y-auto">
            <VTreeview
              items={treeItems}
              itemTitle="name"
              itemValue="id"
              itemChildren="children"
              activatable
              activated={[this.selectedKey]}
              activeStrategy="single-independent"
              openAll
              density="compact"
              onUpdate:activated={value => this.onActivated(value)}
              v-slots={{
                header: ({ props: itemProps, item }: any) => {
                  return (
                    <VTreeviewItem
                      {...itemProps}
                      onClick={(event: MouseEvent) => {
                        itemProps.onClick?.(event);
                        this.selectDepartment(item.id);
                      }}
                    ></VTreeviewItem>
                  );
                },
                item: ({ props: itemProps, item }: any) => {
                  return (
                    <VTreeviewItem
                      {...itemProps}
                      onClick={(event: MouseEvent) => {
                        itemProps.onClick?.(event);
                        this.selectDepartment(item.id);
                      }}
                    ></VTreeviewItem>
                  );
                },
              }}
            ></VTreeview>
          </VCardText>
        </VCard>
        <div class="min-width-0 flex-grow-1">{this._renderPage()}</div>
      </div>
    );
  }

  private _renderPage() {
    const props = this.$props as ControllerBlockDepartmentProps;
    const blocks = props.blocks;
    if (!blocks || blocks.length === 0) return;
    const options = {
      resource: (this.$props as ControllerBlockDepartmentProps).resource,
      blocks,
      queryFixed: this.queryFixed,
    };
    return (
      <ZBlockPage
        {...options}
        controllerRef={ref => {
          this.pageRef = ref;
        }}
      ></ZBlockPage>
    );
  }
}
