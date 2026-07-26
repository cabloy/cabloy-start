import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { VBtn, VMenu } from 'vuetify/components';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

import type { IFilePreviewItem } from '../types/file.js';

import {
  collectFileRelationPreviewItems,
  inferFileRelationName,
  resolveFileDownloadUrl,
} from '../lib/index.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'start-file:file'?: ITableCellOptionsFile;
  }
}

export interface ITableCellOptionsFile extends IResourceTableCellOptionsBase {
  relationName?: string;
}

@TableCell<ITableCellOptionsFile>()
export class TableCellFile extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsFile,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const fallbackValue = next();
    const relationName = inferFileRelationName(renderContext.$celScope.name, options.relationName);
    const items = collectFileRelationPreviewItems(
      relationName ? renderContext.cellContext.row.original[relationName] : undefined,
    );
    if (!items.length) return fallbackValue;
    if (items.length === 1)
      return this._renderFileButton(items[0], this._label(items[0], fallbackValue));
    return this._renderFileMenu(items, this._label(items[0], fallbackValue));
  }

  private _renderFileButton(item: IFilePreviewItem, label: string) {
    const { downloadUrl } = item;
    if (!downloadUrl) return label;
    return (
      <VBtn
        variant="text"
        density="compact"
        class="text-none"
        nativeOnClick={event => {
          event.stopPropagation();
          void this._openDownloadUrl(downloadUrl);
        }}
      >
        {label}
      </VBtn>
    );
  }

  private _renderFileMenu(items: IFilePreviewItem[], label: string) {
    return (
      <VMenu>
        {{
          activator: ({ props }: any) => (
            <VBtn
              {...props}
              variant="text"
              density="compact"
              class="text-none"
              nativeOnClick={(event: MouseEvent) => {
                event.stopPropagation();
                props.onClick?.(event);
              }}
            >
              {label} (+{items.length - 1})
            </VBtn>
          ),
          default: () => (
            <div class="d-flex flex-column pa-1 bg-surface">
              {items.map(item => (
                <VBtn
                  key={String(item.id)}
                  variant="text"
                  density="compact"
                  disabled={!item.downloadUrl}
                  nativeOnClick={(event: MouseEvent) => {
                    event.stopPropagation();
                    if (item.downloadUrl) void this._openDownloadUrl(item.downloadUrl);
                  }}
                >
                  {this._label(item)}
                </VBtn>
              ))}
            </div>
          ),
        }}
      </VMenu>
    );
  }

  private _label(item: IFilePreviewItem, fallbackValue?: unknown) {
    if (item.filename) return item.filename;
    if (typeof fallbackValue === 'string' || typeof fallbackValue === 'number')
      return String(fallbackValue);
    return `#${String(item.id)}`;
  }

  private async _openDownloadUrl(downloadUrl: string) {
    if (!process.env.CLIENT) return;
    const passportCode = await this.$passport.ensureFreshTempAuthToken({
      path: `${this.sys.config.api.prefix ?? '/api'}/file/download`,
      staleTime: 30 * 1000,
    });
    const url = resolveFileDownloadUrl(downloadUrl, this.sys.config.api.baseURL, passportCode);
    if (url) globalThis.open?.(url, '_blank', 'noopener,noreferrer');
  }
}
