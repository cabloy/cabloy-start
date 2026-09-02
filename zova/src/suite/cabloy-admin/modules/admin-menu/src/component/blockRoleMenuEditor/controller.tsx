import type { TableIdentity } from 'table-identity';
import type { IComponentOptions } from 'zova';
import type { IResourceBlockOptionsBase } from 'zova-module-a-openapi';

import {
  VAlert,
  VBtn,
  VCard,
  VCardText,
  VCheckbox,
  VChip,
  VExpansionPanel,
  VExpansionPanelText,
  VExpansionPanelTitle,
  VExpansionPanels,
  VIcon,
  VProgressCircular,
  VTreeview,
} from 'vuetify/components';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

import type { IRoleMenuEnabledBatchData, ModelRoleMenu } from '../../model/roleMenu.ts';
import type { IRoleMenuEditorOperation, RoleMenuEditorLayers } from './state.js';
import type { IRoleMenuTreeGroup, IRoleMenuTreeMenu, IRoleMenuTreeNode } from './tree.js';

import {
  applyRoleMenuEditorOperation,
  commitRoleMenuEditorOperation,
  getRoleMenuEditorEnabled,
  normalizeRoleMenuEditorChanges,
  reconcileRoleMenuEditorLayers,
  rejectRoleMenuEditorOperation,
} from './state.js';
import { createRoleMenuTree, getRoleMenuTreeGroupState } from './tree.js';

export interface ControllerBlockRoleMenuEditorProps extends IResourceBlockOptionsBase {
  roleId: TableIdentity;
  roleName: string;
}

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'admin-menu:blockRoleMenuEditor'?: ControllerBlockRoleMenuEditorProps;
  }
}

