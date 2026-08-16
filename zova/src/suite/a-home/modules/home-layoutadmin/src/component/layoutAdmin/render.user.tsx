import { VAvatar, VBtn, VList, VListItem, VMenu } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';

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
                  image={this.$passport.user?.avatar || this.$scopeBase.config.avatar.empty}
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
              title={this.scope.locale.Logout()}
              onClick={() => {
                this.$passport.logout().mutate();
              }}
            ></VListItem>
          </VList>
        </ClientOnly>
      </VMenu>
    );
  }
}
