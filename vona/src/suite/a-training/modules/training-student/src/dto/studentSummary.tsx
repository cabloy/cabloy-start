import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Class } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';
import { EntityStudent } from '../entity/student.tsx';

export interface IDtoOptionsStudentSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentSummary>()
export class DtoStudentSummary extends $Class.pick(EntityStudent, [
  'id',
  'name',
  'mobile',
  'level',
]) {
  @Api.field(v.title($locale('Description')))
  descriptionMarkdown?: string;

  @Api.field(v.title($locale('Description')))
  descriptionHtml?: string;

  @Api.field(v.title($locale('LevelTitle')))
  levelTitle: string;

  @Api.field(v.title($locale('DescriptionLength')))
  descriptionLength: number;

  @Api.field(v.title($locale('Summary')))
  summaryText: string;
}
