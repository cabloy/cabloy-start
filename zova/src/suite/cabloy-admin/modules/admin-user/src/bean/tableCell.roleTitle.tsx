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
    'admin-user:roleTitle'?: ITableCellOptionsRoleTitle;
  }
}

export interface ITableCellOptionsRoleTitle extends IResourceTableCellOptionsBase {}

interface UserRoleSummary {
  systemAdmin: boolean;
}

@TableCell<ITableCellOptionsRoleTitle>()
export class TableCellRoleTitle extends BeanBase implements ITableCellRender {
  render(
    _options: ITableCellOptionsRoleTitle,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const title = next();
    const row = renderContext.cellContext.row.original as UserRoleSummary;
    if (!row.systemAdmin) return title;
    const locale = (this as unknown as { scope: { locale: { Protected(): string } } }).scope.locale;
    return (
      <span class="d-flex align-center ga-2">
        <span>{title}</span>
        <VChip color="warning" size="small" variant="tonal">
          {locale.Protected()}
        </VChip>
      </span>
    );
  }
}
