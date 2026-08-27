import type { SchemaObject } from 'openapi3-ts/oas31';
import type { TableIdentity } from 'table-identity';
import type { BeanControllerFormBase } from 'zova-module-a-form';
import type { IJsxRenderContextTableCell } from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { formMetaFromFormScene, ZForm } from 'zova-module-a-form';
import { ZButton } from 'zova-module-start-button';

import type {
  ApiSchemaAdminDepartmentDtoDepartmentMembershipDelete_2d063d28bc7243bed02ebd8bddf1212a93c6305b,
  ApiSchemaAdminDepartmentDtoDepartmentMembershipUpdate,
} from '../api/openapi/schemas.ts';
import type { ModelDepartment } from '../model/department.ts';

export interface DepartmentMembershipRow {
  id: TableIdentity;
  userId: TableIdentity;
  position?: string | null;
  enabled: boolean;
  primary: boolean;
  manager: boolean;
}

export interface MembershipLocale {
  Cancel(): string;
  ClearPrimary(): string;
  Delete(): string;
  DeleteManagerMembershipConfirm(): string;
  Manager(): string;
  SetManager(): string;
  ClearManager(): string;
  DeleteMembershipConfirm(): string;
  EditMembership(): string;
  Save(): string;
  SetPrimary(): string;
}

export function getLocale(bean: BeanBase): MembershipLocale {
  return (bean as unknown as { scope: { locale: MembershipLocale } }).scope.locale;
}

export function departmentId(renderContext: IJsxRenderContextTableCell): TableIdentity {
  const $$details = renderContext.$celScope.$$details;
  if (!$$details) throw new Error('should provide $$details in cell scope');
  const id = $$details.$currentRoute?.params.id;
  if (id === undefined) throw new Error('should provide Department id in details route');
  return id as TableIdentity;
}

export async function getModelDepartment(
  renderContext: IJsxRenderContextTableCell,
): Promise<ModelDepartment> {
  return (await renderContext.ctx.bean._getBean(
    'admin-department.model.department',
    true,
  )) as ModelDepartment;
}

export async function openMembershipUpdateDialog(
  owner: BeanBase,
  locale: MembershipLocale,
  renderContext: IJsxRenderContextTableCell,
  modelDepartment: ModelDepartment,
  id: TableIdentity,
  row: DepartmentMembershipRow,
) {
  const apiSchemas = modelDepartment.scope.apiSchema.adminDepartment.updateMembership();
  await apiSchemas.sdk.suspense();
  type Data = ApiSchemaAdminDepartmentDtoDepartmentMembershipUpdate;
  let formRef: BeanControllerFormBase<Data> | undefined;
  const dialog = owner.$appModal.dialog({
    title: locale.EditMembership(),
    slotDefault: () => (
      <ZForm<Data>
        formTag="div"
        controllerRef={ref => {
          formRef = ref;
        }}
        data={{ position: row.position ?? undefined, enabled: row.enabled }}
        schema={apiSchemas.requestBody as SchemaObject}
        formMeta={formMetaFromFormScene('edit')}
        onSubmitData={async data => {
          await modelDepartment.updateMembership(id, row.id, row.userId).mutateAsync(data.value);
          dialog?.close();
        }}
        onShowError={async ({ error }) => {
          await renderContext.$host.$performCommand('start-commands:alert', {
            type: 'error',
            text: error.message,
          });
        }}
      ></ZForm>
    ),
    slotActions: modal => {
      const isSubmitting = formRef?.formState.isSubmitting ?? false;
      return (
        <>
          <ZButton variant="text" onPerform={async () => modal.close()}>
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
            {locale.Save()}
          </ZButton>
        </>
      );
    },
  });
}

export function deleteMembershipData(
  row: DepartmentMembershipRow,
): ApiSchemaAdminDepartmentDtoDepartmentMembershipDelete_2d063d28bc7243bed02ebd8bddf1212a93c6305b {
  return row.manager
    ? ({
        managerMembershipId: null,
      } as unknown as ApiSchemaAdminDepartmentDtoDepartmentMembershipDelete_2d063d28bc7243bed02ebd8bddf1212a93c6305b)
    : {};
}
