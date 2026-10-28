import { VBtn, VList, VListItem, VMenu } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $iconName, ZIcon } from 'zova-module-a-icon';
import { ZButton } from 'zova-module-start-button';

@Render()
export class RenderLocale extends BeanRenderBase {
  public render() {
    const currentRoute = this.$currentRoute;
    const metaLocale = currentRoute?.meta?.locale;
    const locales = this.app.meta.locale.getItems(currentRoute?.meta?.locales);
    const slots = {
      activator: ({ props }) => {
        return (
          <VBtn
            {...props}
            class="header-action"
            data-header-action="locale"
            icon
            variant="text"
            aria-label={this.scope.locale.Language()}
            title={this.scope.locale.Language()}
          >
            <ZIcon name="::language" width={24} />
            <span class="header-action-label">{this.scope.locale.Language()}</span>
          </VBtn>
        );
      },
    };
    return (
      <VMenu {...this.getHeaderMenuProps('locale')} v-slots={slots}>
        <ClientOnly>
          <VList>
            {Object.keys(locales).map(key => {
              const title = this.$scopeBase.locale[locales[key]]();
              return (
                <VListItem key={key}>
                  <ZButton
                    block
                    variant="text"
                    class="justify-start text-none"
                    disabled={this.app.meta.locale.current === key}
                    prependIcon={$iconName(
                      this.app.meta.locale.current === key ? '::done' : '::none',
                    )}
                    onPerform={async () => {
                      this.closeHeaderActions(true);
                      if (metaLocale) {
                        const options = {
                          params: {
                            ...currentRoute.params,
                            locale: key === this.sys.config.locale.default ? '' : key,
                          },
                          query: currentRoute.query,
                        };
                        const name = this.$router.getRealRouteName(currentRoute.name);
                        const alias =
                          name && this.$router.getAliasPath(name as never, options as never);
                        // A query-only root alias must not resolve against the current path.
                        const target = alias?.startsWith('?') ? `/${alias}` : alias;
                        await this.app.$gotoPage(
                          target || currentRoute.matched[0].path,
                          target ? undefined : options,
                        );
                      } else {
                        this.app.meta.locale.current = key as any;
                      }
                    }}
                  >
                    {title}
                  </ZButton>
                </VListItem>
              );
            })}
          </VList>
        </ClientOnly>
      </VMenu>
    );
  }
}
