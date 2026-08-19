import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelRbacGrant } from '../model/rbacGrant.ts';

export interface IDtoOptionsRbacGrantView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacGrantView>({
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
                    title: $locale('BasicInformation'),
                    children: [
                      { type: 'field', name: 'roleId' },
                      { type: 'field', name: 'actionKey' },
                      { type: 'field', name: 'dataScope' },
                      { type: 'field', name: 'enabled' },
                      { type: 'field', name: 'description' },
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
export class DtoRbacGrantView extends $Dto.get(() => ModelRbacGrant) {}
