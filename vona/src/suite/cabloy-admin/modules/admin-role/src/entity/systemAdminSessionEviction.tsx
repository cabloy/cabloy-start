import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

export interface IEntityOptionsSystemAdminSessionEviction extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsSystemAdminSessionEviction>('adminRoleSystemAdminSessionEviction')
export class EntitySystemAdminSessionEviction extends EntityBase {
  @Api.field(v.tableIdentity())
  targetId: TableIdentity;

  @Api.field(v.tableIdentity())
  auditId: TableIdentity;

  @Api.field(z.enum(['pending', 'claimed', 'dispatched', 'failed']))
  state: 'pending' | 'claimed' | 'dispatched' | 'failed';

  @Api.field(z.number().int().nonnegative())
  attemptCount: number;

  @Api.field(v.optional())
  claimedAt?: Date;

  @Api.field(v.optional(), v.max(100))
  claimToken?: string;

  @Api.field(v.optional())
  claimExpiresAt?: Date;

  @Api.field(v.optional())
  nextAttemptAt?: Date;

  @Api.field(v.optional())
  dispatchedAt?: Date;

  @Api.field(v.optional(), v.max(255))
  errorSummary?: string;
}
