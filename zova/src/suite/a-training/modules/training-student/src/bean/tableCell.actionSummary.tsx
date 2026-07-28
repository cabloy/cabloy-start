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
    'training-student:actionSummary'?: ITableCellOptionsActionSummary;
  }
}

export interface ITableCellOptionsActionSummary extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionSummary>()
export class TableCellActionSummary extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionSummary,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $host, cellContext, ctx } = renderContext;
    return (
      <ZButton
        class={options.class}
        color="info"
        variant="outlined"
        onPerform={async () => {
          const id = cellContext.row.id as TableIdentity;
          const modelStudent = (await ctx.bean._getBean(
            'training-student.model.student',
            true,
          )) as ModelStudent;
          const { data: summary } = await modelStudent.summary(id).refetch();
          const text = [
            `${this.scope.locale.Id()}: ${summary?.id ?? '-'}`,
            `${this.scope.locale.Name()}: ${summary?.name ?? '-'}`,
            `${this.scope.locale.Level()}: ${summary?.level ?? '-'}`,
            `${this.scope.locale.Description()}: ${summary?.description ?? '-'}`,
          ].join('\n');
          await $host.$performCommand('start-commands:alert', { text }, renderContext);
        }}
      >
        {this.scope.locale.Summary()}
      </ZButton>
    );
  }
}
