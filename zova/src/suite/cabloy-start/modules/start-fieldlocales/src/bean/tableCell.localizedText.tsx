import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

import { resolveLocalizedText } from '../lib/localizedText.ts';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'start-fieldlocales:localizedText'?: ITableCellOptionsLocalizedText;
  }
}

export interface ITableCellOptionsLocalizedText extends IResourceTableCellOptionsBase {
  localesField: string;
}

@TableCell<ITableCellOptionsLocalizedText>()
export class TableCellLocalizedText extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsLocalizedText,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = next();
    const locales = renderContext.cellContext.row.original[options.localesField];
    const resolvedValue = resolveLocalizedText(value, locales, this.app.meta.locale.current);
    if (!options.class) return resolvedValue;
    return <div class={options.class}>{resolvedValue}</div>;
  }
}
