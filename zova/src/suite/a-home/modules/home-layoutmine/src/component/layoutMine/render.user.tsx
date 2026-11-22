import { VBtn, VAvatar, VList, VListItem, VMenu } from 'vuetify/components';
import { BeanRenderBase } from 'zova';
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
          <span class="header-account-name">
            {this.$passport.isAuthenticated
              ? this.$passport.displayName
              : this.scope.locale.NotLoggedIn()}
          </span>
        </VBtn>
      ),
    };
    return (
      <VMenu eager {...this.getHeaderMenuProps('account')} v-slots={slots}>
        <VList>
          {this.$passport.isAuthenticated ? (
            <>
              <VListItem
                title={this.scope.locale.AccountSettings()}
                to={this.$router.getPagePath('/home/user/account')}
                activeClass="text-primary"
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
              activeClass="text-primary"
              onClick={() => {
                this.closeHeaderActions(true);
              }}
            />
          )}
        </VList>
      </VMenu>
    );
  }
}
