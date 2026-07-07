import type { IComponentOptions } from 'zova';
import type { IJsxRenderContextPage, IResourceBlockOptionsBase } from 'zova-module-a-openapi';

import { Row } from '@tanstack/table-core';
import { VDataTableRow, VDataTableServer } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { BeanControllerTableBase, ZTable } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'start-page:blockTable'?: ControllerBlockTableProps;
  }
}

export interface ControllerBlockTableProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockTable<TData extends {} = {}> extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  tableRef: BeanControllerTableBase<TData>;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  protected async __init__() {}

  get permissions() {
    return this.$$renderContext.$celScope.permissions;
  }

  protected render() {
    const { $$page } = this.$$renderContext;
    return (
      <div class={this.$props.class}>
        <ZTable<TData>
          controllerRef={ref => {
            this.tableRef = ref;
            $$page.tableRef = ref as unknown as BeanControllerTableBase<{}>;
          }}
          data={$$page.data as unknown as TData[]}
          schema={$$page.schemaRow}
          tableScope={$$page.jsxCelScope}
          slotDefault={$$table => {
            return this._renderTable($$table);
          }}
        ></ZTable>
      </div>
    );
  }

  public _renderTable($$table: BeanControllerTableBase<TData>) {
    const { $$page } = this.$$renderContext;
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
    const dataTableOptions: VDataTableServer['$props'] = {
      'loading': !$$page.paged,
      'itemsLength': $$page.paged?.total as string | number,
      'itemsPerPage': $$page.queryPaged.pageSize,
      'onUpdate:options': options => {
        $$page.setPageSize(options.itemsPerPage);
        $$page.gotoPage(options.page);
      },
      headers,
      'items': table.getRowModel().rows,
    };
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
    return <VDataTableServer {...dataTableOptions} v-slots={slots}></VDataTableServer>;
  }
}
