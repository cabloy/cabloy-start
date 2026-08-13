import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntitySystemAdminAudit } from '../entity/systemAdminAudit.tsx';

export interface IModelOptionsSystemAdminAudit extends IDecoratorModelOptions<EntitySystemAdminAudit> {}

@Model<IModelOptionsSystemAdminAudit>({ entity: EntitySystemAdminAudit })
export class ModelSystemAdminAudit extends BeanModelBase<EntitySystemAdminAudit> {}
