import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { omitObject } from '@cabloy/utils';
import { VSwitch } from 'vuetify/components';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'start-switch:switch'?: ITableCellOptionsSwitch;
  }
}

export interface ITableCellOptionsSwitch
  extends IResourceTableCellOptionsBase, Omit<VSwitch['$props'], 'style'> {}

@TableCell<ITableCellOptionsSwitch>({
  color: 'secondary',
  hideDetails: true,
  readonly: true,
})
export class TableCellSwitch extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsSwitch,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $celScope } = renderContext;
    const propsNew: VSwitch['$props'] = {
      modelValue: Boolean($celScope.value),
      ...omitObject(options, ['style']),
    };
    return <VSwitch {...propsNew}></VSwitch>;
  }
}
