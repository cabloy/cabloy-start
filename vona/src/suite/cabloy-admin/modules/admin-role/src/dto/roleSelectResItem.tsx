import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelRole } from 'vona-module-home-user';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoRoleRead } from './roleBase.tsx';

export interface IDtoOptionsRoleSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleSelectResItem>({
  blocks: [
    ZovaRender.block('start-page:blockPage', {
      blocks: [
        ZovaRender.block('start-page:blockFilter', {
          formFieldLayout: { inline: true },
          blocks: [
            ZovaRender.block('start-form:blockFormLayout', {
              formLayout: {
                children: [
                  {
                    type: 'section',
                    layout: 'flow',
                    children: [
                      { type: 'field', name: 'name' },
                      { type: 'field', name: 'title' },
                      {
                        type: 'block',
                        block: ZovaRender.block('start-page:blockFilterActions'),
                      },
                    ],
                  },
                ],
              },
            }),
          ],
        }),
        ZovaRender.block('start-page:blockToolbarBulk', {
          actions: [ZovaRender.tableActionBulk('start-table:actionCreate')],
        }),
        ZovaRender.block('start-page:blockTable'),
      ],
    }),
  ],
})
export class DtoRoleSelectResItem extends $Dto.get(() => ModelRole, {
  dtoClass: DtoRoleRead,
}) {
  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('start-table:actionOperationsRow', {
      actions: [
        ZovaRender.tableActionRow('start-table:actionUpdate'),
        ZovaRender.tableActionRow('start-table:actionDelete'),
      ],
    }),
  )
  _operationsRow?: unknown;
}
