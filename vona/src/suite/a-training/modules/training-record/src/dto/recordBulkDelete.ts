import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsRecordBulkDelete extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordBulkDelete>()
export class DtoRecordBulkDelete {
  @Api.field(v.array(v.tableIdentity()))
  ids: TableIdentity[];
}
