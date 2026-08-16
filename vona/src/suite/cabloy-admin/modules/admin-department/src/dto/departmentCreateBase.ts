import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Class } from 'vona';
import { Dto } from 'vona-module-a-web';

import { DtoDepartmentBase } from './departmentBase.tsx';

export interface IDtoOptionsDepartmentCreateBase extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentCreateBase>()
export class DtoDepartmentCreateBase extends $Class.pick(DtoDepartmentBase, ['name', 'parentId']) {}
