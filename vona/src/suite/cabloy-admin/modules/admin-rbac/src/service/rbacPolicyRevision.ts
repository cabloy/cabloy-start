import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

@Service()
export class ServiceRbacPolicyRevision extends BeanBase {
  async current(): Promise<string> {
    const revision = await this.scope.model.policyRevision.get({});
    return String((revision ?? (await this.ensure())).revision);
  }

  @Core.transaction()
  async invalidate(): Promise<string> {
    const revision = await this.ensure();
    const nextRevision = revision.revision + 1;
    await this.scope.model.policyRevision.updateById(revision.id, { revision: nextRevision });
    return String(nextRevision);
  }

  @Core.transaction()
  async ensure() {
    return await this.$scope.redlock.service.redlock.lock(
      `admin-rbac.policy-revision.${this.ctx.instanceName ?? 'default'}`,
      async () => {
        const revision = await this.scope.model.policyRevision.getForUpdate({});
        return revision ?? (await this.scope.model.policyRevision.insert({ revision: 0 }));
      },
    );
  }
}
