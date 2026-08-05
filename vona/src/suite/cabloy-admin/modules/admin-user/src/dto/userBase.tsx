import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Class } from 'vona';
import { $makeMetadata, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { EntityUser } from 'vona-module-home-user';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsUserBase extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserBase>({
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core')),
    iid: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
    createdAt: $makeMetadata(ZovaRender.visible(false)),
    updatedAt: $makeMetadata(ZovaRender.visible(false)),
    name: $makeMetadata(
      v.title($locale('UserName')),
      ZovaRender.order(1),
      ZovaRender.cell('start-table:actionView'),
    ),
    avatar: $makeMetadata(v.title($locale('UserAvatar')), ZovaRender.order(2)),
    email: $makeMetadata(v.title($locale('UserEmail')), ZovaRender.order(3)),
    mobile: $makeMetadata(v.title($locale('UserMobile')), ZovaRender.order(4)),
    activated: $makeMetadata(
      v.title($locale('UserActivated')),
      ZovaRender.order(5),
      ZovaRender.cell('start-switch:switch', { color: 'success' }),
    ),
    locale: $makeMetadata(v.title($locale('UserLocale')), ZovaRender.order(6)),
    tz: $makeMetadata(v.title($locale('UserTz')), ZovaRender.order(7)),
  },
})
export class DtoUserBase extends EntityUser {}

export class DtoUserRead extends $Class.pick(DtoUserBase, [
  'id',
  'name',
  'avatar',
  'email',
  'mobile',
  'activated',
  'locale',
  'tz',
]) {}

export class DtoUserUpdateBase extends $Class.pick(DtoUserBase, [
  'avatar',
  'email',
  'mobile',
  'locale',
  'tz',
]) {}
