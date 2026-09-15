import type { IComponentOptions } from 'zova';
import type { IJsxRenderContextPage, IResourceBlockOptionsBase } from 'zova-module-a-openapi';
import type { IResourcePickerPageContext } from 'zova-module-rest-resource';

import { VBtn, VBtnGroup } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { resourcePickerPageContextKey } from 'zova-module-rest-resource';
import { resolvePickerSelectionMax } from 'zova-module-start-page';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'start-resource:blockResourcePickerActions'?: ControllerBlockResourcePickerActionsProps;
  }
}

export interface ControllerBlockResourcePickerActionsProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockResourcePickerActions extends BeanControllerBase {
  static $propsDefault = { class: 'd-flex align-center justify-space-between ga-3' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  @Use({ name: resourcePickerPageContextKey, injectionScope: 'host' })
  $$pickerContext: IResourcePickerPageContext;

  get pickerOptions() {
    return this.$$pickerContext.options;
  }

  get selectionMax() {
    return resolvePickerSelectionMax(
      this.pickerOptions.selectionMode,
      this.pickerOptions.selectionMax,
    );
  }

  get selection() {
    return this.$$renderContext.$$page.selection.ids;
  }

  get canConfirm() {
    const count = this.selection.length;
    return (
      count > 0 &&
      count <= this.selectionMax &&
      (this.pickerOptions.selectionMode !== 'single' || count === 1)
    );
  }

  confirm() {
    if (!this.canConfirm) return;
    this.$$pickerContext.dialog.resolve(this.$$renderContext.$$page.selection);
  }

  cancel() {
    this.$$pickerContext.dialog.cancel();
  }

  protected render() {
    const count = this.selection.length;
    return (
      <div class={this.$props.class}>
        <span role="status" aria-live="polite">
          {this.pickerOptions.selectionMode === 'multiple'
            ? this.scope.locale.SelectedItemsWithMax(count, this.selectionMax)
            : count === 1
              ? this.scope.locale.SelectedItems_1()
              : this.scope.locale.SelectedItems(count)}
        </span>
        <VBtnGroup variant="outlined" divided>
          <VBtn nativeOnClick={() => this.cancel()}>{this.scope.locale.Cancel()}</VBtn>
          <VBtn color="primary" disabled={!this.canConfirm} nativeOnClick={() => this.confirm()}>
            {this.scope.locale.Select()}
          </VBtn>
        </VBtnGroup>
      </div>
    );
  }
}
