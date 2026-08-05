import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelUser } from 'vona-module-home-user';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoUserUpdateBase } from './userBase.tsx';

export interface IDtoOptionsUserUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserUpdate>({
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
                    title: $locale('UserProfile'),
                    children: [
                      {
                        type: 'section',
                        columns: { default: 1, md: 2 },
                        children: [
                          { type: 'field', name: 'avatar' },
                          { type: 'field', name: 'email' },
                          { type: 'field', name: 'mobile' },
                          { type: 'field', name: 'locale' },
                          { type: 'field', name: 'tz' },
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
              permission: { actionInherit: 'update', formScene: ['edit'] },
            }),
            ZovaRender.formActionRow('start-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
  fields: {
    avatar: $makeSchema(v.optional(), v.trim(), z.string()),
    email: $makeSchema(v.optional(), v.email(), v.trim(), z.string()),
    mobile: $makeSchema(v.optional(), v.trim(), z.string()),
    locale: $makeSchema(v.optional(), z.string()),
    tz: $makeSchema(v.optional(), v.trim(), z.string()),
  },
})
export class DtoUserUpdate extends $Dto.update(() => ModelUser, {
  dtoClass: DtoUserUpdateBase,
}) {}
