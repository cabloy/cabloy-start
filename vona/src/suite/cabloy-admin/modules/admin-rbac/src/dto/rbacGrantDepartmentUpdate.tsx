import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsRbacGrantDepartmentUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacGrantDepartmentUpdate>()
export class DtoRbacGrantDepartmentUpdate {}
