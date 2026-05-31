import { VNavigationDrawer } from 'vuetify/components';
import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';

import type { RenderLayoutAdmin } from './render.jsx';

@Render()
export class RenderSidebar extends BeanRenderBase {
  @Use()
  $$r: RenderLayoutAdmin;

  public render() {
    return (
      <VNavigationDrawer
        v-model={this.leftDrawerOpen}
        mobileBreakpoint={this.sys.config.layout.sidebar.breakpoint}
        width={this.layoutConfig.sidebar.width}
      >
        {this.$$r.$$renderMenu.render()}
      </VNavigationDrawer>
    );
  }
}
