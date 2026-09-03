import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, $resourceName, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelDepartmentMembership } from 'vona-module-admin-department';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsUserDepartmentMembershipSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserDepartmentMembershipSummary>({
  blocks: [
    ZovaRender.block('start-details:blockDetails', {
      blocks: [ZovaRender.block('start-details:blockTable')],
    }),
  ],
  fields: {
    id: $makeMetadata(ZovaRender.visible(false)),
    departmentId: $makeMetadata(
      ZovaRender.cell('admin-department:departmentName', {
        resource: $resourceName('admin-department:department'),
      }),
    ),
    primary: $makeMetadata(
      v.title($locale('Primary')),
      ZovaRender.visible(true),
      ZovaRender.cell('start-switch:switch', { color: 'success' }),
    ),
  },
})
export class DtoUserDepartmentMembershipSummary extends $Dto.get(() => ModelDepartmentMembership, {
  columns: ['id', 'departmentId', 'position', 'enabled', 'primary'],
  include: { department: true },
}) {}
