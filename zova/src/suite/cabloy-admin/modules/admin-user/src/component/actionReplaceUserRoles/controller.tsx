import type { SchemaObject } from 'openapi3-ts/oas31';
import type { TableIdentity } from 'table-identity';
import type { IComponentOptions } from 'zova';
import type { BeanControllerFormBase } from 'zova-module-a-form';
import type {
  IJsxRenderContextDetails,
  IResourceDetailsActionBulkOptionsBase,
} from 'zova-module-a-openapi';

import { VBtn } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { formMetaFromFormScene, ZForm } from 'zova-module-a-form';
import { ZButton } from 'zova-module-start-button';

import type { ApiSchemaAdminRoleDtoUserRoleReplace } from '../../api/openapi/schemas.js';
import type { ModelUser } from '../../model/user.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionBulkRecord {
    'admin-user:actionReplaceUserRoles'?: ControllerActionReplaceUserRolesProps;
  }
}

export interface ControllerActionReplaceUserRolesProps extends IResourceDetailsActionBulkOptionsBase {}

interface UserRoleSummary {
  id: TableIdentity;
  systemAdmin: boolean;
}

@Controller()
export class ControllerActionReplaceUserRoles extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextDetails;

  protected render() {
    const props = this.$props as { class?: string };
    return (
      <ZButton
        class={props.class}
        color="primary"
        variant="outlined"
        onPerform={async () => {
          await this._openDialog();
        }}
      >
        {this._getLocale().ReplaceUserRoles()}
      </ZButton>
    );
  }

  private _getLocale() {
    return this.scope.locale;
  }

  private async _openDialog() {
    const locale = this._getLocale();
    const { ctx, $host, $$details } = this.$$renderContext;
    const id = $host.$currentRoute?.params.id;
    if (id === undefined) throw new Error('should provide User id in route params');
    const userId = id as TableIdentity;
    const modelUser = (await ctx.bean._getBean('admin-user.model.user', true)) as ModelUser;
    const apiSchemas = modelUser.scope.apiSchema.adminUser.replaceUserRoles();
    await apiSchemas.sdk.suspense();
    type Data = ApiSchemaAdminRoleDtoUserRoleReplace;
    const roles = (Array.isArray($$details.data) ? $$details.data : []) as UserRoleSummary[];
    const roleIds = roles.filter(item => !item.systemAdmin).map(item => item.id);
    let formRef: BeanControllerFormBase<Data> | undefined;
    const dialog = this.$appModal.dialog({
      title: locale.ReplaceUserRoles(),
      slotDefault: () => (
        <ZForm<Data>
          formTag="div"
          controllerRef={ref => {
            formRef = ref;
          }}
          data={{ roleIds } as Data}
          schema={apiSchemas.requestBody as SchemaObject}
          formMeta={formMetaFromFormScene('edit')}
          onSubmitData={async data => {
            await modelUser.replaceUserRoles(userId).mutateAsync(data.value.roleIds);
            dialog.close();
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
