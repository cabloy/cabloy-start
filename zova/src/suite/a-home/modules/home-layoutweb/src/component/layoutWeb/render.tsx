import { VApp, VMain } from 'vuetify/components';
import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';

import { RenderContent } from './render.content.tsx';
import { RenderFooter } from './render.footer.tsx';
import { RenderHeader } from './render.header.tsx';
import { RenderLocale } from './render.locale.tsx';
import { RenderTabs } from './render.tabs.tsx';
import { RenderTheme } from './render.theme.tsx';
import { RenderUser } from './render.user.tsx';

@Render()
export class RenderLayoutWeb extends BeanRenderBase {
  @Use()
  $$renderFooter: RenderFooter;

  @Use()
  $$renderTheme: RenderTheme;

  @Use()
  $$renderLocale: RenderLocale;

  @Use()
  $$renderTabs: RenderTabs;

  @Use()
  $$renderContent: RenderContent;

  @Use()
  $$renderHeader: RenderHeader;

  @Use()
  $$renderUser: RenderUser;

  public render() {
    return (
      <VApp>
        {this.$$renderHeader.render()}
        <VMain style={{ transition: 'none', marginBottom: '56px' }}>
          {this.$$renderContent.render()}
        </VMain>
        {this.$$renderFooter.render()}
      </VApp>
    );
  }
}
