import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoUserBase } from './userBase.tsx';

const activatedItems = [
  { value: true, title: $locale('UserAccountStatusActive') },
  { value: false, title: $locale('UserAccountStatusDisabled') },
];

const accountStatusItems = [
  { value: 'active', title: $locale('UserAccountStatusActive') },
  { value: 'disabled', title: $locale('UserAccountStatusDisabled') },
];

export interface IDtoOptionsUserSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserSelectReq>({
  openapi: { filter: { table: 'homeUser' } },
  fields: {
    name: $makeSchema(v.optional(), v.trim(), z.string()),
    activated: $makeSchema(
      ZovaRender.field('start-select:formFieldSelect', {
        items: activatedItems,
        clearable: true,
      }),
      v.optional(),
      z.boolean(),
    ),
    accountStatus: $makeSchema(
      ZovaRender.field('start-select:formFieldSelect', {
        items: accountStatusItems,
        clearable: true,
      }),
      v.optional(),
      z.enum(['active', 'disabled']),
    ),
  },
})
export class DtoUserSelectReq extends $Dto.queryPage(DtoUserBase, [
  'name',
  'activated',
  'accountStatus',
]) {}
