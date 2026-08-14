import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelDepartment } from '../model/department.ts';

export interface IDtoOptionsDepartmentSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentSelectResItem>({
  blocks: [
    ZovaRender.block('admin-department:blockPageDepartments', {
      blocks: [
        ZovaRender.block('start-page:blockFilter', {
          formFieldLayout: { inline: true },
          blocks: [
            ZovaRender.block('start-form:blockFormLayout', {
              formLayout: {
                children: [
                  {
                    type: 'section',
                    layout: 'flow',
                    children: [
                      { type: 'field', name: 'name' },
                      {
                        type: 'block',
                        block: ZovaRender.block('start-page:blockFilterActions'),
                      },
                    ],
                  },
                ],
              },
            }),
          ],
        }),
        ZovaRender.block('start-page:blockToolbarBulk', {
          actions: [ZovaRender.tableActionBulk('start-table:actionCreate')],
        }),
        ZovaRender.block('start-page:blockTable'),
      ],
    }),
  ],
})
export class DtoDepartmentSelectResItem extends $Dto.get(() => ModelDepartment, {
  include: { parent: true },
}) {
  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('start-table:actionOperationsRow', {
      actions: [
        ZovaRender.tableActionRow('start-table:actionUpdate'),
        ZovaRender.tableActionRow('admin-department:actionMove', {
          permission: { actionInherit: 'update' },
        }),
        ZovaRender.tableActionRow('start-table:actionDelete'),
      ],
    }),
  )
  _operationsRow?: unknown;
}
