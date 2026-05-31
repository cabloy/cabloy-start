import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPage,
  IResourceTableActionBulkOptionsBase,
} from 'zova-module-a-openapi';

import { VBtn } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionBulkRecord {
    'start-table:actionCreate'?: ControllerActionCreateProps;
  }
}

export interface ControllerActionCreateProps extends IResourceTableActionBulkOptionsBase {
  color?: string;
}

@Controller()
export class ControllerActionCreate extends BeanControllerBase {
  static $propsDefault = { color: 'primary' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  protected async __init__() {}

  protected render() {
    return (
      <VBtn
        class={this.$props.class}
        color={this.$props.color}
        nativeOnClick={async () => {
          await this.$performCommand('start-commands:create', this.$props, this.$$renderContext);
        }}
      >
        {this.scope.locale.Create()}
      </VBtn>
    );
  }
}
