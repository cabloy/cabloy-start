import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { DtoFileView } from 'vona-module-a-file';
import { DtoImageView } from 'vona-module-a-image';
import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelRecord } from '../model/record.ts';
import { DtoDetailRecordSubjectResItem } from './detailRecordSubjectResItem.tsx';
import { DtoDetailRecordSubjectView } from './detailRecordSubjectView.tsx';

export interface IDtoOptionsRecordView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordView>({
  openapi: { title: $locale('RecordView') },
  blocks: [
    ZovaRender.block('start-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('start-pageentry:blockForm'),
        ZovaRender.block('start-pageentry:blockToolbarRow', {
          actions: [
            ZovaRender.formActionRow('start-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
  fields: {
    trainingRecordSubjects: $makeMetadata(
      v.title($locale('TrainingRecordSubjects')),
      ZovaRender.order(8),
      ZovaRender.field('start-details:formFieldDetails'),
      v.optional(),
    ),
  },
})
export class DtoRecordView extends $Dto.get(() => ModelRecord, {
  include: {
    student: true,
    trainingRecordSubjects: { dtoClass: DtoDetailRecordSubjectView },
  },
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

  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoDetailRecordSubjectResItem))
  _trainingRecordSubjects?: DtoDetailRecordSubjectResItem[];
}
