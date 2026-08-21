import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsRbacGrantCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacGrantCreate>({
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
                      { type: 'field', name: 'roleId' },
                      { type: 'field', name: 'actionKey' },
                      { type: 'field', name: 'dataScope' },
                      { type: 'field', name: 'enabled' },
                      { type: 'field', name: 'description' },
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
              permission: { actionInherit: 'update', formScene: ['create', 'edit'] },
            }),
            ZovaRender.formActionRow('start-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
})
export class DtoRbacGrantCreate {
  @Api.field(v.title($locale('Role')), v.required(), v.tableIdentity())
  roleId: TableIdentity;

  @Api.field(v.title($locale('ActionKey')), v.required(), v.min(1), v.max(255))
  actionKey: string;

  @Api.field(
    v.title($locale('DataScope')),
    v.required(),
    z.enum(['all', 'customDepartments', 'ownDepartment', 'ownDepartmentAndDescendants', 'mine']),
  )
  dataScope: 'all' | 'customDepartments' | 'ownDepartment' | 'ownDepartmentAndDescendants' | 'mine';

  @Api.field(v.title($locale('Enabled')), v.required())
  enabled: boolean;

  @Api.field(v.title($locale('Description')), v.optional(), v.max(255))
  description?: string;
}
