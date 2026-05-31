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
  export interface IResourceTableActionRowRecord {
    'start-table:actionView'?: ITableCellOptionsActionView;
  }
}

export interface ITableCellOptionsActionView extends IResourceTableActionRowOptionsBase {
  color?: string;
  variant?: 'elevated' | 'flat' | 'outlined' | 'plain' | 'text' | 'tonal';
}

@TableCell<ITableCellOptionsActionView>({
  class: 'pa-0',
  color: '',
  variant: 'text',
})
export class TableCellActionView extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionView,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const { $host } = renderContext;
    const value = next();
    return (
      <VBtn
        class={options.class}
        color={options.color}
        variant={options.variant}
        nativeOnClick={async e => {
          e.preventDefault();
          e.stopPropagation();
          await $host.$performCommand('start-commands:view', options, renderContext);
        }}
      >
        {value}
      </VBtn>
    );
  }
}
