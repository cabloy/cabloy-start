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
import { ZMarkdownHtml } from 'zova-module-start-markdown';

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
    const { cellContext, ctx } = renderContext;
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
          const querySummary = modelStudent.summary(id);
          await querySummary.refetch();
          this.$appModal.dialog({
            title: this.scope.locale.Summary(),
            slotDefault: () => (
              <div class="d-flex flex-column ga-4">
                <div class="d-flex flex-column ga-1">
                  <div>
                    {this.scope.locale.Id()}: {querySummary.data?.id ?? '-'}
                  </div>
                  <div>
                    {this.scope.locale.Name()}: {querySummary.data?.name ?? '-'}
                  </div>
                  <div>
                    {this.scope.locale.Level()}: {querySummary.data?.levelTitle ?? '-'}
                  </div>
                </div>
                <ZMarkdownHtml html={querySummary.data?.descriptionHtml ?? ''} />
              </div>
            ),
          });
        }}
      >
        {this.scope.locale.Summary()}
      </ZButton>
    );
  }
}
