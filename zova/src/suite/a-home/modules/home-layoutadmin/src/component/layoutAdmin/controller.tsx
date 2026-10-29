import type { ModelTabs, ModelTabsOptions } from 'zova-module-a-routertabs';

import { nextTick, provide, ref } from 'vue';
import { BeanControllerBase, Use, usePrepareArg } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { IServiceSsrLayoutOptions, ServiceSsrLayout } from 'zova-module-home-base';
import { ILayoutConfig } from 'zova-module-vuetify-adapter';

import { ModelLayout } from '../../model/layout.ts';
import { ModelMenu } from '../../model/menu.ts';

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
      sidebarWidth: sidebar.width,
      navbarHeight: this.scope.config.layout.navbar.height,
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

  headerActionsOpen = false;
  headerActionsId = 'home-layoutadmin-header-actions';
  headerMenu = '';
  private _headerActionsElement?: HTMLDivElement;
  private _headerOutsideHandler?: (event: PointerEvent | FocusEvent) => void;
  private _headerKeydownHandler?: (event: KeyboardEvent) => void;

  tabItemsWidth: number | undefined = undefined;
  tabItemsOverflowStart = false;
  tabItemsOverflowEnd = false;
  tabItemsMenuOpen = false;
  private _tabItemsElement?: HTMLDivElement;
  private _tabItemsObserver?: ResizeObserver;
  private _tabItemsMounted = false;
  private readonly _tabItemsOnScroll = () => this.measureTabItems();

  get tabItemsCompact() {
    return this.tabItemsWidth !== undefined && this.tabItemsWidth < 240;
  }

  protected async __init__() {
    this.$controllerMounted(() => {
      this.$ssr.handleDirectOrOnHydrated(() => {
        if (this.ctx.disposed) return;
        this._tabItemsMounted = true;
        this.observeTabItems();
      });
    });
    this.$watch(
      () => [
        this.$$modelTabs?.tabKeyCurrent,
        this.$$modelTabs?.tabCurrent?.items,
        this.tabItemsCompact,
      ],
      ([tabKey], [previousTabKey]) => {
        if (tabKey !== previousTabKey) this.tabItemsMenuOpen = false;
        void nextTick(() => this.observeTabItems());
      },
    );
    // viewport
    if (process.env.CLIENT) {
      this._windowResizeHandler = () => {
        this.viewportWidth = document.documentElement.clientWidth;
        this.closeHeaderActions();
        this.tabItemsMenuOpen = false;
      };
      this._windowResizeHandler();
      window.addEventListener('resize', this._windowResizeHandler);
      this._headerOutsideHandler = event => {
        if (!this.isHeaderActionsTarget(event.target)) this.closeHeaderActions();
      };
      this._headerKeydownHandler = event => {
        if (event.key === 'Escape' && !event.defaultPrevented && this.tabItemsMenuOpen) {
          event.preventDefault();
          this.closeTabItemsMenu();
          return;
        }
        if (
          event.key === 'Escape' &&
          !event.defaultPrevented &&
          this.headerActionsOpen &&
          !this.headerMenu &&
          this.isHeaderActionsTarget(event.target)
        ) {
          event.preventDefault();
          this.closeHeaderActions(true);
        }
      };
      document.addEventListener('pointerdown', this._headerOutsideHandler);
      document.addEventListener('focusin', this._headerOutsideHandler);
      document.addEventListener('keydown', this._headerKeydownHandler);
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

  setTabItemsElement(element?: HTMLDivElement) {
    if (element === this._tabItemsElement) return;
    this._tabItemsObserver?.disconnect();
    this._tabItemsElement?.removeEventListener('scroll', this._tabItemsOnScroll, true);
    this._tabItemsElement = element;
    element?.addEventListener('scroll', this._tabItemsOnScroll, true);
    this.observeTabItems();
  }

  closeTabItemsMenu() {
    this.tabItemsMenuOpen = false;
    void nextTick(() => {
      this._tabItemsElement
        ?.querySelector<HTMLButtonElement>('[data-testid="tab-items-more"]')
        ?.focus();
    });
  }

  private observeTabItems() {
    const element = this._tabItemsElement;
    if (!this._tabItemsMounted || this.ctx.disposed || !element) return;
    this._tabItemsObserver?.disconnect();
    this._tabItemsObserver = new ResizeObserver(() => this.measureTabItems());
    this._tabItemsObserver.observe(element);
    const content = element.querySelector('.v-slide-group__content');
    if (content) this._tabItemsObserver.observe(content);
    this.measureTabItems();
  }

  private measureTabItems() {
    const element = this._tabItemsElement;
    if (this.ctx.disposed || !element) return;
    this.tabItemsWidth = element.clientWidth;
    const container = element.querySelector('.v-slide-group__container');
    const content = element.querySelector('.v-slide-group__content');
    const bounds = container?.getBoundingClientRect();
    const items = content?.getBoundingClientRect();
    this.tabItemsOverflowStart = !!bounds && !!items && items.left < bounds.left - 1;
    this.tabItemsOverflowEnd = !!bounds && !!items && items.right > bounds.right + 1;
  }

  protected __dispose__() {
    this._tabItemsMounted = false;
    this.setTabItemsElement(undefined);
    this._headerActionsElement = undefined;
    if (this._headerOutsideHandler) {
      document.removeEventListener('pointerdown', this._headerOutsideHandler);
      document.removeEventListener('focusin', this._headerOutsideHandler);
      document.removeEventListener('keydown', this._headerKeydownHandler!);
    }
    if (this._windowResizeHandler) {
      window.removeEventListener('resize', this._windowResizeHandler);
    }
    if (this.layoutConfigTimeout) {
      window.clearTimeout(this.layoutConfigTimeout);
      this.layoutConfigTimeout = 0;
    }
  }

  setHeaderActionsElement(element?: HTMLDivElement) {
    this._headerActionsElement = element;
  }

  toggleHeaderActions() {
    if (this.headerActionsOpen) this.closeHeaderActions();
    else this.headerActionsOpen = true;
  }

  closeHeaderActions(restoreFocus = false) {
    const wasOpen = this.headerActionsOpen;
    this.headerActionsOpen = false;
    this.headerMenu = '';
    if (restoreFocus && wasOpen) {
      this._headerActionsElement
        ?.querySelector<HTMLButtonElement>('[data-testid="header-actions-more"]')
        ?.focus();
    }
  }

  getHeaderMenuProps(key: string) {
    return {
      'modelValue': this.headerMenu === key,
      'onUpdate:modelValue': (open: boolean) => {
        if (open) this.headerMenu = key;
        else if (this.headerMenu === key) this.headerMenu = '';
      },
      'transition': false as const,
      'location': 'bottom end' as const,
      'maxWidth': 'calc(100vw - 1rem)',
      'maxHeight': 'calc(100dvh - 5rem)',
      'contentProps': { 'data-header-actions-owner': this.headerActionsId },
    };
  }

  private isHeaderActionsTarget(target: EventTarget | null) {
    return (
      target instanceof Node &&
      (this._headerActionsElement?.contains(target) ||
        (target instanceof Element &&
          target
            .closest('[data-header-actions-owner]')
            ?.getAttribute('data-header-actions-owner') === this.headerActionsId))
    );
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
    this.layoutConfig = {
      ...this.scope.config.layout,
      leftDrawerOpen: this.leftDrawerOpen,
    };
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
