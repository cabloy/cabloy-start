import type { TableIdentity } from 'table-identity';
import type { IComponentOptions } from 'zova';
import type { IResourceBlockOptionsBase } from 'zova-module-a-openapi';
import type { ModelDepartment } from 'zova-module-admin-department';

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
  VTable,
  VTreeview,
  VTreeviewItem,
} from 'vuetify/components';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

import type {
  IRbacPolicyCatalogAction,
  IRbacPolicyCatalogActionView,
  IRbacPolicyEditorAction,
  ModelRbacPolicy,
  TypeRbacGrant,
  TypeRbacPolicyDataScope,
} from '../../model/rbacPolicy.ts';

import { groupRbacPolicyActions } from '../../model/rbacPolicy.js';

export interface ControllerBlockPolicyEditorProps extends IResourceBlockOptionsBase {
  roleId: TableIdentity;
}

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'admin-rbac:blockPolicyEditor'?: ControllerBlockPolicyEditorProps;
  }
}

interface DepartmentTreeItem {
  id: TableIdentity;
  name: string;
  children: DepartmentTreeItem[];
}

type PolicyAction = IRbacPolicyEditorAction;

@Controller()
export class ControllerBlockPolicyEditor extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  modelRbacPolicy: ModelRbacPolicy;
  modelDepartment: ModelDepartment;
  selectedGrantId: TableIdentity | undefined;
  selectedDepartmentId: TableIdentity | undefined;
  expandedControllerNames: string[] = [];

  get roleId(): TableIdentity {
    const roleId = this.$props.roleId;
    if (roleId === undefined) throw new Error('should provide Role id');
    return roleId;
  }

  get queryCatalog() {
    return this.modelRbacPolicy.catalog();
  }

  get queryConfiguration() {
    return this.modelRbacPolicy.roleConfiguration(this.roleId);
  }

  get queryGrants() {
    return this.modelRbacPolicy.grants(this.roleId);
  }

  get queryDepartmentTree() {
    return this.modelDepartment.tree();
  }

  get catalog(): IRbacPolicyCatalogAction[] {
    return this.queryCatalog.data?.list ?? [];
  }

  get configuration(): PolicyAction[] {
    return this.queryConfiguration.data?.list ?? [];
  }

  get grants(): TypeRbacGrant[] {
    return this.queryGrants.data?.list ?? [];
  }

  get departmentTree(): DepartmentTreeItem[] {
    return (this.queryDepartmentTree.data?.list ?? []) as DepartmentTreeItem[];
  }

  get queryGrantDepartments() {
    return this.grants
      .filter(grant => grant.dataScope === 'customDepartments')
      .map(grant => this._grantDepartments(grant));
  }

  private _grantDepartments(grant: TypeRbacGrant) {
    return this.modelRbacPolicy.grantDepartments(grant.id);
  }

  protected async __init__() {
    this.modelRbacPolicy = (await this.bean._getBeanSelector(
      'admin-rbac.model.rbacPolicy',
      true,
    )) as ModelRbacPolicy;
    this.modelDepartment = (await this.bean._getBeanSelector(
      'admin-department.model.department',
      true,
    )) as ModelDepartment;
    try {
      await Promise.all([
        this.queryCatalog.suspense(),
        this.queryConfiguration.suspense(),
        this.queryGrants.suspense(),
        this.queryDepartmentTree.suspense(),
      ]);
      await Promise.all(this.queryGrantDepartments.map(query => query.suspense()));
      this.expandedControllerNames = groupRbacPolicyActions(this.catalog).map(
        group => group.controllerBeanFullName,
      );
    } catch {
      // Render the query error state instead of presenting an incomplete policy editor.
    }
  }

  protected render() {
    const locale = this.scope.locale;
    if (this._isPending()) {
      return (
        <VCard class={this.$props.class} variant="outlined">
          <VCardText class="d-flex justify-center">
            <VProgressCircular indeterminate></VProgressCircular>
          </VCardText>
        </VCard>
      );
    }
    if (this._isError()) {
      return (
        <VAlert class={this.$props.class} type="error" variant="tonal">
          <div>{locale.LoadFailed()}</div>
          <VBtn
            class="mt-3"
            variant="outlined"
            nativeOnClick={async () => {
              await Promise.all([
                this.queryCatalog.refetch(),
                this.queryConfiguration.refetch(),
                this.queryGrants.refetch(),
                this.queryDepartmentTree.refetch(),
              ]);
              await Promise.all(this.queryGrantDepartments.map(query => query.refetch()));
            }}
          >
            {locale.Retry()}
          </VBtn>
        </VAlert>
      );
    }
    const groups = groupRbacPolicyActions(this.catalog);
    return (
      <VExpansionPanels
        class={this.$props.class}
        modelValue={this.expandedControllerNames}
        multiple
        variant="accordion"
        static
        onUpdate:modelValue={value => {
          this.expandedControllerNames = Array.isArray(value)
            ? value.filter((item): item is string => typeof item === 'string')
            : [];
        }}
      >
        {groups.map(group => this._renderControllerGroup(group))}
      </VExpansionPanels>
    );
  }

  private _renderControllerGroup(group: {
    controllerBeanFullName: string;
    controllerSummary?: string;
    actions: IRbacPolicyCatalogActionView[];
  }) {
    const scopedActions = group.actions.filter(action => this._hasDataScopes(action));
    const authorizationActions = group.actions.filter(action => !this._hasDataScopes(action));
    return (
      <VExpansionPanel key={group.controllerBeanFullName} value={group.controllerBeanFullName}>
        <VExpansionPanelTitle
          v-slots={{
            actions: ({ expanded }: { expanded: boolean }) => (
              <>
                <span class="text-caption text-medium-emphasis me-2">
                  {group.controllerBeanFullName}
                </span>
                <VIcon icon={expanded ? '$collapse' : '$expand'}></VIcon>
              </>
            ),
          }}
        >
          <span>
            {this._controllerSummary(group.controllerSummary, group.controllerBeanFullName)}
          </span>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="d-flex flex-column ga-4">
            {scopedActions.length > 0 ? this._renderScopedActionsTable(scopedActions) : undefined}
            {authorizationActions.length > 0
              ? this._renderAuthorizationActionsTable(authorizationActions)
              : undefined}
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    );
  }

  private _renderScopedActionsTable(actions: IRbacPolicyCatalogActionView[]) {
    const locale = this.scope.locale;
    const dataScopes: TypeRbacPolicyDataScope[] = [
      'all',
      'customDepartments',
      'ownDepartment',
      'ownDepartmentAndDescendants',
      'mine',
    ];
    return (
      <div class="overflow-x-auto">
        <VTable class="w-100">
          <thead>
            <tr>
              <th scope="col">{locale.ActionKey()}</th>
              {dataScopes.map(dataScope => (
                <th key={dataScope} scope="col">
                  {this._dataScopeTitle(dataScope)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{actions.map(action => this._renderScopedActionRow(action, dataScopes))}</tbody>
        </VTable>
      </div>
    );
  }

  private _dataScopeTitle(dataScope: TypeRbacPolicyDataScope) {
    const locale = this.scope.locale;
    switch (dataScope) {
      case 'all':
        return locale.DataScopeAll();
      case 'customDepartments':
        return locale.DataScopeCustomDepartments();
      case 'ownDepartment':
        return locale.DataScopeOwnDepartment();
      case 'ownDepartmentAndDescendants':
        return locale.DataScopeOwnDepartmentAndDescendants();
      case 'mine':
        return locale.DataScopeMine();
    }
  }

  private _renderScopedActionRow(
    action: IRbacPolicyCatalogActionView,
    dataScopes: TypeRbacPolicyDataScope[],
  ) {
    return (
      <tr key={action.actionKey}>
        {this._renderActionIdentifier(action)}
        {dataScopes.map(dataScope => (
          <td key={dataScope} class="vertical-align-top">
            {action.dataScopes.includes(dataScope)
              ? this._renderScopeCheckbox(action.actionKey, dataScope)
              : undefined}
            {dataScope === 'customDepartments' && action.dataScopes.includes(dataScope)
              ? this._renderCustomDepartmentsCell(action.actionKey)
              : undefined}
          </td>
        ))}
      </tr>
    );
  }

  private _renderAuthorizationActionsTable(actions: IRbacPolicyCatalogActionView[]) {
    const locale = this.scope.locale;
    return (
      <div class="overflow-x-auto">
        <VTable class="w-100">
          <thead>
            <tr>
              <th scope="col">{locale.ActionKey()}</th>
              <th scope="col">{locale.Authorization()}</th>
            </tr>
          </thead>
          <tbody>
            {actions.map(action => (
              <tr key={action.actionKey}>
                {this._renderActionIdentifier(action)}
                <td>{this._renderScopeCheckbox(action.actionKey, 'all')}</td>
              </tr>
            ))}
          </tbody>
        </VTable>
      </div>
    );
  }

  private _controllerSummary(summary: string | undefined, controllerBeanFullName: string) {
    if (summary?.trim()) return summary;
    const shortName = controllerBeanFullName.split('.').at(-1) ?? controllerBeanFullName;
    return shortName
      ? `${shortName[0].toUpperCase()}${shortName.slice(1)}`
      : controllerBeanFullName;
  }

  private _renderActionIdentifier(action: IRbacPolicyCatalogActionView) {
    return (
      <th scope="row">
        <div class="d-flex flex-column align-start ga-1">
          <span>{action.actionSummary || action.action}</span>
          {action.actionSummary ? (
            <span class="text-caption text-medium-emphasis">{action.action}</span>
          ) : undefined}
        </div>
      </th>
    );
  }

  private _renderScopeCheckbox(actionKey: string, dataScope: TypeRbacPolicyDataScope) {
    const scope = this._findConfiguredScope(actionKey, dataScope);
    return (
      <VCheckbox
        color="primary"
        density="compact"
        hideDetails
        modelValue={scope?.enabled ?? false}
        aria-label={`${actionKey} ${dataScope}`}
        disabled={this._isMutationPending(actionKey, dataScope)}
        onUpdate:modelValue={value => {
          void this._setEnabled(actionKey, dataScope, Boolean(value));
        }}
      ></VCheckbox>
    );
  }

  private _renderCustomDepartmentsCell(actionKey: string) {
    const locale = this.scope.locale;
    const scope = this._findConfiguredScope(actionKey, 'customDepartments');
    const grant = this.modelRbacPolicy.grant(this.roleId, actionKey, 'customDepartments');
    if (!scope?.enabled || !grant) return undefined;
    return (
      <div class="d-flex flex-column ga-2">
        {!scope.customDepartmentsConfigured ? (
          <span class="text-caption text-warning">{locale.DepartmentsNotConfigured()}</span>
        ) : undefined}
        {this._renderCustomDepartments(grant)}
      </div>
    );
  }

  private _hasDataScopes(action: IRbacPolicyCatalogActionView) {
    return action.dataScopes.some(dataScope => dataScope !== 'all');
  }

  private _renderCustomDepartments(grant: TypeRbacGrant) {
    const locale = this.scope.locale;
    const query = this._grantDepartments(grant);
    if (query.isPending) return <VProgressCircular indeterminate size="20"></VProgressCircular>;
    if (query.isError) return <span class="text-error">{locale.LoadFailed()}</span>;
    const mappings = query.data?.list ?? [];
    const activated =
      this.selectedGrantId === grant.id && this.selectedDepartmentId !== undefined
        ? [this.selectedDepartmentId]
        : [];
    return (
      <div class="d-flex flex-column ga-2 ms-4">
        <VTreeview
          items={this.departmentTree}
          itemTitle="name"
          itemValue="id"
          itemChildren="children"
          activatable
          activated={activated}
          activeStrategy="single-independent"
          openAll
          density="compact"
          onUpdate:activated={value => {
            this.selectedGrantId = grant.id;
            this.selectedDepartmentId = this._getActivatedId(value);
          }}
          v-slots={{
            header: ({ props: itemProps, item }: any) => this._renderTreeItem(itemProps, item),
            item: ({ props: itemProps, item }: any) => this._renderTreeItem(itemProps, item),
          }}
        ></VTreeview>
        <VBtn
          class="align-self-start"
          size="small"
          variant="outlined"
          disabled={
            this.selectedGrantId !== grant.id ||
            this.selectedDepartmentId === undefined ||
            this.modelRbacPolicy.addGrantDepartment(this.roleId, grant.id).isPending
          }
          nativeOnClick={async () => {
            const departmentId = this.selectedDepartmentId;
            if (departmentId === undefined) return;
            const mutation = this.modelRbacPolicy.addGrantDepartment(this.roleId, grant.id);
            if (mutation.isPending) return;
            try {
              await mutation.mutateAsync(departmentId);
            } catch (error) {
              await this._showMutationError(error);
            }
          }}
        >
          {locale.AddDepartment()}
        </VBtn>
        <div class="d-flex flex-wrap ga-2">
          {mappings.map(mapping => (
            <VChip
              key={mapping.id}
              closable
              size="small"
              variant="tonal"
              aria-label={locale.RemoveDepartment()}
              disabled={this.modelRbacPolicy.removeGrantDepartment(this.roleId, grant.id).isPending}
              onClick:close={async () => {
                const mutation = this.modelRbacPolicy.removeGrantDepartment(this.roleId, grant.id);
                if (mutation.isPending) return;
                try {
                  await mutation.mutateAsync(mapping.id);
                } catch (error) {
                  await this._showMutationError(error);
                }
              }}
            >
              {this._departmentTitle(mapping.departmentId)}
            </VChip>
          ))}
        </div>
      </div>
    );
  }

  private _renderTreeItem(itemProps: any, item: DepartmentTreeItem) {
    return (
      <VTreeviewItem
        {...itemProps}
        onClick={(event: MouseEvent) => {
          itemProps.onClick?.(event);
          this.selectedDepartmentId = item.id;
        }}
      ></VTreeviewItem>
    );
  }

  private async _setEnabled(
    actionKey: string,
    dataScope: TypeRbacPolicyDataScope,
    enabled: boolean,
  ) {
    const mutation = this.modelRbacPolicy.setGrantEnabled(this.roleId, actionKey, dataScope);
    if (mutation.isPending) return;
    try {
      await mutation.mutateAsync(enabled);
    } catch (error) {
      await this._showMutationError(error);
    }
  }

  private _findConfiguredScope(actionKey: string, dataScope: TypeRbacPolicyDataScope) {
    return this.configuration
      .find(action => action.actionKey === actionKey)
      ?.dataScopes.find(scope => scope.dataScope === dataScope);
  }

  private _departmentTitle(id: TableIdentity) {
    return this._findDepartment(this.departmentTree, id)?.name ?? String(id);
  }

  private _findDepartment(
    items: DepartmentTreeItem[],
    id: TableIdentity,
  ): DepartmentTreeItem | undefined {
    for (const item of items) {
      if (String(item.id) === String(id)) return item;
      const child = this._findDepartment(item.children, id);
      if (child) return child;
    }
    return undefined;
  }

  private _getActivatedId(value: unknown): TableIdentity | undefined {
    const activated =
      value instanceof Set ? value.values().next().value : Array.isArray(value) ? value[0] : value;
    if (typeof activated === 'number' || typeof activated === 'string') return activated;
    return undefined;
  }

  private _isPending() {
    return (
      this.queryCatalog.isPending ||
      this.queryConfiguration.isPending ||
      this.queryGrants.isPending ||
      this.queryDepartmentTree.isPending ||
      this.queryGrantDepartments.some(query => query.isPending)
    );
  }

  private _isError() {
    return (
      this.queryCatalog.isError ||
      this.queryConfiguration.isError ||
      this.queryGrants.isError ||
      this.queryDepartmentTree.isError ||
      this.queryGrantDepartments.some(query => query.isError)
    );
  }

  private _isMutationPending(actionKey: string, dataScope: TypeRbacPolicyDataScope) {
    return this.modelRbacPolicy.setGrantEnabled(this.roleId, actionKey, dataScope).isPending;
  }

  private async _showMutationError(error: unknown) {
    await this.$performCommand('start-commands:alert', {
      type: 'error',
      text: error instanceof Error ? error.message : String(error),
    });
  }
}
