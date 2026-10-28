import type { IThemeRecord } from 'zova-module-a-style';

import { VBtn, VList, VListItem, VMenu } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $iconName, ZIcon } from 'zova-module-a-icon';
import { ZButton } from 'zova-module-start-button';

@Render()
export class RenderTheme extends BeanRenderBase {
  renderThemeDark() {
    const themes = [
      {
        mode: false,
        title: this.scope.locale.ThemeLight(),
      },
      {
        mode: true,
        title: this.scope.locale.ThemeDark(),
      },
      {
        mode: 'auto',
        title: this.scope.locale.ThemeAuto(),
      },
    ];
    const slots = {
      activator: ({ props }) => {
        return (
          <VBtn
            {...props}
            class="header-action"
            data-header-action="color-mode"
            icon
            variant="text"
            aria-label={this.scope.locale.ColorMode()}
            title={this.scope.locale.ColorMode()}
          >
            <ZIcon name="::dark-theme" width={24} />
            <span class="header-action-label">{this.scope.locale.ColorMode()}</span>
          </VBtn>
        );
      },
    };
    return (
      <VMenu {...this.getHeaderMenuProps('color-mode')} v-slots={slots}>
        <ClientOnly>
          <VList>
            {themes.map(item => {
              return (
                <VListItem key={item.mode.toString()}>
                  <ZButton
                    block
                    variant="text"
                    class="justify-start text-none"
                    disabled={this.$theme.darkMode === item.mode}
                    prependIcon={$iconName(
                      this.$theme.darkMode === item.mode ? '::done' : '::none',
                    )}
                    onPerform={() => {
                      this.closeHeaderActions(true);
                      this.$theme.darkMode = item.mode as any;
                    }}
                  >
                    {item.title}
                  </ZButton>
                </VListItem>
              );
            })}
          </VList>
        </ClientOnly>
      </VMenu>
    );
  }

  renderThemeName() {
    const themes = this.getThemeNames();
    const slots = {
      activator: ({ props }) => {
        return (
          <VBtn
            {...props}
            class="header-action"
            data-header-action="theme"
            icon
            variant="text"
            aria-label={this.scope.locale.Theme()}
            title={this.scope.locale.Theme()}
          >
            <ZIcon name=":outline:theme-outline" width={24} />
            <span class="header-action-label">{this.scope.locale.Theme()}</span>
          </VBtn>
        );
      },
    };
    return (
      <VMenu {...this.getHeaderMenuProps('theme')} v-slots={slots}>
        <ClientOnly>
          <VList>
            {themes.map(item => {
              return (
                <VListItem key={item.name}>
                  <ZButton
                    block
                    variant="text"
                    class="justify-start text-none"
                    disabled={this.$theme.name === item.name}
                    prependIcon={$iconName(this.$theme.name === item.name ? '::done' : '::none')}
                    onPerform={() => {
                      this.closeHeaderActions(true);
                      this.$theme.name = item.name as keyof IThemeRecord;
                    }}
                  >
                    {item.title}
                  </ZButton>
                </VListItem>
              );
            })}
          </VList>
        </ClientOnly>
      </VMenu>
    );
  }

  getThemeNames() {
    return [
      {
        name: 'home-theme:orange' satisfies keyof IThemeRecord,
        title: this.scope.locale.ThemeOrange(),
      },
      {
        name: 'home-theme:default' satisfies keyof IThemeRecord,
        title: this.scope.locale.ThemeBlue(),
      },
    ];
  }
}
