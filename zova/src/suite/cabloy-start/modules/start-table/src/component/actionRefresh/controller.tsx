import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPage,
  IResourceTableActionBulkPropsBase,
} from 'zova-module-a-openapi';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $iconName } from 'zova-module-a-icon';
import { ZButton } from 'zova-module-start-button';

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
    const label = this.scope.locale.Refresh() as string;
    return (
      <ZButton
        class={this.$props.class}
        icon={$iconName('::arrow-repeat')}
        variant="text"
        disabled={disabled}
        loading={queryData.isFetching}
        aria-label={label}
        title={label}
        onPerform={async () => {
          await queryData.refetch({ throwOnError: true });
        }}
      ></ZButton>
    );
  }
}
