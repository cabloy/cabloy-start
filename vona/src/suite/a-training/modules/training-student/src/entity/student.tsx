import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export const studentLevelItems = [
  { value: 1, title: $locale('LevelBeginner') },
  { value: 2, title: $locale('LevelIntermediate') },
  { value: 3, title: $locale('LevelAdvanced') },
];

export interface IEntityOptionsStudent extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsStudent>('trainingStudent', {
  openapi: { title: $locale('Student') },
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core')),
    iid: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
    createdAt: $makeMetadata(
      ZovaRender.order(-2, 'max'),
      ZovaRender.field('start-date:formFieldDate'),
      ZovaRender.cell('start-date:date'),
    ),
    updatedAt: $makeMetadata(
      ZovaRender.order(-1, 'max'),
      ZovaRender.field('start-date:formFieldDate'),
      ZovaRender.cell('start-date:date'),
    ),
  },
})
export class EntityStudent extends EntityBase {
  @Api.field(
    v.title($locale('StudentName')),
    v.required(),
    v.min(2),
    ZovaRender.order(1),
    ZovaRender.cell('start-table:actionView'),
  )
  name: string;

  @Api.field(
    v.title($locale('Description')),
    v.optional(),
    ZovaRender.order(2),
    ZovaRender.field('start-markdown:formFieldMarkdown'),
  )
  description?: string;

  @Api.field(
    v.title($locale('Mobile')),
    v.required(),
    v.min(11),
    v.serializerReplace({
      patternFrom: /^(\d{3})\d{4}(\d+)$/,
      patternTo: '$1****$2',
    }),
    ZovaRender.order(3),
  )
  mobile: string;

  @Api.field(
    v.title($locale('StudentImage')),
    v.optional(),
    ZovaRender.order(4),
    ZovaRender.field('start-image:formFieldImage', {
      imageScene: 'training-student:studentImage',
      enableCrop: true,
      cropAspectRatio: 1,
      relationName: 'image',
      resize: {
        width: 512,
        height: 512,
        fit: 'cover',
        format: 'jpeg',
        quality: 90,
      },
    }),
    ZovaRender.cell('start-image:image', { relationName: 'image' }),
    v.tableIdentity(),
  )
  imageId?: TableIdentity;

  @Api.field(ZovaRender.visible(false), v.nullable(), v.tableIdentity())
  departmentId: TableIdentity | null;

  @Api.field(ZovaRender.visible(false), v.required(), v.tableIdentity())
  userIdOwner: TableIdentity;

  @Api.field(
    v.title($locale('Level')),
    v.required(),
    ZovaRender.order(5),
    ZovaRender.field('training-student:formFieldLevel', {
      items: studentLevelItems,
      placeholder: $locale('Level'),
    }),
    ZovaRender.cell('training-student:level', { items: studentLevelItems }),
    z.union([z.literal(1), z.literal(2), z.literal(3)]),
  )
  level: number;
}
