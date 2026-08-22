import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type { ApiApiAdminRbacRbacGrantselectResponseBody } from '../api/adminRbacRbacGrant.js';
import type { ApiApiAdminRbacRbacGrantDepartmentselectResponseBody } from '../api/adminRbacRbacGrantDepartment.js';
import type {
  ApiApiAdminRbacRbacPolicycatalogResponseBody,
  ApiApiAdminRbacRbacPolicyroleConfigurationResponseBody,
} from '../api/adminRbacRbacPolicy.js';

export interface IModelOptionsRbacPolicy extends IDecoratorModelOptions {}

export type TypeRbacPolicyDataScope =
  ApiApiAdminRbacRbacPolicycatalogResponseBody['list'][number]['dataScopes'][number];

export type TypeRbacGrant = ApiApiAdminRbacRbacGrantselectResponseBody['list'][number];
export type TypeRbacGrantDepartment =
  ApiApiAdminRbacRbacGrantDepartmentselectResponseBody['list'][number];

export interface IRbacPolicyCatalogAction {
  controllerBeanFullName: string;
  controllerSummary?: string;
  action: string;
  actionSummary?: string;
  actionKey: string;
  dataScopes: TypeRbacPolicyDataScope[];
}

export interface IRbacPolicyCatalogActionView extends IRbacPolicyCatalogAction {}

export interface IRbacPolicyCatalogActionGroup {
  controllerBeanFullName: string;
  controllerSummary?: string;
  actions: IRbacPolicyCatalogActionView[];
}

export function parseRbacActionKey(
  actionKey: string,
): Pick<IRbacPolicyCatalogActionView, 'controllerBeanFullName' | 'action'> {
  const separatorIndex = actionKey.indexOf('#');
  if (separatorIndex <= 0 || separatorIndex === actionKey.length - 1) {
    return { controllerBeanFullName: actionKey, action: actionKey };
  }
  return {
    controllerBeanFullName: actionKey.slice(0, separatorIndex),
    action: actionKey.slice(separatorIndex + 1),
  };
}

export function groupRbacPolicyActions(
  actions: IRbacPolicyCatalogAction[],
): IRbacPolicyCatalogActionGroup[] {
  const groups = new Map<string, IRbacPolicyCatalogActionGroup>();
  for (const action of actions) {
    const parsed = parseRbacActionKey(action.actionKey);
    const controllerBeanFullName = action.controllerBeanFullName || parsed.controllerBeanFullName;
    const actionName = action.action || parsed.action;
    const group = groups.get(controllerBeanFullName) ?? {
      controllerBeanFullName,
      controllerSummary: action.controllerSummary,
      actions: [],
    };
    if (!group.controllerSummary && action.controllerSummary) {
      group.controllerSummary = action.controllerSummary;
    }
    group.actions.push({
      ...action,
      controllerBeanFullName,
      action: actionName,
    });
    groups.set(controllerBeanFullName, group);
  }
  return [...groups.values()]
    .toSorted((left, right) =>
      left.controllerBeanFullName.localeCompare(right.controllerBeanFullName),
    )
    .map(group => ({
      ...group,
      actions: group.actions.toSorted((left, right) =>
        left.actionKey.localeCompare(right.actionKey),
      ),
    }));
}

export interface IRbacPolicyEditorScope {
  dataScope: TypeRbacPolicyDataScope;
  enabled: boolean;
  customDepartmentsConfigured?: boolean;
}

export interface IRbacPolicyEditorAction {
  actionKey: string;
  dataScopes: IRbacPolicyEditorScope[];
}

export interface IRbacPolicyEditorData {
  revision: string;
  roleId: TableIdentity;
  list: IRbacPolicyEditorAction[];
}

export interface IRbacPolicyGrantColumnData {
  actionKeys: string[];
  enabled: boolean;
  departmentIds?: TableIdentity[];
}

@Model<IModelOptionsRbacPolicy>()
export class ModelRbacPolicy extends BeanModelBase {
  catalog() {
    return this.$useStateData<ApiApiAdminRbacRbacPolicycatalogResponseBody>({
      queryKey: ['catalog'],
      queryFn: async () => {
        return await this.scope.api.adminRbacRbacPolicy.catalog();
      },
    });
  }

  grants(roleId: TableIdentity) {
    return this.$useStateData<ApiApiAdminRbacRbacGrantselectResponseBody>({
      queryKey: ['grants', roleId],
      queryFn: async () => {
        return await this._selectAllGrants(roleId);
      },
    });
  }

  grant(
    roleId: TableIdentity,
    actionKey: string,
    dataScope: TypeRbacPolicyDataScope,
  ): TypeRbacGrant | undefined {
    return this.grants(roleId).data?.list.find(
      grant => grant.actionKey === actionKey && grant.dataScope === dataScope,
    );
  }

  grantDepartments(grantId: TableIdentity) {
    return this.$useStateData<ApiApiAdminRbacRbacGrantDepartmentselectResponseBody>({
      queryKey: ['grantDepartments', grantId],
      queryFn: async () => {
        return await this._selectAllGrantDepartments(grantId);
      },
    });
  }

