import type { IResourceDetailsActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';
import type { AppModalItem, IModalDialogOptions } from 'zova-module-start-app';

import { VBtn } from 'vuetify/components';
import { BeanBase, deepExtend } from 'zova';
import { TypeFormOnSubmitData } from 'zova-module-a-form';
import { IIconRecord } from 'zova-module-a-icon';
import { TableCell } from 'zova-module-a-table';

import { ServiceDetail } from '../service/detail.jsx';
import { IDialogFormOptions } from '../types/dialogForm.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionRowRecord {
    'start-details:actionUpdate'?: ITableCellOptionsActionUpdate;
  }
}

export interface ITableCellOptionsActionUpdate extends IResourceDetailsActionRowOptionsBase {
  color?: string;
  icon?: keyof IIconRecord;
  dialogOptions?: IModalDialogOptions & { icon?: keyof IIconRecord; title?: string };
}

@TableCell<ITableCellOptionsActionUpdate>({
  color: 'primary',
  icon: '::draft',
})
export class TableCellActionUpdate extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionUpdate,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { ctx, $celScope, cellContext } = renderContext;
    return (
      <VBtn
        class={options.class}
        color={options.color}
        icon={options.icon}
        nativeOnClick={async () => {
          const $$details = $celScope.$$details;
          if (!$$details) throw new Error('should provide $$details in cell scope');
          const detailItem = cellContext.row.original as Record<string, any>;
          const detailItemIndex = $$details.data.indexOf(detailItem);
          if (detailItemIndex === -1) throw new Error('detail item is no longer available');
          const detailService = await ctx.bean._newBean(ServiceDetail, true, {
            locale: this.scope.locale,
            schema: $$details.schemaForm,
            data: deepExtend({}, detailItem),
            formScene: 'edit',
            schemaScene: 'form',
            icon: options.dialogOptions?.icon,
            title: options.dialogOptions?.title ?? this.scope.locale.EditDetail(),
            dialogOptions: options.dialogOptions,
            onSubmitData: (
              data: TypeFormOnSubmitData<Record<string, any>>,
              dialog: AppModalItem,
            ) => {
              const detailItemNew = detailService.buildSubmittedDetailItem(data, detailItem);
              $$details.data = $$details.data.map((item, index) => {
                return index === detailItemIndex ? detailItemNew : item;
              });
              dialog.close();
            },
          } satisfies IDialogFormOptions);
          detailService.openDialogForm();
        }}
      ></VBtn>
    );
  }
}
