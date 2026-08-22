import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { cel } from '@cabloy/utils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelRole } from 'vona-module-home-user';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoRoleRead } from './roleBase.tsx';

export interface IDtoOptionsRoleView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleView>({
  blocks: [
    ZovaRender.block('start-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('start-pageentry:blockForm', {
          blocks: [
            ZovaRender.block('start-form:blockFormLayout', {
              formLayout: {
                children: [
                  {
                    type: 'tabs',
                    children: [
                      {
                        type: 'tab',
                        title: $locale('Role'),
                        children: [
                          {
                            type: 'section',
                            columns: { default: 1, md: 2 },
                            children: [
                              { type: 'field', name: 'name' },
                              { type: 'field', name: 'title' },
                              { type: 'field', name: 'siteIds' },
                            ],
                          },
                        ],
                      },
                      {
                        type: 'tab',
                        title: $locale('ResourcePermissions'),
                        children: [
                          {
                            type: 'block',
                            block: ZovaRender.block('admin-rbac:blockPolicyEditor', {
                              roleId: cel('id'),
                            }),
                          },
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
export class DtoRoleView extends $Dto.get(() => ModelRole, {
  dtoClass: DtoRoleRead,
}) {}
