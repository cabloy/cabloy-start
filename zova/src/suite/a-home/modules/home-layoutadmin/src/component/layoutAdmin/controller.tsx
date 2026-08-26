import type { ModelTabs, ModelTabsOptions } from 'zova-module-a-routertabs';

import { provide, ref } from 'vue';
import { BeanControllerBase, Use, usePrepareArg } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { IServiceSsrLayoutOptions, ServiceSsrLayout } from 'zova-module-home-base';
import { ILayoutConfig } from 'zova-module-vuetify-adapter';

import { ModelLayout } from '../../model/layout.js';
import { ModelMenu } from '../../model/menu.js';

export interface ControllerLayoutAdminProps {}

@Controller()
export class ControllerLayoutAdmin extends BeanControllerBase {
  static $propsDefault = {};

  $$modelTabs: ModelTabs;

  @Use()
  $$modelMenu: ModelMenu;

  @Use()
  $$modelLayout: ModelLayout;

  @Use({ beanFullName: 'home-base.service.ssrLayout' })
  get $$serviceSsrLayout(): ServiceSsrLayout {
    const sidebar = this.scope.config.layout.sidebar;
    return usePrepareArg({
      bodyReadyObserver: sidebar.bodyReadyObserver,
      sidebarBreakpoint: sidebar.breakpoint,
      sidebarLeftOpenPCCapability: sidebar.leftOpenPCCapability,
      sidebarLeftOpenPCFallback: sidebar.leftOpenPCFallback,
    } satisfies IServiceSsrLayoutOptions);
  }

  layoutConfig: ILayoutConfig;
  layoutConfigTimeout: number = 0;

  leftDrawerOpen: boolean;
  leftDrawerOpenMobile: boolean = false;
  belowBreakpoint: boolean;
  private viewportWidth: number = 0;
  private _windowResizeHandler?: () => void;

  protected async __init__() {
    // viewport
    if (process.env.CLIENT) {
      this._windowResizeHandler = () => {
        this.viewportWidth = document.documentElement.clientWidth;
      };
      this._windowResizeHandler();
      window.addEventListener('resize', this._windowResizeHandler);
    }
    // belowBreakpoint
    this.belowBreakpoint = this.$computed(() => {
      return this.viewportWidth <= this.scope.config.layout.sidebar.breakpoint;
    });
    // leftDrawerOpen
    this.leftDrawerOpen = this.$customRef(() => {
      // eslint-disable-next-line
      const self = this;
      return {
        get() {
          return self.belowBreakpoint
            ? self.leftDrawerOpenMobile
            : self.$$modelLayout.leftDrawerOpenPC;
        },
        set(value) {
          if (self.belowBreakpoint) {
            self.leftDrawerOpenMobile = value;
          } else {
            self.$$modelLayout.leftDrawerOpenPC = value;
          }
        },
      };
    });
    // layoutConfig
    this.__initLayoutConfig();
    // passport
    if (process.env.SERVER) {
      await this.$passport.ensurePassport();
    }
    // menu
    await $QueryEnsureLoaded(() => this.$$modelMenu.retrieveMenus());
    // tabs
    await this._initTabs();
  }

  protected __dispose__() {
    if (this._windowResizeHandler) {
      window.removeEventListener('resize', this._windowResizeHandler);
    }
    if (this.layoutConfigTimeout) {
      window.clearTimeout(this.layoutConfigTimeout);
      this.layoutConfigTimeout = 0;
    }
  }

  toggleLeftDrawer() {
    this.leftDrawerOpen = !this.leftDrawerOpen;
  }

  private async _initTabs() {
    const configTabs = this.scope.config.tabs;
    const tabsOptions: ModelTabsOptions = {
      max: configTabs.max,
      maxItems: configTabs.maxItems,
      cache: configTabs.cache,
      getInitialTabs: () => {
        if (!this.$$modelMenu.retrieveMenus().data) return;
        return [{ tabKey: '/', affix: true }];
      },
      getTabInfo: tabKey => {
        const queryMenu = this.$$modelMenu.retrieveMenus();
        if (!queryMenu.data || queryMenu.isError) return undefined;
        const menuItem = this.$$modelMenu.findMenuItem({ link: tabKey });
        if (!menuItem) return undefined;
        return { title: menuItem.title, icon: menuItem.icon };
      },
    };
    this.$$modelTabs = await this.bean._getBeanSelector(
      'a-routertabs.model.tabs',
      true,
      configTabs.scene,
      tabsOptions,
    );
    // watch menus
    this.$watch(
      () => {
        return this.$$modelMenu.retrieveMenus().data;
      },
      () => {
        this.$$modelTabs.updateAllTabInfos();
      },
    );
  }

  private __initLayoutConfig() {
    this.layoutConfig = this.$scopeBase.config.layout;
    this.layoutConfig.leftDrawerOpen = this.leftDrawerOpen;
    if (process.env.SSR) {
      const layoutConfigRef = ref<ILayoutConfig | undefined>(this.layoutConfig);
      provide('VuetifyLayoutConfig', layoutConfigRef);
      if (process.env.CLIENT) {
        if (!this.layoutConfigTimeout) {
          this.layoutConfigTimeout = window.setTimeout(() => {
            this.layoutConfigTimeout = 0;
            layoutConfigRef.value = undefined;
          }, 100);
        }
      }
    }
  }
}
