import { VAvatar, VBtn, VList, VListItem, VMenu } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
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
          {this.$passport.user?.name}
        </VBtn>
      ),
    };
    return (
      <VMenu v-slots={slots}>
        <VList>
          <VListItem
            title={this.scope.locale.AccountSettings()}
            nativeOnClick={() => this.app.$gotoPage('/home/user/account')}
          />
          <VListItem
            title={this.scope.locale.Logout()}
            nativeOnClick={() => this.$passport.logout().mutate()}
          />
        </VList>
      </VMenu>
    );
  }
}
