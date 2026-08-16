import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Class } from 'vona';
import { Dto } from 'vona-module-a-web';

import { DtoDepartmentBase } from './departmentBase.tsx';

export interface IDtoOptionsDepartmentUpdateBase extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentUpdateBase>()
export class DtoDepartmentUpdateBase extends $Class.pick(DtoDepartmentBase, ['name']) {}
