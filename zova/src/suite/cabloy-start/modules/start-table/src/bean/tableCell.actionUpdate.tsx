import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { VBtn } from 'vuetify/components';
import { BeanBase } from 'zova';
import { IIconRecord } from 'zova-module-a-icon';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'start-table:actionUpdate'?: ITableCellOptionsActionUpdate;
  }
}

export interface ITableCellOptionsActionUpdate extends IResourceTableActionRowOptionsBase {
  color?: string;
  icon?: keyof IIconRecord;
}

@TableCell<ITableCellOptionsActionUpdate>({
  color: 'primary',
  icon: '::draft',
})
export class TableCellActionUpdate extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionUpdate,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $host } = renderContext;
    return (
      <VBtn
        class={options.class}
        color={options.color}
        icon={options.icon}
        nativeOnClick={async () => {
          await $host.$performCommand('start-commands:edit', options, renderContext);
        }}
      ></VBtn>
    );
  }
}
