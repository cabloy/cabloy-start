import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { EntityDepartment } from '../entity/department.tsx';

export interface IDtoOptionsDepartmentSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentSelectReq>({
  openapi: { filter: { table: 'adminDepartment' } },
  fields: {
    name: $makeSchema(v.optional(), v.trim(), z.string()),
  },
})
export class DtoDepartmentSelectReq extends $Dto.queryPage(EntityDepartment, ['name']) {}
