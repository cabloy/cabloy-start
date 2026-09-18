import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPage,
  IResourceTableActionBulkPropsBase,
} from 'zova-module-a-openapi';

import { useId } from 'vue';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-start-button';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionBulkRecord {
    'start-table:actionDeleteBulk'?: ControllerActionDeleteBulkProps;
  }
}

export interface ControllerActionDeleteBulkProps extends IResourceTableActionBulkPropsBase {
  color?: string;
}

@Controller()
export class ControllerActionDeleteBulk extends BeanControllerBase {
  static $propsDefault = { color: 'error' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  private disabledReasonDomId: string;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  protected async __init__() {
    this.disabledReasonDomId = `start-table-delete-bulk-${useId()}`;
  }

  protected render() {
    const { dynamicDisabledReason, dynamicSelection } = this.$props;
    const disabled = this.$props.disabled === true || this.$props.dynamicDisabled === true;
    const label = this.scope.locale.DeleteBulk() as string;
    return (
      <ZButton
        class={this.$props.class}
        color={this.$props.color}
        disabled={disabled}
        aria-label={label}
        aria-describedby={dynamicDisabledReason ? this.disabledReasonDomId : undefined}
        onPerform={async () => {
          if (disabled) return;
          const confirmed = await this.$performCommand(
            'start-commands:confirm',
            {
              text: this.scope.locale.DeleteBulkConfirm(dynamicSelection?.count ?? 0),
            },
            this.$$renderContext,
          );
          if (!confirmed) return;
          await this.$performCommand(
            'start-commands:deleteBulk',
            this.$props,
            this.$$renderContext,
          );
        }}
      >
        {label}
        {dynamicDisabledReason && (
          <span id={this.disabledReasonDomId} class="d-sr-only">
            {dynamicDisabledReason}
          </span>
        )}
      </ZButton>
    );
  }
}
