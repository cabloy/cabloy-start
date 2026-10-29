import type { VNode } from 'vue';

import { withModifiers } from 'vue';
import { VList, VListItem, VMenu, VTab, VTabs } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $iconName, IIconRecord, ZIcon } from 'zova-module-a-icon';
import { IRouteViewRouteItem } from 'zova-module-a-router';
import { RouteTab, ZRouterViewTabs } from 'zova-module-a-routertabs';
import { ZButton } from 'zova-module-start-button';

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
            width="20"
            height="20"
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
        height={40}
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
    const tabItemAnchor = tabCurrent.items.find(item => item.componentKey === tabKey);
    const onCustomRenderIsolate = tabItemAnchor?.pageMeta?.onCustomRenderIsolate;
    if (onCustomRenderIsolate) {
      const domContent = onCustomRenderIsolate(tabCurrent);
      if (!this.$$modelTabs.cache) return domContent;
      return <ClientOnly>{domContent}</ClientOnly>;
    }
    const pageTitleAnchor = tabItemAnchor?.pageMeta?.pageTitle;
    if (pageTitleAnchor) {
      const domWrapper = <div class="d-flex align-center justify-center">{pageTitleAnchor}</div>;
      if (!this.$$modelTabs.cache) return domWrapper;
      return <ClientOnly>{domWrapper}</ClientOnly>;
    }

    const tabItems = tabCurrent.items.filter(item => item.componentKey !== tabKey);
    if (!tabItems.length) return;
    const visibleItems = this.tabItemsCompact
      ? tabItems.filter(item => item.componentKey === $$modelTabs.componentKeyCurrent)
      : tabItems;
    const domTabs: VNode[] = [];
    for (const tabItem of visibleItems) {
      const { componentKey } = tabItem;
      const className = componentKey === $$modelTabs.componentKeyCurrent ? 'text-secondary' : '';
      const pageContent = this.getTabItemContent(tabItem);
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
          height={48}
          nativeOnClick={() => {
            $$modelTabs.activeTabItem(tabKey, componentKey);
          }}
          prependIcon={tabItemIcon}
          v-slots={slots}
        >
          <div class="text-truncate" style={{ maxWidth: this.scope.config.tabItem.maxWidth }}>
            {pageContent}
          </div>
        </VTab>
      );
      domTabs.push(domTab);
    }
    const domWrapper = (
      <div
        class={`tab-items ${this.tabItemsCompact ? 'is-compact' : ''}`}
        data-testid="tab-items"
        data-compact={this.tabItemsCompact ? 'true' : 'false'}
        ref={ref => {
          if (!this.ctx.disposed) {
            this.setTabItemsElement?.((ref as HTMLDivElement | null) ?? undefined);
          }
        }}
      >
        <div
          class={`tab-items-scroll ${this.tabItemsOverflowStart ? 'has-start' : ''} ${this.tabItemsOverflowEnd ? 'has-end' : ''}`}
        >
          <VTabs showArrows="never" modelValue={$$modelTabs.componentKeyCurrent} mandatory={false}>
            {domTabs}
          </VTabs>
        </div>
        <VMenu
          modelValue={this.tabItemsMenuOpen}
          onUpdate:modelValue={open => {
            this.tabItemsMenuOpen = open;
            if (open) this.closeHeaderActions();
          }}
          location="bottom end"
          maxWidth="calc(100vw - 1rem)"
          maxHeight="calc(100dvh - 5rem)"
          closeOnContentClick={false}
          openOnClick={false}
          transition={false}
          v-slots={{
            activator: ({ props }) => (
              <ZButton
                {...props}
                class="tab-items-more"
                data-testid="tab-items-more"
                icon
                variant="text"
                aria-label={this.scope.locale.AllTabs()}
                title={this.scope.locale.AllTabs()}
                aria-expanded={this.tabItemsMenuOpen}
                onPerform={() => {
                  this.closeHeaderActions();
                  this.tabItemsMenuOpen = !this.tabItemsMenuOpen;
                }}
              >
                <span aria-hidden="true">▾</span>
              </ZButton>
            ),
          }}
        >
          <VList data-testid="tab-items-list" class={this.cTabItemsMenu}>
            {tabItems.map(tabItem => {
              const current = tabItem.componentKey === $$modelTabs.componentKeyCurrent;
              return (
                <VListItem key={tabItem.componentKey} class="px-2">
                  <div class="d-flex align-center ga-1">
                    <ZButton
                      class="tab-items-select justify-start text-none"
                      variant={current ? 'tonal' : 'text'}
                      color={current ? 'secondary' : undefined}
                      aria-current={current ? 'page' : undefined}
                      prependIcon={$iconName(this.getTabItemIcon(tabItem) || '::none')}
                      onPerform={async () => {
                        this.tabItemsMenuOpen = false;
                        await $$modelTabs.activeTabItem(tabKey, tabItem.componentKey);
                      }}
                    >
                      <span class="tab-items-label">{this.getTabItemContent(tabItem)}</span>
                      {current && <ZIcon name="::done" width={16} class="ml-2" />}
                    </ZButton>
                    <ZButton
                      icon="::close"
                      size="small"
                      variant="text"
                      aria-label={this.scope.locale.CloseTab(tabItem.pageMeta?.pageTitle || '')}
                      title={this.scope.locale.CloseTab(tabItem.pageMeta?.pageTitle || '')}
                      onPerform={async () => {
                        await $$modelTabs.deleteTabItem(tabKey, tabItem.componentKey, false);
                        if (tabItems.length === 1) this.tabItemsMenuOpen = false;
                      }}
                    />
                  </div>
                </VListItem>
              );
            })}
          </VList>
        </VMenu>
      </div>
    );
    if (!this.$$modelTabs.cache) return domWrapper;
    return <ClientOnly>{domWrapper}</ClientOnly>;
  }

  private getTabItemContent(tabItem: IRouteViewRouteItem) {
    const pageMeta = tabItem.pageMeta;
    return pageMeta?.onCustomRender ? pageMeta.onCustomRender(tabItem) : pageMeta?.pageTitle || '';
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
    if (pageMeta?.formMeta?.formScene === 'create') return '::add';
    if (pageMeta?.formMeta?.formScene === 'edit') return '::edit';
    return '';
  }

  _renderRouterViewTabs() {
    return <ZRouterViewTabs></ZRouterViewTabs>;
  }
}
