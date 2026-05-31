import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPageEntry,
  IResourceFormActionRowOptionsBase,
} from 'zova-module-a-openapi';

import { VBtn } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { BeanControllerFormBase } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormActionRowRecord {
    'start-form:actionBack'?: ControllerActionBackProps;
  }
}

export interface ControllerActionBackProps extends IResourceFormActionRowOptionsBase {
  color?: string;
}

@Controller()
export class ControllerActionBack extends BeanControllerBase {
  static $propsDefault = { color: 'secondary' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPageEntry;

  protected async __init__() {}

  protected render() {
    const { $$pageEntry } = this.$$renderContext;
    const formRef: BeanControllerFormBase = $$pageEntry.formRef;
    const isSubmitting = formRef?.formState.isSubmitting;
    return (
      <VBtn
        class={this.$props.class}
        color={this.$props.color}
        disabled={isSubmitting}
        nativeOnClick={() => {
          this.$router.back();
        }}
      >
        {this.scope.locale.Back()}
      </VBtn>
    );
  }
}
