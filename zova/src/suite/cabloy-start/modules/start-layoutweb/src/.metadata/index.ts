// eslint-disable
/** model: begin */
export * from '../model/layout.js';
export * from '../model/menu.js';
import { IModelOptionsLayout } from '../model/layout.js';
import { IModelOptionsMenu } from '../model/menu.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'start-layoutweb:layout': IModelOptionsLayout;
'start-layoutweb:menu': IModelOptionsMenu;
    }

  
}
declare module 'zova-module-start-layoutweb' {
  
        export interface ModelLayout {
          /** @internal */
          get scope(): ScopeModuleStartLayoutweb;
        }

        export interface ModelLayout {
          get $beanFullName(): 'start-layoutweb.model.layout';
          get $onionName(): 'start-layoutweb:layout';
          get $onionOptions(): IModelOptionsLayout;
        }

        export interface ModelMenu {
          /** @internal */
          get scope(): ScopeModuleStartLayoutweb;
        }

        export interface ModelMenu {
          get $beanFullName(): 'start-layoutweb.model.menu';
          get $onionName(): 'start-layoutweb:menu';
          get $onionOptions(): IModelOptionsMenu;
        } 
}
/** model: end */
/** model: begin */
import { ModelLayout } from '../model/layout.js';
import { ModelMenu } from '../model/menu.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-layoutweb.model.layout': ModelLayout;
'start-layoutweb.model.menu': ModelMenu;
  }
}
/** model: end */
/** controller: begin */
export * from '../component/layoutWeb/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-layoutweb' {
  
        export interface ControllerLayoutWeb {
          /** @internal */
          get scope(): ScopeModuleStartLayoutweb;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerLayoutWeb } from '../component/layoutWeb/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-layoutweb.controller.layoutWeb': ControllerLayoutWeb;
  }
}
/** controller: end */

/** components: begin */
export * from './component/layoutWeb.js';
import { ZLayoutWeb } from './component/layoutWeb.js';
export const components = {
  'layoutWeb': ZLayoutWeb,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-layoutweb:layoutWeb': ControllerLayoutWeb;
}
export interface IZovaComponentRecord {
  'start-layoutweb:layoutWeb': typeof ZLayoutWeb;
}
}
/** components: end */
/** render: begin */
export * from '../component/layoutWeb/render.content.jsx';
export * from '../component/layoutWeb/render.footer.jsx';
export * from '../component/layoutWeb/render.header.jsx';
export * from '../component/layoutWeb/render.locale.jsx';
export * from '../component/layoutWeb/render.tabs.jsx';
export * from '../component/layoutWeb/render.theme.jsx';
export * from '../component/layoutWeb/render.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-layoutweb' {
  
        export interface RenderContent {
          /** @internal */
          get scope(): ScopeModuleStartLayoutweb;
        }

        export interface RenderFooter {
          /** @internal */
          get scope(): ScopeModuleStartLayoutweb;
        }

        export interface RenderHeader {
          /** @internal */
          get scope(): ScopeModuleStartLayoutweb;
        }

        export interface RenderLocale {
          /** @internal */
          get scope(): ScopeModuleStartLayoutweb;
        }

        export interface RenderTabs {
          /** @internal */
          get scope(): ScopeModuleStartLayoutweb;
        }

        export interface RenderTheme {
          /** @internal */
          get scope(): ScopeModuleStartLayoutweb;
        }

        export interface RenderLayoutWeb {
          /** @internal */
          get scope(): ScopeModuleStartLayoutweb;
        } 
}
/** render: end */
/** render: begin */
import { RenderContent } from '../component/layoutWeb/render.content.jsx';
import { RenderFooter } from '../component/layoutWeb/render.footer.jsx';
import { RenderHeader } from '../component/layoutWeb/render.header.jsx';
import { RenderLocale } from '../component/layoutWeb/render.locale.jsx';
import { RenderTabs } from '../component/layoutWeb/render.tabs.jsx';
import { RenderTheme } from '../component/layoutWeb/render.theme.jsx';
import { RenderLayoutWeb } from '../component/layoutWeb/render.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-layoutweb.render.content': RenderContent;
'start-layoutweb.render.footer': RenderFooter;
'start-layoutweb.render.header': RenderHeader;
'start-layoutweb.render.locale': RenderLocale;
'start-layoutweb.render.tabs': RenderTabs;
'start-layoutweb.render.theme': RenderTheme;
'start-layoutweb.render.layoutWeb': RenderLayoutWeb;
  }
}
/** render: end */
/** config: begin */
export * from '../config/config.js';
import { config } from '../config/config.js';
/** config: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartLayoutweb extends BeanScopeBase {}

export interface ScopeModuleStartLayoutweb {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-layoutweb': ScopeModuleStartLayoutweb;
  }
  
  export interface IBeanScopeConfig {
    'start-layoutweb': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'start-layoutweb': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `start-layoutweb::${K}` {
  return `start-layoutweb::${key}`;
}  
/** scope: end */
