import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityPolicyRevision } from '../entity/policyRevision.tsx';

export interface IModelOptionsPolicyRevision extends IDecoratorModelOptions<EntityPolicyRevision> {}

@Model<IModelOptionsPolicyRevision>({ entity: EntityPolicyRevision })
export class ModelPolicyRevision extends BeanModelBase<EntityPolicyRevision> {}
