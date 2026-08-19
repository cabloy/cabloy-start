import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelRbacGrantDepartment } from '../model/rbacGrantDepartment.ts';

export interface IDtoOptionsRbacGrantDepartmentView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacGrantDepartmentView>({
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
                      { type: 'field', name: 'rbacGrantId' },
                      { type: 'field', name: 'departmentId' },
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
export class DtoRbacGrantDepartmentView extends $Dto.get(() => ModelRbacGrantDepartment) {}
