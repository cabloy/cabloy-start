import { VBtn, VAvatar, VList, VListItem, VMenu } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-start-button';
import { resolveImagePreviewUrl } from 'zova-module-start-image';

@Render()
export class RenderUser extends BeanRenderBase {
  public render() {
    const slots = {
      activator: ({ props }) => (
        <VBtn
          {...props}
          class="header-action header-account"
          data-header-action="account"
          variant="text"
          aria-label={this.scope.locale.Account()}
          title={this.scope.locale.Account()}
          v-slots={{
            prepend: () => (
              <ClientOnly
                v-slots={{
                  placeholder: () => (
                    <VAvatar image={this.$scopeBase.config.avatar.empty} size={24} />
                  ),
                  default: () => (
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
              />
            ),
          }}
        >
          <span class="header-account-name">
            <ClientOnly
              v-slots={{
                placeholder: () => '',
                default: () =>
                  this.$passport.isAuthenticated
                    ? this.$passport.displayName
                    : this.scope.locale.NotLoggedIn(),
              }}
            />
          </span>
        </VBtn>
      ),
    };
    return (
      <VMenu eager {...this.getHeaderMenuProps('account')} v-slots={slots}>
        <ClientOnly>
          <VList>
            {this.$passport.isAuthenticated ? (
              <>
                <VListItem
                  title={this.scope.locale.AccountSettings()}
                  to={this.$router.getPagePath('/home/user/account')}
                  onClick={() => {
                    this.closeHeaderActions(true);
                  }}
                />
                <VListItem>
                  <ZButton
                    block
                    variant="text"
                    class="justify-start text-none"
                    onPerform={async () => {
                      this.closeHeaderActions(true);
                      await this.$passport.logout().mutateAsync();
                    }}
                  >
                    {this.scope.locale.Logout()}
                  </ZButton>
                </VListItem>
              </>
            ) : (
              <VListItem
                title={this.scope.locale.Login()}
                to={this.app.$getPagePathLogin(true)}
                onClick={() => {
                  this.closeHeaderActions(true);
                }}
              />
            )}
          </VList>
        </ClientOnly>
      </VMenu>
    );
  }
}
