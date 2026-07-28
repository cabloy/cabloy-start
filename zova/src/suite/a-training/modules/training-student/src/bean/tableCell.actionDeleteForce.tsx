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

import type { ModelStudent } from '../model/student.ts';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'training-student:actionDeleteForce'?: ITableCellOptionsActionDeleteForce;
  }
}

export interface ITableCellOptionsActionDeleteForce extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionDeleteForce>()
export class TableCellActionDeleteForce extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionDeleteForce,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $host, cellContext, ctx } = renderContext;
    return (
      <ZButton
        class={options.class}
        color="error"
        variant="outlined"
        onPerform={async () => {
          const confirmed = await $host.$performCommand('start-commands:confirm', {
            text: this.scope.locale.ForceDeleteConfirm(),
          });
          if (!confirmed) return;
          const id = cellContext.row.id as TableIdentity;
          const modelStudent = (await ctx.bean._getBean(
            'training-student.model.student',
            true,
          )) as ModelStudent;
          await modelStudent.deleteForce(id).mutateAsync();
        }}
      >
        {this.scope.locale.ForceDelete()}
      </ZButton>
    );
  }
}
