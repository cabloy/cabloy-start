import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelRecord } from 'vona-module-training-record';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoDetailRecordBase } from './detailRecordBase.tsx';

export interface IDtoOptionsDetailRecordResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDetailRecordResItem>({
  blocks: [
    ZovaRender.block('start-details:blockDetails', {
      blocks: [
        ZovaRender.block('start-details:blockToolbarBulk', {
          actions: [
            ZovaRender.detailsActionBulk('start-details:actionCreate', {
              dialogOptions: { title: $locale('AddTrainingRecord') },
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
        dialogOptions: { title: $locale('ViewTrainingRecord') },
      }),
    ),
  },
})
export class DtoDetailRecordResItem extends $Dto.get(() => ModelRecord, {
  dtoClass: DtoDetailRecordBase,
  include: { trainingRecordSubjects: false },
}) {
  @Api.field(v.title('#'), ZovaRender.order(1, 'core'), ZovaRender.cell('start-details:lineNumber'))
  _lineNumber?: number;

  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('start-details:actionOperationsRow', {
      actions: [
        ZovaRender.detailsActionRow('start-details:actionUpdate', {
          dialogOptions: { title: $locale('EditTrainingRecord') },
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
