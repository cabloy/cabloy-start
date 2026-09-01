import type {
  IResourceRenderTableActionRowOptionsAction,
  IResourceTableActionRowOptionsBase,
  TypeTableCellRenderComponent,
} from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { VNode } from 'vue';
import { VBtnGroup } from 'vuetify/components';
import { BeanBase } from 'zova';
import { IJsxRenderContextTableColumn, TableCell } from 'zova-module-a-table';

interface RoleRow extends Record<string, unknown> {
  builtin?: boolean;
}

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'admin-role:actionOperationsRow'?: ITableCellOptionsActionOperationsRow;
  }
}

export interface ITableCellOptionsActionOperationsRow extends IResourceTableActionRowOptionsBase {
  actions?: IResourceRenderTableActionRowOptionsAction[];
}

@TableCell<ITableCellOptionsActionOperationsRow>()
export class TableCellActionOperationsRow extends BeanBase implements ITableCellRender {
  async checkVisible(
    options: ITableCellOptionsActionOperationsRow,
    renderContext: IJsxRenderContextTableColumn,
  ): Promise<boolean> {
    const { $celScope, $host, $$table } = renderContext;
    const permissions = $celScope.permissions;
    const actions = options.actions;
    if (!actions || actions.length === 0) return false;
    const renders: TypeTableCellRenderComponent[] = [];
    for (const action of actions) {
      const permissionHint = action.options?.permission;
      if ($host.$passport.checkPermission(permissions, action.name, permissionHint)) {
        if (!action.render) throw new Error(`should specify action render: ${action.name}`);
        renders.push(action.render);
      }
    }
    await $$table.cellRenderPrepare(renders);
    return renders.length > 0;
  }

  render(
    options: ITableCellOptionsActionOperationsRow,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $celScope, $host, $$table } = renderContext;
    const permissions = $celScope.permissions;
    const actions = options.actions;
    if (!actions || actions.length === 0) return;
    const role = renderContext.cellContext.row.original as RoleRow;
    const builtin = role.builtin === true;
    const domActions: VNode[] = [];
    actions.forEach((action, index) => {
      if (builtin && action.name === 'delete') return;
      const permissionHint = action.options?.permission;
      if (!$host.$passport.checkPermission(permissions, action.name, permissionHint, role)) return;
      const actionOptions = Object.assign({ key: index }, action.options);
      domActions.push($$table.cellRender(action.render!, actionOptions, renderContext));
    });
    if (domActions.length === 0) return;
    return (
      <VBtnGroup class={options.class} variant="outlined" divided>
        {domActions}
      </VBtnGroup>
    );
  }
}
