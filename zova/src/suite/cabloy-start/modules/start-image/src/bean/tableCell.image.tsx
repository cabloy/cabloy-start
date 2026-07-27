import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { VBtn, VChip } from 'vuetify/components';
import { BeanBase, ClientOnly } from 'zova';
import { TableCell } from 'zova-module-a-table';

import {
  buildImagePreviewTitle,
  collectImageRelationPreviewItems,
  collectImageUrlPreviewItems,
  inferImageRelationName,
  openImagePreviewDialog,
  resolveImagePreviewUrl,
} from '../lib/index.js';

import type { IImagePreviewItem } from '../lib/index.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'start-image:image'?: ITableCellOptionsImage;
  }
}

export interface ITableCellOptionsImage extends IResourceTableCellOptionsBase {
  size?: number;
  fit?: 'cover' | 'contain';
  relationName?: string;
}

interface IImagePreviewSummary {
  count: number;
  item?: IImagePreviewItem;
  items: IImagePreviewItem[];
}

@TableCell<ITableCellOptionsImage>({ size: 40, fit: 'cover' })
export class TableCellImage extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsImage,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const fallbackValue = next();
    const preview = this._resolvePreview(options, renderContext, fallbackValue);
    const item = preview.item;
    if (!item?.url) return item?.filename ?? fallbackValue;
    const previewUrl = this._resolvePreviewUrl(item.url);
    if (!previewUrl) return item.filename ?? fallbackValue;
    const size = options.size ?? 40;
    const passportCode = this._getDeliveryPassportCode();
    const src = passportCode ? this._resolvePreviewUrl(previewUrl, passportCode) : undefined;
    const title = buildImagePreviewTitle(
      renderContext.$celScope.property?.title ?? renderContext.$celScope.name,
      preview.count,
      () => this.scope.locale.PreviewImage(),
    );
    return (
      <VBtn
        variant="text"
        density="compact"
        class="pa-0"
        nativeOnClick={event => {
          event.preventDefault();
          event.stopPropagation();
          void this._openPreviewDialog(preview, title);
        }}
      >
        <div class="d-flex align-center ga-2">
          <div class="overflow-hidden rounded bg-surface-variant" style={{ width: `${size}px`, height: `${size}px` }}>
            <ClientOnly>
              {src && <img class="w-100 h-100" style={{ display: 'block', objectFit: options.fit ?? 'cover' }} src={src} alt={item.filename ?? 'image'} />}
            </ClientOnly>
          </div>
          {preview.count > 1 && <VChip size="x-small">+{preview.count - 1}</VChip>}
        </div>
      </VBtn>
    );
  }

  private _resolvePreview(
    options: ITableCellOptionsImage,
    renderContext: IJsxRenderContextTableCell,
    value: unknown,
  ): IImagePreviewSummary {
    const relationName = inferImageRelationName(renderContext.$celScope.name, options.relationName);
    const relationValue = relationName ? renderContext.cellContext.row.original[relationName] : undefined;
    const relation = collectImageRelationPreviewItems(relationValue);
    if (relation.length) return { count: relation.length, item: relation[0], items: relation };
    const urls = collectImageUrlPreviewItems(value);
    return { count: urls.length, item: urls[0], items: urls };
  }

  private async _openPreviewDialog(preview: IImagePreviewSummary, title: string) {
    const passportCode = await this._ensureDeliveryPassportCode();
    const items = preview.items
      .map(item => ({ ...item, url: this._resolvePreviewUrl(item.url, passportCode) }))
      .filter((item): item is IImagePreviewItem => !!item.url);
    openImagePreviewDialog({
      appModal: this.$appModal,
      title,
      items,
      baseURL: this.sys.config.api.baseURL,
    });
  }

  private _getDeliveryPassportCode() {
    return this.$passport.getFreshTempAuthToken({
      path: `${this.sys.config.api.prefix ?? '/api'}/image/delivery`,
      staleTime: 30 * 1000,
    });
  }

  private async _ensureDeliveryPassportCode() {
    return await this.$passport.ensureFreshTempAuthToken({
      path: `${this.sys.config.api.prefix ?? '/api'}/image/delivery`,
      staleTime: 30 * 1000,
    });
  }

  private _resolvePreviewUrl(url: string, passportCode?: string) {
    return resolveImagePreviewUrl(url, this.sys.config.api.baseURL, passportCode);
  }
}
