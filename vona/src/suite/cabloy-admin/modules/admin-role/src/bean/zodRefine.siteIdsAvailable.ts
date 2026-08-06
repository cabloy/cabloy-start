import type {
  IDecoratorZodRefineOptions,
  IZodRefineExecute,
  TypeRefinementCtx,
} from 'vona-module-a-zod';

import { BeanBase } from 'vona';
import { ZodRefine } from 'vona-module-a-zod';

export type TypeZodRefineSiteIdsAvailableData = string[];

export interface IZodRefineOptionsSiteIdsAvailable extends IDecoratorZodRefineOptions {}

@ZodRefine<IZodRefineOptionsSiteIdsAvailable>()
export class ZodRefineSiteIdsAvailable
  extends BeanBase
  implements IZodRefineExecute<TypeZodRefineSiteIdsAvailableData>
{
  async execute(
    value: TypeZodRefineSiteIdsAvailableData,
    refinementCtx: TypeRefinementCtx,
    _options: IZodRefineOptionsSiteIdsAvailable,
  ) {
    const unavailableSiteIds = this.scope.service.role.getUnavailableSiteIds(value);
    if (unavailableSiteIds.length) {
      refinementCtx.addIssue({
        code: 'custom',
        message: this.scope.locale.SiteIdsUnavailable_(
          unavailableSiteIds.map(siteId => JSON.stringify(siteId)).join(', '),
          unavailableSiteIds.length,
        ),
      });
    }
  }
}
