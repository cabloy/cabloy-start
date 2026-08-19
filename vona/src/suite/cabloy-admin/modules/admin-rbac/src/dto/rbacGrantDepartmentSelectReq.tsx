import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { EntityRbacGrantDepartment } from '../entity/rbacGrantDepartment.tsx';

export interface IDtoOptionsRbacGrantDepartmentSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacGrantDepartmentSelectReq>({
  openapi: { filter: { table: 'adminRbacRbacGrantDepartment' } },
  fields: {
    departmentId: $makeSchema(v.optional(), v.tableIdentity()),
    createdAt: $makeSchema(
      ZovaRender.field('start-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoRbacGrantDepartmentSelectReq extends $Dto.queryPage(EntityRbacGrantDepartment, [
  'departmentId',
  'createdAt',
]) {}
