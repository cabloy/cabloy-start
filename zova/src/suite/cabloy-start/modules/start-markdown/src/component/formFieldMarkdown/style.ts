import { BeanStyleBase } from 'zova';
import { Style } from 'zova-module-a-bean';

import { richTextContentStyle } from '../../lib/richTextContentStyle.js';

@Style()
export class StyleFormFieldMarkdown extends BeanStyleBase {
  cMarkdown: string;
  cContainer: string;
  cContainerError: string;
  cToolbar: string;
  cBlockStyleSelect: string;
  cLanguageSelect: string;
  cTablePickerTrigger: string;
  cTablePicker: string;
  cTablePickerStatus: string;
  cTablePickerGrid: string;
  cTablePickerRow: string;
  cTablePickerCell: string;
  cTablePickerCellSelected: string;
  cTablePickerCellActive: string;
  cOverlay: string;
  cFloatingToolbar: string;
  cUploadError: string;
  cPlaceholder: string;

  protected async __init__() {
    const markdownStyle = richTextContentStyle();
    this.cMarkdown = this.$style({
      ...markdownStyle,
      $nest: {
        ...markdownStyle.$nest,
        '& > .ProseMirror': {
          minHeight: '32rem',
          outline: 'none',
          padding: '1rem',
        },
      },
    });
    this.cContainer = this.$style({
      backgroundColor: 'rgb(var(--v-theme-surface))',
      border: '1px solid rgb(var(--v-theme-outline))',
      borderRadius: '4px',
      position: 'relative',
    });
    this.cContainerError = this.$style({
      borderColor: 'rgb(var(--v-theme-error))',
    });
    this.cToolbar = this.$style({
      alignItems: 'center',
      borderBottom: '1px solid rgb(var(--v-theme-outline))',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.25rem',
      padding: '0.5rem',
    });
    this.cBlockStyleSelect = this.$style({
      flex: '0 1 10rem',
      minWidth: '8rem',
    });
    this.cLanguageSelect = this.$style({
      flex: '0 1 11rem',
      minWidth: '9rem',
    });
    this.cTablePickerTrigger = this.$style({
      position: 'relative',
    });
    this.cTablePicker = this.$style({
      backgroundColor: 'rgb(var(--v-theme-surface))',
      border: '1px solid rgb(var(--v-theme-outline))',
      borderRadius: 'var(--v-border-radius-sm)',
      boxShadow: '0 4px 12px rgb(var(--v-theme-shadow) / 0.2)',
      padding: '0.75rem',
      position: 'absolute',
      right: 0,
      top: '100%',
      zIndex: 20,
    });
    this.cTablePickerStatus = this.$style({
      color: 'rgb(var(--v-theme-on-surface-variant))',
      fontSize: '0.875rem',
      marginBottom: '0.5rem',
      textAlign: 'center',
      whiteSpace: 'nowrap',
    });
    this.cTablePickerGrid = this.$style({
      display: 'grid',
      gap: '0.25rem',
    });
    this.cTablePickerRow = this.$style({
      display: 'grid',
      gap: '0.25rem',
      gridTemplateColumns: 'repeat(8, minmax(1.5rem, 1fr))',
    });
    this.cTablePickerCell = this.$style({
      borderColor: 'rgb(var(--v-theme-outline))',
      height: '1.5rem',
      minWidth: '1.5rem',
      padding: 0,
      width: '1.5rem',
    });
    this.cTablePickerCellSelected = this.$style({
      backgroundColor: 'rgb(var(--v-theme-primary))',
      borderColor: 'rgb(var(--v-theme-primary))',
      color: 'rgb(var(--v-theme-on-primary))',
    });
    this.cTablePickerCellActive = this.$style({
      outline: '2px solid rgb(var(--v-theme-primary))',
      outlineOffset: '2px',
    });
    this.cOverlay = this.$style({
      inset: 0,
      pointerEvents: 'none',
      position: 'absolute',
      zIndex: 10,
    });
    this.cFloatingToolbar = this.$style({
      alignItems: 'center',
      backgroundColor: 'rgb(var(--v-theme-surface))',
      border: '1px solid rgb(var(--v-theme-outline))',
      borderRadius: 'var(--v-border-radius-sm)',
      boxShadow: '0 2px 8px rgb(var(--v-theme-shadow) / 0.2)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.25rem',
      padding: '0.25rem',
      pointerEvents: 'auto',
      position: 'absolute',
    });
    this.cUploadError = this.$style({
      color: 'rgb(var(--v-theme-error))',
      fontSize: '0.875rem',
      margin: '0.75rem 1rem 0',
    });
    this.cPlaceholder = this.$style({
      minHeight: '32rem',
      padding: '1rem',
    });
  }
}
