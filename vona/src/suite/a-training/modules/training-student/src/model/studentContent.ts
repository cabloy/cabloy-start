import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityStudentContent } from '../entity/studentContent.tsx';

export interface IModelOptionsStudentContent
  extends IDecoratorModelOptions<EntityStudentContent> {}

@Model<IModelOptionsStudentContent>({
  entity: EntityStudentContent,
})
export class ModelStudentContent extends BeanModelBase<EntityStudentContent> {}
