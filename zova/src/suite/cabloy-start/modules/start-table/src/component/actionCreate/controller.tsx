import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPage,
  IResourceTableActionBulkPropsBase,
} from 'zova-module-a-openapi';

import { VBtn } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionBulkRecord {
    'start-table:actionCreate'?: ControllerActionCreateProps;
  }
}

export interface ControllerActionCreateProps extends IResourceTableActionBulkPropsBase {
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
        disabled={this.$props.disabled === true || this.$props.dynamicDisabled === true}
        nativeOnClick={async () => {
          if (this.$props.disabled === true || this.$props.dynamicDisabled === true) return;
          await this.$performCommand('start-commands:create', this.$props, this.$$renderContext);
        }}
      >
        {this.scope.locale.Create()}
      </VBtn>
    );
  }
}
