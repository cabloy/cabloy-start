import type { ApiApiHomeUserAccountconsumePasswordResetRequestBody } from 'zova-module-home-api';

import { SchemaObject } from 'openapi3-ts/oas31';
import { VAlert, VBtn, VCard, VCardText, VCardTitle, VContainer } from 'vuetify/components';
import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { TypeFormOnSubmitData, ZForm } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';

import { ModelAccount } from '../../model/account.js';

type PasswordResetFormData = Omit<ApiApiHomeUserAccountconsumePasswordResetRequestBody, 'token'>;

export const ControllerPagePasswordResetSchemaQuery = z.object({
  token: z.preprocess(
    value => (typeof value === 'string' ? value : undefined),
    z.string().optional(),
  ),
});

@Controller()
export class ControllerPagePasswordReset extends BeanControllerPageBase {
  @Use()
  $$modelAccount: ModelAccount;

  private token?: string;
  tokenReady = false;
  submitted = false;
  schemaPasswordReset?: SchemaObject;
  passwordReset: PasswordResetFormData = { newPassword: '', passwordConfirm: '' };

  get apiSchemasPasswordReset() {
    return this.$apiSchema.homeUserAccount.consumePasswordReset({ authToken: false });
  }

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.apiSchemasPasswordReset.sdk);
    this.schemaPasswordReset = this.$computed(() =>
      omitSchemaProperty(this.apiSchemasPasswordReset.requestBody, 'token'),
    );
    this.ctx.meta.$ssr.handleDirectOrOnHydrated(async () => {
      await this._captureQueryToken();
    });
  }

  async submitPasswordReset(data: TypeFormOnSubmitData<PasswordResetFormData>) {
    if (!this.token || this.submitted) return;
    const result = await this.$$modelAccount
      .consumePasswordReset()
      .mutateAsync({ token: this.token, ...data.value });
    this.token = undefined;
    if (result.requiresRelogin) {
      this.submitted = true;
      await this.$passport.requireRelogin(false);
    }
  }

  private async _captureQueryToken() {
    this.token = this.$query.token || undefined;
    try {
      await this.$router.replace(this.$router.getPagePath('/home/user/password-reset'));
    } finally {
      this.tokenReady = true;
    }
  }

  protected render() {
    return (
      <ZPage>
        <VContainer class="py-6" style={{ maxWidth: '560px' }}>
          <VCard>
            <VCardTitle>{this.scope.locale.AccountResetPassword()}</VCardTitle>
            <VCardText class="d-flex flex-column ga-4">{this._renderContent()}</VCardText>
          </VCard>
        </VContainer>
      </ZPage>
    );
  }

  private _renderContent() {
    if (!this.tokenReady) {
      return <p>{this.scope.locale.AccountPasswordResetPreparing()}</p>;
    }
    if (!this.token) {
      return <VAlert type="error">{this.scope.locale.AccountPasswordResetInvalid()}</VAlert>;
    }
    if (this.submitted) {
      return <VAlert type="success">{this.scope.locale.AccountPasswordResetCompleted()}</VAlert>;
    }
    return (
      <>
        <p>{this.scope.locale.AccountResetPasswordPublicHelp()}</p>
        <ZForm
          data={this.passwordReset}
          schema={this.schemaPasswordReset}
          onSubmitData={data => this.submitPasswordReset(data)}
          onShowError={() => {
            return this.$performCommand('start-commands:alert', {
              type: 'error',
              text: this.scope.locale.AccountPasswordResetInvalid(),
            });
          }}
          slotFooter={$$form => (
            <VBtn disabled={$$form.formState.isSubmitting} type="submit" color="primary">
              {this.scope.locale.AccountResetPassword()}
            </VBtn>
          )}
        />
      </>
    );
  }
}

function omitSchemaProperty(schema: SchemaObject | undefined, property: string) {
  if (!schema) return;
  const { [property]: _, ...properties } = schema.properties ?? {};
  return { ...schema, properties, required: schema.required?.filter(item => item !== property) };
}
