import type { TableIdentity } from 'table-identity';
import type { BeanControllerFormBase } from 'zova-module-a-form';
import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';
import type { AppModalItem } from 'zova-module-start-app';

import { BeanBase } from 'zova';
import { formMetaFromFormScene, ZForm, ZFormFieldPreset } from 'zova-module-a-form';
import { TableCell } from 'zova-module-a-table';
import { ZButton } from 'zova-module-start-button';

import type { ModelDepartment } from '../model/department.ts';

interface DepartmentRow {
  id: TableIdentity;
  parentId: TableIdentity | null;
}

interface DepartmentReorderData {
  beforeId: TableIdentity | null;
}

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'admin-department:actionReorder'?: ITableCellOptionsActionReorder;
  }
}

export interface ITableCellOptionsActionReorder extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionReorder>()
export class TableCellActionReorder extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionReorder,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $host, cellContext, ctx } = renderContext;
    const row = cellContext.row.original as DepartmentRow;
    const locale = this.scope.locale;
    return (
      <ZButton
        class={options.class}
        color="primary"
        variant="outlined"
        onPerform={async () => {
          const modelDepartment = (await ctx.bean._getBean(
            'admin-department.model.department',
            true,
          )) as ModelDepartment;
          await this._openReorderDialog($host, modelDepartment, row);
        }}
      >
        {locale.Reorder()}
      </ZButton>
    );
  }

  private async _openReorderDialog(
    $host: IJsxRenderContextTableCell['$host'],
    modelDepartment: ModelDepartment,
    row: DepartmentRow,
  ) {
    const locale = this.scope.locale;
    const apiSchemas = modelDepartment.scope.apiSchema.adminDepartment.reorder();
    await apiSchemas.sdk.suspense();
    let dialog: AppModalItem | undefined;
    let formRef: BeanControllerFormBase<DepartmentReorderData> | undefined;
    dialog = this.$appModal.dialog({
      title: locale.ReorderDepartment(),
      slotDefault: () => (
        <ZForm<DepartmentReorderData>
          formTag="div"
          controllerRef={ref => {
            formRef = ref;
          }}
          data={{ beforeId: null }}
          schema={apiSchemas.requestBody}
          formMeta={formMetaFromFormScene('edit')}
          onSubmitData={async data => {
            await modelDepartment.reorder(row.id).mutateAsync(data.value.beforeId);
            dialog?.close();
          }}
          onShowError={async ({ error }) => {
            await $host.$performCommand('start-commands:alert', {
              type: 'error',
              text: error.message,
            });
          }}
        >
          <ZFormFieldPreset
            name="beforeId"
            render="admin-department:formFieldDepartmentTree"
            options={{
              excludeId: row.id,
              siblingOfId: row.id,
              rootTitle: locale.AppendDepartment(),
            }}
          ></ZFormFieldPreset>
        </ZForm>
      ),
      slotActions: modal => {
        const isSubmitting = formRef?.formState.isSubmitting ?? false;
        return (
          <>
            <ZButton
              variant="text"
              onPerform={async () => {
                modal.close();
              }}
            >
              {locale.Cancel()}
            </ZButton>
            <ZButton
              color="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
              onPerform={async () => {
                await formRef?.submit();
              }}
            >
              {locale.ReorderDepartment()}
            </ZButton>
          </>
        );
      },
    });
  }
}
