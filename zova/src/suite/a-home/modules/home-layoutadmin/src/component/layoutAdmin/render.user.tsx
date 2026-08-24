import { VAvatar, VBtn, VList, VListItem, VMenu } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { resolveImagePreviewUrl } from 'zova-module-start-image';

@Render()
export class RenderUser extends BeanRenderBase {
  public render() {
    const slots = {
      activator: ({ props }) => {
        return (
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
        );
      },
    };
    return (
      <VMenu v-slots={slots}>
        <ClientOnly>
          <VList>
            <VListItem
              title={this.scope.locale.AccountSettings()}
              nativeOnClick={() => {
                window.location.assign(
                  this.$router.getPagePath('/home/user/account', undefined, true),
                );
              }}
            />
            <VListItem
              title={this.scope.locale.Logout()}
              nativeOnClick={() => this.$passport.logout().mutate()}
            />
          </VList>
        </ClientOnly>
      </VMenu>
    );
  }
}
