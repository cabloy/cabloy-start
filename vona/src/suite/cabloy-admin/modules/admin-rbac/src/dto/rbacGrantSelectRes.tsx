import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoRbacGrantSelectResItem } from './rbacGrantSelectResItem.tsx';

export interface IDtoOptionsRbacGrantSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacGrantSelectRes>()
export class DtoRbacGrantSelectRes extends $Dto.listAndCount(DtoRbacGrantSelectResItem) {}
