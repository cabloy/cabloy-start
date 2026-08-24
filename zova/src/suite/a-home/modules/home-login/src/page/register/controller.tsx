import { SchemaObject } from 'openapi3-ts/oas31';
import { VAlert, VBtn, VCard, VCardText, VCardTitle, VContainer } from 'vuetify/components';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { TypeFormOnSubmitData, ZForm } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ApiApiHomeUserPassportregisterRequestBody } from 'zova-module-home-api';

@Controller()
export class ControllerPageRegister extends BeanControllerPageBase {
  submitted = false;
  schemaRegister?: SchemaObject;
  user: ApiApiHomeUserPassportregisterRequestBody = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    captcha: {
      id: '',
      token: '',
    },
    consumerUrl: '',
  };

  get apiSchemasRegister() {
    return this.$apiSchema.homeUserPassport.register({ authToken: false });
  }

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.apiSchemasRegister.sdk);
    this.schemaRegister = this.$computed(() => {
      return omitSchemaProperty(this.apiSchemasRegister.requestBody, 'consumerUrl');
    });
  }

  async submitRegister(data: TypeFormOnSubmitData<ApiApiHomeUserPassportregisterRequestBody>) {
    const consumerUrl = this.$router.getPagePath('/home/user/activation', undefined, true);
    if (!consumerUrl) throw new Error('activation consumer route is unavailable');
    const result = await this.$api.homeUserPassport.register(
      { ...data.value, consumerUrl },
      { authToken: false },
    );
    if (this.$passport.isPassportSiteAdmitted(result.passport)) {
      this.$passport.afterLogin(result);
      return;
    }
    this.submitted = true;
  }

  gotoLogin() {
    return this.app.$gotoPage('/home/login', {
      query: { [this.sys.env.ROUTER_KEY_RETURNTO]: this.app.$getReturnTo() },
    });
  }

  protected render() {
    return (
      <VContainer class="py-6 d-flex align-center" style={{ minHeight: '100vh' }}>
        <VCard class="mx-auto" style={{ width: '100%', maxWidth: '560px' }}>
          <VCardTitle>{this.scope.locale.Register()}</VCardTitle>
          <VCardText class="d-flex flex-column ga-4">
            <p>{this.scope.locale.RegisterHelp()}</p>
            {this.submitted ? (
              <>
                <VAlert type="success">{this.scope.locale.RegisterActivationPending()}</VAlert>
                <VBtn color="primary" nativeOnClick={() => this.gotoLogin()}>
                  {this.scope.locale.BackToLogin()}
                </VBtn>
              </>
            ) : (
              <>
                <ZForm
                  data={this.user}
                  schema={this.schemaRegister}
                  onSubmitData={data => this.submitRegister(data)}
                  onShowError={async ({ error }) => {
                    await this.$performCommand('start-commands:alert', {
                      type: 'error',
                      text: error.message,
                    });
                  }}
                  slotFooter={$$form => (
                    <VBtn disabled={$$form.formState.isSubmitting} type="submit" color="primary">
                      {this.scope.locale.Register()}
                    </VBtn>
                  )}
                />
                <div class="d-flex align-center justify-center ga-2">
                  <span>{this.scope.locale.AlreadyHaveAccount()}</span>
                  <VBtn variant="text" nativeOnClick={() => this.gotoLogin()}>
                    {this.scope.locale.Login()}
                  </VBtn>
                </div>
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
