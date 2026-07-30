import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { DtoImageView } from 'vona-module-a-image';
import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelStudent } from '../model/student.ts';

export interface IDtoOptionsStudentSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentSelectResItem>({
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
                    // columns: { default: 1, md: 2 },
                    children: [
                      { type: 'field', name: 'name' },
                      { type: 'field', name: 'level' },
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
export class DtoStudentSelectResItem extends $Dto.get(() => ModelStudent) {
  @Api.field(
    ZovaRender.visible(false),
    v.optional(),
    v.serializerTransform('a-image:resolveView', {
      fieldName: 'imageId',
      imageScene: 'training-student:studentImage',
    }),
    v.object(DtoImageView),
  )
  image?: DtoImageView;

  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('start-table:actionOperationsRow', {
      actions: [
        ZovaRender.tableActionRow('training-student:actionSummary', {
          permission: { actionInherit: 'view' },
        }),
        ZovaRender.tableActionRow('start-table:actionUpdate'),
        ZovaRender.tableActionRow('start-table:actionDelete'),
        ZovaRender.tableActionRow('training-student:actionDeleteForce', {
          permission: { actionInherit: 'delete' },
        }),
      ],
    }),
  )
  _operationsRow?: unknown;
}
