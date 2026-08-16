import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { VSelect } from 'vuetify/components';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

import { isSelectValueEqual } from '../lib/utils.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'start-select:select'?: ITableCellOptionsSelect;
  }
}

export interface ITableCellOptionsSelect
  extends IResourceTableCellOptionsBase, Omit<VSelect['$props'], 'readonly' | 'style'> {}

@TableCell<ITableCellOptionsSelect>({
  itemValue: 'value',
  itemTitle: 'title',
})
export class TableCellSelect extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsSelect,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = next();
    const item = options.items?.find(item => {
      const itemValue = item[String(options.itemValue)];
      return isSelectValueEqual(itemValue, value);
    });
    const value2 = item?.[String(options.itemTitle)];
    if (!options.class) return value2;
    return <div class={options.class}>{value2}</div>;
    // return <VSelect modelValue={value} hideDetails readonly variant="solo" menuIcon="" {...options.select}></VSelect>;
  }
}
