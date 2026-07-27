import type { TableIdentity } from 'table-identity';
import type { IComponentOptions } from 'zova';
import type {
  ControllerFormField,
  IFormFieldComponentOptions,
  IJsxRenderContextFormField,
} from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { VBtn, VCard, VCardText, VProgressCircular } from 'vuetify/components';
import { BeanControllerBase, ClientOnly, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';

import type { IFilePreviewItem } from '../../types/file.js';

import {
  formatFileDate,
  formatFileSize,
  inferFileRelationName,
  resolveFileDownloadUrl,
} from '../../lib/index.js';
import { ModelFile } from '../../model/file.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-file:formFieldFile'?: IResourceFormFieldFileOptions;
  }
}

export interface IResourceFormFieldFileOptions extends IResourceFormFieldOptionsBase {
  fileScene?: string;
  relationName?: string;
  multiple?: boolean;
  maxCount?: number;
  accept?: string | string[];
  mimeTypes?: string[];
  extensions?: string[];
  maxSize?: number;
  minSize?: number;
  placeholder?: string;
}

export interface ControllerFormFieldFileProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldFileOptions;
}

interface IUploadPolicyState {
  acceptAttr?: string;
  multiple: boolean;
  pending: boolean;
}

@Controller()
export class ControllerFormFieldFile extends BeanControllerBase {
  static $propsDefault = {
    options: {
      maxCount: 1,
    },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  fileInputRef?: HTMLInputElement;
  errorMessage?: string;
  isUploading = false;
  currentValue?: TableIdentity | TableIdentity[] | string;
  currentOptions: IResourceFormFieldFileOptions = {};
  $$formField?: ControllerFormField;
  uploadedPreviewMap: Record<string, IFilePreviewItem> = {};

  @Use()
  $$modelFile: ModelFile;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextFormField;

  protected async __init__() {}

  protected render() {
    return this.$props.readonly ? this._renderReadonly() : this._renderEditable();
  }

  private _renderEditable() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          this.$$formField = $$formField;
          this.currentValue = propsBucket.value as TableIdentity | TableIdentity[] | string;
          this.currentOptions = (propsBucket.options ?? {}) as IResourceFormFieldFileOptions;
          const policyState = this._getUploadPolicyState(this.currentOptions);
          const items = this._getPreviewItems(this.currentValue);
          const maxCount = this._getMaxCount(this.currentOptions);
          const disabled = this.isUploading || policyState.pending;
          return (
            <VCard variant="outlined" class={props.class}>
              <VCardText class="d-flex flex-column ga-3">
                <ClientOnly>
                  <input
                    ref={ref => {
                      this.fileInputRef = ref as HTMLInputElement;
                    }}
                    class="d-none"
                    type="file"
                    accept={policyState.acceptAttr}
                    multiple={policyState.multiple}
                    onChange={event => {
                      void this._handleFileChange(event, propsBucket.disableNotifyChanged);
                    }}
                  />
                </ClientOnly>
                <div class="d-flex flex-wrap align-center ga-3">
                  {items.length < maxCount && (
                    <VBtn
                      color="primary"
                      disabled={disabled}
                      nativeOnClick={() => {
                        if (disabled) return;
                        this._applyInputPolicy(policyState);
                        this.fileInputRef?.click();
                      }}
                    >
                      {this._getUploadButtonText(items.length, policyState.multiple)}
                    </VBtn>
                  )}
                  {this.isUploading && (
                    <span class="d-inline-flex align-center ga-2 text-medium-emphasis">
                      <VProgressCircular
                        indeterminate
                        color="primary"
                        size={20}
                      ></VProgressCircular>
                      {this.scope.locale.Uploading()}
                    </span>
                  )}
                  {!items.length && !this.isUploading && (
                    <span class="text-medium-emphasis">
                      {this.currentOptions.placeholder ?? this.scope.locale.NoFileSelected()}
                    </span>
                  )}
                </div>
                {this.errorMessage && <span class="text-error">{this.errorMessage}</span>}
                {items.map((item, index) =>
                  this._renderPreview(item, index, false, propsBucket.disableNotifyChanged),
                )}
              </VCardText>
            </VCard>
          );
        }}
      ></ZFormField>
    );
  }

  private _renderReadonly() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }) => {
          this.currentValue = propsBucket.value as TableIdentity | TableIdentity[] | string;
          this.currentOptions = (propsBucket.options ?? {}) as IResourceFormFieldFileOptions;
          const items = this._getPreviewItems(this.currentValue);
          if (!items.length) {
            return <span class={props.class}>{this.scope.locale.NoFileSelected()}</span>;
          }
          return (
            <div class={props.class}>
              {items.map((item, index) => this._renderPreview(item, index, true))}
            </div>
          );
        }}
      ></ZFormField>
    );
  }

  private _renderPreview(
    item: IFilePreviewItem,
    index: number,
    readonly: boolean,
    disableNotifyChanged?: boolean,
  ) {
    const downloadUrl = item.downloadUrl ? this._resolveDownloadUrl(item.downloadUrl) : undefined;
    return (
      <VCard key={`${item.id}-${index}`} variant="tonal">
        <VCardText class="d-flex flex-wrap align-center justify-space-between ga-3 py-3">
          <div class="d-flex flex-column overflow-hidden">
            <span class="text-truncate font-weight-medium">
              {item.filename ?? `#${String(item.id)}`}
            </span>
            <span class="text-caption text-medium-emphasis">
              {item.contentType ?? '-'} · {formatFileSize(item.size)} ·{' '}
              {this.scope.locale.UploadedAt()}: {formatFileDate(item.uploadedAt)}
            </span>
          </div>
          <div class="d-flex flex-wrap ga-2">
            {downloadUrl && (
              <VBtn
                variant="text"
                size="small"
                nativeOnClick={() => {
                  void this._openDownloadUrl(downloadUrl);
                }}
              >
                {this.scope.locale.DownloadFile()}
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
                {this.scope.locale.RemoveFile()}
              </VBtn>
            )}
          </div>
        </VCardText>
      </VCard>
    );
  }

  private _getUploadPolicyQuery(options?: IResourceFormFieldFileOptions) {
    return this.$$modelFile.getUploadPolicy(options?.fileScene);
  }

  private _getUploadPolicyState(options?: IResourceFormFieldFileOptions): IUploadPolicyState {
    const query = this._getUploadPolicyQuery(options);
    const policy = query?.data;
    return {
      acceptAttr: this._getAcceptAttr(options, policy),
      multiple: this._getEffectiveMultiple(options, policy),
      pending: query ? query.data === undefined && !!(query.isPending || query.isFetching) : false,
    };
  }

  private _getCachedUploadPolicy(options?: IResourceFormFieldFileOptions) {
    return this._getUploadPolicyQuery(options)?.data;
  }

  private async _waitForUploadPolicy(options?: IResourceFormFieldFileOptions) {
    await $QueryEnsureLoaded(() => this._getUploadPolicyQuery(options));
  }

  private _getEffectiveMultiple(
    options?: IResourceFormFieldFileOptions,
    policy = this._getCachedUploadPolicy(options),
  ) {
    return !!(options?.multiple ?? policy?.multiple);
  }

  private _applyInputPolicy(policyState: IUploadPolicyState) {
    if (!this.fileInputRef) return;
    this.fileInputRef.accept = policyState.acceptAttr ?? '';
    this.fileInputRef.multiple = policyState.multiple;
  }

  private async _handleFileChange(event: Event, disableNotifyChanged?: boolean) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (!files.length) return;
    this.errorMessage = undefined;
    this.isUploading = true;
    try {
      const options = this.currentOptions;
      const fileScene = this._getFileScene(options);
      await this._waitForUploadPolicy(options);
      const policy = this._getCachedUploadPolicy(options);
      const multiple = this._getEffectiveMultiple(options, policy);
      const currentIds = this._normalizeFileIds(this.currentValue);
      const filesToUpload = multiple ? files : files.slice(0, 1);
      const maxCount = this._getMaxCount(options, multiple);
      if (currentIds.length + filesToUpload.length > maxCount) {
        this.errorMessage = this.scope.locale.TooManyFiles(maxCount);
        return;
      }
      const uploadedItems: IFilePreviewItem[] = [];
      for (const file of filesToUpload) {
        const message = this._validateFile(file, options);
        if (message) {
          this.errorMessage = message;
          continue;
        }
        const uploaded = await this._uploadFile(fileScene, file, policy?.directUpload ?? false);
        const item: IFilePreviewItem = {
          id: uploaded.id as TableIdentity,
          filename: uploaded.filename,
          contentType: uploaded.contentType,
          size: uploaded.size,
          uploadedAt: uploaded.uploadedAt,
          downloadUrl: uploaded.url,
          public: uploaded.public,
          signed: uploaded.signed,
        };
        this.uploadedPreviewMap[String(item.id)] = item;
        uploadedItems.push(item);
      }
      if (!uploadedItems.length) return;
      const nextIds = multiple
        ? [...currentIds, ...uploadedItems.map(item => item.id)]
        : [uploadedItems[uploadedItems.length - 1].id];
      this._setFieldValue(nextIds, disableNotifyChanged, multiple);
      this.errorMessage = undefined;
    } catch (err: any) {
      this.errorMessage = err?.message ?? this.scope.locale.FileUploadFailed();
    } finally {
      this.isUploading = false;
    }
  }

  private async _uploadFile(fileScene: string, file: File, directUpload: boolean) {
    if (!directUpload) return await this.scope.api.file.upload({ fileScene, file });
    const response = await this.scope.api.file.createDirectUpload({
      fileScene,
      filename: file.name,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
    });
    const uploadResponse = await fetch(response.uploadUrl, {
      method: response.method ?? 'PUT',
      headers: response.headers,
      body: file,
    });
    if (!uploadResponse.ok) throw new Error(`file direct upload failed: ${uploadResponse.status}`);
    return await this.scope.api.file.finalizeDirectUpload({ fileId: response.id });
  }

  private _getFileScene(options: IResourceFormFieldFileOptions) {
    if (!options.fileScene) throw new Error('should specify file upload scene');
    return options.fileScene;
  }

  private _removeItem(fileId: TableIdentity, disableNotifyChanged?: boolean) {
    const multiple = this._getEffectiveMultiple(this.currentOptions);
    const fileIds = this._normalizeFileIds(this.currentValue).filter(
      id => String(id) !== String(fileId),
    );
    delete this.uploadedPreviewMap[String(fileId)];
    this._setFieldValue(fileIds, disableNotifyChanged, multiple);
    this.errorMessage = undefined;
  }

  private _setFieldValue(
    fileIds: TableIdentity[],
    disableNotifyChanged: boolean | undefined,
    multiple: boolean,
  ) {
    const value = multiple ? fileIds : (fileIds[0] ?? '');
    this.currentValue = value;
    this._syncRelationField(fileIds, multiple);
    this.$$formField?.setValue(value, disableNotifyChanged);
    this.$$formField?.handleBlur();
  }

  private _syncRelationField(fileIds: TableIdentity[], multiple: boolean) {
    const relationName = this._getRelationName();
    if (!relationName) return;
    const relationItems = this._getRelationPreviewMap();
    const value = fileIds.map(
      id => this.uploadedPreviewMap[String(id)] ?? relationItems[String(id)] ?? { id },
    );
    this.$$renderContext.$$form.setFieldValue(
      relationName as never,
      (multiple ? value : value[0]) as never,
      true,
    );
  }

  private _getPreviewItems(value: unknown) {
    const fileIds = this._normalizeFileIds(value);
    const relationItems = this._getRelationPreviewMap();
    if (!fileIds.length) return Object.values(relationItems);
    return fileIds.map(
      id => this.uploadedPreviewMap[String(id)] ?? relationItems[String(id)] ?? { id },
    );
  }

  private _getRelationName() {
    return inferFileRelationName(this.$props.name, this.currentOptions.relationName);
  }

  private _getRelationPreviewMap() {
    const relationName = this._getRelationName();
    if (!relationName) return {} as Record<string, IFilePreviewItem>;
    const value = this.$$renderContext.$$form.getFieldValue(relationName as never);
    const items = Array.isArray(value) ? value : value ? [value] : [];
    const previewItems = items.filter(
      (item): item is IFilePreviewItem => !!item && typeof item === 'object' && 'id' in item,
    );
    return Object.fromEntries(previewItems.map(item => [String(item.id), item]));
  }

  private _normalizeFileIds(value: unknown): TableIdentity[] {
    if (Array.isArray(value)) {
      return value.filter(
        item => item !== undefined && item !== null && item !== '',
      ) as TableIdentity[];
    }
    return value ? [value as TableIdentity] : [];
  }

  private _getMaxCount(
    options: IResourceFormFieldFileOptions,
    multiple = this._getEffectiveMultiple(options),
  ) {
    return multiple ? Math.max(options.maxCount ?? 1, 1) : 1;
  }

  private _getUploadButtonText(itemCount: number, multiple: boolean) {
    if (itemCount === 0) return this.scope.locale.SelectFile();
    if (multiple) return this.scope.locale.AddFile();
    return this.scope.locale.ReplaceFile();
  }

  private _getAcceptAttr(
    options?: IResourceFormFieldFileOptions,
    policy = this._getCachedUploadPolicy(options),
  ) {
    if (!options) return undefined;
    if (typeof options.accept === 'string') return options.accept;
    if (options.accept?.length) return options.accept.join(',');
    const values = [
      ...(options.mimeTypes ?? policy?.mimeTypes ?? []),
      ...(options.extensions ?? policy?.extensions ?? []),
    ];
    return values.length ? values.join(',') : undefined;
  }

  private _validateFile(file: File, options: IResourceFormFieldFileOptions) {
    const tokens = this._collectAcceptTokens(options);
    if (tokens.length && !this._matchesAccept(file, tokens))
      return this.scope.locale.InvalidFileType();
    const maxSize = options.maxSize ?? this._getCachedUploadPolicy(options)?.maxSize;
    if (typeof maxSize === 'number' && file.size > maxSize)
      return this.scope.locale.FileTooLarge(formatFileSize(maxSize));
    if (typeof options.minSize === 'number' && file.size < options.minSize)
      return this.scope.locale.FileTooSmall(formatFileSize(options.minSize));
    return undefined;
  }

  private _collectAcceptTokens(options: IResourceFormFieldFileOptions) {
    const accept = options.accept
      ? Array.isArray(options.accept)
        ? options.accept
        : options.accept.split(',')
      : [];
    const policy = this._getCachedUploadPolicy(options);
    return [
      ...accept,
      ...(options.mimeTypes ?? policy?.mimeTypes ?? []),
      ...(options.extensions ?? policy?.extensions ?? []),
    ]
      .map(item => item.trim().toLowerCase())
      .filter(Boolean);
  }

  private _matchesAccept(file: File, tokens: string[]) {
    const mimeType = file.type.toLowerCase();
    const extensionIndex = file.name.lastIndexOf('.');
    const extension = extensionIndex === -1 ? '' : file.name.slice(extensionIndex).toLowerCase();
    return tokens.some(token => {
      if (token.startsWith('.')) return extension === token;
      if (token.endsWith('/*')) return mimeType.startsWith(token.slice(0, -1));
      return mimeType === token;
    });
  }

  private async _openDownloadUrl(downloadUrl: string) {
    if (!process.env.CLIENT) return;
    const passportCode = await this.$passport.ensureFreshTempAuthToken({
      path: `${this.sys.config.api.prefix ?? '/api'}/file/download`,
      staleTime: 30 * 1000,
    });
    const url = this._resolveDownloadUrl(downloadUrl, passportCode);
    if (url) globalThis.open?.(url, '_blank', 'noopener,noreferrer');
  }

  private _resolveDownloadUrl(url: string, passportCode?: string) {
    return resolveFileDownloadUrl(url, this.sys.config.api.baseURL, passportCode);
  }
}
