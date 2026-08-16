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
  deleteMembershipData,
  departmentId,
  getLocale,
  getModelDepartment,
  type DepartmentMembershipRow,
  type MembershipLocale,
} from './membershipAction.tsx';

export interface ITableCellOptionsActionDeleteMembership extends IResourceDetailsActionRowOptionsBase {}

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionRowRecord {
    'admin-department:actionDeleteMembership'?: ITableCellOptionsActionDeleteMembership;
  }
}

@TableCell<ITableCellOptionsActionDeleteMembership>()
export class TableCellActionDeleteMembership extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionDeleteMembership,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const row = renderContext.cellContext.row.original as DepartmentMembershipRow;
    const locale = getLocale(this) as MembershipLocale;
    return (
      <ZButton
        class={options.class}
        color="error"
        variant="outlined"
        onPerform={async () => {
          const confirmed = await renderContext.$host.$performCommand('start-commands:confirm', {
            text: row.manager
              ? locale.DeleteManagerMembershipConfirm()
              : locale.DeleteMembershipConfirm(),
          });
          if (!confirmed) return;
          const modelDepartment = await getModelDepartment(renderContext);
          await modelDepartment
            .deleteMembership(departmentId(renderContext), row.id, row.userId)
            .mutateAsync(deleteMembershipData(row));
        }}
      >
        {locale.Delete()}
      </ZButton>
    );
  }
}
