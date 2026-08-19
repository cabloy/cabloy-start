import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoRbacGrantDepartmentSelectResItem } from './rbacGrantDepartmentSelectResItem.tsx';

export interface IDtoOptionsRbacGrantDepartmentSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacGrantDepartmentSelectRes>()
export class DtoRbacGrantDepartmentSelectRes extends $Dto.listAndCount(
  DtoRbacGrantDepartmentSelectResItem,
) {}
