import { VApp, VMain } from 'vuetify/components';
import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';

import { RenderContent } from './render.content.tsx';
import { RenderHeader } from './render.header.tsx';
import { RenderLocale } from './render.locale.tsx';
import { RenderMenu } from './render.menu.tsx';
import { RenderSidebar } from './render.sidebar.tsx';
import { RenderTabs } from './render.tabs.tsx';
import { RenderTheme } from './render.theme.tsx';
import { RenderUser } from './render.user.tsx';

@Render()
export class RenderLayoutAdmin extends BeanRenderBase {
  @Use()
  $$renderHeader: RenderHeader;

  @Use()
  $$renderContent: RenderContent;

  @Use()
  $$renderSidebar: RenderSidebar;

  @Use()
  $$renderMenu: RenderMenu;

  @Use()
  $$renderTabs: RenderTabs;

  @Use()
  $$renderTheme: RenderTheme;

  @Use()
  $$renderLocale: RenderLocale;

  @Use()
  $$renderUser: RenderUser;

  render() {
    return (
      <VApp>
        {this.$$renderSidebar.render()}
        {this.$$renderHeader.render()}
        <VMain style={{ transition: 'none' }}>{this.$$renderContent.render()}</VMain>
      </VApp>
    );
  }
}
