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
  roleName: string;
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

interface PolicyColumnOperation {
  token: number;
  actionKeys: string[];
  dataScope: TypeRbacPolicyDataScope;
}

interface PolicyScopeState {
  enabled: boolean;
  departmentIds?: TableIdentity[];
  departmentDataPending: boolean;
  departmentDataError: boolean;
}

interface PolicyColumnState {
  actionKeys: string[];
  allEqual: boolean;
  enabled: boolean;
  departmentIds?: TableIdentity[];
  departmentDataPending: boolean;
  departmentDataError: boolean;
}

@Controller()
export class ControllerBlockPolicyEditor extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  modelRbacPolicy: ModelRbacPolicy;
  modelDepartment: ModelDepartment;
  departmentDialogSelectedIds: TableIdentity[] = [];
  departmentDialogSaving = false;
  departmentColumnDialogOperation: PolicyColumnOperation | undefined;
  pendingColumnOperations: Record<string, PolicyColumnOperation | undefined> = {};
  nextColumnOperationToken = 0;
  expandedControllerNames: string[] = [];
  enabledScopes: Record<string, boolean | undefined> = {};

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

  get systemAdminPolicyProtected(): boolean {
    return this.roleName === 'systemAdmin';
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
    if (this.systemAdminPolicyProtected) return;
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
    if (this.systemAdminPolicyProtected) {
      return (
        <VAlert class={this.$props.class} type="info" variant="tonal">
          {locale.SystemAdminPolicyProtected()}
        </VAlert>
      );
    }
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
                  {this._renderScopeHeader(actions, dataScope)}
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

  private _renderScopeHeader(
    actions: IRbacPolicyCatalogActionView[],
    dataScope: TypeRbacPolicyDataScope,
    title = this._dataScopeTitle(dataScope),
  ) {
    const locale = this.scope.locale;
    const actionKeys = actions
      .filter(action => action.dataScopes.includes(dataScope))
      .map(action => action.actionKey);
    const state = this._getColumnState(actionKeys, dataScope);
    return (
      <div class="d-flex flex-column align-center ga-1">
        <span>{title}</span>
        <VCheckbox
          color="primary"
          density="compact"
          hideDetails
          aria-label={`${locale.ToggleColumn()} ${this._dataScopeTitle(dataScope)}`}
          modelValue={state.allEqual && state.enabled}
          indeterminate={!state.allEqual}
          disabled={
            actionKeys.length === 0 ||
            state.departmentDataPending ||
            state.departmentDataError ||
            this._isColumnPending(dataScope, actionKeys)
          }
          onUpdate:modelValue={() => {
            void this._toggleScopeColumn(actionKeys, dataScope);
          }}
        ></VCheckbox>
      </div>
    );
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
            {action.dataScopes.includes(dataScope) ? (
              <div class="d-flex justify-center">
                {this._renderScopeCheckbox(action.actionKey, dataScope)}
              </div>
            ) : undefined}
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
              <th scope="col">{this._renderScopeHeader(actions, 'all', locale.Authorization())}</th>
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
        modelValue={this._scopeEnabled(actionKey, dataScope, scope?.enabled ?? false)}
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
    const removeMutation = this.modelRbacPolicy.removeGrantDepartment(this.roleId, grant.id);
    return (
      <div class="d-flex flex-wrap align-center ga-2 ms-4">
        {mappings.map(mapping => (
          <VChip
            key={mapping.id}
            closable
            size="small"
            variant="tonal"
            aria-label={locale.RemoveDepartment()}
            disabled={
              removeMutation.isPending ||
              this._isMutationPending(grant.actionKey, 'customDepartments')
            }
            onClick:close={async () => {
              if (
                removeMutation.isPending ||
                this._isMutationPending(grant.actionKey, 'customDepartments')
              ) {
                return;
              }
              try {
                await removeMutation.mutateAsync(mapping.id);
              } catch (error) {
                await this._showMutationError(error);
              }
            }}
          >
            {this._departmentTitle(mapping.departmentId)}
          </VChip>
        ))}
        <VBtn
          icon="$plus"
          size="small"
          variant="text"
          aria-label={locale.ConfigureDepartments()}
          nativeOnClick={() => {
            this._openDepartmentDialog(grant);
          }}
        ></VBtn>
      </div>
    );
  }

  private _openDepartmentDialog(grant: TypeRbacGrant) {
    const locale = this.scope.locale as typeof this.scope.locale & {
      Cancel(): string;
      Save(): string;
    };
    const mappings = this._grantDepartments(grant).data?.list ?? [];
    this.departmentDialogSelectedIds = mappings.map(mapping => mapping.departmentId);
    const dialog = this.$appModal.dialog(
      {
        title: locale.ConfigureDepartments(),
        slotDefault: () => (
          <VTreeview
            items={this.departmentTree}
            itemTitle="name"
            itemValue="id"
            itemChildren="children"
            selectable
            selected={this.departmentDialogSelectedIds}
            selectStrategy="independent"
            openAll
            density="compact"
            onUpdate:selected={value => {
              this.departmentDialogSelectedIds = this._getSelectedIds(value);
            }}
          ></VTreeview>
        ),
        slotActions: modal => (
          <>
            <VBtn
              variant="text"
              disabled={this.departmentDialogSaving}
              nativeOnClick={() => modal.close()}
            >
              {locale.Cancel()}
            </VBtn>
            <VBtn
              color="primary"
              loading={this.departmentDialogSaving}
              disabled={this.departmentDialogSaving}
              nativeOnClick={async () => {
                await this._saveDepartmentDialog(grant, modal.close);
              }}
            >
              {locale.Save()}
            </VBtn>
          </>
        ),
        onClose: () => {
          this.departmentDialogSelectedIds = [];
        },
      },
      { maxWidth: 640 },
    );
    return dialog;
  }

  private async _saveDepartmentDialog(grant: TypeRbacGrant, close: () => void) {
    const mutation = this.modelRbacPolicy.replaceGrantDepartments(this.roleId, grant.id);
    if (this.departmentDialogSaving || mutation.isPending) return;
    this.departmentDialogSaving = true;
    try {
      await mutation.mutateAsync({
        mappings: this._grantDepartments(grant).data?.list ?? [],
        departmentIds: this.departmentDialogSelectedIds,
      });
      close();
    } catch (error) {
      await this._showMutationError(error);
    } finally {
      this.departmentDialogSaving = false;
    }
  }

  private async _setEnabled(
    actionKey: string,
    dataScope: TypeRbacPolicyDataScope,
    enabled: boolean,
  ) {
    const mutation = this.modelRbacPolicy.setGrantEnabled(this.roleId, actionKey, dataScope);
    if (mutation.isPending) return;
    const scopeKey = this._scopeKey(actionKey, dataScope);
    this.enabledScopes[scopeKey] = enabled;
    try {
      await mutation.mutateAsync(enabled);
    } catch (error) {
      delete this.enabledScopes[scopeKey];
      await this._showMutationError(error);
    }
  }

  private _scopeEnabled(actionKey: string, dataScope: TypeRbacPolicyDataScope, fallback: boolean) {
    const scopeKey = this._scopeKey(actionKey, dataScope);
    return this.enabledScopes[scopeKey] ?? fallback;
  }

  private _scopeKey(actionKey: string, dataScope: TypeRbacPolicyDataScope) {
    return `${actionKey}:${dataScope}`;
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

  private _getSelectedIds(value: unknown): TableIdentity[] {
    const selected = value instanceof Set ? [...value] : Array.isArray(value) ? value : [value];
    return selected.filter(
      (item): item is TableIdentity => typeof item === 'number' || typeof item === 'string',
    );
  }

  private _getColumnState(
    actionKeys: string[],
    dataScope: TypeRbacPolicyDataScope,
  ): PolicyColumnState {
    const states = actionKeys.map(actionKey => this._getScopeState(actionKey, dataScope));
    const firstState = states[0];
    if (!firstState) {
      return {
        actionKeys,
        allEqual: true,
        enabled: false,
        departmentDataPending: false,
        departmentDataError: false,
      };
    }
    const allEqual = states.every(state => this._scopeStatesEqual(firstState, state, dataScope));
    return {
      actionKeys,
      allEqual,
      enabled: firstState.enabled,
      departmentIds: allEqual ? firstState.departmentIds : undefined,
      departmentDataPending: states.some(state => state.departmentDataPending),
      departmentDataError: states.some(state => state.departmentDataError),
    };
  }

  private _getScopeState(actionKey: string, dataScope: TypeRbacPolicyDataScope): PolicyScopeState {
    const scope = this._findConfiguredScope(actionKey, dataScope);
    if (dataScope !== 'customDepartments') {
      return {
        enabled: this._scopeEnabled(actionKey, dataScope, scope?.enabled ?? false),
        departmentDataPending: false,
        departmentDataError: false,
      };
    }
    const grant = this.modelRbacPolicy.grant(this.roleId, actionKey, dataScope);
    const query = grant ? this._grantDepartments(grant) : undefined;
    return {
      enabled: this._scopeEnabled(actionKey, dataScope, scope?.enabled ?? false),
      departmentIds: query?.data?.list.map(mapping => mapping.departmentId) ?? [],
      departmentDataPending: query?.isPending ?? false,
      departmentDataError: query?.isError ?? false,
    };
  }

  private _scopeStatesEqual(
    left: PolicyScopeState,
    right: PolicyScopeState,
    dataScope: TypeRbacPolicyDataScope,
  ) {
    if (left.enabled !== right.enabled) return false;
    if (dataScope !== 'customDepartments') return true;
    return this._departmentIdsEqual(left.departmentIds ?? [], right.departmentIds ?? []);
  }

  private _departmentIdsEqual(left: TableIdentity[], right: TableIdentity[]) {
    const leftKeys = this._normalizeDepartmentIds(left);
    const rightKeys = this._normalizeDepartmentIds(right);
    return (
      leftKeys.length === rightKeys.length && leftKeys.every((id, index) => id === rightKeys[index])
    );
  }

  private _normalizeDepartmentIds(ids: TableIdentity[]): string[] {
    return [...new Set(ids.map(id => String(id)))].toSorted();
  }

  private _columnKey(dataScope: TypeRbacPolicyDataScope, actionKeys: string[]) {
    return `${dataScope}:${[...actionKeys].toSorted().join('|')}`;
  }

  private _isColumnPending(dataScope: TypeRbacPolicyDataScope, actionKeys: string[]) {
    const actionKeySet = new Set(actionKeys);
    return (
      Object.values(this.pendingColumnOperations).some(
        operation =>
          operation?.dataScope === dataScope &&
          operation.actionKeys.some(actionKey => actionKeySet.has(actionKey)),
      ) ||
      actionKeys.some(
        actionKey =>
          this.modelRbacPolicy.setGrantEnabled(this.roleId, actionKey, dataScope).isPending,
      )
    );
  }

  private async _toggleScopeColumn(actionKeys: string[], dataScope: TypeRbacPolicyDataScope) {
    const state = this._getColumnState(actionKeys, dataScope);
    if (
      actionKeys.length === 0 ||
      state.departmentDataPending ||
      state.departmentDataError ||
      this._isColumnPending(dataScope, actionKeys)
    ) {
      return;
    }
    const operation: PolicyColumnOperation = {
      token: ++this.nextColumnOperationToken,
      actionKeys,
      dataScope,
    };
    this.pendingColumnOperations[this._columnKey(dataScope, actionKeys)] = operation;
    const enabled = state.allEqual ? !state.enabled : true;
    if (dataScope === 'customDepartments' && enabled) {
      this.departmentColumnDialogOperation = operation;
      this.departmentDialogSelectedIds = state.allEqual ? (state.departmentIds ?? []) : [];
      this._openDepartmentColumnDialog(operation);
      return;
    }
    const completed = await this._applyColumnOperation(operation, enabled);
    if (!completed) this._releaseColumnOperation(operation);
  }

  private _openDepartmentColumnDialog(operation: PolicyColumnOperation) {
    const locale = this.scope.locale as typeof this.scope.locale & {
      Cancel(): string;
      Save(): string;
    };
    this.$appModal.dialog(
      {
        title: locale.ConfigureColumnDepartments(),
        slotDefault: () => (
          <>
            <p class="text-body-2 text-medium-emphasis">
              {locale.ConfigureColumnDepartmentsHint()}
            </p>
            <VTreeview
              class="mt-4"
              items={this.departmentTree}
              itemTitle="name"
              itemValue="id"
              itemChildren="children"
              selectable
              selected={this.departmentDialogSelectedIds}
              selectStrategy="independent"
              openAll
              density="compact"
              onUpdate:selected={value => {
                this.departmentDialogSelectedIds = this._getSelectedIds(value);
              }}
            ></VTreeview>
          </>
        ),
        slotActions: modal => (
          <>
            <VBtn
              variant="text"
              disabled={this.departmentDialogSaving}
              nativeOnClick={() => modal.close()}
            >
              {locale.Cancel()}
            </VBtn>
            <VBtn
              color="primary"
              loading={this.departmentDialogSaving}
              disabled={this.departmentDialogSaving}
              nativeOnClick={async () => {
                await this._saveDepartmentColumnDialog(operation, modal.close);
              }}
            >
              {locale.Save()}
            </VBtn>
          </>
        ),
        onClose: () => {
          this.departmentDialogSelectedIds = [];
          this.departmentColumnDialogOperation = undefined;
          this._releaseColumnOperation(operation);
        },
      },
      { maxWidth: 640 },
    );
  }

  private async _saveDepartmentColumnDialog(operation: PolicyColumnOperation, close: () => void) {
    if (
      this.departmentDialogSaving ||
      this.departmentColumnDialogOperation?.token !== operation.token
    ) {
      return;
    }
    this.departmentDialogSaving = true;
    try {
      const completed = await this._applyColumnOperation(
        operation,
        true,
        this.departmentDialogSelectedIds,
      );
      if (completed) close();
    } finally {
      this.departmentDialogSaving = false;
    }
  }

  private async _applyColumnOperation(
    operation: PolicyColumnOperation,
    enabled: boolean,
    departmentIds?: TableIdentity[],
  ) {
    const mutation = this.modelRbacPolicy.setGrantColumn(
      this.roleId,
      operation.dataScope,
      operation.actionKeys,
    );
    if (mutation.isPending) return false;
    for (const actionKey of operation.actionKeys) {
      this.enabledScopes[this._scopeKey(actionKey, operation.dataScope)] = enabled;
    }
    try {
      await mutation.mutateAsync({
        actionKeys: operation.actionKeys,
        enabled,
        departmentIds,
      });
      await this._reloadRolePolicy();
      this._clearColumnEnabledOverrides(operation);
      this._releaseColumnOperation(operation);
      return true;
    } catch (error) {
      this._clearColumnEnabledOverrides(operation);
      await this._reloadRolePolicy();
      await this._showMutationError(error);
      return false;
    }
  }

  private _clearColumnEnabledOverrides(operation: PolicyColumnOperation) {
    for (const actionKey of operation.actionKeys) {
      delete this.enabledScopes[this._scopeKey(actionKey, operation.dataScope)];
    }
  }

  private _releaseColumnOperation(operation: PolicyColumnOperation) {
    const operationKey = this._columnKey(operation.dataScope, operation.actionKeys);
    if (this.pendingColumnOperations[operationKey]?.token === operation.token) {
      delete this.pendingColumnOperations[operationKey];
    }
  }

  private async _reloadRolePolicy() {
    await Promise.all([this.queryConfiguration.refetch(), this.queryGrants.refetch()]);
    await Promise.all(this.queryGrantDepartments.map(query => query.refetch()));
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
    return (
      this.modelRbacPolicy.setGrantEnabled(this.roleId, actionKey, dataScope).isPending ||
      Object.values(this.pendingColumnOperations).some(
        operation => operation?.dataScope === dataScope && operation.actionKeys.includes(actionKey),
      )
    );
  }

  private async _showMutationError(error: unknown) {
    await this.$performCommand('start-commands:alert', {
      type: 'error',
      text: error instanceof Error ? error.message : String(error),
    });
  }
}
