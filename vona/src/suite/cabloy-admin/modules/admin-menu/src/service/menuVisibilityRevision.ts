import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

@Service()
export class ServiceMenuVisibilityRevision extends BeanBase {
  async current(): Promise<string> {
    const revision = await this.scope.model.menuVisibilityRevision.get({});
    return String((revision ?? (await this.ensure())).revision);
  }

  @Core.transaction()
  async invalidate(): Promise<string> {
    const revision = await this.ensure();
    const nextRevision = revision.revision + 1;
    await this.scope.model.menuVisibilityRevision.updateById(revision.id, {
      revision: nextRevision,
    });
    return String(nextRevision);
  }

  @Core.transaction()
  async ensure() {
    return await this.$scope.redlock.service.redlock.lock(
      `admin-menu.menu-visibility-revision.${this.ctx.instanceName ?? 'default'}`,
      async () => {
        const revision = await this.scope.model.menuVisibilityRevision.getForUpdate({});
        return revision ?? (await this.scope.model.menuVisibilityRevision.insert({ revision: 0 }));
      },
    );
  }
}
