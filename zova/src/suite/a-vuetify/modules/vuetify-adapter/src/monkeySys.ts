import type { IMonkeySysInitialize } from 'zova';

import { BeanSimple } from 'zova';

import { SysAppBar } from './bean/sys.appBar.tsx';
import { SysIcon } from './bean/sys.icon.ts';
import { SysMain } from './bean/sys.main.tsx';
import { SysNavigationDrawer } from './bean/sys.navigationDrawer.tsx';

export class MonkeySys extends BeanSimple implements IMonkeySysInitialize {
  async sysInitialize() {
    // defaultThemeHandler
    const scopeStyleConfig = this.sys.util.getModuleConfigSafe('a-style');
    if (!scopeStyleConfig.defaultThemeHandler) {
      scopeStyleConfig.defaultThemeHandler = 'vuetify-adapter:themeHandler';
    }
    // icon
    const sysIcon = await this.bean._newBean(SysIcon, false);
    await sysIcon.initialize();
    // main
    const sysMain = await this.bean._newBean(SysMain, false);
    await sysMain.initialize();
    // navigationDrawer
    const sysNavigationDrawer = await this.bean._newBean(SysNavigationDrawer, false);
    await sysNavigationDrawer.initialize();
    // appBar
    const sysAppBar = await this.bean._newBean(SysAppBar, false);
    await sysAppBar.initialize();
  }
}
