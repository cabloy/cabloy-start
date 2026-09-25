import { BeanBase } from 'zova';
import { Service } from 'zova-module-a-bean';
import { getBodyReadyObserverScript } from 'zova-module-a-ssr';

export interface IServiceSsrLayoutOptions {
  bodyReadyObserver?: boolean;
  sidebarBreakpoint?: number;
  sidebarWidth?: number;
  navbarHeight?: number;
  sidebarLeftOpenPCCapability?: boolean;
  sidebarLeftOpenPCFallback?: boolean;
}

@Service()
export class ServiceSsrLayout extends BeanBase {
  options?: IServiceSsrLayoutOptions;

  protected async __init__(options?: IServiceSsrLayoutOptions) {
    this.options = options;
    // ssr theme
    if (process.env.SERVER) {
      this.ctx.meta.$ssr.context.onRendered((err?: Error) => {
        if (err) return;
        this.ctx.meta.$ssr.context._meta.bodyTags += `<script id="__prefersColorSchemeDarkJS">
            const __themeDarkStyle=window.ssr_themedark_data;
            const __themeDarkEl=document.createElement('style');
            __themeDarkEl.setAttribute('vite-css-module-id','vuetify-theme-stylesheet');
            __themeDarkEl.innerHTML=__themeDarkStyle;
            document.head.appendChild(__themeDarkEl);
            document.querySelector('#__prefersColorSchemeDarkJS').remove();
            document.body.setAttribute('data-theme',window.ssr_themedark?'dark':'light');
          </script>`.replaceAll('\n', '');
        if (this.options?.bodyReadyObserver) {
          this.ctx.meta.$ssr.context.__qMetaList.push({
            bodyStyle: { display: 'none' },
          });
          this.ctx.meta.$ssr.context._meta.bodyTags +=
            `<script id="__leftDrawerOpenJS">
  ${this.options?.sidebarLeftOpenPCCapability ? this._getJsHandlerSidebar() : ''}
  ${this._getJsHandlerPageContainer()}
  window.ssr_get_layout_elements=()=>{
    const __domLayout=document.querySelector('#q-app .v-application');
    const __domLayoutWrap=__domLayout?.querySelector(':scope>.v-application__wrap');
    const __domHeader=__domLayoutWrap?.querySelector(':scope>header.v-toolbar');
    const __domDrawer=__domLayoutWrap?.querySelector(':scope>.v-navigation-drawer--left');
    const __domPageContainer=__domLayoutWrap?.querySelector(':scope>main.v-main');
    if(!__domHeader||!__domDrawer||!__domPageContainer) return;
    return {__domHeader,__domDrawer,__domPageContainer};
  };
  window.ssr_body_ready_handler=(__layoutElements)=>{
    ${this.options?.sidebarLeftOpenPCCapability ? 'window.ssr_body_ready_handler_sidebar(__layoutElements);' : ''}
    window.ssr_body_ready_handler_pageContainer(__layoutElements);
  };
  window.ssr_body_ready_condition=()=>{
    return window.ssr_get_layout_elements();
  };
  window.ssr_body_ready_callback=(__layoutElements)=>{
    window.ssr_body_ready_handler(__layoutElements);
    document.querySelector('#__leftDrawerOpenJS').remove();
  };
</script>`.replaceAll('\n', '') + getBodyReadyObserverScript();
        }
      });
    }
  }

  private _getJsHandlerPageContainer() {
    return `window.ssr_body_ready_handler_pageContainer=(_layoutElements)=>{
  };`;
  }

  private _getJsHandlerSidebar() {
    return `window.ssr_body_ready_handler_sidebar=({__domHeader,__domDrawer,__domPageContainer})=>{
      const __belowBreakpoint=document.documentElement.clientWidth <= ${this.options?.sidebarBreakpoint};
      let __leftDrawerOpen;
      if(__belowBreakpoint){
        __leftDrawerOpen=false;
      }else{
        const __leftDrawerOpenPC=window.ssr_load_local('sidebarLeftOpenPC');
        __leftDrawerOpen=__leftDrawerOpenPC!==undefined?__leftDrawerOpenPC:${this.options?.sidebarLeftOpenPCFallback ?? false};
      }
      const sidebarWidth = '${this.options?.sidebarWidth}px';
      const navbarHeight = '${this.options?.navbarHeight}px';
      if(__leftDrawerOpen){
        __domHeader.style.left=sidebarWidth;
        __domHeader.style.width=\`calc(100% - \${sidebarWidth})\`;
        __domDrawer.style.transform='translateX(0px)';
        __domDrawer.style.width=sidebarWidth;
        __domPageContainer.style.setProperty('--v-layout-left',sidebarWidth);
        __domPageContainer.style.setProperty('--v-layout-top',navbarHeight);
      }else{
        __domPageContainer.style.setProperty('--v-layout-left','0px');
        __domPageContainer.style.setProperty('--v-layout-top',navbarHeight);
      }
    };`;
  }
}
