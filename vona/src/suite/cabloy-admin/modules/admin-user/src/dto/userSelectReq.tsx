import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { DtoUserBase } from './userBase.tsx';

export interface IDtoOptionsUserSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserSelectReq>({
  openapi: { filter: { table: 'homeUser' } },
  fields: {
    name: $makeSchema(v.optional(), v.trim(), z.string()),
    activated: $makeSchema(v.optional(), z.boolean()),
    accountStatus: $makeSchema(v.optional(), z.enum(['active', 'disabled'])),
  },
})
export class DtoUserSelectReq extends $Dto.queryPage(DtoUserBase, [
  'name',
  'activated',
  'accountStatus',
]) {}
