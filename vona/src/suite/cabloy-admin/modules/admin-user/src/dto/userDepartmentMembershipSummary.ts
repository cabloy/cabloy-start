import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsUserDepartmentMembershipSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserDepartmentMembershipSummary>({
  blocks: [
    ZovaRender.block('start-details:blockDetails', {
      blocks: [ZovaRender.block('start-details:blockTable')],
    }),
  ],
})
export class DtoUserDepartmentMembershipSummary {
  @Api.field(v.required(), v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.title($locale('Department')), v.required(), v.tableIdentity())
  departmentId: TableIdentity;

  @Api.field(v.title($locale('DepartmentName')), v.required())
  departmentName: string;

  @Api.field(
    v.title($locale('Position')),
    $makeSchema(v.optional(), v.nullable(), v.max(100), String),
  )
  position?: string | null;

  @Api.field(v.title($locale('Enabled')), v.required())
  enabled: boolean;

  @Api.field(v.title($locale('Primary')), v.required())
  primary: boolean;
}
