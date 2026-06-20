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
    'start-table:actionDelete'?: ITableCellOptionsActionDelete;
  }
}

export interface ITableCellOptionsActionDelete extends IResourceTableActionRowOptionsBase {
  color?: string;
  icon?: keyof IIconRecord;
}

@TableCell<ITableCellOptionsActionDelete>({
  color: 'error',
  icon: '::delete',
})
export class TableCellActionDelete extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionDelete,
    renderContext: IJsxRenderContextTableCell,
    _optionsnext: NextTableCellRender,
  ) {
    const { $host } = renderContext;
    return (
      <ZButton
        class={options.class}
        color={options.color}
        icon={options.icon}
        onPerform={async () => {
          const confirmed = await $host.$performCommand('start-commands:confirm', {
            text: this.scope.locale.DeleteConfirm(),
          });
          if (!confirmed) return;
          await $host.$performCommand('start-commands:delete', options, renderContext);
        }}
      ></ZButton>
    );
  }
}
