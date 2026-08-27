import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { VChip } from 'vuetify/components';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'training-student:level'?: ITableCellOptionsLevel;
  }
}

export interface ITableCellOptionsLevel extends IResourceTableCellOptionsBase {
  items?: Array<Record<string, unknown>>;
  itemValue?: string;
  itemTitle?: string;
}

@TableCell<ITableCellOptionsLevel>({ itemValue: 'value', itemTitle: 'title' })
export class TableCellLevel extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsLevel,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = next();
    const item = options.items?.find(
      item => String(item[String(options.itemValue)]) === String(value),
    );
    return <VChip color={this._color(value)}>{item?.[String(options.itemTitle)] ?? value}</VChip>;
  }

  private _color(value: unknown) {
    if (String(value) === '1') return 'warning';
    if (String(value) === '2') return 'info';
    if (String(value) === '3') return 'success';
    return undefined;
  }
}
