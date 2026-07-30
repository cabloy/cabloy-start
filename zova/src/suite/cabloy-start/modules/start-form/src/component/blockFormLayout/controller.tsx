import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextForm,
  IResolvedFormLayout,
  IResolvedFormLayoutBlock,
  IResolvedFormLayoutField,
  IResolvedFormLayoutLeaf,
  IResolvedFormLayoutGroup,
  IResolvedFormLayoutNode,
  IResolvedFormLayoutSection,
  IResolvedFormLayoutTab,
  IResolvedFormLayoutTabs,
} from 'zova-module-a-form';
import type {
  IFormLayout,
  IFormLayoutResponsiveColumns,
  IResourceBlockOptionsBase,
} from 'zova-module-a-openapi';

import { useId } from 'vue';
import { VBadge, VCol, VRow, VTab, VTabs } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { resolveFormLayout } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'start-form:blockFormLayout'?: ControllerBlockFormLayoutProps;
  }
}

export interface ControllerBlockFormLayoutProps extends IResourceBlockOptionsBase {
  formLayout: IFormLayout;
}

@Controller()
export class ControllerBlockFormLayout extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  private formLayoutPlan: IResolvedFormLayout | undefined;
  private formLayoutActiveTabs: Record<string, string | undefined> = {};
  private formLayoutDomIdPrefix: string;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextForm;

  protected async __init__() {
    this.formLayoutDomIdPrefix = `start-form-layout-${useId()}`;
    this.formLayoutPlan = this.$computed(() => {
      const { $$form } = this.$$renderContext;
      return resolveFormLayout(this.$props.formLayout, $$form.properties);
    });
  }

  protected render() {
    return <>{this.formLayoutPlan!.children.map(node => this._renderNode(node))}</>;
  }

  private _renderNode(node: IResolvedFormLayoutNode) {
    switch (node.type) {
      case 'field':
        return this._renderField(node);
      case 'block':
        return this._renderBlock(node);
      case 'group':
        return this._renderGroup(node);
      case 'section':
        return this._renderSection(node);
      case 'tabs':
        return this._renderTabs(node);
    }
  }

  private _renderLeaf(
    node: IResolvedFormLayoutLeaf,
    sectionLayout?: 'grid' | 'flow',
    sectionColumns?: IFormLayoutResponsiveColumns,
  ) {
    if (sectionLayout === 'grid') {
      return (
        <VCol {...this._gridColumns(sectionColumns, node.span)}>
          {this._renderLeafContent(node)}
        </VCol>
      );
    }
    const style =
      sectionLayout === 'flow'
        ? node.type === 'field'
          ? { flex: '1 1 240px', minWidth: 0, maxWidth: '100%' }
          : { flex: '0 0 auto', minWidth: 0, maxWidth: '100%' }
        : undefined;
    return <div style={style}>{this._renderLeafContent(node)}</div>;
  }

  private _renderLeafContent(node: IResolvedFormLayoutLeaf) {
    if (node.type === 'field') return this.$$renderContext.$$form.renderField(node.name);
    return this._renderBlockContent(node);
  }

  private _renderField(node: IResolvedFormLayoutField) {
    return this._renderLeaf(node);
  }

  private _renderBlock(node: IResolvedFormLayoutBlock) {
    return this._renderLeaf(node);
  }

  private _renderBlockContent(node: IResolvedFormLayoutBlock) {
    const { $celScope, $jsx } = this.$$renderContext;
    return $jsx.render(node.block.render!, node.block.options, $celScope, this.$$renderContext);
  }

  private _renderGroup(node: IResolvedFormLayoutGroup) {
    return (
      <fieldset class="mb-6 rounded border pa-4">
        {!!node.title && <legend class="px-2 text-h6">{node.title}</legend>}
        {!!node.description && (
          <p class="mb-4 text-body-2 text-medium-emphasis">{node.description}</p>
        )}
        {node.children.map(child => this._renderNode(child))}
      </fieldset>
    );
  }

  private _renderSection(node: IResolvedFormLayoutSection) {
    const layout = node.layout ?? 'grid';
    return (
      <section class="mb-6">
        {!!node.title && <h3 class="mb-1 text-h6">{node.title}</h3>}
        {!!node.description && (
          <p class="mb-4 text-body-2 text-medium-emphasis">{node.description}</p>
        )}
        {layout === 'flow' ? (
          <div class="d-flex flex-wrap align-start ga-4">
            {node.children.map(child => this._renderLeaf(child, layout))}
          </div>
        ) : (
          <VRow>{node.children.map(child => this._renderLeaf(child, layout, node.columns))}</VRow>
        )}
      </section>
    );
  }

  private getActiveTabId(node: IResolvedFormLayoutTabs) {
    const activeTabId = this.formLayoutActiveTabs[node.id];
    if (node.children.some(tab => tab.id === activeTabId)) return activeTabId;
    const fallbackTabId = node.children[0]?.id;
    this.formLayoutActiveTabs[node.id] = fallbackTabId;
    return fallbackTabId;
  }

  private setActiveTab(tabsId: string, tabId: string) {
    this.formLayoutActiveTabs[tabsId] = tabId;
  }

  private _renderTabs(node: IResolvedFormLayoutTabs) {
    const { $$form } = this.$$renderContext;
    const activeTabId = this.getActiveTabId(node);
    const domIdBase = `${this.formLayoutDomIdPrefix}-${node.id}`;
    return (
      <div class="mb-6">
        <VTabs
          modelValue={activeTabId}
          onUpdate:modelValue={value => {
            if (typeof value === 'string') this.setActiveTab(node.id, value);
          }}
        >
          {node.children.map(tab => {
            const errorFieldCount = $$form.getErrorFieldCount(tab);
            const invalid = errorFieldCount > 0;
            const tabAttrs = {
              'id': `${domIdBase}-${tab.id}-tab`,
              'aria-controls': `${domIdBase}-${tab.id}-panel`,
            };
            return (
              <VTab
                key={tab.id}
                value={tab.id}
                {...tabAttrs}
                aria-label={invalid ? `${tab.title}: ${errorFieldCount} invalid fields` : undefined}
              >
                {invalid ? (
                  <VBadge content={errorFieldCount} color="error" inline aria-hidden="true">
                    {tab.title}
                  </VBadge>
                ) : (
                  tab.title
                )}
              </VTab>
            );
          })}
        </VTabs>
        {node.children.map(tab => this._renderTabPanel(domIdBase, tab, tab.id === activeTabId))}
      </div>
    );
  }

  private _renderTabPanel(domIdBase: string, tab: IResolvedFormLayoutTab, active: boolean) {
    return (
      <div
        id={`${domIdBase}-${tab.id}-panel`}
        role="tabpanel"
        aria-labelledby={`${domIdBase}-${tab.id}-tab`}
        hidden={!active}
        class="rounded border pa-4"
      >
        {tab.children.map(child => this._renderNode(child))}
      </div>
    );
  }

  private _gridColumns(
    sectionColumns?: IFormLayoutResponsiveColumns,
    leafSpan?: IFormLayoutResponsiveColumns,
  ) {
    const columnsDefault = sectionColumns?.default ?? 1;
    const spanDefault = leafSpan?.default ?? 1;
    const columnsMd = sectionColumns?.md ?? columnsDefault;
    const spanMd = leafSpan?.md ?? spanDefault;
    const columnsLg = sectionColumns?.lg ?? columnsMd;
    const spanLg = leafSpan?.lg ?? spanMd;
    const resolveWidth = (columns: number, span: number) =>
      (12 * Math.min(span, columns)) / columns;
    return {
      cols: resolveWidth(columnsDefault, spanDefault),
      md: resolveWidth(columnsMd, spanMd),
      lg: resolveWidth(columnsLg, spanLg),
    };
  }
}
