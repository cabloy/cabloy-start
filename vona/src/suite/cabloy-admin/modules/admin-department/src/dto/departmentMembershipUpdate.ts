import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsDepartmentMembershipUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentMembershipUpdate>()
export class DtoDepartmentMembershipUpdate {
  @Api.field(
    v.title($locale('Position')),
    $makeSchema(v.optional(), v.nullable(), v.trim(), v.max(100), String),
  )
  position?: string | null;

  @Api.field(
    v.title($locale('Enabled')),
    ZovaRender.field('start-switch:formFieldSwitch'),
    v.optional(),
    z.boolean(),
  )
  enabled?: boolean;

  @Api.field(
    ZovaRender.visible(false),
    v.title($locale('DepartmentManager')),
    $makeSchema(v.optional(), v.nullable(), v.tableIdentity()),
  )
  managerMembershipId?: TableIdentity | null;
}
