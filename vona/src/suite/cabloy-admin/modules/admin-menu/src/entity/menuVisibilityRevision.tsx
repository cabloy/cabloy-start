import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

export interface IEntityOptionsMenuVisibilityRevision extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsMenuVisibilityRevision>('adminMenuMenuVisibilityRevision')
export class EntityMenuVisibilityRevision extends EntityBase {
  @Api.field(z.number().int().nonnegative())
  revision: number;
}
