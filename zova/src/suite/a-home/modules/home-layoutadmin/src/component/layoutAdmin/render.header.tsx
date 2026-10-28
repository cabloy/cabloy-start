import { classes } from 'typestyle';
import { VAppBar, VAppBarNavIcon, VSpacer, VToolbarTitle } from 'vuetify/components';
import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-start-button';

import type { RenderLayoutAdmin } from './render.tsx';

@Render()
export class RenderHeader extends BeanRenderBase {
  @Use()
  $$r: RenderLayoutAdmin;

  public render() {
    const slots = {
      extension: () => {
        return this.$$r.$$renderTabs.renderTabs();
      },
    };
    return (
      <VAppBar
        class={this.cHeader}
        style={{ transition: 'none' }}
        density="compact"
        extended={true}
        v-slots={slots}
      >
        <VAppBarNavIcon
          icon="::menu"
          variant="text"
          nativeOnClick={() => this.toggleLeftDrawer()}
        ></VAppBarNavIcon>
        <VToolbarTitle>{this.sys.env.APP_TITLE}</VToolbarTitle>
        <div class="header-navigation">{this.$$r.$$renderTabs.renderTabItems()}</div>
        <VSpacer></VSpacer>
        <div
          ref={ref => this.setHeaderActionsElement?.((ref as HTMLDivElement | null) ?? undefined)}
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
            {this.$$r.$$renderLocale.render()}
            {this.$$r.$$renderTheme.renderThemeDark()}
            {this.$ssr.profileOptions.useCookie && this.$$r.$$renderTheme.renderThemeName()}
            {this.$$r.$$renderUser.render()}
          </div>
        </div>
      </VAppBar>
    );
  }
}
