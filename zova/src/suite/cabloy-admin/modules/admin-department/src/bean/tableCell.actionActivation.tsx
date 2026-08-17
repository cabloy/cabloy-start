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

import type { ModelDepartment } from '../model/department.ts';

interface DepartmentRow {
  id: TableIdentity;
  enabled: boolean | number | string;
}

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'admin-department:actionActivation'?: ITableCellOptionsActionActivation;
  }
}

export interface ITableCellOptionsActionActivation extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionActivation>()
export class TableCellActionActivation extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionActivation,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $host, cellContext, ctx } = renderContext;
    const row = cellContext.row.original as DepartmentRow;
    const enabled =
      row.enabled === true || row.enabled === 1 || row.enabled === '1';
    const disabled = !enabled;
    const locale = (this.scope as unknown as {
      locale: {
        Enable(): string;
        Disable(): string;
        EnableDepartmentConfirm(): string;
        DisableDepartmentConfirm(): string;
      };
    }).locale;
    const label = disabled ? locale.Enable() : locale.Disable();
    return (
      <ZButton
        class={options.class}
        color={disabled ? 'success' : 'error'}
        variant="outlined"
        onPerform={async () => {
          const confirmed = await $host.$performCommand('start-commands:confirm', {
            text: disabled ? locale.EnableDepartmentConfirm() : locale.DisableDepartmentConfirm(),
          });
          if (!confirmed) return;
          const modelDepartment = (await ctx.bean._getBean(
            'admin-department.model.department',
            true,
          )) as ModelDepartment;
          await modelDepartment.updateActivation(row.id).mutateAsync(disabled);
        }}
      >
        {label}
      </ZButton>
    );
  }
}
