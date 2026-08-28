import type { IResourceDetailsActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';
import { ZButton } from 'zova-module-start-button';

import type { DepartmentMembershipRow, MembershipLocale } from './membershipAction.tsx';

import {
  departmentId,
  getLocale,
  getModelDepartment,
  openMembershipUpdateDialog,
} from './membershipAction.tsx';

export interface ITableCellOptionsActionUpdateMembership extends IResourceDetailsActionRowOptionsBase {}

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionRowRecord {
    'admin-department:actionUpdateMembership'?: ITableCellOptionsActionUpdateMembership;
  }
}

@TableCell<ITableCellOptionsActionUpdateMembership>()
export class TableCellActionUpdateMembership extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionUpdateMembership,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const row = renderContext.cellContext.row.original as DepartmentMembershipRow;
    const locale = getLocale(this) as MembershipLocale;
    return (
      <ZButton
        class={options.class}
        color="primary"
        variant="outlined"
        onPerform={async () => {
          const modelDepartment = await getModelDepartment(renderContext);
          await openMembershipUpdateDialog(
            this,
            locale,
            renderContext,
            modelDepartment,
            departmentId(renderContext),
            row,
          );
        }}
      >
        {locale.EditMembership()}
      </ZButton>
    );
  }
}
