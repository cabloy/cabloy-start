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

interface DepartmentMoveData {
  parentId: TableIdentity | null;
}

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'admin-department:actionMove'?: ITableCellOptionsActionMove;
  }
}

export interface ITableCellOptionsActionMove extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionMove>()
export class TableCellActionMove extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionMove,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $host, cellContext, ctx } = renderContext;
    const row = cellContext.row as unknown as DepartmentRow;
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
          await this._openMoveDialog($host, modelDepartment, row);
        }}
      >
        {this.scope.locale.MoveDepartment()}
      </ZButton>
    );
  }

  private async _openMoveDialog(
    $host: IJsxRenderContextTableCell['$host'],
    modelDepartment: ModelDepartment,
    row: DepartmentRow,
  ) {
    const apiSchemas = modelDepartment.scope.apiSchema.adminDepartment.move();
    await apiSchemas.sdk.suspense();
    let dialog: AppModalItem | undefined;
    let formRef: BeanControllerFormBase<DepartmentMoveData> | undefined;
    dialog = this.$appModal.dialog({
      title: this.scope.locale.MoveDepartment(),
      slotDefault: () => (
        <ZForm<DepartmentMoveData>
          formTag="div"
          controllerRef={ref => {
            formRef = ref;
          }}
          data={{ parentId: row.parentId ?? null }}
          schema={apiSchemas.requestBody}
          formMeta={formMetaFromFormScene('edit')}
          onSubmitData={async data => {
            await modelDepartment.move(row.id).mutateAsync(data.value.parentId);
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
            name="parentId"
            render="admin-department:formFieldDepartmentTree"
            options={{ excludeId: row.id }}
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
              {this.scope.locale.Cancel()}
            </ZButton>
            <ZButton
              color="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
              onPerform={async () => {
                await formRef?.submit();
              }}
            >
              {this.scope.locale.MoveDepartment()}
            </ZButton>
          </>
        );
      },
    });
  }
}
