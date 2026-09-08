import type { DataTableHeader } from 'vuetify';
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
  private cTable: string;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  protected async __init__() {
    this.cTable = this.$style({
      $nest: {
        '&.v-data-table .v-table__wrapper > table > thead > tr > th.v-data-table__th--sortable:not(.v-data-table__th--sorted) .v-data-table-header__sort-icon':
          {
            opacity: 0.5,
          },
      },
    });
  }

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
            $$page.setTableRef(ref as unknown as BeanControllerTableBase<{}> | undefined);
          }}
          data={$$page.data as unknown as TData[]}
          schema={$$page.schemaRow}
          schemaOrder={$$page.schemaOrder}
          sorting={$$page.sorting}
          onSortingChange={updater => $$page.onSortingChange(updater)}
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
    const headers: DataTableHeader[] = table.getFlatHeaders().map(header => {
      const column = header.column;
      const columnDefHeader = column.columnDef.header;
      const rest = (column.columnDef.meta as any)?.rest;
      return {
        title:
          typeof columnDefHeader === 'function'
            ? columnDefHeader(header.getContext())
            : columnDefHeader,
        key: header.id,
        align: rest?.align === 'left' ? 'start' : rest?.align === 'right' ? 'end' : rest?.align,
        width: rest?.width,
        minWidth: rest?.width,
        fixed: rest?.fixed === 'left' ? 'start' : rest?.fixed === 'right' ? 'end' : undefined,
        sortable: column.getCanSort(),
      };
    });
    const sortableKeys = new Set(
      headers.filter(header => header.sortable).map(header => header.key),
    );
    const dataTableOptions: VDataTableServer['$props'] = {
      'class': this.cTable,
      'loading': !$$page.paged,
      'itemsLength': $$page.paged?.total as string | number,
      'itemsPerPage': $$page.queryPaged.pageSize,
      'multiSort': false,
      'mustSort': true,
      'sortBy': $$page.sorting.map(sorting => ({
        key: sorting.id,
        order: sorting.desc ? 'desc' : 'asc',
      })),
      'onUpdate:sortBy': sortBy => {
        const emittedSorting = sortBy?.[0];
        const currentSorting = $$page.sorting[0];
        const key =
          emittedSorting && typeof emittedSorting.key === 'string'
            ? emittedSorting.key
            : sortBy?.length === 0
              ? currentSorting?.id
              : undefined;
        const column = key && sortableKeys.has(key) ? table.getColumn(key) : undefined;
        if (!column) {
          $$page.onSortingChange([]);
          return;
        }
        const emittedOrder = emittedSorting?.order;
        const order =
          currentSorting?.id !== column.id
            ? column.getFirstSortDir()
            : emittedOrder === 'asc' || emittedOrder === 'desc'
              ? emittedOrder
              : currentSorting.desc
                ? 'asc'
                : 'desc';
        $$page.onSortingChange([{ id: column.id, desc: order === 'desc' }]);
      },
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
