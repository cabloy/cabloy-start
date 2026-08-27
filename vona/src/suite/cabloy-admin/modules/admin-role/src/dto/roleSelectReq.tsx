import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { DtoRoleBase } from './roleBase.tsx';

export interface IDtoOptionsRoleSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleSelectReq>({
  openapi: { filter: { table: 'homeRole' } },
  fields: {
    name: $makeSchema(v.optional(), v.trim(), z.string()),
    title: $makeSchema(
      ZovaRender.field('start-input:formFieldInput'),
      v.optional(),
      v.trim(),
      z.string(),
    ),
  },
})
export class DtoRoleSelectReq extends $Dto.queryPage(DtoRoleBase, ['name', 'title']) {}
