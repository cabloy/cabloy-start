import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Class } from 'vona';
import { $makeMetadata, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { EntityDepartment } from '../entity/department.tsx';

export interface IDtoOptionsDepartmentBase extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentBase>({
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core')),
    iid: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
    createdAt: $makeMetadata(ZovaRender.visible(false)),
    updatedAt: $makeMetadata(ZovaRender.visible(false)),
    name: $makeMetadata(
      v.title($locale('DepartmentName')),
      ZovaRender.order(1),
      ZovaRender.cell('start-table:actionView'),
    ),
    parentId: $makeMetadata(v.title($locale('ParentDepartment')), ZovaRender.order(2)),
    enabled: $makeMetadata(v.title($locale('Enabled')), ZovaRender.order(3)),
    sortOrder: $makeMetadata(v.title($locale('SortOrder')), ZovaRender.order(4)),
    managerMembershipId: $makeMetadata(ZovaRender.visible(false)),
  },
})
export class DtoDepartmentBase extends EntityDepartment {}

export class DtoDepartmentRead extends $Class.pick(DtoDepartmentBase, [
  'id',
  'name',
  'parentId',
  'enabled',
  'sortOrder',
]) {}

export class DtoDepartmentCreateBase extends $Class.pick(DtoDepartmentBase, ['name', 'parentId']) {}

export class DtoDepartmentUpdateBase extends $Class.pick(DtoDepartmentBase, ['name']) {}
