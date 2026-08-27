import type { IIconRecord } from 'zova-module-a-icon';
import type { IImageUploaderRenderState } from 'zova-module-start-image';

import { EditorContent } from '@tiptap/vue-3';
import { VBtn, VSelect, VTooltip } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';
import { $iconName } from 'zova-module-a-icon';
import { ZImageUploader } from 'zova-module-start-image';

import { codeBlockLanguages, getCodeBlockLanguage } from '../../lib/codeBlockLanguages.js';

@Render()
export class RenderFormFieldMarkdown extends BeanRenderBase {
  private _toolbarButton(
    name: keyof IIconRecord,
    label: string,
    action: () => void,
    options: { active?: boolean; disabled?: boolean } = {},
  ) {
    return (
      <VTooltip text={label} location="bottom" v-slots={{
        activator: ({ props }) => (
          <VBtn
            {...props}
            icon={$iconName(name)}
            variant={options.active ? 'tonal' : 'text'}
            color={options.active ? 'primary' : undefined}
            size="small"
            density="compact"
            minHeight="1.75rem"
            minWidth="1.75rem"
            aria-label={label}
            aria-pressed={options.active}
            disabled={options.disabled}
            nativeOnMousedown={(event: MouseEvent) => {
              event.preventDefault();
            }}
            nativeOnClick={(event: MouseEvent) => {
              event.stopPropagation();
              action();
            }}
          ></VBtn>
        ),
      }}></VTooltip>
    );
  }

