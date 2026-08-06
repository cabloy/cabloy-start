import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Class } from 'vona';
import { $makeMetadata, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { EntityRole } from 'vona-module-home-user';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsRoleBase extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleBase>({
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core')),
    iid: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
    createdAt: $makeMetadata(ZovaRender.visible(false)),
    updatedAt: $makeMetadata(ZovaRender.visible(false)),
    name: $makeMetadata(
      v.title($locale('RoleName')),
      ZovaRender.order(1),
      ZovaRender.cell('start-table:actionView'),
    ),
    title: $makeMetadata(v.title($locale('RoleTitle')), ZovaRender.order(2)),
    locales: $makeMetadata(v.title($locale('RoleLocales')), ZovaRender.order(3)),
    siteIds: $makeMetadata(v.title($locale('RoleSiteIds')), ZovaRender.order(4)),
  },
})
export class DtoRoleBase extends EntityRole {}

export class DtoRoleRead extends $Class.pick(DtoRoleBase, [
  'id',
  'name',
  'title',
  'locales',
  'siteIds',
]) {}

export class DtoRoleCreateBase extends $Class.pick(DtoRoleBase, [
  'name',
  'title',
  'locales',
  'siteIds',
]) {}

export class DtoRoleUpdateBase extends $Class.pick(DtoRoleBase, ['title', 'locales', 'siteIds']) {}
