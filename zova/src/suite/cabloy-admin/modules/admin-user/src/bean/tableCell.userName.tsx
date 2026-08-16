import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { VAvatar, VBtn } from 'vuetify/components';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'admin-user:userName'?: ITableCellOptionsUserName;
  }
}

export interface ITableCellOptionsUserName extends IResourceTableActionRowOptionsBase {
  color?: string;
  variant?: 'elevated' | 'flat' | 'outlined' | 'plain' | 'text' | 'tonal';
}

@TableCell<ITableCellOptionsUserName>({
  class: 'pa-0',
  color: '',
  variant: 'text',
})
export class TableCellUserName extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsUserName,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const { $host, cellContext } = renderContext;
    const name = next();
    const avatar = cellContext.row.original.avatar as string | undefined;
    return (
      <VBtn
        class={options.class}
        color={options.color}
        variant={options.variant}
        v-slots={{
          prepend: () => (
            <VAvatar image={avatar || this.$scopeBase.config.avatar.empty} size={24} />
          ),
        }}
        nativeOnClick={async event => {
          event.preventDefault();
          event.stopPropagation();
          await $host.$performCommand('start-commands:view', options, renderContext);
        }}
      >
        {name}
      </VBtn>
    );
  }
}
