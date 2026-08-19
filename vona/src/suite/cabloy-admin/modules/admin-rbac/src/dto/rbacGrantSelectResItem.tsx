import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelRbacGrant } from '../model/rbacGrant.ts';

export interface IDtoOptionsRbacGrantSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacGrantSelectResItem>({
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
                      { type: 'field', name: 'actionKey' },
                      { type: 'field', name: 'createdAt' },
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
export class DtoRbacGrantSelectResItem extends $Dto.get(() => ModelRbacGrant) {
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
