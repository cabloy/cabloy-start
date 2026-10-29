import type { DataTableHeader } from 'vuetify';
import type { IComponentOptions } from 'zova';
import type { IJsxRenderContextPage, IResourceBlockOptionsBase } from 'zova-module-a-openapi';

import { Row } from '@tanstack/table-core';
import { VDataTableRow, VDataTableServer } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import {
  BeanControllerTableBase,
  ControllerTable,
  TableColumnIdSelection,
  ZTable,
} from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'start-page:blockTable'?: ControllerBlockTableProps;
  }
}

export interface ControllerBlockTableProps extends IResourceBlockOptionsBase {
  compactBreakpoint?: number | false;
}

@Controller()
export class ControllerBlockTable<TData extends {} = {}> extends BeanControllerBase {
  static $propsDefault = { compactBreakpoint: 768 };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  tableRef: ControllerTable<TData>;
  containerWidth: number | undefined = undefined;
  private _container?: HTMLElement;
  private _observer?: ResizeObserver;
  private _mounted: boolean = false;
  private _disposed: boolean = false;
  private cTable: string;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  protected async __init__() {
    this.$controllerMounted(() => {
      this.$ssr.handleDirectOrOnHydrated(() => {
        if (this._disposed) return;
        this._mounted = true;
        this._observeContainer();
      });
    });
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

  public get compact() {
    const breakpoint = this.$props.compactBreakpoint;
    if (breakpoint === false) return false;
    if (this.containerWidth === undefined) return this.$ssr.state.compactHint === true;
    return this.containerWidth > 0 && this.containerWidth < (breakpoint ?? 768);
  }

  public get columnSizing() {
    const sizing: Record<string, number> = {};
    if (this.compact) {
      for (const property of this.tableRef?.tableMeta?.properties ?? []) {
        if (this.isOperationsColumn(property.key!)) sizing[property.key!] = 80;
      }
    }
    return sizing;
  }

  public isOperationsColumn(key: string, table: ControllerTable<TData> = this.tableRef) {
    if (!table) return false;
    const scope = table.getColumnScope(key);
    const { render } = table.getColumnComponentPropsTop(key, scope, {});
    const provider = table.getRenderProvider(render);
    return (
      provider === 'start-table.tableCell.actionOperationsRow' ||
      provider === 'start-details.tableCell.actionOperationsRow'
    );
  }

  private _setContainer(element: HTMLElement | undefined) {
    if (element === this._container) return;
    this._observer?.disconnect();
    this._container = element;
    this._observeContainer();
  }

  private _observeContainer() {
    const container = this._container;
    if (!this._mounted || this._disposed || !container) return;
    this._observer?.disconnect();
    const measure = () => {
      if (this._disposed || container !== this._container) return;
      this.containerWidth = container.clientWidth;
    };
    measure();
    this._observer = new ResizeObserver(measure);
    this._observer.observe(container);
  }

  protected __dispose__() {
    this._disposed = true;
    this._observer?.disconnect();
    this._container = undefined;
  }

  protected render() {
    const { $$page } = this.$$renderContext;
    return (
      <div
        class={this.$props.class}
        style={{ minWidth: 0, maxWidth: '100%' }}
        data-table-compact={this.compact ? 'true' : 'false'}
        ref={element => {
          if (this.ctx.disposed) return;
          this._setContainer?.((element as HTMLElement | null) ?? undefined);
        }}
      >
        <ZTable<TData>
          compact={this.compact}
          columnSizing={this.columnSizing}
          controllerRef={ref => {
            this.tableRef = ref;
            $$page.setTableRef(ref as unknown as BeanControllerTableBase<{}> | undefined);
          }}
          data={$$page.data as unknown as TData[]}
          schema={$$page.schemaRow}
          schemaOrder={$$page.schemaOrder}
          layout={$$page.tableLayout}
          sorting={$$page.sorting}
          onSortingChange={updater => $$page.onSortingChange(updater)}
          enableRowSelection={$$page.selectionEnabled}
          selectionMode={$$page.selectionMode}
          rowSelection={$$page.rowSelection}
          onRowSelectionChange={updater => $$page.onRowSelectionChange(updater)}
          tableScope={$$page.jsxCelScope}
          slotDefault={$$table => {
            return this._renderTable($$table);
          }}
        ></ZTable>
      </div>
    );
  }

  public _renderTable($$table: ControllerTable<TData>) {
    const { $$page } = this.$$renderContext;
    const table = $$table.table;
    const headers: DataTableHeader[] = table
      .getFlatHeaders()
      .filter(header => header.column.getIsVisible())
      .map(header => {
        const column = header.column;
        const columnDefHeader = column.columnDef.header;
        const rest = (column.columnDef.meta as any)?.rest;
        const fixed = column.getIsPinned();
        const width =
          this.compact && this.isOperationsColumn(column.id, $$table)
            ? 80
            : typeof rest?.width === 'number' || typeof this.columnSizing[column.id] === 'number'
              ? column.getSize()
              : undefined;
        return {
          title:
            typeof columnDefHeader === 'function'
              ? columnDefHeader(header.getContext())
              : columnDefHeader,
          key: header.id === TableColumnIdSelection ? 'data-table-select' : header.id,
          align: rest?.align === 'left' ? 'start' : rest?.align === 'right' ? 'end' : rest?.align,
          width,
          minWidth: width,
          fixed: fixed === 'left' ? 'start' : fixed === 'right' ? 'end' : undefined,
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
      'page': $$page.queryPaged.pageNo,
      'itemsPerPage': $$page.queryPaged.pageSize,
      'itemsPerPageOptions': [10, 25, 50, 100],
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
      'showSelect': $$page.selectionEnabled,
      'selectStrategy': $$page.selectionMode === 'single' ? 'single' : 'page',
      'itemValue': (row: Row<TData>) => row.id,
      'itemSelectable': (row: Row<TData>) => row.getCanSelect(),
      'returnObject': false,
      'modelValue': table
        .getRowModel()
        .rows.filter(row => $$page.rowSelection[row.id])
        .map(row => row.id),
      'onUpdate:modelValue': (values: unknown) => {
        const selected = new Set(Array.isArray(values) ? values.map(value => String(value)) : []);
        const currentPageSelection = Object.fromEntries(
          table
            .getRowModel()
            .rows.filter(row => selected.has(row.id))
            .map(row => [row.id, true]),
        );
        $$page.onRowSelectionChange(currentPageSelection);
      },
      headers,
      'items': table.getRowModel().rows,
    };
    const slots = {
      item: itemSlotProps => {
        const row: Row<TData> = itemSlotProps.item;
        const slotsCell = {};
        for (const cell of row.getVisibleCells()) {
          if (cell.column.id === TableColumnIdSelection) continue;
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
    for (const header of headers) {
      if (this.compact && this.isOperationsColumn(header.key!, $$table)) {
        slots[`header.${header.key}`] = () => (
          <span class="d-inline-block position-relative">
            <span class="d-sr-only">{header.title}</span>
          </span>
        );
      }
    }
    return <VDataTableServer {...dataTableOptions} v-slots={slots}></VDataTableServer>;
  }
}
