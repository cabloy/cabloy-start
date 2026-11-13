import { RouterLink } from '@cabloy/vue-router';
import { classes } from 'typestyle';
import { VApp, VAppBar, VBtn, VMain, VToolbarTitle } from 'vuetify/components';
import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZIcon } from 'zova-module-a-icon';
import { ZRouterViewEmpty } from 'zova-module-a-router';
import { ZButton } from 'zova-module-start-button';

import { RenderLocale } from './render.locale.tsx';
import { RenderTheme } from './render.theme.tsx';
import { RenderUser } from './render.user.tsx';

@Render()
export class RenderLayoutMine extends BeanRenderBase {
  @Use()
  $$renderLocale: RenderLocale;

  @Use()
  $$renderTheme: RenderTheme;

  @Use()
  $$renderUser: RenderUser;

  public render() {
    return (
      <VApp class={this.cLayout} data-testid="layout-mine">
        <VAppBar class={this.cHeader} height={64} style={{ transition: 'none' }}>
          <VBtn
            icon
            variant="text"
            href={this.app.$getPagePathHome()}
            aria-label={this.scope.locale.Home()}
          >
            <ZIcon name=":social:cabloy" width={24} />
          </VBtn>
          <VToolbarTitle>{this.sys.env.APP_TITLE}</VToolbarTitle>
          <VBtn variant="text" href={this.app.$getPagePathHome()}>
            {this.scope.locale.Home()}
          </VBtn>
          <ZButton
            data-testid="mine-menu-toggle"
            class="mine-menu-toggle"
            variant="text"
            aria-expanded={this.mobileMenuOpen}
            aria-controls="home-layoutmine-navigation"
            onPerform={() => this.toggleMobileMenu()}
          >
            {this.scope.locale.PersonalCenter()}
          </ZButton>
          <div
            ref={ref => {
              if (!this.ctx.disposed)
                this.setHeaderActionsElement?.((ref as HTMLDivElement | null) ?? undefined);
            }}
            class="header-actions"
            data-testid="header-actions"
          >
            <ZButton
              data-testid="header-actions-more"
              class="header-actions-more"
              variant="text"
              icon="::more-horiz"
              aria-label={this.scope.locale.MoreActions()}
              title={this.scope.locale.MoreActions()}
              aria-expanded={this.headerActionsOpen}
              aria-controls={this.headerActionsId}
              onPerform={() => this.toggleHeaderActions()}
            />
            <div
              id={this.headerActionsId}
              class={classes('header-actions-panel', this.headerActionsOpen && 'is-open')}
            >
              {this.$$renderLocale.render()}
              {this.$$renderTheme.renderThemeDark()}
              {this.$$renderUser.render()}
            </div>
          </div>
        </VAppBar>
        <VMain style={{ transition: 'none', paddingTop: '64px' }}>
          <div class="mine-body">
            <aside class={classes('mine-sidebar', this.mobileMenuOpen && 'is-open')}>
              <nav
                id="home-layoutmine-navigation"
                data-testid="mine-navigation"
                aria-label={this.scope.locale.PersonalCenter()}
              >
                <div class="text-subtitle-1 font-weight-bold pa-4">
                  {this.scope.locale.PersonalCenter()}
                </div>
                {this.menuGroups.map(group => (
                  <div key={group.title || 'account'}>
                    {group.title && <div class="text-overline px-4 pt-2">{group.title}</div>}
                    <ul class="mine-menu">
                      {group.items.map(item => {
                        const active = this.$currentRoute?.path === item.href;
                        return (
                          <li
                            key={item.path}
                            onClick={() => {
                              this.mobileMenuOpen = false;
                            }}
                          >
                            <RouterLink
                              to={item.href}
                              class={classes('mine-menu-link', active && 'is-active')}
                              aria-current={active ? 'page' : undefined}
                            >
                              {item.title}
                            </RouterLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </aside>
            <div class="mine-content">
              <ZRouterViewEmpty />
            </div>
          </div>
        </VMain>
      </VApp>
    );
  }
}
