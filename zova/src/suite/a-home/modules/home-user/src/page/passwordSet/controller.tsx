import type { ApiApiHomeUserAccountconsumePasswordSetRequestBody } from 'zova-module-home-api';

import { SchemaObject } from 'openapi3-ts/oas31';
import { VAlert, VBtn, VCard, VCardText, VCardTitle, VContainer } from 'vuetify/components';
import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { TypeFormOnSubmitData, ZForm } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';

import { ModelAccount } from '../../model/account.js';

type PasswordSetFormData = Omit<ApiApiHomeUserAccountconsumePasswordSetRequestBody, 'token'>;

export const ControllerPagePasswordSetSchemaQuery = z.object({
  token: z.preprocess(
    value => (typeof value === 'string' ? value : undefined),
    z.string().optional(),
  ),
});

@Controller()
export class ControllerPagePasswordSet extends BeanControllerPageBase {
  @Use()
  $$modelAccount: ModelAccount;

  private token?: string;
  tokenReady = false;
  submitted = false;
  schemaPasswordSet?: SchemaObject;
  passwordSet: PasswordSetFormData = { newPassword: '', passwordConfirm: '' };

  get apiSchemasPasswordSet() {
    return this.$apiSchema.homeUserAccount.consumePasswordSet({ authToken: false });
  }

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.apiSchemasPasswordSet.sdk);
    this.schemaPasswordSet = this.$computed(() =>
      omitSchemaProperty(this.apiSchemasPasswordSet.requestBody, 'token'),
    );
    this.ctx.meta.$ssr.handleDirectOrOnHydrated(async () => {
      await this._captureQueryToken();
    });
  }

  async submitPasswordSet(data: TypeFormOnSubmitData<PasswordSetFormData>) {
    if (!this.token || this.submitted) return;
    const result = await this.$$modelAccount
      .consumePasswordSet()
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
      await this.$router.replace(this.$router.getPagePath('/home/user/password-set'));
    } finally {
      this.tokenReady = true;
    }
  }

  protected render() {
    return (
      <ZPage>
        <VContainer class="py-6" style={{ maxWidth: '560px' }}>
          <VCard>
            <VCardTitle>{this.scope.locale.AccountSetPassword()}</VCardTitle>
            <VCardText class="d-flex flex-column ga-4">{this._renderContent()}</VCardText>
          </VCard>
        </VContainer>
      </ZPage>
    );
  }

  private _renderContent() {
    if (!this.tokenReady) {
      return <p>{this.scope.locale.AccountPasswordSetPreparing()}</p>;
    }
    if (!this.token) {
      return <VAlert type="error">{this.scope.locale.AccountPasswordSetInvalid()}</VAlert>;
    }
    if (this.submitted) {
      return <VAlert type="success">{this.scope.locale.AccountPasswordSetCompleted()}</VAlert>;
    }
    return (
      <>
        <p>{this.scope.locale.AccountSetPasswordPublicHelp()}</p>
        <ZForm
          data={this.passwordSet}
          schema={this.schemaPasswordSet}
          onSubmitData={data => this.submitPasswordSet(data)}
          onShowError={() => {
            return this.$performCommand('start-commands:alert', {
              type: 'error',
              text: this.scope.locale.AccountPasswordSetInvalid(),
            });
          }}
          slotFooter={$$form => (
            <VBtn disabled={$$form.formState.isSubmitting} type="submit" color="primary">
              {this.scope.locale.AccountSetPassword()}
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
