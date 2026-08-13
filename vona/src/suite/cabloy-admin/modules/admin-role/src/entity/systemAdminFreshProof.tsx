import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';

export interface IEntityOptionsSystemAdminFreshProof extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsSystemAdminFreshProof>('adminRoleSystemAdminFreshProof')
export class EntitySystemAdminFreshProof extends EntityBase {
  @Api.field(v.tableIdentity())
  actorId: TableIdentity;

  @Api.field(v.max(64))
  proofHash: string;

  @Api.field(v.max(100))
  purpose: string;

  @Api.field(v.max(100))
  proofMethod: string;

  @Api.field()
  expiresAt: Date;

  @Api.field(v.optional())
  consumedAt?: Date;

  @Api.field(v.optional(), v.max(100))
  commandId?: string;
}
