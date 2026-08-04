import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { DtoFileView } from 'vona-module-a-file';
import { DtoImageView } from 'vona-module-a-image';
import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelRecord } from '../model/record.ts';

export interface IDtoOptionsRecordSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordSelectResItem>({
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
                      { type: 'field', name: 'studentId' },
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
export class DtoRecordSelectResItem extends $Dto.get(() => ModelRecord, {
  include: { student: true },
}) {
  @Api.field(
    ZovaRender.visible(false),
    v.optional(),
    v.serializerTransform('a-image:resolveViews', {
      fieldName: 'sceneImageIds',
      imageScene: 'training-record:sceneImage',
      deliveryOptions: { audience: true },
    }),
    v.array(DtoImageView),
  )
  sceneImages?: DtoImageView[];

  @Api.field(
    v.title($locale('DossierFiles')),
    ZovaRender.visible(false),
    v.optional(),
    v.serializerTransform('a-file:resolveViews', {
      fieldName: 'dossierFileIds',
      fileScene: 'training-record:dossierFile',
      deliveryOptions: { audience: true },
    }),
    v.array(DtoFileView),
  )
  dossierFiles?: DtoFileView[];

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
