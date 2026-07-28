import type { IComponentOptions } from 'zova';
import type { IJsxRenderContextForm } from 'zova-module-a-form';
import type { IResourceBlockOptionsBase } from 'zova-module-a-openapi';

import { VBtn, VBtnGroup } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'start-page:blockFilterActions'?: ControllerBlockFilterActionsProps;
  }
}

export interface ControllerBlockFilterActionsProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockFilterActions extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextForm;

  protected async __init__() {}

  protected render() {
    const { $$filter } = this.$$renderContext.$celScope;
    return (
      <VBtnGroup class={this.$props.class} variant="outlined" divided>
        <VBtn
          color="primary"
          nativeOnClick={() => {
            $$filter?.submitFilter();
          }}
        >
          {this.scope.locale.Search()}
        </VBtn>
        <VBtn
          nativeOnClick={() => {
            $$filter?.resetFilter();
          }}
        >
          {this.scope.locale.Reset()}
        </VBtn>
      </VBtnGroup>
    );
  }
}
