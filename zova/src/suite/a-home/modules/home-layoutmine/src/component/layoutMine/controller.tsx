import { BeanControllerBase, Use, usePrepareArg } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { IServiceSsrLayoutOptions, ServiceSsrLayout } from 'zova-module-home-base';

@Controller()
export class ControllerLayoutMine extends BeanControllerBase {
  mobileMenuOpen = false;
  headerActionsOpen = false;
  headerActionsId = 'home-layoutmine-header-actions';
  headerMenu = '';
  private _headerActionsElement?: HTMLDivElement;
  private _headerOutsideHandler?: (event: PointerEvent | FocusEvent) => void;
  private _headerKeydownHandler?: (event: KeyboardEvent) => void;
  private _windowResizeHandler?: () => void;

  @Use({ beanFullName: 'home-base.service.ssrLayout' })
  get $$serviceSsrLayout(): ServiceSsrLayout {
    return usePrepareArg({
      bodyReadyObserver: false,
      sidebarLeftOpenPCCapability: false,
    } satisfies IServiceSsrLayoutOptions);
  }

  protected async __init__() {
    if (process.env.CLIENT) {
      this._windowResizeHandler = () => this.closeHeaderActions();
      this._headerOutsideHandler = event => {
        if (!this.isHeaderActionsTarget(event.target)) this.closeHeaderActions();
      };
      this._headerKeydownHandler = event => {
        if (
          event.key === 'Escape' &&
          !event.defaultPrevented &&
          this.headerActionsOpen &&
          !this.headerMenu &&
          this.isHeaderActionsTarget(event.target) &&
          !(event.target instanceof Element && event.target.closest('[role="dialog"]'))
        ) {
          event.preventDefault();
          this.closeHeaderActions(true);
        }
      };
      window.addEventListener('resize', this._windowResizeHandler);
      document.addEventListener('pointerdown', this._headerOutsideHandler);
      document.addEventListener('focusin', this._headerOutsideHandler);
      document.addEventListener('keydown', this._headerKeydownHandler);
    }
    this.$watch(
      () => this.$currentRoute?.fullPath,
      () => {
        this.mobileMenuOpen = false;
        this.closeHeaderActions();
        this.$logger.debug('layout.mine.navigation completed');
      },
    );
  }

  protected __dispose__() {
    this._headerActionsElement = undefined;
    if (this._headerOutsideHandler) {
      document.removeEventListener('pointerdown', this._headerOutsideHandler);
      document.removeEventListener('focusin', this._headerOutsideHandler);
      document.removeEventListener('keydown', this._headerKeydownHandler!);
    }
    if (this._windowResizeHandler) {
      window.removeEventListener('resize', this._windowResizeHandler);
    }
  }

  toggleMobileMenu() {
    this.closeHeaderActions();
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  setHeaderActionsElement(element?: HTMLDivElement) {
    this._headerActionsElement = element;
  }

  toggleHeaderActions() {
    if (this.headerActionsOpen) {
      this.closeHeaderActions();
    } else {
      this.mobileMenuOpen = false;
      this.headerActionsOpen = true;
    }
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

  private _getMcpMenuGroup() {
    if (!this.$passport.roles?.some(role => role.mcpAccess === true)) return;
    return {
      title: 'MCP',
      items: [
        { path: '/cabloy/mcp/scopes', title: this.scope.locale.McpScopes() },
        { path: '/cabloy/mcp/authorizations', title: this.scope.locale.McpAuthorizations() },
        { path: '/cabloy/mcp/accessTokens', title: this.scope.locale.McpAccessTokens() },
      ],
    };
  }

  get menuGroups() {
    const mcpMenuGroup = this._getMcpMenuGroup();
    const groups = [
      {
        title: undefined,
        items: [{ path: '/home/user/account', title: this.scope.locale.AccountSettings() }],
      },
      ...(mcpMenuGroup ? [mcpMenuGroup] : []),
    ];
    return groups
      .map(group => ({
        ...group,
        items: group.items
          .filter(item => this.$router.checkPathValid(item.path))
          .map(item => ({ ...item, href: this.$router.getPagePath(item.path as never) })),
      }))
      .filter(group => group.items.length > 0);
  }
}
