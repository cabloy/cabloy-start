import type { TableIdentity } from 'table-identity';
import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';
import { ZButton } from 'zova-module-start-button';

import type { ModelUser } from '../model/user.ts';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'admin-user:actionDisable'?: ITableCellOptionsActionDisable;
  }
}

export interface ITableCellOptionsActionDisable extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionDisable>()
export class TableCellActionDisable extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionDisable,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $host, cellContext, ctx } = renderContext;
    const row = cellContext.row as unknown as { id: TableIdentity; accountStatus?: string };
    const disabled = row.accountStatus === 'disabled';
    return (
      <ZButton
        class={options.class}
        color={disabled ? 'success' : 'error'}
        variant="outlined"
        onPerform={async () => {
          const targetStatus = disabled ? 'active' : 'disabled';
          const confirmed = await $host.$performCommand('start-commands:confirm', {
            text: disabled
              ? this.scope.locale.EnableAccountConfirm()
              : this.scope.locale.DisableAccountConfirm(),
          });
          if (!confirmed) return;
          const id = row.id;
          const modelUser = (await ctx.bean._getBean(
            'admin-user.model.user',
            true,
          )) as ModelUser;
          await modelUser.updateAccountStatus(id, targetStatus).mutateAsync();
        }}
      >
        {disabled ? this.scope.locale.EnableAccount() : this.scope.locale.DisableAccount()}
      </ZButton>
    );
  }
}
