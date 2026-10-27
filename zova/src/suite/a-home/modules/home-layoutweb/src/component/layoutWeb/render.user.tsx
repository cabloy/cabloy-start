import { VAvatar, VBtn, VList, VListItem, VMenu } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-start-button';
import { resolveImagePreviewUrl } from 'zova-module-start-image';

@Render()
export class RenderUser extends BeanRenderBase {
  public render() {
    return <ClientOnly>{this._renderClientUser()}</ClientOnly>;
  }

  private _renderClientUser() {
    if (!this.$passport.isAuthenticated) {
      return (
        <VBtn variant="text" nativeOnClick={() => this.app.$gotoLogin(true)}>
          {this.scope.locale.Login()}
        </VBtn>
      );
    }
    const slots = {
      activator: ({ props }) => (
        <VBtn
          {...props}
          variant="text"
          v-slots={{
            prepend: () => (
              <VAvatar
                image={
                  resolveImagePreviewUrl(
                    this.$passport.user?.avatar,
                    this.sys.config.api.baseURL,
                  ) || this.$scopeBase.config.avatar.empty
                }
                size={24}
              />
            ),
          }}
        >
          {this.$passport.displayName}
        </VBtn>
      ),
    };
    return (
      <VMenu eager v-slots={slots}>
        <VList>
          <VListItem
            title={this.scope.locale.AccountSettings()}
            onClick={() => this.app.$gotoPage('/home/user/account')}
          />
          <VListItem>
            <ZButton
              block
              variant="text"
              class="justify-start text-none"
              onPerform={async () => {
                await this.$passport.logout().mutateAsync();
              }}
            >
              {this.scope.locale.Logout()}
            </ZButton>
          </VListItem>
        </VList>
      </VMenu>
    );
  }
}
