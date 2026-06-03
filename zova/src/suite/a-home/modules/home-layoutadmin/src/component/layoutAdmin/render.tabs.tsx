import type { VNode } from 'vue';

import { withModifiers } from 'vue';
import { VTab, VTabs } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $iconName, IIconRecord, ZIcon } from 'zova-module-a-icon';
import { IRouteViewRouteItem } from 'zova-module-a-router';
import { RouteTab, ZRouterViewTabs } from 'zova-module-a-routertabs';

@Render()
export class RenderTabs extends BeanRenderBase {
  public renderTabs() {
    const $$modelTabs = this.$$modelTabs;
    if (!$$modelTabs) return;
    const domTabs: VNode[] = [];
    for (const tab of $$modelTabs.tabs) {
      domTabs.push(this._renderTab(tab));
    }
    const domWrapper = (
      <VTabs
        alignTabs="start"
        centerActive
        modelValue={$$modelTabs.tabKeyCurrent}
        mandatory={false}
      >
        {domTabs}
      </VTabs>
    );
    if (!this.$$modelTabs.cache) return domWrapper;
    return <ClientOnly>{domWrapper}</ClientOnly>;
  }

  private _renderTab(tab: RouteTab) {
    const $$modelTabs = this.$$modelTabs;
    const { tabKey, info } = tab;
    const className = tabKey === $$modelTabs.tabKeyCurrent ? 'text-primary' : '';
    const titleLocale = info?.title || '';
    const tabIcon = this.getTabIcon(tab);
    const slots = {
      append: () => {
        if (tab.affix) return;
        return (
          <ZIcon
            class="close"
            name="::close"
            width="16"
            height="16"
            nativeOnClick={withModifiers(() => {
              $$modelTabs.deleteTab(tabKey);
            }, ['stop'])}
          ></ZIcon>
        );
      },
    };
    return (
      <VTab
        key={tabKey}
        value={tabKey}
        class={`${className} ${this.cTab}`}
        nativeOnClick={() => {
          $$modelTabs.activeTab(tabKey);
        }}
        prependIcon={tabIcon}
        v-slots={slots}
      >
        {titleLocale}
      </VTab>
    );
  }

  public renderTabItems() {
    const $$modelTabs = this.$$modelTabs;
    if (!$$modelTabs) return;
    const tabCurrent = $$modelTabs.tabCurrent;
    if (!tabCurrent || !tabCurrent.items) return;
    const tabKey = tabCurrent.tabKey;
    const domTabs: VNode[] = [];
    for (const tabItem of tabCurrent.items) {
      // ignore first
      if (tabItem.componentKey === tabKey) continue;
      const { componentKey, pageMeta } = tabItem;
      const className = componentKey === $$modelTabs.componentKeyCurrent ? 'text-secondary' : '';
      const pageTitle = pageMeta?.pageTitle || '';
      const tabItemIcon = this.getTabItemIcon(tabItem);
      const slots = {
        append: () => {
          return (
            <ZIcon
              class="close"
              name="::close"
              width="16"
              height="16"
              nativeOnClick={withModifiers(() => {
                $$modelTabs.deleteTabItem(tabKey, componentKey, false);
              }, ['stop'])}
            ></ZIcon>
          );
        },
      };
      const domTab = (
        <VTab
          key={componentKey}
          value={componentKey}
          class={`${className} ${this.cTab}`}
          nativeOnClick={() => {
            $$modelTabs.activeTabItem(tabKey, componentKey);
          }}
          prependIcon={tabItemIcon}
          v-slots={slots}
        >
          <div class="text-truncate" style={{ maxWidth: this.scope.config.tabItem.maxWidth }}>
            {pageTitle}
          </div>
        </VTab>
      );
      domTabs.push(domTab);
    }
    const domWrapper = (
      <VTabs centerActive showArrows modelValue={$$modelTabs.componentKeyCurrent} mandatory={false}>
        {domTabs}
      </VTabs>
    );
    if (!this.$$modelTabs.cache) return domWrapper;
    return <ClientOnly>{domWrapper}</ClientOnly>;
  }

  public getTabIcon(tab: RouteTab) {
    const { info, items } = tab;
    // pageDirty
    const hasPageDirty = items && items.some(item => !!item.pageMeta?.pageDirty);
    if (hasPageDirty) return $iconName('::asterisk');
    // default
    return info?.icon ? info?.icon : '';
  }

  public getTabItemIcon(tabItem: IRouteViewRouteItem): keyof IIconRecord | '' {
    const { pageMeta } = tabItem;
    if (pageMeta?.pageDirty) return '::asterisk';
    if (pageMeta?.formMeta?.formScene === 'create') return '::draft-add';
    if (pageMeta?.formMeta?.formScene === 'edit') return '::draft-edit';
    return '';
  }

  _renderRouterViewTabs() {
    return <ZRouterViewTabs></ZRouterViewTabs>;
  }
}
