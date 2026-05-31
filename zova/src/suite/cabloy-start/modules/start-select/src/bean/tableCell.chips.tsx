import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { VSelect } from 'vuetify/components';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'start-select:chips'?: ITableCellOptionsChips;
  }
}

export interface ITableCellOptionsChips
  extends
    IResourceTableCellOptionsBase,
    Pick<VSelect['$props'], 'items' | 'itemProps' | 'itemTitle' | 'itemValue' | 'multiple'> {}

@TableCell<ITableCellOptionsChips>({
  itemProps: 'props',
  itemValue: 'value',
  itemTitle: 'title',
})
export class TableCellChips extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsChips,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = next();
    const item = options.items?.find(item => item[String(options.itemValue)] === value);
    const value2 = item?.[String(options.itemTitle)];
    if (!options.class) return value2;
    return <div class={options.class}>{value2}</div>;
  }
}
