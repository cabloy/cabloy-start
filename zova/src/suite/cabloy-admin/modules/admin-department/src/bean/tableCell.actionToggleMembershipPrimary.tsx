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

export interface ITableCellOptionsActionToggleMembershipPrimary extends IResourceDetailsActionRowOptionsBase {}

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionRowRecord {
    'admin-department:actionToggleMembershipPrimary'?: ITableCellOptionsActionToggleMembershipPrimary;
  }
}

@TableCell<ITableCellOptionsActionToggleMembershipPrimary>()
export class TableCellActionToggleMembershipPrimary extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionToggleMembershipPrimary,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const row = renderContext.cellContext.row.original as DepartmentMembershipRow;
    const locale = getLocale(this) as MembershipLocale;
    return (
      <ZButton
        class={options.class}
        color={row.primary ? 'secondary' : 'primary'}
        variant="outlined"
        onPerform={async () => {
          const modelDepartment = await getModelDepartment(renderContext);
          await modelDepartment
            .updateMembershipPrimary(departmentId(renderContext), row.id, row.userId)
            .mutateAsync({ primary: !row.primary });
        }}
      >
        {row.primary ? locale.ClearPrimary() : locale.SetPrimary()}
      </ZButton>
    );
  }
}
