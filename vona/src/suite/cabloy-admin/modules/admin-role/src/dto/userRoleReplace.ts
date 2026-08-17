import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, $resourceName, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsUserRoleReplace extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserRoleReplace>({
  fields: {
    roleIds: $makeMetadata(
      ZovaRender.field('start-resource:formFieldResourcePicker', {
        resource: $resourceName('admin-role:role'),
        actionPath: 'membership-select',
        selectOptions: {
          multiple: true,
          itemValue: 'id',
          itemTitle: 'title',
        },
      }),
    ),
  },
})
export class DtoUserRoleReplace {
  @Api.field(v.title($locale('Roles')), v.array(v.tableIdentity()))
  roleIds: TableIdentity[];
}
