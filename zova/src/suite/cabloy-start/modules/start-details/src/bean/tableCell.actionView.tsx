import type { IResourceDetailsActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { VBtn } from 'vuetify/components';
import { BeanBase } from 'zova';
import { IIconRecord } from 'zova-module-a-icon';
import { TableCell } from 'zova-module-a-table';
import { IModalDialogOptions } from 'zova-module-start-app';

import { ServiceDetail } from '../service/detail.jsx';
import { IDialogFormOptions } from '../types/dialogForm.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionRowRecord {
    'start-details:actionView'?: ITableCellOptionsActionView;
  }
}

export interface ITableCellOptionsActionView extends IResourceDetailsActionRowOptionsBase {
  color?: string;
  variant?: 'elevated' | 'flat' | 'outlined' | 'plain' | 'text' | 'tonal';
  dialogOptions?: IModalDialogOptions & { icon?: keyof IIconRecord; title?: string };
}

@TableCell<ITableCellOptionsActionView>({
  class: 'pa-0',
  variant: 'text',
})
export class TableCellActionView extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionView,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const { ctx, $celScope, cellContext } = renderContext;
    const value = next();
    return (
      <VBtn
        class={options.class}
        color={options.color}
        variant={options.variant}
        nativeOnClick={async e => {
          e.preventDefault();
          e.stopPropagation();
          const $$details = $celScope.$$details;
          if (!$$details) throw new Error('should provide $$details in cell scope');
          const detailItem = cellContext.row.original as Record<string, any>;
          const detailService = await ctx.bean._newBean(ServiceDetail, true, {
            locale: this.scope.locale,
            schema: $$details.schemaForm,
            data: detailItem,
            formScene: 'view',
            schemaScene: 'form-view',
            icon: options.dialogOptions?.icon,
            title: options.dialogOptions?.title ?? this.scope.locale.ViewDetail(),
            dialogOptions: options.dialogOptions,
          } satisfies IDialogFormOptions);
          detailService.openDialogForm();
        }}
      >
        {value}
      </VBtn>
    );
  }
}
