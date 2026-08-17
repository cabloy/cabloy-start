import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsUserRoleSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserRoleSummary>({
  blocks: [
    ZovaRender.block('start-details:blockDetails', {
      blocks: [
        ZovaRender.block('start-details:blockToolbarBulk', {
          actions: [
            ZovaRender.detailsActionBulk('admin-role:actionReplaceUserRoles', {
              permission: { formScene: ['view'] },
            }),
          ],
        }),
        ZovaRender.block('start-details:blockTable'),
      ],
    }),
  ],
})
export class DtoUserRoleSummary {
  @Api.field(v.required(), v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.title($locale('RoleName')), v.required())
  name: string;

  @Api.field(v.title($locale('RoleTitle')), ZovaRender.cell('admin-user:roleTitle'), v.required())
  title: string;

  @Api.field(ZovaRender.visible(false), v.required())
  systemAdmin: boolean;
}
