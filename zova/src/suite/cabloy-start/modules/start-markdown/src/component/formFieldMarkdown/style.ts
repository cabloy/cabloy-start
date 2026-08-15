import { BeanStyleBase } from 'zova';
import { Style } from 'zova-module-a-bean';

import { richTextContentStyle } from '../../lib/richTextContentStyle.js';

@Style()
export class StyleFormFieldMarkdown extends BeanStyleBase {
  cMarkdown: string;
  cContainer: string;
  cContainerError: string;

  protected async __init__() {
    this.cMarkdown = this.$style(richTextContentStyle());
    this.cContainer = this.$style({
      backgroundColor: 'rgb(var(--v-theme-surface))',
      border: '1px solid rgb(var(--v-theme-outline))',
      borderRadius: '4px',
    });
    this.cContainerError = this.$style({
      borderColor: 'rgb(var(--v-theme-error))',
    });
  }
}
