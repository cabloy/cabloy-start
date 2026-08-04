import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelSubject } from 'vona-module-training-recordsubject';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoDetailRecordSubjectBase } from './detailRecordSubjectBase.tsx';

export interface IDtoOptionsDetailRecordSubjectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDetailRecordSubjectResItem>({
  blocks: [
    ZovaRender.block('start-details:blockDetails', {
      blocks: [
        ZovaRender.block('start-details:blockToolbarBulk', {
          actions: [
            ZovaRender.detailsActionBulk('start-details:actionCreate', {
              dialogOptions: { title: $locale('AddTrainingRecordSubject') },
              permission: { formScene: ['create', 'edit'] },
            }),
          ],
        }),
        ZovaRender.block('start-details:blockTable'),
      ],
    }),
  ],
  fields: {
    name: $makeMetadata(
      ZovaRender.cell('start-details:actionView', {
        dialogOptions: { title: $locale('ViewTrainingRecordSubject') },
      }),
    ),
  },
})
export class DtoDetailRecordSubjectResItem extends $Dto.get(() => ModelSubject, {
  dtoClass: DtoDetailRecordSubjectBase,
}) {
  @Api.field(
    v.title('#'),
    ZovaRender.order(1, 'core'),
    ZovaRender.cell('start-details:lineNumber'),
    v.optional(),
  )
  _lineNumber?: number;

  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('start-details:actionOperationsRow', {
      actions: [
        ZovaRender.detailsActionRow('start-details:actionUpdate', {
          dialogOptions: { title: $locale('EditTrainingRecordSubject') },
          permission: { formScene: ['create', 'edit'] },
        }),
        ZovaRender.detailsActionRow('start-details:actionDelete', {
          permission: { formScene: ['create', 'edit'] },
        }),
      ],
    }),
  )
  _operationsRow?: unknown;
}
