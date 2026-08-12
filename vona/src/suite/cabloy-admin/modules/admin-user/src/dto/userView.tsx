import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelUser } from 'vona-module-home-user';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoUserRead } from './userBase.tsx';

export interface IDtoOptionsUserView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserView>({
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
                          { type: 'field', name: 'name' },
                          { type: 'field', name: 'avatar' },
                          { type: 'field', name: 'email' },
                          { type: 'field', name: 'mobile' },
                          { type: 'field', name: 'activated' },
                          { type: 'field', name: 'accountStatus' },
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
            ZovaRender.formActionRow('start-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
})
export class DtoUserView extends $Dto.get(() => ModelUser, {
  dtoClass: DtoUserRead,
}) {}
