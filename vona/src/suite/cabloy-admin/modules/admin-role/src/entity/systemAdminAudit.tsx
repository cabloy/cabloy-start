import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

export interface IEntityOptionsSystemAdminAudit extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsSystemAdminAudit>('adminRoleSystemAdminAudit')
export class EntitySystemAdminAudit extends EntityBase {
  @Api.field(v.tableIdentity())
  actorId: TableIdentity;

  @Api.field(v.optional(), v.tableIdentity())
  targetId?: TableIdentity;

  @Api.field(z.enum(['grant', 'revoke', 'activate', 'deactivate']))
  command: 'grant' | 'revoke' | 'activate' | 'deactivate';

  @Api.field(z.enum(['accepted', 'rejected']))
  result: 'accepted' | 'rejected';

  @Api.field(v.max(255))
  reason: string;

  @Api.field(v.max(100))
  commandId: string;

  @Api.field(v.max(100))
  proofMethod: string;

  @Api.field(v.optional(), v.max(100))
  errorCode?: string;

  @Api.field(v.required())
  beforeState: Record<string, unknown>;

  @Api.field(v.required())
  afterState: Record<string, unknown>;

  @Api.field()
  occurredAt: Date;
}