  roleConfiguration(roleId: TableIdentity) {
    return this.$useStateData<
      ApiApiAdminRbacRbacPolicyroleConfigurationResponseBody,
      Error,
      IRbacPolicyEditorData
    >({
      queryKey: ['roleConfiguration', roleId],
      queryFn: async () => {
        return await this.scope.api.adminRbacRbacPolicy.roleConfiguration({ params: { roleId } });
      },
      select: data =>
        ({
          ...data,
          list: data.list.map(action => ({
            ...action,
            dataScopes: action.dataScopes.map(scope => ({
              ...scope,
              enabled: Boolean(scope.enabled),
            })),
          })),
        }) as IRbacPolicyEditorData,
    });
  }

  setGrantEnabled(roleId: TableIdentity, actionKey: string, dataScope: TypeRbacPolicyDataScope) {
    return this.$useMutationData<void, boolean>({
      mutationKey: ['setGrantEnabled', roleId, actionKey, dataScope],
      mutationFn: async enabled => {
        const grant = await this._findGrant(roleId, actionKey, dataScope);
        if (grant) {
          await this.scope.api.adminRbacRbacGrant.update({ enabled }, { params: { id: grant.id } });
          return;
        }
        if (!enabled) return;
        await this.scope.api.adminRbacRbacGrant.create({
          roleId,
          actionKey,
          dataScope,
          enabled: true,
        });
      },
      onSuccess: async () => {
        await this._invalidateRolePolicy(roleId);
      },
    });
  }

  setGrantColumn(roleId: TableIdentity, dataScope: TypeRbacPolicyDataScope, actionKeys: string[]) {
    return this.$useMutationData<TableIdentity[], IRbacPolicyGrantColumnData>({
      mutationKey: ['setGrantColumn', roleId, dataScope, actionKeys],
      mutationFn: async ({ actionKeys, enabled, departmentIds }) => {
        const grantIds: TableIdentity[] = [];
        for (const actionKey of [...new Set(actionKeys)]) {
          const grant = await this._setGrantEnabled(roleId, actionKey, dataScope, enabled);
          if (grant && dataScope === 'customDepartments' && enabled) {
            await this._replaceGrantDepartments(grant, departmentIds ?? []);
            grantIds.push(grant);
          }
        }
        return grantIds;
      },
      onSuccess: async (grantIds, { enabled }) => {
        await this._invalidateRolePolicy(roleId);
        if (dataScope === 'customDepartments' && enabled) {
          await Promise.all(
            grantIds.map(grantId =>
              this.$invalidateQueries({ queryKey: ['grantDepartments', grantId] }),
            ),
          );
        }
      },
      onError: async () => {
        await this._invalidateRolePolicy(roleId);
      },
    });
  }

  deleteGrant(roleId: TableIdentity, actionKey: string, dataScope: TypeRbacPolicyDataScope) {
    return this.$useMutationData<void, void>({
      mutationKey: ['deleteGrant', roleId, actionKey, dataScope],
      mutationFn: async () => {
        const grant = await this._findGrant(roleId, actionKey, dataScope);
        if (!grant) return;
        await this.scope.api.adminRbacRbacGrant.delete({ params: { id: grant.id } });
      },
      onSuccess: async () => {
        await this._invalidateRolePolicy(roleId);
      },
    });
  }

  addGrantDepartment(roleId: TableIdentity, grantId: TableIdentity) {
    return this.$useMutationData<TableIdentity, TableIdentity>({
      mutationKey: ['addGrantDepartment', roleId, grantId],
      mutationFn: async departmentId => {
        return await this.scope.api.adminRbacRbacGrantDepartment.create({
          rbacGrantId: grantId,
          departmentId,
        });
      },
      onSuccess: async () => {
        await this._invalidateRolePolicy(roleId, grantId);
      },
    });
  }

  replaceGrantDepartments(roleId: TableIdentity, grantId: TableIdentity) {
    return this.$useMutationData<
      void,
      {
        mappings: TypeRbacGrantDepartment[];
        departmentIds: TableIdentity[];
      }
    >({
      mutationKey: ['replaceGrantDepartments', roleId, grantId],
      mutationFn: async ({ mappings, departmentIds }) => {
        const existingByDepartmentId = new Map(
          mappings.map(mapping => [String(mapping.departmentId), mapping]),
        );
        const departmentIdsByKey = new Map(
          departmentIds.map(departmentId => [String(departmentId), departmentId]),
        );
        for (const departmentId of departmentIdsByKey.values()) {
          if (existingByDepartmentId.has(String(departmentId))) continue;
          await this.scope.api.adminRbacRbacGrantDepartment.create({
            rbacGrantId: grantId,
            departmentId,
          });
        }
        for (const mapping of mappings) {
          if (departmentIdsByKey.has(String(mapping.departmentId))) continue;
          await this.scope.api.adminRbacRbacGrantDepartment.delete({
            params: { id: mapping.id },
          });
        }
      },
      onSuccess: async () => {
        await this._invalidateRolePolicy(roleId, grantId);
      },
      onError: async () => {
        await this.$invalidateQueries({ queryKey: ['grantDepartments', grantId] });
      },
    });
  }

