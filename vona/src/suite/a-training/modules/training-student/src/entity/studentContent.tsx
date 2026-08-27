import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsStudentContent extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsStudentContent>('trainingStudentContent')
export class EntityStudentContent extends EntityBase {
  @Api.field(
    v.title($locale('Description')),
    v.optional(),
    ZovaRender.order(2),
    ZovaRender.field('start-markdown:formFieldMarkdown'),
  )
  descriptionMarkdown?: string;

  @Api.field(v.optional(), ZovaRender.visible(false))
  descriptionHtml?: string;

  @Api.field(v.tableIdentity())
  studentId: TableIdentity;
}
