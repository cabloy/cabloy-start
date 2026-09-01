import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { Model } from 'vona-module-a-orm';
import { BeanModelBase } from 'vona-module-a-orm';

import { EntityMenuVisibilityRevision } from '../entity/menuVisibilityRevision.tsx';

export interface IModelOptionsMenuVisibilityRevision extends IDecoratorModelOptions<EntityMenuVisibilityRevision> {}

@Model<IModelOptionsMenuVisibilityRevision>({ entity: EntityMenuVisibilityRevision })
export class ModelMenuVisibilityRevision extends BeanModelBase<EntityMenuVisibilityRevision> {}
