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
    'start-table:actionRefresh'?: ControllerActionRefreshProps;
  }
}

export interface ControllerActionRefreshProps extends IResourceTableActionBulkPropsBase {}

@Controller()
export class ControllerActionRefresh extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  protected render() {
    const disabled = this.$props.disabled === true || this.$props.dynamicDisabled === true;
    const queryData = this.$$renderContext.$$page.queryData;
    return (
      <VBtn
        class={this.$props.class}
        disabled={disabled}
        loading={queryData.isFetching}
        nativeOnClick={async () => {
          if (disabled) return;
          await queryData.refetch();
        }}
      >
        {this.scope.locale.Refresh()}
      </VBtn>
    );
  }
}
