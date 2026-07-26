import type { IResourceDetailsActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { IIconRecord } from 'zova-module-a-icon';
import { TableCell } from 'zova-module-a-table';
import { ZButton } from 'zova-module-start-button';

import { ICommandOptionsDelete } from './command.delete.jsx';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionRowRecord {
    'start-details:actionDelete'?: ITableCellOptionsActionDelete;
  }
}

export interface ITableCellOptionsActionDelete extends IResourceDetailsActionRowOptionsBase {
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
    _next: NextTableCellRender,
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
          await $host.$performCommand(
            'start-details:delete',
            options as Partial<ICommandOptionsDelete>,
            renderContext,
          );
        }}
      ></ZButton>
    );
  }
}
