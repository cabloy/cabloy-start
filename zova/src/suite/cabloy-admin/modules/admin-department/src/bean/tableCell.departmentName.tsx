import type { TableIdentity } from 'table-identity';
import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { VBtn } from 'vuetify/components';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'admin-department:departmentName'?: ITableCellOptionsDepartmentName;
  }
}

export interface ITableCellOptionsDepartmentName extends IResourceTableActionRowOptionsBase {
  color?: string;
  relationName?: string;
  variant?: 'elevated' | 'flat' | 'outlined' | 'plain' | 'text' | 'tonal';
}

interface IDepartmentRelation {
  id: TableIdentity;
  name: unknown;
}

@TableCell<ITableCellOptionsDepartmentName>({
  class: 'pa-0',
  color: '',
  resource: 'admin-department:department',
  variant: 'text',
})
export class TableCellDepartmentName extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsDepartmentName,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const { $host, cellContext } = renderContext;
    const relation = this._getRelation(options, renderContext);
    const name = relation?.name ?? next();
    const id = relation?.id ?? cellContext.row.id;
    const pagePath = $host.$router.getPagePath('/rest/resource/:resource/:id/:formScene?', {
      params: { resource: 'admin-department:department', id: id.toString() },
    });
    return (
      <VBtn class={options.class} color={options.color} to={pagePath} variant={options.variant}>
        {name}
      </VBtn>
    );
  }

  private _getRelation(
    options: ITableCellOptionsDepartmentName,
    renderContext: IJsxRenderContextTableCell,
  ): IDepartmentRelation | undefined {
    const relationName = options.relationName ?? this._getRelationName(renderContext);
    const relation = relationName
      ? renderContext.cellContext.row.original[relationName]
      : undefined;
    return this._isDepartmentRelation(relation) ? relation : undefined;
  }

  private _getRelationName(renderContext: IJsxRenderContextTableCell): string | undefined {
    const name = renderContext.$celScope.name;
    return name.endsWith('Id') ? name.slice(0, -2) : undefined;
  }

  private _isDepartmentRelation(value: unknown): value is IDepartmentRelation {
    return typeof value === 'object' && value !== null && 'id' in value && 'name' in value;
  }
}
