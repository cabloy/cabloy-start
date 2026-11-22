import { classes } from 'typestyle';
import { VAppBar, VAppBarNavIcon, VBtn, VSpacer, VToolbarTitle } from 'vuetify/components';
import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $iconName, ZIcon } from 'zova-module-a-icon';
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
            {this.sys.env.AI_CHAT_BOT_ENABLE === 'true' && (
              <VBtn
                class="header-action"
                data-header-action="ai-chat"
                data-testid="ai-chat-nav"
                to="/cabloy/ai/chat"
                icon
                variant="text"
                activeColor="primary"
                style={{ '--v-activated-opacity': 0 }}
                aria-label={this.scope.locale.AiChat()}
                title={this.scope.locale.AiChat()}
              >
                <ZIcon name="::comment-dots" width={24} aria-hidden="true" />
                <span class="header-action-label">{this.scope.locale.AiChat()}</span>
              </VBtn>
            )}
            {this.$$r.$$renderLocale.render()}
            {this.$$r.$$renderTheme.renderThemeDark()}
            {this.$$r.$$renderUser.render()}
          </div>
        </div>
      </VAppBar>
    );
  }
}
