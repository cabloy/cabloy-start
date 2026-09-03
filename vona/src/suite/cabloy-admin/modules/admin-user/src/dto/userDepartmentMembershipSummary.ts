import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, $resourceName, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoUserDepartmentSummary } from './userDepartmentSummary.ts';

export interface IDtoOptionsUserDepartmentMembershipSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserDepartmentMembershipSummary>({
  blocks: [
    ZovaRender.block('start-details:blockDetails', {
      blocks: [ZovaRender.block('start-details:blockTable')],
    }),
  ],
})
export class DtoUserDepartmentMembershipSummary {
  @Api.field(ZovaRender.visible(false), v.required(), v.tableIdentity())
  id: TableIdentity;

  @Api.field(
    v.title($locale('Department')),
    ZovaRender.cell('admin-department:departmentName', {
      resource: $resourceName('admin-department:department'),
    }),
    v.required(),
    v.tableIdentity(),
  )
  departmentId: TableIdentity;

  @Api.field(v.required(), v.lazy(ZovaRender.visible(false), DtoUserDepartmentSummary))
  department: DtoUserDepartmentSummary;

  @Api.field(
    v.title($locale('Position')),
    $makeSchema(v.optional(), v.nullable(), v.max(100), String),
  )
  position?: string | null;

  @Api.field(
    v.title($locale('Enabled')),
    ZovaRender.cell('start-switch:switch', { color: 'success' }),
    v.required(),
  )
  enabled: boolean;

  @Api.field(
    v.title($locale('Primary')),
    ZovaRender.cell('start-switch:switch', { color: 'success' }),
    v.required(),
  )
  primary: boolean;
}
