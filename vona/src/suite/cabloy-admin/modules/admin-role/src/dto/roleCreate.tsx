import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelRole } from 'vona-module-home-user';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoRoleCreateBase } from './roleBase.tsx';

export interface IDtoOptionsRoleCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleCreate>({
  blocks: [
    ZovaRender.block('start-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('start-pageentry:blockForm', {
          blocks: [
            ZovaRender.block('start-form:blockFormLayout', {
              formLayout: {
                children: [
                  {
                    type: 'group',
                    title: $locale('Role'),
                    children: [
                      {
                        type: 'section',
                        columns: { default: 1, md: 2 },
                        children: [
                          { type: 'field', name: 'name' },
                          { type: 'field', name: 'title' },
                          { type: 'field', name: 'locales' },
                          { type: 'field', name: 'siteIds' },
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
            ZovaRender.formActionRow('start-form:actionSubmit', {
              permission: { actionInherit: 'update', formScene: ['create'] },
            }),
            ZovaRender.formActionRow('start-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
  fields: {
    name: $makeSchema(v.min(1), v.trim(), z.string()),
    title: $makeSchema(v.min(1), v.trim(), z.string()),
    locales: $makeSchema(v.optional(), z.record(z.string(), z.string())),
    siteIds: $makeSchema(v.array(z.string())),
  },
})
export class DtoRoleCreate extends $Dto.create(() => ModelRole, {
  dtoClass: DtoRoleCreateBase,
}) {}
