import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { EntityUser, ModelUser } from 'vona-module-home-user';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoUserSelectRes } from '../dto/userSelectRes.tsx';
import type { DtoUserSelectResItem } from '../dto/userSelectResItem.tsx';
import type { DtoUserUpdate } from '../dto/userUpdate.tsx';
import type { DtoUserView } from '../dto/userView.tsx';

function toUserItem(user: EntityUser) {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    email: user.email,
    mobile: user.mobile,
    activated: user.activated,
    locale: user.locale,
    tz: user.tz,
  };
}

@Service()
export class ServiceUser extends BeanBase {
  async select(params?: IQueryParams<ModelUser>): Promise<DtoUserSelectRes> {
    const result = await this.$scope.homeUser.model.user.selectAndCount(params);
    return {
      ...result,
      list: result.list.map(toUserItem) as DtoUserSelectResItem[],
    };
  }

  async view(id: TableIdentity): Promise<DtoUserView | undefined> {
    const user = await this.$scope.homeUser.model.user.getById(id);
    return user && (toUserItem(user) as DtoUserView);
  }

  @Core.transaction()
  async update(id: TableIdentity, user: DtoUserUpdate): Promise<void> {
    const target = await this.$scope.homeUser.model.user.getByIdForUpdate(id);
    if (!target) this.app.throw(404, 'User not found');
    if (user.email) {
      const existing = await this.$scope.homeUser.model.user.getByEmailEqI(user.email);
      if (existing && String(existing.id) !== String(id)) {
        this.throwConflict(() => this.scope.error.EmailAlreadyInUse.throw());
      }
    }
    await this.$scope.homeUser.model.user.updateById(id, user);
  }

  @Core.transaction()
  async activate(id: TableIdentity): Promise<void> {
    const user = await this.$scope.homeUser.model.user.getByIdForUpdate(id);
    if (!user) this.app.throw(404, 'User not found');
    await this.bean.user.activate(user);
  }

  @Core.transaction()
  async deactivate(id: TableIdentity): Promise<void> {
    const user = await this.$scope.homeUser.model.user.getByIdForUpdate(id, {
      include: { roles: true },
    });
    if (!user) this.app.throw(404, 'User not found');
    if (user.roles?.some(role => role.name === 'systemAdmin')) {
      this.throwConflict(() => this.scope.error.ProtectedSystemAdminTransition.throw());
    }
    await this.$scope.homeUser.service.userAdapter.setActivated(id, false);
  }

  private throwConflict(throwError: () => never): never {
    try {
      return throwError();
    } catch (error) {
      (error as Error & { status?: number }).status = 409;
      throw error;
    }
  }
}
