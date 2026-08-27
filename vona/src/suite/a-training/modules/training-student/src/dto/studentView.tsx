import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { DtoImageView } from 'vona-module-a-image';
import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelStudent } from '../model/student.ts';
import { DtoDetailRecordResItem } from './detailRecordResItem.tsx';
import { DtoDetailRecordView } from './detailRecordView.tsx';

export interface IDtoOptionsStudentView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentView>({
  blocks: [
    ZovaRender.block('start-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('start-pageentry:blockForm', {
          blocks: [
            ZovaRender.block('start-form:blockFormLayout', {
              formLayout: {
                children: [
                  {
                    type: 'tabs',
                    children: [
                      {
                        type: 'tab',
                        title: $locale('BasicInformation'),
                        children: [
                          {
                            type: 'group',
                            title: $locale('StudentProfile'),
                            children: [
                              {
                                type: 'section',
                                columns: { default: 1, md: 2 },
                                children: [
                                  { type: 'field', name: 'name' },
                                  { type: 'field', name: 'mobile' },
                                  { type: 'field', name: 'imageId' },
                                ],
                              },
                            ],
                          },
                          {
                            type: 'group',
                            title: $locale('Description'),
                            children: [
                              {
                                type: 'section',
                                children: [{ type: 'field', name: 'description' }],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: 'tab',
                        title: $locale('TrainingRecords'),
                        children: [
                          { type: 'field', name: 'level' },
                          {
                            type: 'section',
                            children: [{ type: 'field', name: 'trainingRecords' }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            }),
          ],
        }),
        ZovaRender.block('start-pageentry:blockToolbarRow', {
          actions: [
            ZovaRender.formActionRow('start-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
  fields: {
    trainingRecords: $makeMetadata(
      v.title($locale('TrainingRecords')),
      ZovaRender.order(6),
      ZovaRender.field('start-details:formFieldDetails'),
    ),
  },
})
export class DtoStudentView extends $Dto.get(() => ModelStudent, {
  include: { trainingRecords: { dtoClass: DtoDetailRecordView } },
}) {
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

  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoDetailRecordResItem))
  _trainingRecords?: DtoDetailRecordResItem[];
}
