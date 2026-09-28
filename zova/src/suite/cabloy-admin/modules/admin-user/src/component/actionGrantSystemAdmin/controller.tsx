import type { SchemaObject } from 'openapi3-ts/oas31';
import type { TableIdentity } from 'table-identity';
import type { IComponentOptions } from 'zova';
import type { BeanControllerFormBase } from 'zova-module-a-form';
import type {
  IJsxRenderContextDetails,
  IResourceDetailsActionBulkOptionsBase,
} from 'zova-module-a-openapi';

import { VAlert, VBtn } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { formMetaFromFormScene, ZForm, ZFormFieldPreset } from 'zova-module-a-form';
import { ZButton } from 'zova-module-start-button';

import type { ModelUser } from '../../model/user.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionBulkRecord {
    'admin-user:actionGrantSystemAdmin'?: ControllerActionGrantSystemAdminProps;
  }
}

export interface ControllerActionGrantSystemAdminProps extends IResourceDetailsActionBulkOptionsBase {}

interface UserRoleSummary {
  systemAdmin: boolean;
}

interface GrantSystemAdminData {
  password: string;
  reason: string;
}

interface GrantSystemAdminLocale {
  GrantSystemAdmin(): string;
  GrantSystemAdminDescription(): string;
  CurrentPassword(): string;
  OperationalReason(): string;
  ConfirmGrantSystemAdmin(): string;
  Cancel(): string;
}

@Controller()
export class ControllerActionGrantSystemAdmin extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextDetails;

  private dialogOpen = false;

  protected render() {
    if (this._hasSystemAdminRole()) return;
    const props = this.$props as { class?: string };
    return (
      <ZButton
        class={props.class}
        color="error"
        variant="outlined"
        onPerform={async () => {
          await this._openDialog();
        }}
      >
        {this._getLocale().GrantSystemAdmin()}
      </ZButton>
    );
  }

  private _getLocale() {
    return (this.scope as { locale: GrantSystemAdminLocale }).locale;
  }

  private _hasSystemAdminRole() {
    const { $$details } = this.$$renderContext;
    const roles = (Array.isArray($$details.data) ? $$details.data : []) as UserRoleSummary[];
    return roles.some(role => role.systemAdmin);
  }

  private _openDialog() {
    if (this.dialogOpen) return;
    this.dialogOpen = true;
    const locale = this._getLocale();
    const { ctx, $host } = this.$$renderContext;
    const id = $host.$currentRoute?.params.id;
    if (id === undefined) throw new Error('should provide User id in route params');
    const userId = id as TableIdentity;
    const schema = this._createFormSchema(locale);
    let formRef: BeanControllerFormBase<GrantSystemAdminData> | undefined;
    const dialog = this.$appModal.dialog({
      title: locale.GrantSystemAdmin(),
      onClose: () => {
        this.dialogOpen = false;
      },
      slotDefault: () => (
        <>
          <VAlert class="mb-4" density="compact" type="warning">
            {locale.GrantSystemAdminDescription()}
          </VAlert>
          <ZForm<GrantSystemAdminData>
            formTag="div"
            controllerRef={ref => {
              formRef = ref;
            }}
            data={{ password: '', reason: '' }}
            schema={schema}
            formMeta={formMetaFromFormScene('edit')}
            onSubmitData={async data => {
              const modelUser = (await ctx.bean._getBean(
                'admin-user.model.user',
                true,
              )) as ModelUser;
              await modelUser.grantSystemAdmin(userId).mutateAsync(data.value);
              dialog.close();
            }}
            onShowError={async ({ error }) => {
              await $host.$performCommand('start-commands:alert', {
                type: 'error',
                text: error.message,
              });
            }}
          >
            <ZFormFieldPreset
              name="password"
              render="start-input:formFieldInput"
              options={{ type: 'password', autocomplete: 'current-password' }}
            ></ZFormFieldPreset>
            <ZFormFieldPreset
              name="reason"
              render="start-input:formFieldInput"
              options={{ type: 'text' }}
            ></ZFormFieldPreset>
          </ZForm>
        </>
      ),
      slotActions: modal => {
        const isSubmitting = formRef?.formState.isSubmitting ?? false;
        return (
          <>
            <VBtn variant="text" disabled={isSubmitting} nativeOnClick={() => modal.close()}>
              {locale.Cancel()}
            </VBtn>
            <VBtn
              color="error"
              loading={isSubmitting}
              disabled={isSubmitting}
              nativeOnClick={async () => {
                await formRef?.submit();
              }}
            >
              {locale.ConfirmGrantSystemAdmin()}
            </VBtn>
          </>
        );
      },
    });
  }

  private _createFormSchema(
    locale: ReturnType<ControllerActionGrantSystemAdmin['_getLocale']>,
  ): SchemaObject {
    return {
      type: 'object',
      required: ['password', 'reason'],
      properties: {
        password: {
          type: 'string',
          minLength: 1,
          maxLength: 1024,
          title: locale.CurrentPassword(),
        },
        reason: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          title: locale.OperationalReason(),
        },
      },
    };
  }
}
