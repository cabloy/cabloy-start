import type { IComponentOptions } from 'zova';
import type { SchemaObject } from 'openapi3-ts/oas31';
import type { TableIdentity } from 'table-identity';
import type {
  IJsxRenderContextDetails,
  IResourceDetailsActionBulkOptionsBase,
} from 'zova-module-a-openapi';
import type { AppModalItem } from 'zova-module-start-app';

import { VBtn } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { formMetaFromFormScene, ZForm, type BeanControllerFormBase } from 'zova-module-a-form';

import type { ApiSchemaAdminDepartmentDtoDepartmentMembershipCreate } from '../../api/openapi/schemas.ts';
import type { ModelDepartment } from '../../model/department.ts';

export interface ControllerActionCreateMembershipProps extends IResourceDetailsActionBulkOptionsBase {}

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionBulkRecord {
    'admin-department:actionCreateMembership'?: ControllerActionCreateMembershipProps;
  }
}

@Controller()
export class ControllerActionCreateMembership extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextDetails;

  protected render() {
    const props = this.$props as { class?: string };
    return (
      <VBtn
        class={props.class}
        color="primary"
        variant="outlined"
        nativeOnClick={async () => {
          await this._openDialog();
        }}
      >
        {this._getLocale().AddMembership()}
      </VBtn>
    );
  }

  private _getLocale() {
    return (this as unknown as {
      scope: { locale: { AddMembership(): string; Cancel(): string; Save(): string } };
    }).scope.locale;
  }

  private async _openDialog() {
    const locale = this._getLocale();
    const { ctx, $host } = this.$$renderContext;
    const id = $host.$currentRoute?.params.id;
    if (id === undefined) throw new Error('should provide Department id in route params');
    const departmentId = id as TableIdentity;
    const modelDepartment = (await ctx.bean._getBean(
      'admin-department.model.department',
      true,
    )) as ModelDepartment;
    const apiSchemas = modelDepartment.scope.apiSchema.adminDepartment.createMembership();
    await apiSchemas.sdk.suspense();
    type Data = ApiSchemaAdminDepartmentDtoDepartmentMembershipCreate;
    let dialog: AppModalItem | undefined;
    let formRef: BeanControllerFormBase<Data> | undefined;
    dialog = this.$appModal.dialog({
      title: locale.AddMembership(),
      slotDefault: () => (
        <ZForm<Data>
          formTag="div"
          controllerRef={ref => {
            formRef = ref;
          }}
          data={{} as Data}
          schema={apiSchemas.requestBody as SchemaObject}
          formMeta={formMetaFromFormScene('create')}
          onSubmitData={async data => {
            await modelDepartment.createMembership(departmentId).mutateAsync(data.value);
            dialog?.close();
          }}
          onShowError={async ({ error }) => {
            await $host.$performCommand('start-commands:alert', {
              type: 'error',
              text: error.message,
            });
          }}
        ></ZForm>
      ),
      slotActions: modal => {
        const isSubmitting = formRef?.formState.isSubmitting ?? false;
        return (
          <>
            <VBtn variant="text" nativeOnClick={() => modal.close()}>
              {locale.Cancel()}
            </VBtn>
            <VBtn
              color="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
              nativeOnClick={async () => {
                await formRef?.submit();
              }}
            >
              {locale.Save()}
            </VBtn>
          </>
        );
      },
    });
  }
}
