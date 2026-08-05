import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoUserSelectResItem } from './userSelectResItem.tsx';

export interface IDtoOptionsUserSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserSelectRes>()
export class DtoUserSelectRes extends $Dto.listAndCount(DtoUserSelectResItem) {}
