import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelUser } from 'vona-module-home-user';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoUserRead } from './userBase.tsx';
import { DtoUserDepartmentMembershipSummary } from './userDepartmentMembershipSummary.ts';
import { DtoUserRoleSummary } from './userRoleSummary.ts';

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
                  {
                    type: 'group',
                    title: $locale('Roles'),
                    children: [{ type: 'field', name: 'roles' }],
                  },
                  {
                    type: 'group',
                    title: $locale('DepartmentMemberships'),
                    children: [{ type: 'field', name: 'departmentMemberships' }],
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
    roles: $makeMetadata(
      v.title($locale('Roles')),
      ZovaRender.field('start-details:formFieldDetails'),
    ),
    departmentMemberships: $makeMetadata(
      v.title($locale('DepartmentMemberships')),
      ZovaRender.field('start-details:formFieldDetails'),
    ),
  },
})
export class DtoUserView extends $Dto.get(() => ModelUser, {
  dtoClass: DtoUserRead,
}) {
  @Api.field(v.title($locale('Roles')), v.array(DtoUserRoleSummary))
  roles: DtoUserRoleSummary[];

  @Api.field(v.title($locale('DepartmentMemberships')), v.array(DtoUserDepartmentMembershipSummary))
  departmentMemberships: DtoUserDepartmentMembershipSummary[];

  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoUserRoleSummary))
  _roles?: DtoUserRoleSummary[];

  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoUserDepartmentMembershipSummary))
  _departmentMemberships?: DtoUserDepartmentMembershipSummary[];
}
