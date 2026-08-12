import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsUserAccountStatusUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserAccountStatusUpdate>()
export class DtoUserAccountStatusUpdate {
  @Api.field(v.title($locale('UserAccountStatus')), z.enum(['active', 'disabled']))
  accountStatus: 'active' | 'disabled';
}
