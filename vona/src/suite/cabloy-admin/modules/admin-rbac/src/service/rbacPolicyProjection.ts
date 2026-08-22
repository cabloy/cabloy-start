import type { TableIdentity } from 'table-identity';
import type { IOpenapiOptions } from 'vona-module-a-openapiutils';
import type { IRbacActionDescriptor, TypeRbacDataScope } from 'vona-module-a-rbac';

import { appMetadata, BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { SymbolOpenApiOptions } from 'vona-module-a-openapiutils';

import type { DtoRbacPolicyCatalogRes } from '../dto/rbacPolicyCatalogRes.ts';
import type { DtoRbacPolicyCatalogResItem } from '../dto/rbacPolicyCatalogResItem.ts';
import type { DtoRbacPolicyRoleConfigurationAction } from '../dto/rbacPolicyRoleConfigurationAction.ts';
import type { DtoRbacPolicyRoleConfigurationRes } from '../dto/rbacPolicyRoleConfigurationRes.ts';
import type { DtoRbacPolicyRoleConfigurationScope } from '../dto/rbacPolicyRoleConfigurationScope.ts';

import {
  getRbacGrantablePolicyAction,
  isRbacDataScope,
  isRbacDataScopeCompatible,
  isRbacPolicyRoleAvailable,
} from '../lib/rbacPolicy.ts';

@Service()
export class ServiceRbacPolicyProjection extends BeanBase {
  async catalog(): Promise<DtoRbacPolicyCatalogRes> {
    const catalog = this.bean.rbacCatalog.getCatalog();
    const actionKeys = Array.from(
      new Set(catalog.values().map(action => action.actionInheritKey ?? action.actionKey)),
    ).toSorted();
    const list = actionKeys.flatMap(actionKey => {
      const action = getRbacGrantablePolicyAction(catalog, actionKey);
      return action ? [this._projectCatalogAction(action.action, action.dataScopes)] : [];
    });
    return {
      revision: await this.scope.service.rbacPolicyRevision.current(),
      list,
    };
  }

  private _projectCatalogAction(
    action: IRbacActionDescriptor,
    dataScopes: TypeRbacDataScope[],
  ): DtoRbacPolicyCatalogResItem {
    const controller = action.route?.controller;
    const controllerOptions = controller
      ? appMetadata.getMetadata<IOpenapiOptions>(SymbolOpenApiOptions, controller)
      : undefined;
    const actionOptions = controller
      ? appMetadata.getMetadata<IOpenapiOptions>(
          SymbolOpenApiOptions,
          controller.prototype,
          action.action,
        )
      : undefined;
    const controllerSummary = this._resolveSummary(controllerOptions?.summary);
    const actionSummary = this._resolveSummary(actionOptions?.summary);
    return {
      controllerBeanFullName: action.controllerBeanFullName,
      ...(controllerSummary ? { controllerSummary } : {}),
      action: action.action,
      ...(actionSummary ? { actionSummary } : {}),
      actionKey: action.actionKey,
      dataScopes,
    };
  }

  private _resolveSummary(summary: IOpenapiOptions['summary'] | undefined): string | undefined {
    if (summary === undefined) return undefined;
    try {
      const value = this.app.meta.text.locale(this.ctx.locale, summary);
      const trimmed = value?.trim();
      return trimmed || undefined;
    } catch {
      return undefined;
    }
  }

  async roleConfiguration(roleId: TableIdentity): Promise<DtoRbacPolicyRoleConfigurationRes> {
    const role = await this.$scope.homeUser.model.role.getById(roleId);
    if (!isRbacPolicyRoleAvailable(role)) {
      this.app.throw(422, 'RBAC grant role is unavailable');
    }

    const catalog = this.bean.rbacCatalog.getCatalog();
    const grants = await this.scope.model.rbacGrant.select({ where: { roleId } });
    const customGrantIds = grants
      .filter(grant => grant.dataScope === 'customDepartments')
      .map(grant => grant.id);
    const departments = customGrantIds.length
      ? await this.scope.model.rbacGrantDepartment.select({
          where: { rbacGrantId: { _in_: customGrantIds } },
          columns: ['rbacGrantId'],
        })
      : [];
    const customDepartmentsConfigured = new Set(departments.map(item => String(item.rbacGrantId)));
    const actions = new Map<string, DtoRbacPolicyRoleConfigurationScope[]>();

    for (const grant of grants) {
      const action = getRbacGrantablePolicyAction(catalog, grant.actionKey);
      const dataScope = grant.dataScope;
      if (
        !action ||
        !isRbacDataScope(dataScope) ||
        !isRbacDataScopeCompatible(action.action, dataScope)
      ) {
        continue;
      }
      const scopes = actions.get(grant.actionKey) ?? [];
      scopes.push({
        dataScope,
        enabled: grant.enabled,
        ...(dataScope === 'customDepartments'
          ? { customDepartmentsConfigured: customDepartmentsConfigured.has(String(grant.id)) }
          : {}),
      });
      actions.set(grant.actionKey, scopes);
    }

    const list: DtoRbacPolicyRoleConfigurationAction[] = [...actions]
      .toSorted(([left], [right]) => left.localeCompare(right))
      .map(([actionKey, dataScopes]) => ({
        actionKey,
        dataScopes: dataScopes.toSorted((left, right) =>
          left.dataScope.localeCompare(right.dataScope),
        ),
      }));
    return {
      revision: await this.scope.service.rbacPolicyRevision.current(),
      roleId: role.id,
      list,
    };
  }
}
