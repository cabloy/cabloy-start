import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsRbacGrantDepartmentCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacGrantDepartmentCreate>({
  blocks: [
    ZovaRender.block('start-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('start-pageentry:blockForm', {
          blocks: [
            ZovaRender.block('start-form:blockFormLayout', {
              formLayout: {
                children: [
                  {
                    type: 'group',
                    title: $locale('BasicInformation'),
                    children: [
                      { type: 'field', name: 'rbacGrantId' },
                      { type: 'field', name: 'departmentId' },
                    ],
                  },
                ],
              },
            }),
          ],
        }),
        ZovaRender.block('start-pageentry:blockToolbarRow', {
          actions: [
            ZovaRender.formActionRow('start-form:actionSubmit', {
              permission: { actionInherit: 'update', formScene: ['create'] },
            }),
            ZovaRender.formActionRow('start-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
})
export class DtoRbacGrantDepartmentCreate {
  @Api.field(v.title($locale('RbacGrant')), v.required(), v.tableIdentity())
  rbacGrantId: TableIdentity;

  @Api.field(v.title($locale('Department')), v.required(), v.tableIdentity())
  departmentId: TableIdentity;
}
