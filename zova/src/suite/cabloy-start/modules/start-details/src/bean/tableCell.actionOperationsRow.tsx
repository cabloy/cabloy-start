import type {
  IResourceDetailsActionRowOptionsBase,
  IResourceRenderDetailsActionRowOptionsAction,
  TypeTableCellRenderComponent,
} from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  IJsxRenderContextTableColumn,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { Comment, Fragment, isVNode, Text, VNode } from 'vue';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';
import { ZRowOperations } from 'zova-module-start-table';

import { filterDetailsRowActions } from '../lib/detailsPermissions.ts';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionRowRecord {
    'start-details:actionOperationsRow'?: ITableCellOptionsActionOperationsRow;
  }
}

export interface ITableCellOptionsActionOperationsRow extends IResourceDetailsActionRowOptionsBase {
  actions?: IResourceRenderDetailsActionRowOptionsAction[];
}

@TableCell<ITableCellOptionsActionOperationsRow>()
export class TableCellActionOperationsRow extends BeanBase implements ITableCellRender {
  async checkVisible(
    options: ITableCellOptionsActionOperationsRow,
    renderContext: IJsxRenderContextTableColumn,
  ): Promise<boolean> {
    const { $celScope, $$table } = renderContext;
    const actions = options.actions;
    if (!actions || actions.length === 0) return false;
    const $$details = $celScope.$$details!;
    const actionsAllowed = filterDetailsRowActions(
      $$details.formScene,
      $$details.checkPermission.bind($$details),
      actions,
    );
    const renders: TypeTableCellRenderComponent[] = [];
    for (const action of actionsAllowed) {
      const actionName = action.name;
      const actionRender = action.render;
      if (!actionRender) throw new Error(`should specify action render: ${actionName}`);
      renders.push(actionRender);
    }
    await $$table.cellRenderPrepare(renders);
    return renders.length > 0;
  }

  render(
    options: ITableCellOptionsActionOperationsRow,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $celScope, $$table } = renderContext;
    const actions = options.actions;
    if (!actions || actions.length === 0) return;
    const $$details = $celScope.$$details!;
    const actionsAllowed = filterDetailsRowActions(
      $$details.formScene,
      $$details.checkPermission.bind($$details),
      actions,
    );
    const domActions: VNode[] = [];
    actionsAllowed.forEach((action, index) => {
      const actionOptions = Object.assign({ key: index }, action.options);
      const domAction = $$table.cellRender(action.render!, actionOptions, renderContext);
      if (this._hasContent(domAction)) domActions.push(domAction);
    });
    if (domActions.length === 0) return;
    return (
      <ZRowOperations
        compact={$$table.compact}
        class={options.class}
        slotDefault={() => <>{domActions}</>}
      />
    );
  }

  private _hasContent(value: unknown): boolean {
    if (value === undefined || value === null || typeof value === 'boolean') return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.some(item => this._hasContent(item));
    if (!isVNode(value)) return true;
    if (value.type === Comment) return false;
    if (value.type === Text || value.type === Fragment) return this._hasContent(value.children);
    // Component renderers stay opaque: preserve their VNode and runtime ownership.
    return true;
  }
}