@Controller()
export class ControllerBlockRoleMenuEditor extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  modelRoleMenu: ModelRoleMenu;
  mutationSetEnabledBatch: ReturnType<ModelRoleMenu['setEnabledBatch']>;
  menuLayers: RoleMenuEditorLayers = {};
  menuOperations: IRoleMenuEditorOperation[] = [];
  menuOperationToken = 0;
  menuOperationsDraining = false;
  expandedSiteNames: string[] = [];

  get roleId(): TableIdentity {
    const roleId = this.$props.roleId;
    if (roleId === undefined) throw new Error('should provide Role id');
    return roleId;
  }

  get roleName(): string {
    const roleName = this.$props.roleName;
    if (roleName === undefined) throw new Error('should provide Role name');
    return roleName;
  }

  get systemAdminMenuAuthorizationProtected(): boolean {
    return this.roleName === 'systemAdmin';
  }

  get queryConfiguration() {
    return this.modelRoleMenu.roleConfiguration(this.roleId);
  }

  get tree() {
    return (this.queryConfiguration.data?.list ?? []).map(createRoleMenuTree);
  }

  protected async __init__() {
    if (this.systemAdminMenuAuthorizationProtected) return;
    this.modelRoleMenu = (await this.bean._getBeanSelector(
      'admin-menu.model.roleMenu',
      true,
    )) as ModelRoleMenu;
    this.mutationSetEnabledBatch = this.modelRoleMenu.setEnabledBatch(this.roleId);
    this.$watch(
      () => this.queryConfiguration.data,
      () => {
        this._reconcileMenuLayers();
      },
    );
    try {
      await this.queryConfiguration.suspense();
      this.expandedSiteNames = this.tree.map(site => site.ssrSiteName);
    } catch {
      // Render the query error state instead of presenting incomplete authorization controls.
    }
  }

  protected render() {
    const locale = this.scope.locale;
    if (this.systemAdminMenuAuthorizationProtected) {
      return (
        <VAlert class={this.$props.class} type="info" variant="tonal">
          {locale.SystemAdminMenuAuthorizationProtected()}
        </VAlert>
      );
    }
    if (this.queryConfiguration.isPending) {
      return (
        <VCard class={this.$props.class} variant="outlined">
          <VCardText class="d-flex justify-center">
            <VProgressCircular indeterminate></VProgressCircular>
          </VCardText>
        </VCard>
      );
    }
    if (this.queryConfiguration.isError) {
      return (
        <VAlert class={this.$props.class} type="error" variant="tonal">
          <div>{locale.MenuAuthorizationLoadFailed()}</div>
          <VBtn
            class="mt-3"
            variant="outlined"
            nativeOnClick={async () => {
              await this.queryConfiguration.refetch();
            }}
          >
            {locale.Retry()}
          </VBtn>
        </VAlert>
      );
    }
    if (this.tree.length === 0) {
      return (
        <VCard class={this.$props.class} variant="outlined">
          <VCardText class="text-medium-emphasis">{locale.NoMenuEntries()}</VCardText>
        </VCard>
      );
    }
    return (
      <VExpansionPanels
        class={this.$props.class}
        modelValue={this.expandedSiteNames}
        multiple
        variant="accordion"
        static
        onUpdate:modelValue={value => {
          this.expandedSiteNames = Array.isArray(value)
            ? value.filter((item): item is string => typeof item === 'string')
            : [];
        }}
      >
        {this.tree.map(site => this._renderSite(site))}
      </VExpansionPanels>
    );
  }

  private _renderSite(site: ReturnType<typeof createRoleMenuTree>) {
    return (
      <VExpansionPanel key={site.ssrSiteName} value={site.ssrSiteName}>
        <VExpansionPanelTitle
          v-slots={{
            actions: ({ expanded }: { expanded: boolean }) => (
              <>
                <span class="text-caption text-medium-emphasis me-2">{site.ssrSiteName}</span>
                <VIcon icon={expanded ? '$collapse' : '$expand'}></VIcon>
              </>
            ),
          }}
        >
          <span>{site.title}</span>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          {site.children.length ? (
            <VTreeview
              items={site.children}
              itemTitle="title"
              itemValue="id"
              itemChildren="children"
              openAll
              density="compact"
              v-slots={{
                title: ({ item }: { item: IRoleMenuTreeNode }) => this._renderTreeNode(item),
              }}
            ></VTreeview>
          ) : (
            <span class="text-body-2 text-medium-emphasis">
              {this.scope.locale.NoMenuEntries()}
            </span>
          )}
        </VExpansionPanelText>
      </VExpansionPanel>
    );
  }

  private _renderTreeNode(node: IRoleMenuTreeNode) {
    return node.kind === 'group' ? this._renderGroup(node) : this._renderMenu(node);
  }

  private _renderGroup(group: IRoleMenuTreeGroup) {
    const locale = this.scope.locale;
    const state = getRoleMenuTreeGroupState(group, menu => this._menuEnabled(menu));
    return (
      <div class="d-flex min-width-0 align-start ga-2 py-1">
        {state.menus.length > 0 ? (
          <VCheckbox
            class="mt-n2"
            color="primary"
            density="compact"
            hideDetails
            modelValue={state.enabled}
            indeterminate={state.indeterminate}
            aria-label={`${locale.ToggleMenuGroup()} ${group.title || group.ssrMenuGroupName}`}
            onUpdate:modelValue={() => {
              this._toggleGroup(group);
            }}
          ></VCheckbox>
        ) : undefined}
        <div class="d-flex min-width-0 flex-grow-1 flex-column pt-1">
          <div class="d-flex min-width-0 align-center ga-2">
            <span class="flex-grow-1 text-truncate">{group.title || group.ssrMenuGroupName}</span>
            <span class="text-caption text-medium-emphasis text-no-wrap ms-auto">
              {group.onionName}
            </span>
          </div>
          {group.description ? (
            <span class="text-caption text-medium-emphasis">{group.description}</span>
          ) : undefined}
        </div>
      </div>
    );
  }

  private _renderMenu(menu: IRoleMenuTreeMenu) {
    const locale = this.scope.locale;
    const enabled = this._menuEnabled(menu);
    return (
      <div class="d-flex min-width-0 align-start ga-2 py-1">
        {menu.configurable ? (
          <VCheckbox
            class="mt-n2"
            color="primary"
            density="compact"
            hideDetails
            modelValue={enabled}
            aria-label={`${locale.ToggleMenu()} ${menu.title || menu.ssrMenuName}`}
            onUpdate:modelValue={value => {
              this._setEnabled(menu, Boolean(value));
            }}
          ></VCheckbox>
        ) : (
          <VChip class="mt-1" size="x-small" variant="tonal">
            {locale.Public()}
          </VChip>
        )}
        <div class="d-flex min-width-0 flex-grow-1 flex-column pt-1">
          <div class="d-flex min-width-0 align-center ga-2">
            <span class="flex-grow-1 text-truncate">{menu.title || menu.ssrMenuName}</span>
            <span class="text-caption text-medium-emphasis text-no-wrap ms-auto">
              {menu.onionName}
            </span>
          </div>
          {menu.description ? (
            <span class="text-caption text-medium-emphasis">{menu.description}</span>
          ) : undefined}
        </div>
      </div>
    );
  }

  private _menuEnabled(menu: IRoleMenuTreeMenu) {
    return getRoleMenuEditorEnabled(this.menuLayers, menu, menu.enabled);
  }

  private _setEnabled(menu: IRoleMenuTreeMenu, enabled: boolean) {
    if (this._menuEnabled(menu) === enabled) return;
    this._enqueueMenuOperation([
      {
        ssrSiteName: menu.ssrSiteName,
        ssrMenuName: menu.ssrMenuName,
        enabled,
      },
    ]);
  }

  private _toggleGroup(group: IRoleMenuTreeGroup) {
    const state = getRoleMenuTreeGroupState(group, menu => this._menuEnabled(menu));
    this._enqueueMenuOperation(
      state.menus
        .filter(menu => this._menuEnabled(menu) !== state.targetEnabled)
        .map(menu => ({
          ssrSiteName: menu.ssrSiteName,
          ssrMenuName: menu.ssrMenuName,
          enabled: state.targetEnabled,
        })),
    );
  }

  private _enqueueMenuOperation(changes: IRoleMenuEnabledBatchData[]) {
    const normalizedChanges = normalizeRoleMenuEditorChanges(changes);
    if (normalizedChanges.length === 0) return;
    const operation: IRoleMenuEditorOperation = {
      token: ++this.menuOperationToken,
      changes: normalizedChanges,
    };
    applyRoleMenuEditorOperation(this.menuLayers, operation);
    this.menuOperations.push(operation);
    void this._drainMenuOperations();
  }

  private async _drainMenuOperations() {
    if (this.menuOperationsDraining) return;
    this.menuOperationsDraining = true;
    try {
      while (this.menuOperations.length > 0) {
        const operation = this.menuOperations.shift();
        if (!operation) continue;
        try {
          await this.mutationSetEnabledBatch.mutateAsync(operation.changes);
          commitRoleMenuEditorOperation(this.menuLayers, operation);
        } catch (error) {
          rejectRoleMenuEditorOperation(this.menuLayers, operation);
          void this._showMutationError(error);
        } finally {
          this._reconcileMenuLayers();
        }
      }
    } finally {
      this.menuOperationsDraining = false;
      if (this.menuOperations.length > 0) void this._drainMenuOperations();
    }
  }

  private _reconcileMenuLayers() {
    reconcileRoleMenuEditorLayers(this.menuLayers, key => this._getCommittedMenuEnabled(key));
  }

  private _getCommittedMenuEnabled(key: string) {
    for (const site of this.queryConfiguration.data?.list ?? []) {
      for (const menu of site.menus) {
        if (
          this._menuKey({ ssrSiteName: site.ssrSiteName, ssrMenuName: menu.ssrMenuName }) === key
        ) {
          return menu.enabled;
        }
      }
    }
    return undefined;
  }

  private _menuKey(menu: Pick<IRoleMenuTreeMenu, 'ssrSiteName' | 'ssrMenuName'>) {
    return JSON.stringify([menu.ssrSiteName, menu.ssrMenuName]);
  }

  private async _showMutationError(error: unknown) {
    await this.$performCommand('start-commands:alert', {
      type: 'error',
      text: error instanceof Error ? error.message : String(error),
    });
  }
}
