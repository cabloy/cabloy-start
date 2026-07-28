import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import {
  DtoDetailRecordSubjectMutate,
  DtoDetailRecordSubjectResItem,
  ModelRecord,
} from 'vona-module-training-record';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { DtoDetailRecordBase } from './detailRecordBase.tsx';

export interface IDtoOptionsDetailRecordMutate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDetailRecordMutate>({
  blocks: [ZovaRender.block('start-details:blockForm')],
})
export class DtoDetailRecordMutate extends $Dto.mutate(() => ModelRecord, {
  dtoClass: DtoDetailRecordBase,
  include: { trainingRecordSubjects: { dtoClass: DtoDetailRecordSubjectMutate } },
}) {
  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoDetailRecordSubjectResItem))
  _trainingRecordSubjects?: DtoDetailRecordSubjectResItem[];
}
