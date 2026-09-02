import type { TableIdentity } from 'table-identity';
import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPageEntry,
  IResourceBlockOptionsBase,
  ISchemaObjectExtensionField,
} from 'zova-module-a-openapi';

import { VNode } from 'vue';
import { VBtn, VCard, VCardText } from 'vuetify/components';
import { BeanControllerBase, deepExtend, Use } from 'zova';
import { ZovaJsx } from 'zova-jsx';
import { Controller } from 'zova-module-a-bean';

import type { ModelDepartment } from '../../model/department.ts';

export interface ControllerBlockDepartmentMembershipsProps extends IResourceBlockOptionsBase {}

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'admin-department:blockDepartmentMemberships'?: ControllerBlockDepartmentMembershipsProps;
  }
}

@Controller()
export class ControllerBlockDepartmentMemberships extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  modelDepartment: ModelDepartment;
  jsxZova: ZovaJsx;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPageEntry;

  get departmentId(): TableIdentity {
    const id = this.$$renderContext.$$pageEntry.entryId;
    if (id === undefined) throw new Error('should provide Department id in page entry');
    return id;
  }

  get apiSchemas() {
    return this.modelDepartment.scope.apiSchema.adminDepartment.selectMemberships();
  }

  get queryMemberships() {
    return this.modelDepartment.memberships(this.departmentId);
  }

  get membershipItems() {
    return this.queryMemberships.data?.list;
  }

  get managerName() {
    return this.membershipItems?.find(item => item.manager)?.user?.name;
  }

  protected async __init__() {
    this.modelDepartment = (await this.bean._getBeanSelector(
      'admin-department.model.department',
      true,
    )) as ModelDepartment;
    await this.apiSchemas.sdk.suspense();
    try {
      await this.queryMemberships.suspense();
    } catch {
      // Render the query error state instead of presenting the table's normal empty state.
    }
    this._prepareJsx();
  }

  protected render() {
    if (this.queryMemberships.isError) return this._renderMembershipError();
    const { $$pageEntry } = this.$$renderContext;
    const schemaRow = this.apiSchemas.row as ISchemaObjectExtensionField | undefined;
    const blocks = schemaRow?.rest?.blocks;
    if (!schemaRow || !blocks || blocks.length === 0) return;
    const domBlocks: VNode[] = [];
    blocks.forEach((block, index) => {
      const options = deepExtend(
        { key: index },
        {
          formMeta: $$pageEntry.formMeta,
          schemaForm: schemaRow,
          schemaRow,
          permissions: $$pageEntry.jsxCelScope.permissions,
          departmentId: this.departmentId,
          getDetailItems: () => this.membershipItems,
        },
        block.options,
      );
      const domBlock = this.jsxZova.render(
        block.render!,
        options,
        $$pageEntry.jsxCelScope,
        this.$$renderContext,
      );
      if (!domBlock) return;
      if (Array.isArray(domBlock)) {
        domBlocks.push(...domBlock);
      } else {
        domBlocks.push(domBlock);
      }
    });
    return (
      <div class={this.$props.class}>
        {this._renderManager()}
        {domBlocks}
      </div>
    );
  }

  private _renderManager() {
    const locale = this.scope.locale;
    return (
      <VCard class="mb-4" variant="tonal">
        <VCardText>
          <div>{locale.Manager()}</div>
          <div data-testid="department-manager">{this.managerName ?? locale.ManagerNotSet()}</div>
        </VCardText>
      </VCard>
    );
  }

  private _renderMembershipError() {
    const locale = this.scope.locale;
    return (
      <VCard class={this.$props.class} color="error" variant="tonal">
        <VCardText>
          <div>{locale.MembershipsLoadFailed()}</div>
          <VBtn
            class="mt-4"
            type="button"
            variant="outlined"
            nativeOnClick={async () => {
              await this.queryMemberships.refetch();
            }}
          >
            {locale.Retry()}
          </VBtn>
        </VCardText>
      </VCard>
    );
  }

  private _prepareJsx() {
    this.jsxZova = this.bean._newBeanSimple(ZovaJsx, false);
  }
}
