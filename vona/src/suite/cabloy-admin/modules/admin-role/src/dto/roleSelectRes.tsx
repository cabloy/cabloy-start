import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoRoleSelectResItem } from './roleSelectResItem.tsx';

export interface IDtoOptionsRoleSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleSelectRes>()
export class DtoRoleSelectRes extends $Dto.listAndCount(DtoRoleSelectResItem) {}
