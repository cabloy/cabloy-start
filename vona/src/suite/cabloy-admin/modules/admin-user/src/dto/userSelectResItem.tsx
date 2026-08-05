import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelUser } from 'vona-module-home-user';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoUserRead } from './userBase.tsx';

export interface IDtoOptionsUserSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserSelectResItem>({
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
                      { type: 'field', name: 'activated' },
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
        ZovaRender.block('start-page:blockTable'),
      ],
    }),
  ],
})
export class DtoUserSelectResItem extends $Dto.get(() => ModelUser, {
  dtoClass: DtoUserRead,
}) {
  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('start-table:actionOperationsRow', {
      actions: [ZovaRender.tableActionRow('start-table:actionUpdate')],
    }),
  )
  _operationsRow?: unknown;
}
