import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsDepartmentMembershipUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentMembershipUpdate>()
export class DtoDepartmentMembershipUpdate {
  @Api.field(
    v.title($locale('Position')),
    $makeSchema(v.optional(), v.nullable(), v.trim(), v.max(100), String),
  )
  position?: string | null;

  @Api.field(v.optional(), z.boolean())
  enabled?: boolean;
}
