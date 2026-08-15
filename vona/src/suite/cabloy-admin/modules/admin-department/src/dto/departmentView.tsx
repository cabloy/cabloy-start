import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelDepartment } from '../model/department.ts';
import { DtoDepartmentMembershipSummary } from './departmentMembershipSummary.ts';
import { DtoDepartmentUserSummary } from './departmentUserSummary.ts';

export interface IDtoOptionsDepartmentView extends IDecoratorDtoOptions<'_managerName'> {}

@Dto<IDtoOptionsDepartmentView>({
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
                    title: $locale('Department'),
                    children: [
                      {
                        type: 'section',
                        columns: { default: 1, md: 2 },
                        children: [
                          { type: 'field', name: 'name' },
                          { type: 'field', name: 'parentId' },
                          { type: 'field', name: 'enabled' },
                          { type: 'field', name: 'sortOrder' },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'group',
                    title: $locale('DepartmentManager'),
                    children: [
                      {
                        type: 'section',
                        children: [{ type: 'field', name: 'manager.name' }],
                      },
                    ],
                  },
                  {
                    type: 'group',
                    title: $locale('DepartmentMemberships'),
                    children: [{ type: 'field', name: 'memberships' }],
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
  fields: {
    memberships: $makeMetadata(
      v.title($locale('DepartmentMemberships')),
      ZovaRender.field('start-details:formFieldDetails'),
    ),
    _managerName: $makeMetadata(ZovaRender.fieldSource('manager.name')),
  },
})
export class DtoDepartmentView extends $Dto.get(() => ModelDepartment, {
  include: { parent: true },
}) {
  @Api.field(v.title($locale('DepartmentMemberships')), v.array(DtoDepartmentMembershipSummary))
  memberships: DtoDepartmentMembershipSummary[];

  @Api.field(
    v.title($locale('DepartmentManager')),
    ZovaRender.visible(false),
    v.optional(),
    v.nullable(),
    v.object(DtoDepartmentUserSummary),
  )
  manager?: DtoDepartmentUserSummary | null;

  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoDepartmentMembershipSummary))
  _memberships?: DtoDepartmentMembershipSummary[];
}
