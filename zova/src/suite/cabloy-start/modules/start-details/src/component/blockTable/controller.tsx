import type { DataTableHeader } from 'vuetify';
import type { IComponentOptions } from 'zova';
import type { IResourceBlockOptionsBase, IJsxRenderContextDetails } from 'zova-module-a-openapi';

import { Row } from '@tanstack/table-core';
import { VDataTable, VDataTableRow } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ControllerTable, ZTable } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'start-details:blockTable'?: ControllerBlockTableProps;
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

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextDetails<TData>;

  protected async __init__() {
    this.$controllerMounted(() => {
      this.$ssr.handleDirectOrOnHydrated(() => {
        if (this._disposed) return;
        this._mounted = true;
        this._observeContainer();
      });
    });
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
    const { $$details } = this.$$renderContext;
    const data = ($$details.data as TData[]).filter(
      item => (item as Record<string, unknown>).deleted !== true,
    );
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

  private _renderTable($$table: ControllerTable<TData>) {
    const table = $$table.table;
    const headers: DataTableHeader[] = table.getFlatHeaders().map(header => {
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
        key: header.id,
        width,
        minWidth: width,
        fixed: fixed === 'left' ? 'start' : fixed === 'right' ? 'end' : undefined,
        align: rest?.align === 'left' ? 'start' : rest?.align === 'right' ? 'end' : rest?.align,
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
    for (const header of headers) {
      if (this.compact && this.isOperationsColumn(header.key!, $$table)) {
        slots[`header.${header.key}`] = () => (
          <span class="d-inline-block position-relative">
            <span class="d-sr-only">{header.title}</span>
          </span>
        );
      }
    }
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
