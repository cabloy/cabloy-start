import type { IResourceDetailsActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';
import { ZButton } from 'zova-module-start-button';

import {
  departmentId,
  getLocale,
  getModelDepartment,
  type DepartmentMembershipRow,
  type MembershipLocale,
} from './membershipAction.tsx';

export interface ITableCellOptionsActionUpdateMembershipManager
  extends IResourceDetailsActionRowOptionsBase {}

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionRowRecord {
    'admin-department:actionUpdateMembershipManager'?: ITableCellOptionsActionUpdateMembershipManager;
  }
}

@TableCell<ITableCellOptionsActionUpdateMembershipManager>()
export class TableCellActionUpdateMembershipManager extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionUpdateMembershipManager,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const row = renderContext.cellContext.row.original as DepartmentMembershipRow;
    const locale = getLocale(this) as MembershipLocale;
    const title = row.manager ? locale.ClearManager() : locale.SetManager();
    return (
      <ZButton
        class={options.class}
        color={row.manager ? 'secondary' : 'primary'}
        variant="outlined"
        disabled={!row.manager && !row.enabled}
        onPerform={async () => {
          const modelDepartment = await getModelDepartment(renderContext);
          await modelDepartment
            .updateManager(departmentId(renderContext))
            .mutateAsync({ membershipId: row.manager ? null : row.id } as never);
        }}
      >
        {title}
      </ZButton>
    );
  }
}
