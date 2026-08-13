import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoDepartmentSelectResItem } from './departmentSelectResItem.tsx';

export interface IDtoOptionsDepartmentSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentSelectRes>()
export class DtoDepartmentSelectRes extends $Dto.listAndCount(DtoDepartmentSelectResItem) {}