  private _renderTablePicker() {
    if (!this.tablePickerOpen) return null;
    const { rows, cols } = this.tablePickerPreview;
    const maxSize = this.tablePickerMaxSize;
    return (
      <div
        id="markdown-table-size-picker"
        ref={ref => {
          if (this.ctx.disposed) return;
          this.setTablePickerRoot?.(ref as HTMLDivElement | null);
        }}
        class={this.cTablePicker}
        role="dialog"
        aria-label={this.scope.locale.TableSizePicker()}
      >
        <div class={this.cTablePickerStatus} aria-live="polite" aria-atomic="true">
          {this.scope.locale.TableSizeStatus()}: {rows} × {cols}
        </div>
        <div
          class={this.cTablePickerGrid}
          role="grid"
          aria-label={this.scope.locale.TableSizePicker()}
          aria-rowcount={maxSize}
          aria-colcount={maxSize}
        >
          {Array.from({ length: maxSize }, (_, rowIndex) => {
            const row = rowIndex + 1;
            return (
              <div key={row} class={this.cTablePickerRow} role="row" aria-rowindex={row}>
                {Array.from({ length: maxSize }, (_, colIndex) => {
                  const col = colIndex + 1;
                  const selected = row <= rows && col <= cols;
                  const active =
                    row === this.tablePickerActive.rows && col === this.tablePickerActive.cols;
                  const label = `${row} × ${col} ${this.scope.locale.TableSizeCell()}`;
                  return (
                    <button
                      key={`${row}-${col}`}
                      type="button"
                      role="gridcell"
                      data-table-picker-cell={`${row}-${col}`}
                      aria-label={label}
                      aria-colindex={col}
                      aria-selected={selected}
                      tabindex={active ? 0 : -1}
                      class={[
                        this.cTablePickerCell,
                        selected && this.cTablePickerCellSelected,
                        active && this.cTablePickerCellActive,
                      ]}
                      onMousedown={event => {
                        event.preventDefault();
                      }}
                      onPointerenter={() => {
                        this.setTablePickerPreview(row, col);
                      }}
                      onFocus={() => {
                        this.setTablePickerPreview(row, col);
                      }}
                      onClick={event => {
                        event.stopPropagation();
                        this.selectTablePickerSize(row, col);
                      }}
                    ></button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  private _renderTablePickerTrigger() {
    const label = this.scope.locale.InsertTable();
    return (
      <div class={this.cTablePickerTrigger}>
        <VTooltip text={label} location="bottom" v-slots={{
          activator: ({ props }) => (
            <VBtn
              {...props}
              icon={$iconName(':editor:grid-on')}
              variant="text"
              size="small"
              density="compact"
              minHeight="1.75rem"
              minWidth="1.75rem"
              aria-label={label}
              aria-haspopup="grid"
              aria-expanded={this.tablePickerOpen}
              aria-controls="markdown-table-size-picker"
              disabled={!this.toolbarState.canTable}
              nativeOnMousedown={(event: MouseEvent) => {
                event.preventDefault();
              }}
              nativeOnClick={(event: MouseEvent) => {
                event.stopPropagation();
                this.toggleTablePicker();
              }}
              ref={ref => {
                if (this.ctx.disposed) return;
                const element = (ref as any)?.$el ?? ref;
                this.setTablePickerTrigger?.(element as HTMLButtonElement | null);
              }}
            ></VBtn>
          ),
        }}></VTooltip>
        {this._renderTablePicker()}
      </div>
    );
  }

  private _renderCodeBlockLanguageSelect() {
    const state = this.toolbarState;
    return (
      <VSelect
        class={this.cLanguageSelect}
        variant="outlined"
        density="compact"
        hideDetails
        aria-label={this.scope.locale.CodeBlockLanguage()}
        modelValue={getCodeBlockLanguage(state.codeBlockLanguage) ?? ''}
        items={[
          { title: this.scope.locale.PlainText(), value: '' },
          ...codeBlockLanguages.map(language => ({
            title: this.scope.locale[language](),
            value: language,
          })),
        ]}
        nativeOnMousedown={(event: MouseEvent) => {
          event.stopPropagation();
        }}
        nativeOnClick={(event: MouseEvent) => {
          event.stopPropagation();
        }}
        onUpdate:focused={focused => {
          this.setCodeBlockLanguageSelectFocused(focused);
        }}
        onUpdate:menu={menuOpen => {
          this.setCodeBlockLanguageSelectMenuOpen(menuOpen);
        }}
        onUpdate:modelValue={value => {
          this.setCodeBlockLanguage((value as string) || undefined);
        }}
      ></VSelect>
    );
  }

  private _renderBlockStyleSelect() {
    const state = this.toolbarState;
    return (
      <VSelect
        class={this.cBlockStyleSelect}
        variant="outlined"
        density="compact"
        hideDetails
        aria-label={this.scope.locale.BlockStyle()}
        modelValue={state.headingLevel ? `heading-${state.headingLevel}` : 'paragraph'}
        items={[
          { title: this.scope.locale.Paragraph(), value: 'paragraph' },
          { title: this.scope.locale.Heading1(), value: 'heading-1' },
          { title: this.scope.locale.Heading2(), value: 'heading-2' },
          { title: this.scope.locale.Heading3(), value: 'heading-3' },
          { title: this.scope.locale.Heading4(), value: 'heading-4' },
          { title: this.scope.locale.Heading5(), value: 'heading-5' },
          { title: this.scope.locale.Heading6(), value: 'heading-6' },
        ]}
        nativeOnMousedown={(event: MouseEvent) => {
          event.stopPropagation();
        }}
        onUpdate:modelValue={value => {
          const blockStyle = value as string;
          if (blockStyle === 'paragraph') {
            this.setParagraph();
          } else if (blockStyle.startsWith('heading-')) {
            this.setHeading(Number(blockStyle.slice('heading-'.length)) as 1 | 2 | 3 | 4 | 5 | 6);
          }
        }}
      ></VSelect>
    );
  }

  private _renderToolbar(imageUploader?: IImageUploaderRenderState) {
    const state = this.toolbarState;
    return (
      <div class={this.cToolbar} role="toolbar" aria-label={this.scope.locale.MarkdownToolbar()}>
        {this._toolbarButton('::undo', this.scope.locale.Undo(), () => this.undo(), {
          disabled: !state.canUndo,
        })}
        {this._toolbarButton(':editor:redo', this.scope.locale.Redo(), () => this.redo(), {
          disabled: !state.canRedo,
        })}
        {this._renderBlockStyleSelect()}
        {this._toolbarButton(
          ':editor:format-bold',
          this.scope.locale.Bold(),
          () => this.toggleBold(),
          { active: state.bold, disabled: !state.canBold },
        )}
        {this._toolbarButton(
          ':editor:format-italic',
          this.scope.locale.Italic(),
          () => this.toggleItalic(),
          { active: state.italic, disabled: !state.canItalic },
        )}
        {this._toolbarButton(
          ':editor:format-strikethrough',
          this.scope.locale.Strikethrough(),
          () => this.toggleStrike(),
          { active: state.strike, disabled: !state.canStrike },
        )}
        {this._toolbarButton(
          ':editor:code',
          this.scope.locale.InlineCode(),
          () => this.toggleCode(),
          { active: state.code, disabled: !state.canCode },
        )}
        {this._toolbarButton(
          ':editor:insert-link-outline',
          this.scope.locale.Link(),
          () => {
            void this.editLink();
          },
          { active: state.link, disabled: !state.canLink },
        )}
        {this._toolbarButton(
          ':editor:bookmark',
          this.scope.locale.Highlight(),
          () => this.toggleHighlight(),
          { active: state.highlight, disabled: !state.canHighlight },
        )}
        {this._toolbarButton(
          ':editor:format-list-bulleted',
          this.scope.locale.BulletList(),
          () => this.toggleBulletList(),
          { active: state.bulletList, disabled: !state.canBulletList },
        )}
        {this._toolbarButton(
          ':editor:format-list-numbered',
          this.scope.locale.OrderedList(),
          () => this.toggleOrderedList(),
          { active: state.orderedList, disabled: !state.canOrderedList },
        )}
        {this._toolbarButton(
          ':editor:task-alt',
          this.scope.locale.TaskList(),
          () => this.toggleTaskList(),
          { active: state.taskList, disabled: !state.canTaskList },
        )}
        {this._toolbarButton(
          ':editor:format-quote',
          this.scope.locale.Blockquote(),
          () => this.toggleBlockquote(),
          { active: state.blockquote, disabled: !state.canBlockquote },
        )}
        {this._toolbarButton(
          ':editor:code-block',
          this.scope.locale.CodeBlock(),
          () => this.toggleCodeBlock(),
          { active: state.codeBlock, disabled: !state.canCodeBlock },
        )}
        {this._toolbarButton(
          ':editor:horizontal-rule',
          this.scope.locale.HorizontalRule(),
          () => this.setHorizontalRule(),
          { disabled: !state.canHorizontalRule },
        )}
        {imageUploader &&
          this._toolbarButton(
            ':editor:image-outline',
            this.scope.locale.InsertImage(),
            () => {
              this.beginImageUpload(imageUploader.chooseFiles);
            },
            {
              disabled: imageUploader.isUploading || imageUploader.policy.pending,
            },
          )}
        {this._renderTablePickerTrigger()}
      </div>
    );
  }

  private _renderCodeBlockToolbar() {
    const position = this.codeBlockToolbarPosition;
    return (
      <div
        class={this.cOverlay}
        ref={ref => {
          if (this.ctx.disposed) return;
          this.setCodeBlockToolbarHost?.(ref as HTMLDivElement | null);
        }}
      >
        {position && (
          <div
            class={this.cFloatingToolbar}
            onPointerenter={() => {
              this.setCodeBlockToolbarHovered(true);
            }}
            onPointerleave={() => {
              this.setCodeBlockToolbarHovered(false);
            }}
            style={{
              left: `${position.left}px`,
              top: `${position.top}px`,
              transform: 'translate(-50%, -100%)',
            }}
            role="toolbar"
            aria-label={this.scope.locale.CodeBlockLanguage()}
            onFocus={() => {
              this.setCodeBlockToolbarFocused(true);
            }}
            onBlur={event => {
              const nextTarget = event.relatedTarget;
              const currentTarget = event.currentTarget as HTMLElement;
              if (!(nextTarget instanceof Node) || !currentTarget.contains(nextTarget)) {
                this.setCodeBlockToolbarFocused(false);
              }
            }}
          >
            {this._renderCodeBlockLanguageSelect()}
          </div>
        )}
      </div>
    );
  }

  private _renderTableToolbar() {
    const position = this.tableToolbarPosition;
    const state = this.toolbarState;
    return (
      <div
        class={this.cOverlay}
        ref={ref => {
          if (this.ctx.disposed) return;
          this.setTableToolbarHost?.(ref as HTMLDivElement | null);
        }}
      >
        {position && (
          <div
            class={this.cFloatingToolbar}
            style={{
              left: `${position.left}px`,
              top: `${position.top}px`,
              transform: 'translate(-50%, -100%)',
            }}
            role="toolbar"
            aria-label={this.scope.locale.TableToolbar()}
            onFocus={() => {
              this.setTableToolbarFocused(true);
            }}
            onBlur={event => {
              const nextTarget = event.relatedTarget;
              const currentTarget = event.currentTarget as HTMLElement;
              if (!(nextTarget instanceof Node) || !currentTarget.contains(nextTarget)) {
                this.setTableToolbarFocused(false);
              }
            }}
          >
            {this._toolbarButton(
              ':editor:add-box',
              this.scope.locale.AddRowBefore(),
              () => this.addTableRowBefore(),
              { disabled: !state.canAddTableRowBefore },
            )}
            {this._toolbarButton(
              ':editor:add-box-outline',
              this.scope.locale.AddRowAfter(),
              () => this.addTableRowAfter(),
              { disabled: !state.canAddTableRowAfter },
            )}
            {this._toolbarButton(
              ':editor:horizontal-rule',
              this.scope.locale.DeleteRow(),
              () => this.deleteTableRow(),
              { disabled: !state.canDeleteTableRow },
            )}
            {this._toolbarButton(
              ':editor:add-box',
              this.scope.locale.AddColumnBefore(),
              () => this.addTableColumnBefore(),
              { disabled: !state.canAddTableColumnBefore },
            )}
            {this._toolbarButton(
              ':editor:add-box-outline',
              this.scope.locale.AddColumnAfter(),
              () => this.addTableColumnAfter(),
              { disabled: !state.canAddTableColumnAfter },
            )}
            {this._toolbarButton(
              '::delete',
              this.scope.locale.DeleteColumn(),
              () => this.deleteTableColumn(),
              {
                disabled: !state.canDeleteTableColumn,
              },
            )}
            {this._toolbarButton(
              '::delete-forever',
              this.scope.locale.DeleteTable(),
              () => this.deleteTable(),
              {
                disabled: !state.canDeleteTable,
              },
            )}
          </div>
        )}
      </div>
    );
  }

  public render() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          this.bindFormField(propsBucket, $$formField);
          return (
            <div class={props.class}>
              <div
                class={[
                  this.cContainer,
                  !$$formField.field.state.meta.isValid && this.cContainerError,
                ]}
                onClick={() => {
                  if (!this.readonly) {
                    this.editor?.commands.focus();
                  }
                }}
              >
                <ClientOnly
                  v-slots={{
                    default: () => (
                      <>
                        {!this.readonly && (
                          <ZImageUploader
                            imageScene={this.imageScene}
                            multiple={false}
                            onUploaded={result => {
                              this.handleImageUploaded(result);
                            }}
                            onError={error => {
                              this.handleImageUploadError(error);
                            }}
                            slotDefault={state => this._renderToolbar(state)}
                          ></ZImageUploader>
                        )}
                        {!this.readonly && this.editor && this._renderTableToolbar()}
                        {!this.readonly && this.editor && this._renderCodeBlockToolbar()}
                        {this.imageUploadError && (
                          <p class={this.cUploadError} role="alert" aria-live="polite">
                            {this.imageUploadError}
                          </p>
                        )}
                        <EditorContent editor={this.editor} class={this.cMarkdown} />
                      </>
                    ),
                    placeholder: () => <div class={this.cPlaceholder} aria-hidden="true"></div>,
                  }}
                ></ClientOnly>
              </div>
            </div>
          );
        }}
      ></ZFormField>
    );
  }
}
