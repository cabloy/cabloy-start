import { VBtn, VAvatar, VList, VListItem, VMenu } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-start-button';
import { resolveImagePreviewUrl } from 'zova-module-start-image';

@Render()
export class RenderUser extends BeanRenderBase {
  public render() {
    const slots = {
      activator: ({ props }) => {
        return (
          <VBtn
            {...props}
            class="header-action header-account"
            data-header-action="account"
            aria-label={this.scope.locale.Account()}
            title={this.scope.locale.Account()}
            density="default"
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
                  size={18}
                />
              ),
            }}
          >
            {this.$passport.displayName}
          </VBtn>
        );
      },
    };
    return (
      <VMenu eager {...this.getHeaderMenuProps('account')} v-slots={slots}>
        <ClientOnly>
          <VList>
            <VListItem
              title={this.scope.locale.AccountSettings()}
              href={this.$router.getPagePath('/home/user/account')}
              onClick={event => {
                this.closeHeaderActions(true);
                if (
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                ) {
                  return;
                }
                event.preventDefault();
                this.app.$gotoPage('/home/user/account');
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
          </VList>
        </ClientOnly>
      </VMenu>
    );
  }
}
