import type { TableIdentity } from 'table-identity';
import type { VNode } from 'vue';
import type { IComponentOptions } from 'zova';
import type { IJsxRenderContextFormField } from 'zova-module-a-form';
import type { ControllerFormField, IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IImageSceneRecord, IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { VBtn, VCard, VCardText, VProgressCircular } from 'vuetify/components';
import { BeanControllerBase, ClientOnly, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';

import type { IImageResizeOptions } from '../../lib/imageTransform.js';
import type {
  IImageUploaderRenderState,
  IImageUploaderResult,
} from '../imageUploader/controller.jsx';

import { ZImageUploader } from '../../.metadata/component/imageUploader.js';
import {
  buildImagePreviewTitle,
  inferImageRelationName,
  openImagePreviewDialog,
  resolveImagePreviewUrl,
} from '../../lib/index.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-image:formFieldImage'?: IResourceFormFieldImageOptions;
  }
}

export interface IResourceFormFieldImageResizeOptions extends IImageResizeOptions {}

export interface IResourceFormFieldImageOptions extends IResourceFormFieldOptionsBase {
  imageScene?: keyof IImageSceneRecord | string;
  relationName?: string;
  multiple?: boolean;
  maxCount?: number;
  accept?: string | string[];
  mimeTypes?: string[];
  extensions?: string[];
  maxSize?: number;
  minSize?: number;
  placeholder?: string;
  enableCrop?: boolean;
  cropAspectRatio?: number;
  cropShape?: 'rect' | 'round';
  resize?: IResourceFormFieldImageResizeOptions;
}

export interface ControllerFormFieldImageProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldImageOptions;
}

interface IImagePreviewItem {
  id: TableIdentity;
  url?: string;
  filename?: string;
  width?: number;
  height?: number;
}

