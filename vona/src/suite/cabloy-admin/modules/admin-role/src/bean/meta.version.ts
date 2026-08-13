import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version !== 1) return;

    const freshProof = this.scope.entity.systemAdminFreshProof;
    await this.bean.model.createTable(freshProof.$table, table => {
      table.basicFields();
      table.tableIdentity(freshProof.actorId);
      table.string(freshProof.proofHash, 64);
      table.string(freshProof.purpose, 100);
      table.string(freshProof.proofMethod, 100);
      table.dateTime(freshProof.expiresAt);
      table.dateTime(freshProof.consumedAt);
      table.string(freshProof.commandId, 100);
    });

    const audit = this.scope.entity.systemAdminAudit;
    await this.bean.model.createTable(audit.$table, table => {
      table.basicFields();
      table.tableIdentity(audit.actorId);
      table.tableIdentity(audit.targetId);
      table.string(audit.command, 32);
      table.string(audit.result, 16);
      table.string(audit.reason, 255);
      table.string(audit.commandId, 100);
      table.string(audit.proofMethod, 100);
      table.string(audit.errorCode, 100);
      table.json(audit.beforeState);
      table.json(audit.afterState);
      table.dateTime(audit.occurredAt);
    });

    const eviction = this.scope.entity.systemAdminSessionEviction;
    await this.bean.model.createTable(eviction.$table, table => {
      table.basicFields();
      table.tableIdentity(eviction.targetId);
      table.tableIdentity(eviction.auditId);
      table.string(eviction.state, 16);
      table.integer(eviction.attemptCount);
      table.dateTime(eviction.claimedAt);
      table.string(eviction.claimToken, 100);
      table.dateTime(eviction.claimExpiresAt);
      table.dateTime(eviction.nextAttemptAt);
      table.dateTime(eviction.dispatchedAt);
      table.string(eviction.errorSummary, 255);
    });
  }
}
