// eslint-disable
/** ssrSite: begin */
export * from '../bean/ssrSite.web.ts';
import type { ISsrSiteOptionsWeb } from '../bean/ssrSite.web.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrSiteRecord {
      'start-siteweb:web': ISsrSiteOptionsWeb;
    }

  
}
declare module 'vona-module-start-siteweb' {
  
        export interface SsrSiteWeb {
          /** @internal */
          get scope(): ScopeModuleStartSiteweb;
        }

          export interface SsrSiteWeb {
            get $beanFullName(): 'start-siteweb.ssrSite.web';
            get $onionName(): 'start-siteweb:web';
            get $onionOptions(): ISsrSiteOptionsWeb;
          } 
}
/** ssrSite: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.home.ts';
import type { ISsrMenuOptionsHome } from '../bean/ssrMenu.home.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'start-siteweb:home': ISsrMenuOptionsHome;
    }

  
}
declare module 'vona-module-start-siteweb' {
  
        export interface SsrMenuHome {
          /** @internal */
          get scope(): ScopeModuleStartSiteweb;
        }

          export interface SsrMenuHome {
            get $beanFullName(): 'start-siteweb.ssrMenu.home';
            get $onionName(): 'start-siteweb:home';
            get $onionOptions(): ISsrMenuOptionsHome;
          } 
}
/** ssrMenu: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleStartSiteweb extends BeanScopeBase {}

export interface ScopeModuleStartSiteweb {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'start-siteweb': ScopeModuleStartSiteweb;
  }

  export interface IBeanScopeContainer {
    startSiteweb: ScopeModuleStartSiteweb;
  }
  
  

  export interface IBeanScopeLocale {
    'start-siteweb': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
