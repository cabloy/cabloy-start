import type { TableIdentity } from 'table-identity';
import type {
  IFormMeta,
  IResourceRenderBlockOptionsBlock,
  ISchemaObjectExtensionField,
} from 'zova-module-a-openapi';
import type { TypeDetailsCheckPermission } from 'zova-module-start-details';

import { deepExtend } from 'zova';

export function createDepartmentMembershipDetailsHostOptions<TData extends {}>(
  index: number,
  block: IResourceRenderBlockOptionsBlock,
  formMeta: IFormMeta,
  schemaRow: ISchemaObjectExtensionField,
  departmentId: TableIdentity,
  getDetailItems: () => TData[] | undefined,
  checkPermission: TypeDetailsCheckPermission,
) {
  return deepExtend(
    { key: index },
    {
      formMeta,
      schemaForm: schemaRow,
      schemaRow,
      departmentId,
      getDetailItems,
    },
    block.options,
    { checkPermission },
  );
}
