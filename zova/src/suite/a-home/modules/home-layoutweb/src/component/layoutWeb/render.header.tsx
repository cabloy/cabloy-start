import { classes } from 'typestyle';
import { VAppBar, VAppBarNavIcon, VSpacer, VToolbarTitle } from 'vuetify/components';
import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $iconName } from 'zova-module-a-icon';
import { ZButton } from 'zova-module-start-button';

import type { RenderLayoutWeb } from './render.tsx';

@Render()
export class RenderHeader extends BeanRenderBase {
  @Use()
  $$r: RenderLayoutWeb;

  public render() {
    return (
      <VAppBar class={this.cHeader} style={{ transition: 'none' }}>
        <VAppBarNavIcon
          icon={$iconName(':social:cabloy')}
          variant="text"
          nativeOnClick={() => this.app.$gotoHome()}
        ></VAppBarNavIcon>
        <VToolbarTitle style={{ flex: 'none' }}>{this.sys.env.APP_TITLE}</VToolbarTitle>
        <div class="header-navigation">{this.$$r.$$renderTabs.renderTabs()}</div>
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
            {this.$$r.$$renderUser.render()}
          </div>
        </div>
      </VAppBar>
    );
  }
}
