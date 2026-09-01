import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Class } from 'vona';
import { Api, $makeMetadata, $resourceName, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { DtoSiteCatalogSelectResItem } from 'vona-module-home-base';
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
    title: $makeMetadata(
      v.title($locale('RoleTitle')),
      ZovaRender.order(2),
      ZovaRender.field('start-fieldlocales:formFieldLocalizedText', {
        localesField: 'titleLocales',
      }),
      ZovaRender.cell('start-fieldlocales:localizedText', {
        localesField: 'titleLocales',
      }),
    ),
    titleLocales: $makeMetadata(ZovaRender.visible(false)),
    builtin: $makeMetadata(
      v.title($locale('RoleBuiltin')),
      ZovaRender.order(3),
      ZovaRender.cell('start-switch:switch', { color: 'success' }),
    ),
    siteIds: $makeMetadata(
      v.title($locale('RoleSiteIds')),
      ZovaRender.order(4),
      ZovaRender.field('start-resource:formFieldResourcePicker', {
        resource: $resourceName('home-base:siteCatalog'),
        display: 'chips',
        relationName: 'sites',
        selectOptions: {
          multiple: true,
          itemValue: 'siteId',
          itemTitle: 'title',
        },
      }),
      ZovaRender.cell('start-resource:resourcePicker', {
        display: 'chips',
        relationName: 'sites',
        selectOptions: {
          multiple: true,
          itemValue: 'siteId',
          itemTitle: 'title',
        },
      }),
    ),
  },
})
export class DtoRoleBase extends EntityRole {}

export class DtoRoleRead extends $Class.pick(DtoRoleBase, [
  'id',
  'name',
  'title',
  'titleLocales',
  'builtin',
  'siteIds',
]) {
  @Api.field(
    ZovaRender.visible(false),
    v.serializerCustom(async function (_value, data: DtoRoleRead) {
      const catalog = await this.app.scope('home-base').service.siteCatalog.select();
      const sitesById = new Map(catalog.list.map(site => [site.siteId, site]));
      return data.siteIds
        .map(siteId => sitesById.get(siteId))
        .filter((site): site is DtoSiteCatalogSelectResItem => !!site);
    }),
    v.optional(),
    v.array(DtoSiteCatalogSelectResItem),
  )
  sites?: DtoSiteCatalogSelectResItem[];
}

export class DtoRoleCreateBase extends $Class.pick(DtoRoleBase, [
  'name',
  'title',
  'titleLocales',
  'siteIds',
]) {}

export class DtoRoleUpdateBase extends $Class.pick(DtoRoleBase, [
  'name',
  'title',
  'titleLocales',
  'siteIds',
]) {}
