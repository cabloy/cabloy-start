import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoDepartmentUserSummary } from './departmentUserSummary.ts';

export interface IDtoOptionsDepartmentMembershipSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentMembershipSummary>({
  blocks: [
    ZovaRender.block('start-details:blockDetails', {
      blocks: [
        ZovaRender.block('start-details:blockToolbarBulk', {
          actions: [
            ZovaRender.detailsActionBulk('admin-department:actionCreateMembership', {
              permission: { formScene: ['create', 'edit'] },
            }),
          ],
        }),
        ZovaRender.block('start-details:blockTable'),
      ],
    }),
  ],
})
export class DtoDepartmentMembershipSummary {
  @Api.field(v.required(), v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.title($locale('User')), v.required(), v.tableIdentity())
  userId: TableIdentity;

  @Api.field(v.title($locale('User')), v.required(), v.object(DtoDepartmentUserSummary))
  user: DtoDepartmentUserSummary;

  @Api.field(
    v.title($locale('Position')),
    $makeSchema(v.optional(), v.nullable(), v.max(100), String),
  )
  position?: string | null;

  @Api.field(v.title($locale('Enabled')), v.required())
  enabled: boolean;

  @Api.field(v.title($locale('Primary')), v.required())
  primary: boolean;

  @Api.field(v.title($locale('DepartmentManager')), ZovaRender.visible(false), v.required())
  manager: boolean;

  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('start-details:actionOperationsRow', {
      actions: [
        ZovaRender.detailsActionRow('admin-department:actionUpdateMembership', {
          permission: { formScene: ['create', 'edit'] },
        }),
        ZovaRender.detailsActionRow('admin-department:actionToggleMembershipPrimary', {
          permission: { formScene: ['create', 'edit'] },
        }),
        ZovaRender.detailsActionRow('admin-department:actionUpdateMembershipManager', {
          permission: { formScene: ['create', 'edit'] },
        }),
        ZovaRender.detailsActionRow('admin-department:actionDeleteMembership', {
          permission: { formScene: ['create', 'edit'] },
        }),
      ],
    }),
  )
  _operationsRow?: unknown;
}
