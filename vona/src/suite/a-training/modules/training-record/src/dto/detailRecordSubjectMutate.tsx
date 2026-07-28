import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelSubject } from 'vona-module-training-recordsubject';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { DtoDetailRecordSubjectBase } from './detailRecordSubjectBase.tsx';

export interface IDtoOptionsDetailRecordSubjectMutate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDetailRecordSubjectMutate>({
  blocks: [ZovaRender.block('start-details:blockForm')],
})
export class DtoDetailRecordSubjectMutate extends $Dto.mutate(() => ModelSubject, {
  dtoClass: DtoDetailRecordSubjectBase,
}) {}
