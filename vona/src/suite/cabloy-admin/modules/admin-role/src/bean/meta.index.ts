import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('adminRoleSystemAdminFreshProof', 'proofHash'),
    ...$tableColumns('adminRoleSystemAdminFreshProof', 'actorId+expiresAt'),
    ...$tableColumns('adminRoleSystemAdminAudit', 'targetId+occurredAt'),
    ...$tableColumns('adminRoleSystemAdminAudit', 'actorId+occurredAt'),
    ...$tableColumns('adminRoleSystemAdminSessionEviction', 'state+nextAttemptAt'),
    ...$tableColumns('adminRoleSystemAdminSessionEviction', 'state+claimExpiresAt'),
    ...$tableColumns('adminRoleSystemAdminSessionEviction', 'targetId'),
    ...$tableColumns('adminRoleSystemAdminSessionEviction', 'auditId'),
  },
})
export class MetaIndex extends BeanBase {}
