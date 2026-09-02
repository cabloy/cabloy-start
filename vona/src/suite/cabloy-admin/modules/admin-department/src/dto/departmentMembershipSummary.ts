import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelDepartmentMembership } from '../model/departmentMembership.ts';

export interface IDtoOptionsDepartmentMembershipSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentMembershipSummary>({
  blocks: [
    ZovaRender.block('start-details:blockDetails', {
      blocks: [
        ZovaRender.block('start-details:blockToolbarBulk', {
          actions: [
            ZovaRender.detailsActionBulk('admin-department:actionCreateMembership', {
              permission: { formScene: ['view'] },
            }),
          ],
        }),
        ZovaRender.block('start-details:blockTable'),
      ],
    }),
  ],
})
export class DtoDepartmentMembershipSummary extends $Dto.get(() => ModelDepartmentMembership, {
  columns: ['id', 'userId', 'position', 'enabled', 'primary'],
  include: { user: true },
}) {
  @Api.field(v.title($locale('DepartmentManager')), ZovaRender.visible(false), v.required())
  manager: boolean;

  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('start-details:actionOperationsRow', {
      actions: [
        ZovaRender.detailsActionRow('admin-department:actionUpdateMembership', {
          permission: { formScene: ['view'] },
        }),
        ZovaRender.detailsActionRow('admin-department:actionToggleMembershipPrimary', {
          permission: { formScene: ['view'] },
        }),
        ZovaRender.detailsActionRow('admin-department:actionUpdateMembershipManager', {
          permission: { formScene: ['view'] },
        }),
        ZovaRender.detailsActionRow('admin-department:actionDeleteMembership', {
          permission: { formScene: ['view'] },
        }),
      ],
    }),
  )
  _operationsRow?: unknown;
}
