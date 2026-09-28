import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';
import type { IPermissionHintDetailsActionBulk } from 'zova-rest-cabloy-start-admin';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsUserRoleSummary extends IDecoratorDtoOptions {}

const permissionReplaceUserRoles: IPermissionHintDetailsActionBulk = {
  formScene: ['view'],
};

const permissionGrantSystemAdmin: IPermissionHintDetailsActionBulk = {
  formScene: ['view'],
};

const permissionRevokeSystemAdmin: IPermissionHintDetailsActionBulk = {
  formScene: ['view'],
};

@Dto<IDtoOptionsUserRoleSummary>({
  blocks: [
    ZovaRender.block('start-details:blockDetails', {
      blocks: [
        ZovaRender.block('start-details:blockToolbarBulk', {
          actions: [
            ZovaRender.detailsActionBulk('admin-user:actionReplaceUserRoles', {
              permission: permissionReplaceUserRoles,
            }),
            ZovaRender.detailsActionBulk('admin-user:actionGrantSystemAdmin', {
              permission: permissionGrantSystemAdmin,
            }),
            ZovaRender.detailsActionBulk('admin-user:actionRevokeSystemAdmin', {
              permission: permissionRevokeSystemAdmin,
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
