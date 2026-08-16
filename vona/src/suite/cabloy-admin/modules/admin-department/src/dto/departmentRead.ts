import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Class } from 'vona';
import { Dto } from 'vona-module-a-web';

import { DtoDepartmentBase } from './departmentBase.tsx';

export interface IDtoOptionsDepartmentRead extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentRead>()
export class DtoDepartmentRead extends $Class.pick(DtoDepartmentBase, [
  'id',
  'name',
  'parentId',
  'enabled',
  'sortOrder',
]) {}
