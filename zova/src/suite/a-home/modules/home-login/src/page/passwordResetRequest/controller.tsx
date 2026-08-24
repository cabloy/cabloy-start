import type { ApiApiHomeUserAccountrequestPasswordResetRequestBody } from 'zova-module-home-api';

import { SchemaObject } from 'openapi3-ts/oas31';
import { VAlert, VBtn, VCard, VCardText, VCardTitle, VContainer } from 'vuetify/components';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZForm, ZFormFieldBlank, ZFormFieldPreset, TypeFormOnSubmitData } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ModelAccount } from 'zova-module-home-user';

@Controller()
export class ControllerPagePasswordResetRequest extends BeanControllerPageBase {
  @Use()
  $$modelAccount: ModelAccount;

  submitted = false;
  schema?: SchemaObject;
  request: Omit<ApiApiHomeUserAccountrequestPasswordResetRequestBody, 'consumerUrl'> = {
    email: '',
    captcha: {
      id: '',
      token: '',
    },
  };

  get apiSchemasPasswordResetRequest() {
    return this.$apiSchema.homeUserAccount.requestPasswordReset({ authToken: false });
  }

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.apiSchemasPasswordResetRequest.sdk);
    this.schema = this.$computed(() => {
      return omitSchemaProperty(this.apiSchemasPasswordResetRequest.requestBody, 'consumerUrl');
    });
  }

  async submitPasswordResetRequest(
    data: TypeFormOnSubmitData<
      Omit<ApiApiHomeUserAccountrequestPasswordResetRequestBody, 'consumerUrl'>
    >,
  ) {
    const consumerUrl = this.$router.getPagePath('/home/user/password-reset', undefined, true);
    if (!consumerUrl) throw new Error('password-reset consumer route is unavailable');
    await this.$$modelAccount.requestPasswordReset().mutateAsync({ ...data.value, consumerUrl });
    this.submitted = true;
  }

  gotoLogin() {
    return this.app.$gotoPage('/home/login');
  }

  protected render() {
    return (
      <VContainer class="py-6 d-flex align-center" style={{ minHeight: '100vh' }}>
        <VCard class="mx-auto" style={{ width: '100%', maxWidth: '560px' }}>
          <VCardTitle>{this.scope.locale.PasswordReset()}</VCardTitle>
          <VCardText class="d-flex flex-column ga-4">
            <p>{this.scope.locale.PasswordResetHelp()}</p>
            {this.submitted ? (
              <>
                <VAlert type="success">{this.scope.locale.PasswordResetRequestAccepted()}</VAlert>
                <VBtn color="primary" nativeOnClick={() => this.gotoLogin()}>
                  {this.scope.locale.BackToLogin()}
                </VBtn>
              </>
            ) : (
              <>
                <ZForm
                  data={this.request}
                  schema={this.schema}
                  onSubmitData={data => this.submitPasswordResetRequest(data)}
                  onShowError={async ({ error }) => {
                    await this.$performCommand('start-commands:alert', {
                      type: 'error',
                      text: error.message,
                    });
                  }}
                >
                  <ZFormFieldPreset
                    name="email"
                    render="start-input:formFieldInput"
                    options={{ type: 'email', placeholder: this.scope.locale.YourEmail() }}
                    layout={{ iconPrefix: ':daisy:person' }}
                  />
                  <ZFormFieldPreset
                    name="captcha"
                    render="start-captcha:formFieldCaptcha"
                    layout={{ iconPrefix: ':editor:code-block' }}
                  />
                  <ZFormFieldBlank
                    slotDefault={$$form => (
                      <VBtn disabled={$$form.formState.isSubmitting} type="submit" color="primary">
                        {this.scope.locale.PasswordReset()}
                      </VBtn>
                    )}
                  />
                </ZForm>
                <VBtn variant="text" nativeOnClick={() => this.gotoLogin()}>
                  {this.scope.locale.BackToLogin()}
                </VBtn>
              </>
            )}
          </VCardText>
        </VCard>
      </VContainer>
    );
  }
}

function omitSchemaProperty(schema: SchemaObject | undefined, property: string) {
  if (!schema) return;
  const { [property]: _, ...properties } = schema.properties ?? {};
  return {
    ...schema,
    properties,
    required: schema.required?.filter(item => item !== property),
  };
}
