import type { IComponentOptions } from 'zova';
import type { IResourceBlockOptionsBase, IJsxRenderContextDetails } from 'zova-module-a-openapi';

import { Row } from '@tanstack/table-core';
import { VDataTable, VDataTableRow } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { BeanControllerTableBase, ZTable } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'start-details:blockTable'?: ControllerBlockTableProps;
  }
}

export interface ControllerBlockTableProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockTable<TData extends {} = {}> extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  tableRef: BeanControllerTableBase<TData>;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextDetails<TData>;

  protected async __init__() {}

  protected render() {
    const { $$details } = this.$$renderContext;
    const data = ($$details.data as TData[]).filter(
      item => (item as Record<string, unknown>).deleted !== true,
    );
    return (
      <div class={this.$props.class}>
        <ZTable<TData>
          controllerRef={ref => {
            this.tableRef = ref;
            $$details.setTableRef(ref);
          }}
          data={data}
          schema={$$details.schemaRow}
          tableScope={$$details.jsxCelScope}
          slotDefault={$$table => this._renderTable($$table)}
        ></ZTable>
      </div>
    );
  }

  private _renderTable($$table: BeanControllerTableBase<TData>) {
    const table = $$table.table;
    const headers = table.getFlatHeaders().map(header => {
      const columnDefHeader = header.column.columnDef.header;
      return {
        title:
          typeof columnDefHeader === 'function'
            ? columnDefHeader(header.getContext())
            : columnDefHeader,
        key: header.id,
      };
    });
    const slots = {
      item: itemSlotProps => {
        const row: Row<TData> = itemSlotProps.item;
        const slotsCell = {};
        for (const cell of row.getVisibleCells()) {
          const slotName = `item.${cell.column.id}`;
          slotsCell[slotName] = _props => {
            const columnDefCell = cell.column.columnDef.cell;
            return typeof columnDefCell === 'function'
              ? columnDefCell(cell.getContext())
              : columnDefCell;
          };
        }
        return <VDataTableRow {...itemSlotProps.props} v-slots={slotsCell} />;
      },
    };
    return (
      <VDataTable
        headers={headers}
        items={table.getRowModel().rows}
        itemsPerPage={-1}
        hideDefaultFooter
        v-slots={slots}
      ></VDataTable>
    );
  }
}
