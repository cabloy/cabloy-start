import type { IResourceTableCellOptionsBase, ITableQuery } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { VChip, VSelect } from 'vuetify/components';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'start-resource:resourcePicker'?: ITableCellOptionsResourcePicker;
  }
}

export interface ITableCellOptionsResourcePicker extends IResourceTableCellOptionsBase {
  display?: 'select' | 'chips';
  resource?: string;
  actionPath?: string;
  query?: ITableQuery;
  relationName?: string;
  selectOptions?: Omit<VSelect['$props'], 'readonly' | 'style' | 'class'>;
  chipOptions?: Omit<VChip['$props'], 'readonly' | 'style' | 'class'>;
}

interface IResourcePickerItem {
  title: string;
  value: unknown;
}

@TableCell<ITableCellOptionsResourcePicker>({
  selectOptions: { itemValue: 'id', itemTitle: 'name' },
})
export class TableCellResourcePicker extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsResourcePicker,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const fallbackValue = next();
    const items = this._getItems(options, renderContext, fallbackValue);
    if (options.display === 'chips') return this._renderChips(options, items, fallbackValue);
    if (!items.length) return fallbackValue;
    const value = items.map(item => item.title).join(', ');
    if (!options.class) return value;
    return <div class={options.class}>{value}</div>;
  }

  private _renderChips(
    options: ITableCellOptionsResourcePicker,
    items: IResourcePickerItem[],
    fallbackValue: unknown,
  ) {
    if (!items.length) return fallbackValue;
    return (
      <div class={['d-flex flex-wrap ga-1', options.class]}>
        {items.map(item => (
          <VChip {...options.chipOptions} key={String(item.value)} text={item.title}></VChip>
        ))}
      </div>
    );
  }

  private _getItems(
    options: ITableCellOptionsResourcePicker,
    renderContext: IJsxRenderContextTableCell,
    fallbackValue: unknown,
  ): IResourcePickerItem[] {
    const values = this._normalizeValues(fallbackValue);
    if (!values.length) return [];
    const relationName = this._getRelationName(renderContext, options.relationName);
    const relationValue = relationName
      ? renderContext.cellContext.row.original[relationName]
      : undefined;
    const { itemTitle, itemValue } = options.selectOptions ?? {};
    const itemTitleName = typeof itemTitle === 'string' ? itemTitle : 'name';
    const itemValueName = typeof itemValue === 'string' ? itemValue : 'id';
    const relationItems = new Map(
      this._normalizeValues(relationValue)
        .filter(this._isRecord)
        .map(item => [String(item[itemValueName]), item]),
    );
    if (!relationItems.size) return [];
    return values.map(value => {
      const item = relationItems.get(String(value));
      const title = item?.[itemTitleName];
      return {
        value,
        title: title === undefined || title === null ? String(value) : String(title),
      };
    });
  }

  private _getRelationName(renderContext: IJsxRenderContextTableCell, relationName?: string) {
    if (relationName) return relationName;
    const name = renderContext.$celScope.name;
    return name.endsWith('Id') ? name.slice(0, -2) : undefined;
  }

  private _normalizeValues(value: unknown): unknown[] {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
  }

  private _isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
