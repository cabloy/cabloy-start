import type { VNode } from 'vue';

import { VBtn, VList, VMenu, VTab, VTabs } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $iconName } from 'zova-module-a-icon';
import { ZRouterViewTabs } from 'zova-module-a-routertabs';
import { ZItemLink } from 'zova-module-home-base';

import type { TypeMenuGroup, TypeMenuItem } from '../../model/menu.js';

type TypeMenuLeaf = Exclude<TypeMenuItem, TypeMenuGroup>;

@Render()
export class RenderTabs extends BeanRenderBase {
  public renderTabs() {
    const $$modelTabs = this.$$modelTabs;
    if (!$$modelTabs) return;
    const domTabs: VNode[] = [];
    for (const tab of $$modelTabs.tabs) {
      const domTab = this._renderTab(tab.info as TypeMenuItem, true, tab.tabKey);
      if (domTab) {
        domTabs.push(domTab);
      }
    }
    const domWrapper = (
      <VTabs centerActive modelValue={$$modelTabs.tabKeyCurrent} mandatory={false}>
        {domTabs}
      </VTabs>
    );
    if (!this.$$modelTabs.cache) return domWrapper;
    return <ClientOnly>{domWrapper}</ClientOnly>;
  }

  private _renderTab(item: TypeMenuItem, topLevel: boolean = false, tabKey?: string) {
    if (item.folder) {
      return this._renderMenuFolder(item, topLevel, tabKey);
    }
    if (item.separator) return;
    return this._renderMenuLeaf(item, topLevel, tabKey);
  }

  private _renderMenuFolder(item: TypeMenuGroup, topLevel: boolean, tabKey?: string) {
    const titleLocale = item.title || '';
    const className = this._getMenuItemClassName(this._hasActiveDescendant(item));
    const slots = {
      activator: ({ props }) => {
        return (
          <VBtn
            variant="text"
            class={`v-tab ${className}`}
            style={{ height: 'calc(var(--v-tabs-height))' }}
            prependIcon={this._getMenuItemIcon(item)}
            {...props}
          >
            {titleLocale}
          </VBtn>
        );
      },
    };
    return (
      <VMenu key={this._getMenuItemKey(item)} v-slots={slots}>
        <VList>
          {item.children?.map((child, index) => {
            return this._renderMenuChild(child, topLevel, tabKey, index);
          })}
        </VList>
      </VMenu>
    );
  }

  private _renderMenuChild(
    item: TypeMenuItem,
    _topLevel: boolean,
    tabKey?: string,
    index?: number,
  ) {
    if (item.folder) {
      return item.children?.map((child, childIndex) => {
        return this._renderMenuChild(child, false, tabKey, childIndex);
      });
    }
    if (item.separator) return;
    const menuItem = item as TypeMenuLeaf;
    const { href, target, to } = this._buildLinkProps(menuItem);
    const key = menuItem.link ?? `${tabKey}:${index}`;
    return (
      <ZItemLink
        key={key}
        title={menuItem.title!}
        icon={(menuItem.icon as any) ?? $iconName('::none')}
        href={href}
        to={to}
        target={target}
        activeClass="text-primary"
      ></ZItemLink>
    );
  }

  private _renderMenuLeaf(item: TypeMenuLeaf, _topLevel: boolean, tabKey?: string) {
    const titleLocale = item.title || '';
    const className = this._getMenuItemClassName(this._isMenuLeafActive(item, tabKey));
    const { href, to } = this._buildLinkProps(item);
    const attrs = item.external && item.target ? { target: item.target } : {};
    return (
      <VTab
        key={this._getMenuItemKey(item)}
        value={tabKey}
        class={className}
        href={href}
        to={to}
        tag={item.external ? 'a' : undefined}
        {...attrs}
        prependIcon={this._getMenuItemIcon(item)}
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

  private _hasActiveDescendant(item: TypeMenuGroup): boolean {
    return item.children.some(child => {
      if (child.folder) return this._hasActiveDescendant(child);
      return this._isMenuLeafCurrent(child as TypeMenuLeaf);
    });
  }

  private _isMenuLeafActive(item: TypeMenuLeaf, tabKey?: string): boolean {
    if (item.external || !item.link) return false;
    if (tabKey && tabKey === this.$$modelTabs?.tabKeyCurrent) return true;
    return this._isMenuLeafCurrent(item);
  }

  private _isMenuLeafCurrent(item: TypeMenuLeaf): boolean {
    if (item.external || !item.link) return false;
    return this.$router.checkActiveOfFullPath(item.link);
  }

  private _getMenuItemKey(item: TypeMenuItem): string {
    if (item.folder) return item.name || item.title || '';
    return item.name || item.link || item.title || '';
  }

  private _getMenuItemClassName(isActive: boolean): string {
    return isActive ? 'text-primary' : '';
  }

  private _getMenuItemIcon(item: TypeMenuItem) {
    return item.icon ? item.icon : '';
  }

  _renderRouterViewTabs() {
    return <ZRouterViewTabs></ZRouterViewTabs>;
  }
}
