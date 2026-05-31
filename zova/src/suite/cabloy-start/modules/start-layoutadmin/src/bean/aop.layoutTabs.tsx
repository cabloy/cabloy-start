import { VNode, withModifiers } from 'vue';
import { VTab, VTabs } from 'vuetify/components';
import { BeanAopBase, ClientOnly } from 'zova';
import { Aop, AopAction } from 'zova-module-a-bean';
import { $iconName, IIconRecord, ZIcon } from 'zova-module-a-icon';
import { IRouteViewRouteItem } from 'zova-module-a-router';
import { RouteTab } from 'zova-module-a-routertabs';
import { RenderTabs } from 'zova-module-home-layouttabs';

@Aop({ match: 'home-layouttabs.render.tabs' })
export class AopLayoutTabs extends BeanAopBase {
  renderTabItems: AopAction<RenderTabs, 'renderTabItems'> = (_args, _next, receiver) => {
    const that = receiver;
    const $$modelTabs = that.$$modelTabs;
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
          class={`${className} ${that.cTab}`}
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
    if (!that.$$modelTabs.cache) return domWrapper;
    return <ClientOnly>{domWrapper}</ClientOnly>;
  };

  getTabIcon: AopAction<RenderTabs, 'getTabIcon'> = (args, next, _receiver) => {
    const tab: RouteTab = args[0];
    const { items } = tab;
    const hasPageDirty = items && items.some(item => !!item.pageMeta?.pageDirty);
    if (hasPageDirty) return $iconName('::asterisk');
    return next();
  };

  getTabItemIcon(tabItem: IRouteViewRouteItem): keyof IIconRecord | '' {
    const { pageMeta } = tabItem;
    if (pageMeta?.pageDirty) return '::asterisk';
    if (pageMeta?.formMeta?.formScene === 'create') return '::draft-add';
    if (pageMeta?.formMeta?.formScene === 'edit') return '::draft-edit';
    return '';
  }
}
