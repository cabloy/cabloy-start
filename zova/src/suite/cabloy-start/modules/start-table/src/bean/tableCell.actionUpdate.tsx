import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { IIconRecord } from 'zova-module-a-icon';
import { TableCell } from 'zova-module-a-table';
import { ZButton } from 'zova-module-start-button';

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
      <ZButton
        class={options.class}
        color={options.color}
        icon={options.icon}
        onPerform={async () => {
          await $host.$performCommand('start-commands:edit', options, renderContext);
        }}
      ></ZButton>
    );
  }
}
