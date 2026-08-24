import { VAlert, VBtn, VCard, VCardText, VCardTitle, VContainer } from 'vuetify/components';
import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

import { ModelAccount } from '../../model/account.js';

export const ControllerPageActivationSchemaQuery = z.object({
  token: z.preprocess(
    value => (typeof value === 'string' ? value : undefined),
    z.string().optional(),
  ),
});

@Controller()
export class ControllerPageActivation extends BeanControllerPageBase {
  @Use()
  $$modelAccount: ModelAccount;

  private token?: string;
  tokenReady = false;
  completed = false;

  protected async __init__() {
    this.ctx.meta.$ssr.handleDirectOrOnHydrated(async () => {
      await this._consumeQueryToken();
    });
  }

  gotoLogin() {
    return this.app.$gotoPage('/home/login', {
      query: { [this.sys.env.ROUTER_KEY_RETURNTO]: this.app.$getReturnTo() },
    });
  }

  private async _consumeQueryToken() {
    this.token = this.$query.token || undefined;
    try {
      if (!this.token) return;
      await this.$$modelAccount.consumeActivation().mutateAsync({ token: this.token });
      this.completed = true;
    } catch {
      // Invalid and expired tokens intentionally share the same public state.
    } finally {
      this.token = undefined;
      await this.$router.replace(this.$router.getPagePath('/home/user/activation'));
      this.tokenReady = true;
    }
  }

  protected render() {
    return (
      <ZPage>
        <VContainer class="py-6" style={{ maxWidth: '560px' }}>
          <VCard>
            <VCardTitle>{this.scope.locale.AccountActivation()}</VCardTitle>
            <VCardText class="d-flex flex-column ga-4">
              {!this.tokenReady ? (
                <p>{this.scope.locale.AccountActivationPreparing()}</p>
              ) : this.completed ? (
                <VAlert type="success">{this.scope.locale.AccountActivationCompleted()}</VAlert>
              ) : (
                <VAlert type="error">{this.scope.locale.AccountActivationInvalid()}</VAlert>
              )}
              {this.tokenReady && (
                <VBtn color="primary" nativeOnClick={() => this.gotoLogin()}>
                  {this.scope.locale.AccountActivationBackToLogin()}
                </VBtn>
              )}
            </VCardText>
          </VCard>
        </VContainer>
      </ZPage>
    );
  }
}
