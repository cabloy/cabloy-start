import type { VNode } from 'vue';

import { reactive } from 'vue';
import { VBtn } from 'vuetify/components';

import type { IImagePreviewItem } from './preview.js';

import { resolveImagePreviewUrl } from './preview.js';

interface IImagePreviewDialogState {
  activeIndex: number;
}

interface IImagePreviewDialogAppModal {
  dialog(
    options?: {
      title?: string;
      slotDefault?: () => VNode;
    },
    dialogOptions?: {
      maxWidth?: number | string;
      maxHeight?: number | string;
      closeOnBackdrop?: boolean;
      closeOnEscape?: boolean;
      showCloseButton?: boolean;
    },
  ): unknown;
}

export interface IOpenImagePreviewDialogOptions {
  appModal: IImagePreviewDialogAppModal;
  title: string;
  items: IImagePreviewItem[];
  initialIndex?: number;
  baseURL?: string;
}

export function openImagePreviewDialog(options: IOpenImagePreviewDialogOptions) {
  const items = options.items.filter(item => !!item.url);
  if (!items.length) return;
  const state = reactive<IImagePreviewDialogState>({
    activeIndex: normalizeIndex(items.length, options.initialIndex),
  });
  options.appModal.dialog(
    {
      title: options.title,
      slotDefault: () => renderBody(items, state, options.baseURL),
    },
    {
      maxWidth: 960,
      maxHeight: 'calc(100vh - 2rem)',
      closeOnBackdrop: true,
      closeOnEscape: true,
      showCloseButton: true,
    },
  );
}

function renderBody(
  items: IImagePreviewItem[],
  state: IImagePreviewDialogState,
  baseURL?: string,
): VNode {
  const item = items[state.activeIndex] ?? items[0];
  const url = resolveImagePreviewUrl(item?.url, baseURL);
  return (
    <div
      class="d-flex flex-column ga-3"
      tabindex={0}
      onVnodeMounted={vnode => {
        requestAnimationFrame(() => (vnode.el as HTMLElement | null)?.focus());
      }}
      onKeydown={event => {
        if (items.length < 2) return;
        if (event.key === 'ArrowLeft')
          state.activeIndex = (state.activeIndex + items.length - 1) % items.length;
        if (event.key === 'ArrowRight') state.activeIndex = (state.activeIndex + 1) % items.length;
      }}
    >
      {url && (
        <div
          class="d-flex align-center justify-center bg-surface-variant"
          style={{ minHeight: '320px' }}
        >
          <img
            style={{ display: 'block', maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
            src={url}
            alt={item?.filename ?? 'image'}
          />
        </div>
      )}
      {(item?.filename || items.length > 1) && (
        <div class="d-flex align-center justify-space-between ga-3">
          <span class="text-truncate">{item?.filename}</span>
          {items.length > 1 && (
            <span class="text-medium-emphasis">
              {state.activeIndex + 1} / {items.length}
            </span>
          )}
        </div>
      )}
      {items.length > 1 && (
        <div class="d-flex flex-wrap ga-2">
          {items.map((previewItem, index) => (
            <VBtn
              key={`${previewItem.url}-${index}`}
              variant={index === state.activeIndex ? 'tonal' : 'text'}
              size="small"
              nativeOnClick={() => {
                state.activeIndex = index;
              }}
            >
              {previewItem.filename ?? `${index + 1}`}
            </VBtn>
          ))}
        </div>
      )}
    </div>
  );
}

function normalizeIndex(count: number, index?: number) {
  if (index === undefined || index < 0) return 0;
  return Math.min(index, count - 1);
}
