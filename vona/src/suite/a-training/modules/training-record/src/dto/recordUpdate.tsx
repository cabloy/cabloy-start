import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { onEffectForTrainingRecordSubjects } from '../lib/onEffectForTrainingRecordSubjects.tsx';
import { ModelRecord } from '../model/record.ts';
import { DtoDetailRecordSubjectMutate } from './detailRecordSubjectMutate.tsx';
import { DtoDetailRecordSubjectResItem } from './detailRecordSubjectResItem.tsx';

export interface IDtoOptionsRecordUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordUpdate>({
  openapi: { title: $locale('RecordUpdate') },
  blocks: [
    ZovaRender.block('start-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('start-pageentry:blockForm'),
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
  fields: {
    trainingRecordSubjects: $makeMetadata(
      v.title($locale('TrainingRecordSubjects')),
      ZovaRender.order(8),
      ZovaRender.field('start-details:formFieldDetails'),
      ZovaRender.onEffect(onEffectForTrainingRecordSubjects),
      v.optional(),
    ),
  },
})
export class DtoRecordUpdate extends $Dto.update(() => ModelRecord, {
  columns: [
    'name',
    'subjectCount',
    'totalScore',
    'averageScore',
    'trainingTime',
    'sceneImageIds',
    'dossierFileIds',
    'description',
  ],
  include: { trainingRecordSubjects: { dtoClass: DtoDetailRecordSubjectMutate } },
}) {
  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoDetailRecordSubjectResItem))
  _trainingRecordSubjects?: DtoDetailRecordSubjectResItem[];
}