  removeGrantDepartment(roleId: TableIdentity, grantId: TableIdentity) {
    return this.$useMutationData<void, TableIdentity>({
      mutationKey: ['removeGrantDepartment', roleId, grantId],
      mutationFn: async grantDepartmentId => {
        await this.scope.api.adminRbacRbacGrantDepartment.delete({
          params: { id: grantDepartmentId },
        });
      },
      onSuccess: async () => {
        await this._invalidateRolePolicy(roleId, grantId);
      },
    });
  }

  private async _setGrantEnabled(
    roleId: TableIdentity,
    actionKey: string,
    dataScope: TypeRbacPolicyDataScope,
    enabled: boolean,
  ): Promise<TableIdentity | undefined> {
    const grant = await this._findGrant(roleId, actionKey, dataScope);
    if (grant) {
      await this.scope.api.adminRbacRbacGrant.update({ enabled }, { params: { id: grant.id } });
      return grant.id;
    }
    if (!enabled) return undefined;
    return await this.scope.api.adminRbacRbacGrant.create({
      roleId,
      actionKey,
      dataScope,
      enabled: true,
    });
  }

  private async _replaceGrantDepartments(grantId: TableIdentity, departmentIds: TableIdentity[]) {
    const result = await this._selectAllGrantDepartments(grantId);
    const existingByDepartmentId = new Map(
      result.list.map(mapping => [String(mapping.departmentId), mapping]),
    );
    const departmentIdsByKey = new Map(
      departmentIds.map(departmentId => [String(departmentId), departmentId]),
    );
    for (const departmentId of departmentIdsByKey.values()) {
      if (existingByDepartmentId.has(String(departmentId))) continue;
      await this.scope.api.adminRbacRbacGrantDepartment.create({
        rbacGrantId: grantId,
        departmentId,
      });
    }
    for (const mapping of result.list) {
      if (departmentIdsByKey.has(String(mapping.departmentId))) continue;
      await this.scope.api.adminRbacRbacGrantDepartment.delete({
        params: { id: mapping.id },
      });
    }
  }

  private async _selectAllGrants(
    roleId: TableIdentity,
  ): Promise<ApiApiAdminRbacRbacGrantselectResponseBody> {
    const pageSize = 100;
    const firstPage = (await this.scope.api.adminRbacRbacGrant.select({
      query: { where: { roleId }, pageNo: 1, pageSize },
    })) as ApiApiAdminRbacRbacGrantselectResponseBody;
    const list = [...firstPage.list];
    for (let pageNo = 2; pageNo <= firstPage.pageCount; pageNo++) {
      const page = (await this.scope.api.adminRbacRbacGrant.select({
        query: { where: { roleId }, pageNo, pageSize },
      })) as ApiApiAdminRbacRbacGrantselectResponseBody;
      list.push(...page.list);
    }
    return { ...firstPage, list };
  }

  private async _selectAllGrantDepartments(
    grantId: TableIdentity,
  ): Promise<ApiApiAdminRbacRbacGrantDepartmentselectResponseBody> {
    const pageSize = 100;
    const firstPage = (await this.scope.api.adminRbacRbacGrantDepartment.select({
      query: { where: { rbacGrantId: grantId }, pageNo: 1, pageSize },
    })) as ApiApiAdminRbacRbacGrantDepartmentselectResponseBody;
    const list = [...firstPage.list];
    for (let pageNo = 2; pageNo <= firstPage.pageCount; pageNo++) {
      const page = (await this.scope.api.adminRbacRbacGrantDepartment.select({
        query: { where: { rbacGrantId: grantId }, pageNo, pageSize },
      })) as ApiApiAdminRbacRbacGrantDepartmentselectResponseBody;
      list.push(...page.list);
    }
    return { ...firstPage, list };
  }

  private async _findGrant(
    roleId: TableIdentity,
    actionKey: string,
    dataScope: TypeRbacPolicyDataScope,
  ): Promise<TypeRbacGrant | undefined> {
    const result = (await this.scope.api.adminRbacRbacGrant.select({
      query: {
        where: { roleId, actionKey, dataScope },
        pageNo: 1,
        pageSize: 2,
      },
    })) as ApiApiAdminRbacRbacGrantselectResponseBody;
    if (result.list.length > 1) {
      throw new Error('RBAC grant lookup is ambiguous');
    }
    return result.list[0];
  }

  private async _invalidateRolePolicy(
    roleId: TableIdentity,
    grantId?: TableIdentity,
  ): Promise<void> {
    await Promise.all([
      this.$invalidateQueries({ queryKey: ['catalog'] }),
      this.$invalidateQueries({ queryKey: ['grants', roleId] }),
      this.$invalidateQueries({ queryKey: ['roleConfiguration', roleId] }),
      ...(grantId === undefined
        ? []
        : [this.$invalidateQueries({ queryKey: ['grantDepartments', grantId] })]),
    ]);
  }
}
