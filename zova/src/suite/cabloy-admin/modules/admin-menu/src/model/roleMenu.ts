import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type { ApiApiAdminMenuRoleMenuroleConfigurationResponseBody } from '../api/adminMenuRoleMenu.js';

export interface IModelOptionsRoleMenu extends IDecoratorModelOptions {}

export interface IRoleMenuEnabledBatchData {
  ssrSiteName: string;
  ssrMenuName: string;
  enabled: boolean;
}

export type TypeRoleMenuConfiguration = ApiApiAdminMenuRoleMenuroleConfigurationResponseBody;
export type TypeRoleMenuConfigurationSite = TypeRoleMenuConfiguration['list'][number];
export type TypeRoleMenuConfigurationMenu = TypeRoleMenuConfigurationSite['menus'][number];
export type TypeRoleMenuConfigurationGroup = TypeRoleMenuConfigurationSite['groups'][number];

@Model<IModelOptionsRoleMenu>()
export class ModelRoleMenu extends BeanModelBase {
  roleConfiguration(roleId: TableIdentity) {
    return this.$useStateData<TypeRoleMenuConfiguration>({
      queryKey: ['roleMenuConfiguration', roleId, this.app.meta.locale.current],
      queryFn: async () => {
        return await this.scope.api.adminMenuRoleMenu.roleConfiguration({ params: { roleId } });
      },
    });
  }

  setEnabled(roleId: TableIdentity, ssrSiteName: string, ssrMenuName: string) {
    return this.$useMutationData<void, boolean>({
      mutationKey: ['setEnabled', roleId, ssrSiteName, ssrMenuName],
      mutationFn: async enabled => {
        const identity = { roleId, ssrSiteName, ssrMenuName };
        if (enabled) {
          await this.scope.api.adminMenuRoleMenu.create(identity);
        } else {
          const api = this.scope.api.adminMenuRoleMenu as unknown as {
            delete(body: typeof identity): Promise<void>;
          };
          await api.delete(identity);
        }
      },
      onSuccess: () => {
        void this._invalidateRoleConfiguration(roleId);
        void this._refreshCurrentSubjectMenus(roleId);
      },
      onError: () => {
        void this._invalidateRoleConfiguration(roleId);
      },
    });
  }

  setEnabledBatch(roleId: TableIdentity) {
    return this.$useMutationData<void, IRoleMenuEnabledBatchData[]>({
      mutationKey: ['setEnabledBatch', roleId],
      mutationFn: async menus => {
        const identities = [
          ...new Map(menus.map(menu => [this._menuKey(menu), menu])).values(),
        ].toSorted((left, right) => this._menuKey(left).localeCompare(this._menuKey(right)));
        const creates = identities
          .filter(menu => menu.enabled)
          .map(({ ssrSiteName, ssrMenuName }) => ({ ssrSiteName, ssrMenuName }));
        const deletes = identities
          .filter(menu => !menu.enabled)
          .map(({ ssrSiteName, ssrMenuName }) => ({ ssrSiteName, ssrMenuName }));
        await this.scope.api.adminMenuRoleMenu.batch({ roleId, creates, deletes });
      },
      onSuccess: () => {
        void this._invalidateRoleConfiguration(roleId);
        void this._refreshCurrentSubjectMenus(roleId);
      },
      onError: () => {
        void this._invalidateRoleConfiguration(roleId);
      },
    });
  }

  private _menuKey(menu: Pick<IRoleMenuEnabledBatchData, 'ssrSiteName' | 'ssrMenuName'>) {
    return JSON.stringify([menu.ssrSiteName, menu.ssrMenuName]);
  }

  private async _invalidateRoleConfiguration(roleId: TableIdentity): Promise<void> {
    await this.$invalidateQueries({ queryKey: ['roleMenuConfiguration', roleId] });
  }

  private async _refreshCurrentSubjectMenus(roleId: TableIdentity): Promise<void> {
    if (
      !process.env.CLIENT ||
      !this.$passport.roles?.some(role => String(role.id) === String(roleId))
    ) {
      return;
    }
    this.app.reload();
  }
}
