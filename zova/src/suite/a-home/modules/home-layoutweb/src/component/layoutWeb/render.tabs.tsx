import type { VNode } from 'vue';

import { VList, VMenu, VTab, VTabs } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $iconName } from 'zova-module-a-icon';
import { RouteTab, ZRouterViewTabs } from 'zova-module-a-routertabs';
import { ZItemLink } from 'zova-module-home-base';

import type { TypeMenuItem } from '../../model/menu.js';

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
      <VTabs centerActive modelValue={$$modelTabs.tabKeyCurrent} mandatory={false}>
        {domTabs}
      </VTabs>
    );
    if (!this.$$modelTabs.cache) return domWrapper;
    return <ClientOnly>{domWrapper}</ClientOnly>;
  }

  private _renderTab(tab: RouteTab) {
    const $$modelTabs = this.$$modelTabs;
    const { tabKey, info } = tab;
    const titleLocale = info?.title || '';
    const className = tabKey === $$modelTabs.tabKeyCurrent ? 'text-primary' : '';
    if (info.folder) {
      const slots = {
        activator: ({ props }) => {
          return (
            <VTab value={tabKey} class={className} prependIcon={this.getTabIcon(tab)} {...props}>
              {titleLocale}
            </VTab>
          );
        },
      };
      return (
        <VMenu key={tab.tabKey} v-slots={slots}>
          <VList>
            {info.children
              ?.filter(item => !item.folder)
              .map((item, index) => {
                const { href, target, to } = this._buildLinkProps(item as TypeMenuItem);
                return (
                  <ZItemLink
                    key={item.link ?? `${tabKey}:${index}`}
                    title={item.title!}
                    icon={(item.icon as any) ?? $iconName('::none')}
                    href={href}
                    to={to}
                    target={target}
                  ></ZItemLink>
                );
              })}
          </VList>
        </VMenu>
      );
    }
    const { href, to } = this._buildLinkProps(info as TypeMenuItem);
    const attrs = info.external && info.target ? { target: info.target } : {};
    return (
      <VTab
        key={tabKey}
        value={tabKey}
        class={className}
        href={href}
        to={to}
        tag={info.external ? 'a' : undefined}
        {...attrs}
        prependIcon={this.getTabIcon(tab)}
      >
        {titleLocale}
      </VTab>
    );
  }

  private _buildLinkProps(item: TypeMenuItem) {
    if (item.folder) return {};
    if (item.external) {
      return {
        href: item.link,
        target: item.target,
        to: undefined,
      };
    }
    let to: any;
    if (item.link) {
      if (this.$router.isRouterName(item.link)) {
        to = { name: item.link };
        if (item.meta?.params) {
          to.params = item.meta.params;
        }
        if (item.meta?.query) {
          to.query = item.meta.query;
        }
      } else if (item.meta?.query) {
        to = {
          path: item.link,
          query: item.meta.query,
        };
      } else {
        to = item.link;
      }
    }
    return {
      href: undefined,
      target: undefined,
      to,
    };
  }

  public getTabIcon(tab: RouteTab) {
    const { info } = tab;
    return info?.icon ? info?.icon : '';
  }

  _renderRouterViewTabs() {
    return <ZRouterViewTabs></ZRouterViewTabs>;
  }
}
