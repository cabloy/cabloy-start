import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPage,
  IResourceTableActionBulkPropsBase,
  ISchemaObjectExtensionField,
} from 'zova-module-a-openapi';
import type { ITableLayout } from 'zova-module-a-table';

import { VBtn, VCheckbox, VProgressCircular, VTextField } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $iconName } from 'zova-module-a-icon';
import { reconcileTableLayout } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionBulkRecord {
    'start-table:actionColumnConfig'?: ControllerActionColumnConfigProps;
  }
}

export interface ControllerActionColumnConfigProps extends IResourceTableActionBulkPropsBase {}

@Controller()
export class ControllerActionColumnConfig extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  private _saving = false;
  private _error: string | undefined;
  private _reset = false;
  private _draft: ITableLayout | undefined;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  get $$page() {
    return this.$$renderContext.$$page;
  }

  get seed() {
    return this.$$page.columnConfigSeed;
  }

  protected render() {
    const disabled = this.$props.disabled === true || this.$props.dynamicDisabled === true;
    const label = this.scope.locale.ColumnConfiguration() as string;
    return (
      <VBtn
        class={this.$props.class}
        icon={$iconName('::settings')}
        variant="text"
        disabled={disabled}
        aria-label={label}
        title={label}
        nativeOnClick={() => this._open()}
      ></VBtn>
    );
  }

  private _open() {
    const seed = this.seed;
    if (!seed) return;
    this._error = undefined;
    this._reset = false;
    this._draft = this._cloneLayout(seed.layout);
    const dialog = this.$appModal.dialog(
      {
        title: this.scope.locale.ColumnConfiguration(),
        slotDefault: () => this._renderDialog(),
        slotActions: modal => (
          <>
            {this._error && (
              <span class="me-auto text-error" role="alert">
                {this._error}
              </span>
            )}
            <VBtn variant="text" disabled={this._saving} nativeOnClick={() => modal.close()}>
              {this.scope.locale.Cancel()}
            </VBtn>
            <VBtn color="primary" disabled={this._saving} nativeOnClick={() => this._save(dialog)}>
              {this._saving && <VProgressCircular indeterminate size={20}></VProgressCircular>}
              {this.scope.locale.Save()}
            </VBtn>
          </>
        ),
      },
      { closeOnBackdrop: false, closeOnEscape: false, maxWidth: 560, showCloseButton: true },
    );
  }

  private _renderDialog() {
    const draft = this._draft;
    const properties = this.seed?.properties ?? [];
    return (
      <div class="d-flex flex-column ga-2" style="max-height: 60vh; overflow-y: auto">
        <div class="text-body-2 text-medium-emphasis">{this.scope.locale.Columns()}</div>
        {draft?.columns.map((column, index) => {
          const property = properties.find(item => item.key === column.key);
          const previous = draft.columns[index - 1];
          const next = draft.columns[index + 1];
          const canMoveUp =
            !!previous && this._sameFixedRegion(properties, column.key, previous.key);
          const canMoveDown = !!next && this._sameFixedRegion(properties, column.key, next.key);
          const title = property?.title ?? column.key;
          return (
            <div
              key={column.key}
              class="d-flex align-center ga-2 border rounded pa-2"
              role="group"
              aria-label={title}
            >
              <VCheckbox
                density="compact"
                hideDetails
                modelValue={column.visible}
                disabled={this._saving}
                aria-label={`${this.scope.locale.Visible()} ${title}`}
                onUpdate:modelValue={value => {
                  this._reset = false;
                  column.visible = value === true;
                }}
              ></VCheckbox>
              <span class="flex-grow-1 text-truncate">{title}</span>
              <VTextField
                class="flex-grow-0"
                style="width: 96px"
                density="compact"
                hideDetails
                type="number"
                modelValue={typeof column.width === 'number' ? String(column.width) : ''}
                disabled={this._saving || column.width === 'auto'}
                aria-label={`${this.scope.locale.Width()} ${title}`}
                onUpdate:modelValue={value => {
                  this._reset = false;
                  const number = Number(value);
                  column.width =
                    Number.isInteger(number) && number >= 1 && number <= 2000 ? number : 'auto';
                }}
              ></VTextField>
              <VCheckbox
                density="compact"
                hideDetails
                label={this.scope.locale.Auto()}
                modelValue={column.width === 'auto'}
                disabled={this._saving}
                aria-label={`${this.scope.locale.Auto()} ${title}`}
                onUpdate:modelValue={value => {
                  this._reset = false;
                  column.width =
                    value === true ? 'auto' : this._defaultNumericWidth(properties, column.key);
                }}
              ></VCheckbox>
              <VBtn
                variant="text"
                size="small"
                disabled={!canMoveUp || this._saving}
                aria-label={this.scope.locale.MoveUp()}
                nativeOnClick={() => this._moveColumn(index, -1)}
              >
                ↑
              </VBtn>
              <VBtn
                variant="text"
                size="small"
                disabled={!canMoveDown || this._saving}
                aria-label={this.scope.locale.MoveDown()}
                nativeOnClick={() => this._moveColumn(index, 1)}
              >
                ↓
              </VBtn>
            </div>
          );
        })}
        <div>
          <VBtn
            variant="outlined"
            size="small"
            disabled={this._saving}
            nativeOnClick={() => this._resetDraft()}
          >
            {this.scope.locale.Reset()}
          </VBtn>
        </div>
      </div>
    );
  }

  private _cloneLayout(layout: ITableLayout): ITableLayout {
    return {
      version: 1,
      ...(layout.schemaFingerprint ? { schemaFingerprint: layout.schemaFingerprint } : {}),
      columns: layout.columns.map(column => ({ ...column })),
    };
  }

  private _defaultNumericWidth(
    properties: readonly ISchemaObjectExtensionField[],
    key: string,
  ): number {
    const width = properties.find(item => item.key === key)?.rest?.width;
    return typeof width === 'number' && Number.isInteger(width) && width >= 1 && width <= 2000
      ? width
      : 160;
  }

  private _sameFixedRegion(
    properties: readonly ISchemaObjectExtensionField[],
    leftKey: string,
    rightKey: string,
  ) {
    const left = properties.find(item => item.key === leftKey)?.rest?.fixed;
    const right = properties.find(item => item.key === rightKey)?.rest?.fixed;
    return (left ?? 'center') === (right ?? 'center');
  }

  private _moveColumn(index: number, offset: -1 | 1) {
    const columns = this._draft?.columns;
    const properties = this.seed?.properties;
    if (!columns || !properties) return;
    const target = index + offset;
    if (
      target < 0 ||
      target >= columns.length ||
      !this._sameFixedRegion(properties, columns[index].key, columns[target].key)
    ) {
      return;
    }
    this._reset = false;
    [columns[index], columns[target]] = [columns[target], columns[index]];
  }

  private _resetDraft() {
    const seed = this.seed;
    if (!seed || this._saving) return;
    this._reset = true;
    this._draft = reconcileTableLayout(seed.properties);
  }

  private async _save(dialog: { close: () => void }) {
    const seed = this.seed;
    const draft = this._draft;
    if (!seed || !draft || this._saving) return;
    this._saving = true;
    this._error = undefined;
    try {
      if (this._reset) {
        await this.$$page.resetColumnConfig();
      } else {
        await this.$$page.saveColumnConfig(reconcileTableLayout(seed.properties, draft));
      }
      this._reset = false;
      dialog.close();
    } catch (error) {
      this._error = error instanceof Error ? error.message : String(error);
    } finally {
      this._saving = false;
    }
  }
}
