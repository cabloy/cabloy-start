import { VApp, VBtn, VList, VListItem, VMain, VMenu } from 'vuetify/components';
import { BeanControllerBase, ClientOnly, Use, usePrepareArg } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $iconName } from 'zova-module-a-icon';
import { ZRouterViewEmpty } from 'zova-module-a-router';
import { IServiceSsrLayoutOptions, ServiceSsrLayout } from 'zova-module-home-base';

export interface ControllerLayoutEmptyProps {}

@Controller()
export class ControllerLayoutEmpty extends BeanControllerBase {
  static $propsDefault = {};

  @Use({ beanFullName: 'home-base.service.ssrLayout' })
  get $$serviceSsrLayout(): ServiceSsrLayout {
    const sidebar = this.scope.config.layout.sidebar;
    return usePrepareArg({
      bodyReadyObserver: sidebar.bodyReadyObserver,
      sidebarLeftOpenPCCapability: sidebar.leftOpenPCCapability,
    } satisfies IServiceSsrLayoutOptions);
  }

  protected renderLocale() {
    const currentRoute = this.$currentRoute;
    const metaLocale = currentRoute?.meta?.locale;
    const locales = this.app.meta.locale.getItems(currentRoute?.meta?.locales);
    const slots = {
      activator: ({ props }) => {
        return (
          <VBtn
            icon={$iconName('::language')}
            variant="text"
            aria-label="Language"
            {...props}
          ></VBtn>
        );
      },
    };
    return (
      <VMenu v-slots={slots} location="bottom end">
        <ClientOnly>
          <VList>
            {Object.keys(locales).map(key => {
              const title = this.$scopeBase.locale[locales[key]]();
              return (
                <VListItem
                  key={key}
                  value={key}
                  title={title}
                  disabled={this.app.meta.locale.current === key}
                  prependIcon={$iconName(
                    this.app.meta.locale.current === key ? '::done' : '::none',
                  )}
                  onClick={() => {
                    if (metaLocale) {
                      this.app.$gotoPage(currentRoute.matched[0].path, {
                        params: { ...currentRoute.params, locale: key },
                        query: currentRoute.query,
                      });
                    } else {
                      this.app.meta.locale.current = key as any;
                    }
                  }}
                ></VListItem>
              );
            })}
          </VList>
        </ClientOnly>
      </VMenu>
    );
  }

  protected render() {
    return (
      <VApp>
        <VMain style={{ transition: 'none' }}>
          <ZRouterViewEmpty></ZRouterViewEmpty>
        </VMain>
        <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50 }}>
          {this.renderLocale()}
        </div>
      </VApp>
    );
  }
}