@Controller()
export class ControllerFormFieldImage extends BeanControllerBase {
  static $propsDefault = {
    options: {
      maxCount: 1,
      enableCrop: true,
      cropAspectRatio: 1,
      cropShape: 'rect',
      resize: {
        width: 512,
        height: 512,
        fit: 'cover',
        format: 'jpeg',
        quality: 90,
      },
    },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  errorMessage?: string;
  effectiveMultiple = false;
  currentValue?: TableIdentity | TableIdentity[] | string;
  currentOptions: IResourceFormFieldImageOptions = {};
  $$formField?: ControllerFormField;

  uploadedPreviewMap: Record<string, IImagePreviewItem> = {};

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextFormField;

  protected async __init__() {}

  protected render() {
    if (this.$props.readonly) {
      return this._renderReadonlyPreset();
    }
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          this.$$formField = $$formField;
          this.currentValue = propsBucket.value as TableIdentity | TableIdentity[] | string;
          this.currentOptions = propsBucket.options ?? {};
          const hasValidationError = !$$formField.field.state.meta.isValid;
          const imageScene = this.currentOptions.imageScene;
          if (!imageScene) {
            return this._renderUploadSceneRequired(
              hasValidationError,
              props.class,
              propsBucket.options?.placeholder,
            );
          }
          return (
            <ZImageUploader
              imageScene={imageScene}
              accept={this.currentOptions.accept}
              mimeTypes={this.currentOptions.mimeTypes}
              extensions={this.currentOptions.extensions}
              maxSize={this.currentOptions.maxSize}
              minSize={this.currentOptions.minSize}
              multiple={this.currentOptions.multiple !== false}
              onBeforeUpload={(fileCount, policy) => {
                return this._validateUploadCount(fileCount, policy.multiple);
              }}
              crop={this._getCropOptions(this.currentOptions)}
              resize={this.currentOptions.resize}
              onUploadedBatch={(uploaded, policy) => {
                this._handleUploaded(uploaded, propsBucket.disableNotifyChanged, policy.multiple);
              }}
              onError={error => {
                this.errorMessage = error.message;
              }}
              slotDefault={state => {
                const multiple = state.policy.multiple;
                this.effectiveMultiple = multiple;
                const items = this._getPreviewItems(propsBucket.value, multiple);
                const maxCount = this._getMaxCount(this.currentOptions, multiple);
                return this._renderUploadContent(
                  state,
                  items,
                  maxCount,
                  hasValidationError,
                  props.class,
                  propsBucket.options?.placeholder,
                  propsBucket.disableNotifyChanged,
                );
              }}
            ></ZImageUploader>
          );
        }}
      ></ZFormField>
    );
  }

  private _renderUploadSceneRequired(
    hasValidationError: boolean,
    propsClass: string | undefined,
    placeholder: string | undefined,
  ): VNode {
    const errorClass = hasValidationError || !!this.errorMessage ? 'border-error' : undefined;
    return (
      <VCard variant="outlined" class={[propsClass, errorClass]}>
        <VCardText class="d-flex flex-column ga-3">
          <span class="text-medium-emphasis">
            {placeholder ?? this.scope.locale.NoImageSelected()}
          </span>
          <span class="text-error">{this.scope.locale.ImageUploadSceneRequired()}</span>
        </VCardText>
      </VCard>
    );
  }

  private _renderUploadContent(
    state: IImageUploaderRenderState,
    items: IImagePreviewItem[],
    maxCount: number,
    hasValidationError: boolean,
    propsClass: string | undefined,
    placeholder: string | undefined,
    disableNotifyChanged: boolean | undefined,
  ): VNode {
    const errorClass =
      hasValidationError || !!this.errorMessage || !!state.errorMessage
        ? 'border-error'
        : undefined;
    return (
      <VCard variant="outlined" class={[propsClass, errorClass]}>
        <VCardText class="d-flex flex-column ga-3">
          <div class="d-flex flex-wrap align-center ga-3">
            {items.length < maxCount && (
              <VBtn
                color="primary"
                disabled={state.isUploading || state.policy.pending}
                nativeOnClick={state.chooseFiles}
              >
                {this._getUploadButtonText(items.length, state.policy.multiple)}
              </VBtn>
            )}
            {state.isUploading && (
              <span class="d-inline-flex align-center ga-2 text-medium-emphasis">
                <VProgressCircular indeterminate color="primary" size={20}></VProgressCircular>
                {this.scope.locale.Uploading()}
              </span>
            )}
            {!items.length && !state.isUploading && (
              <span class="text-medium-emphasis">
                {placeholder ?? this.scope.locale.NoImageSelected()}
              </span>
            )}
          </div>
          {!!(this.errorMessage || state.errorMessage) && (
            <span class="text-error">{this.errorMessage || state.errorMessage}</span>
          )}
          {!!items.length && (
            <div
              class="d-grid ga-3"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
            >
              {items.map((item, index) =>
                this._renderPreviewCard(item, index, items, false, disableNotifyChanged),
              )}
            </div>
          )}
        </VCardText>
      </VCard>
    );
  }

  private _renderReadonlyPreset() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }) => {
          this.currentValue = propsBucket.value as TableIdentity | TableIdentity[] | string;
          this.currentOptions = propsBucket.options ?? {};
          const items = this._getPreviewItems(
            propsBucket.value,
            Array.isArray(propsBucket.value) && this.currentOptions.multiple !== false,
          );
          return <div class={props.class}>{this._renderReadonlyItems(items)}</div>;
        }}
      ></ZFormField>
    );
  }

  private _renderReadonlyItems(items: IImagePreviewItem[]) {
    if (!items.length)
      return <span class="text-medium-emphasis">{this.scope.locale.NoImageSelected()}</span>;
    return (
      <div
        class="d-grid ga-3"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
      >
        {items.map((item, index) => this._renderPreviewCard(item, index, items, true, false))}
      </div>
    );
  }

  private _renderPreviewCard(
    item: IImagePreviewItem,
    index: number,
    items: IImagePreviewItem[],
    readonly: boolean,
    disableNotifyChanged?: boolean,
  ) {
    const previewUrl = item.url ? this._resolvePreviewUrl(item.url) : undefined;
    const passportCode = this._getDeliveryPassportCode();
    const src =
      previewUrl && passportCode ? this._resolvePreviewUrl(previewUrl, passportCode) : undefined;
    return (
      <VCard key={`${item.id}-${index}`} variant="tonal">
        <div class="bg-surface-variant" style={{ aspectRatio: '1 / 1' }}>
          <ClientOnly>
            {src && (
              <img
                class="w-100 h-100"
                style={{ display: 'block', objectFit: 'cover' }}
                alt={item.filename ?? `image-${index + 1}`}
                src={src}
              />
            )}
          </ClientOnly>
        </div>
        <VCardText class="d-flex flex-column ga-2">
          <div class="text-truncate font-weight-medium">
            {item.filename ?? `#${String(item.id)}`}
          </div>
          {(item.width || item.height) && (
            <span class="text-caption text-medium-emphasis">
              {item.width ?? '-'} × {item.height ?? '-'}
            </span>
          )}
          <div class="d-flex flex-wrap ga-2">
            {previewUrl && (
              <VBtn
                variant="text"
                size="small"
                nativeOnClick={() => {
                  void this._openPreviewDialog(items, index);
                }}
              >
                {this.scope.locale.PreviewImage()}
              </VBtn>
            )}
            {!readonly && (
              <VBtn
                color="error"
                variant="text"
                size="small"
                nativeOnClick={() => {
                  this._removeItem(item.id, disableNotifyChanged);
                }}
              >
                {this.scope.locale.RemoveImage()}
              </VBtn>
            )}
          </div>
        </VCardText>
      </VCard>
    );
  }

  private _getUploadButtonText(
    itemCount: number,
    multiple = this._getEffectiveMultiple(this.currentOptions),
  ) {
    if (multiple) {
      return itemCount > 0 ? this.scope.locale.AddImage() : this.scope.locale.SelectImage();
    }
    return itemCount > 0 ? this.scope.locale.ReplaceImage() : this.scope.locale.SelectImage();
  }

  private _getEffectiveMultiple(
    options?: IResourceFormFieldImageOptions,
    policyMultiple = this.effectiveMultiple,
  ) {
    return policyMultiple && options?.multiple !== false;
  }

  private _getCropOptions(options: IResourceFormFieldImageOptions) {
    if (!options.enableCrop) return undefined;
    return {
      labels: {
        title: this.scope.locale.CropImage(),
        adjust: this.scope.locale.AdjustImage(),
        cancel: this.scope.locale.CancelCrop(),
        apply: this.scope.locale.ApplyCrop(),
      },
      aspectRatio: options.cropAspectRatio,
      shape: options.cropShape,
    } as const;
  }

  private _validateUploadCount(fileCount: number, multiple: boolean) {
    const currentIds = this._normalizeValueToImageIds(this.currentValue, multiple);
    const maxCount = this._getMaxCount(this.currentOptions, multiple);
    const nextCountCandidate = multiple ? currentIds.length + fileCount : Math.min(fileCount, 1);
    return nextCountCandidate > maxCount ? this.scope.locale.TooManyImages(maxCount) : undefined;
  }

  private _handleUploaded(
    uploaded: IImageUploaderResult[],
    disableNotifyChanged: boolean | undefined,
    multiple: boolean,
  ) {
    const currentIds = this._normalizeValueToImageIds(this.currentValue, multiple);
    const maxCount = this._getMaxCount(this.currentOptions, multiple);
    const uploadedItems = uploaded.map(item => this._createPreviewItem(item));
    const nextCountCandidate = multiple
      ? currentIds.length + uploadedItems.length
      : uploadedItems.length;
    if (nextCountCandidate > maxCount) {
      this.errorMessage = this.scope.locale.TooManyImages(maxCount);
      return;
    }
    for (const item of uploadedItems) {
      this.uploadedPreviewMap[String(item.id)] = item;
    }
    const nextIds = multiple
      ? [...currentIds, ...uploadedItems.map(item => item.id)]
      : [uploadedItems[uploadedItems.length - 1].id];
    this.errorMessage = undefined;
    this._setFieldValue(nextIds, disableNotifyChanged, multiple);
  }

  private _createPreviewItem(uploaded: IImageUploaderResult): IImagePreviewItem {
    return {
      id: uploaded.id,
      url: uploaded.url,
      filename: uploaded.filename,
      width: uploaded.width,
      height: uploaded.height,
    };
  }

  private _removeItem(imageId: TableIdentity, disableNotifyChanged?: boolean) {
    const multiple = this._getEffectiveMultiple(this.currentOptions);
    const currentIds = this._normalizeValueToImageIds(this.currentValue, multiple);
    const nextIds = currentIds.filter(item => String(item) !== String(imageId));
    delete this.uploadedPreviewMap[String(imageId)];
    this._setFieldValue(nextIds, disableNotifyChanged, multiple);
  }

  private _setFieldValue(
    imageIds: TableIdentity[],
    disableNotifyChanged: boolean | undefined,
    multiple: boolean,
  ) {
    const nextValue = multiple ? imageIds : (imageIds[0] ?? '');
    this.currentValue = nextValue as any;
    this._syncRelationField(imageIds, multiple);
    this.$$formField?.setValue(nextValue, disableNotifyChanged);
    this.$$formField?.handleBlur();
  }

  private _syncRelationField(imageIds: TableIdentity[], multiple: boolean) {
    const relationName = this._getRelationName();
    if (!relationName) return;
    const relationMap = this._getRelationPreviewMap();
    const relationItems = imageIds.map(imageId => {
      const key = String(imageId);
      return this.uploadedPreviewMap[key] ?? relationMap[key] ?? { id: imageId };
    });
    const relationValue = multiple ? relationItems : (relationItems[0] ?? undefined);
    this.$$renderContext.$$form.setFieldValue(relationName as never, relationValue, true);
  }

  private _getPreviewItems(
    value: unknown,
    multiple = this._getEffectiveMultiple(this.currentOptions),
  ) {
    const imageIds = this._normalizeValueToImageIds(value, multiple);
    const relationMap = this._getRelationPreviewMap();
    if (imageIds.length === 0) {
      return Object.values(relationMap);
    }
    return imageIds.map(imageId => {
      const key = String(imageId);
      return this.uploadedPreviewMap[key] ?? relationMap[key] ?? { id: imageId };
    });
  }

  private _getRelationPreviewMap() {
    const relationName = this._getRelationName();
    if (!relationName) return {} as Record<string, IImagePreviewItem>;
    const relationValue = this.$$renderContext.$$form.getFieldValue(relationName as never);
    const relationItems = Array.isArray(relationValue)
      ? relationValue
      : relationValue
        ? [relationValue]
        : [];
    const map: Record<string, IImagePreviewItem> = {};
    for (const relationItem of relationItems) {
      if (!relationItem?.id) continue;
      map[String(relationItem.id)] = {
        id: relationItem.id,
        url: relationItem.url,
        filename: relationItem.filename,
        width: relationItem.width,
        height: relationItem.height,
      };
    }
    return map;
  }

  private _getRelationName() {
    return inferImageRelationName(this.$props.name, this.currentOptions.relationName);
  }

  private _normalizeValueToImageIds(value: unknown, multiple: boolean): TableIdentity[] {
    if (Array.isArray(value)) {
      return value
        .filter(item => item !== undefined && item !== null && item !== '')
        .map(item => item as TableIdentity);
    }
    if (!multiple && value !== undefined && value !== null && value !== '') {
      return [value as TableIdentity];
    }
    return [];
  }

  private _getMaxCount(options: IResourceFormFieldImageOptions, multiple = this.effectiveMultiple) {
    if (!multiple) return 1;
    return Math.max(options.maxCount ?? 1, 1);
  }

  private async _openPreviewDialog(items: IImagePreviewItem[], currentIndex: number) {
    const passportCode = await this._ensureDeliveryPassportCode();
    const previewItems = items
      .map((item, index) => ({ index, item }))
      .filter(({ item }) => !!item.url)
      .map(({ index, item }) => ({
        index,
        item: {
          url: this._resolvePreviewUrl(item.url!, passportCode),
          filename: item.filename,
        },
      }));
    const resolvedItems = previewItems.filter(item => !!item.item.url);
    if (resolvedItems.length === 0) return;
    const initialIndex = resolvedItems.findIndex(({ index }) => index === currentIndex);
    openImagePreviewDialog({
      appModal: this.$appModal,
      title: this._getPreviewDialogTitle(resolvedItems.length),
      items: resolvedItems.map(({ item }) => ({ ...item, url: item.url! })),
      initialIndex: initialIndex === -1 ? 0 : initialIndex,
      baseURL: this.sys.config.api.baseURL,
    });
  }

  private _getPreviewDialogTitle(count: number) {
    return buildImagePreviewTitle(
      this.$$renderContext.$celScope.property?.title ??
        this.$$renderContext.$celScope.name ??
        this.$props.name,
      count,
      () => this.scope.locale.PreviewImage(),
    );
  }

  private _getDeliveryPassportCode() {
    const apiPrefix = this.sys.config.api.prefix ?? '/api';
    return this.$passport.getFreshTempAuthToken({
      path: `${apiPrefix}/image/delivery`,
      staleTime: 30 * 1000,
    });
  }

  private async _ensureDeliveryPassportCode() {
    const apiPrefix = this.sys.config.api.prefix ?? '/api';
    return await this.$passport.ensureFreshTempAuthToken({
      path: `${apiPrefix}/image/delivery`,
      staleTime: 30 * 1000,
    });
  }

  private _resolvePreviewUrl(url: string, passportCode?: string) {
    return resolveImagePreviewUrl(url, this.sys.config.api.baseURL, passportCode);
  }
}
