import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsDepartmentMembershipPrimary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentMembershipPrimary>()
export class DtoDepartmentMembershipPrimary {
  @Api.field(v.title($locale('Primary')), z.boolean())
  primary: boolean;
}
