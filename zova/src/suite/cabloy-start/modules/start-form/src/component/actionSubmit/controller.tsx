import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPageEntry,
  IResourceFormActionRowOptionsBase,
} from 'zova-module-a-openapi';

import { isNil } from '@cabloy/utils';
import { VBtn } from 'vuetify/components';
import { BeanControllerBase, cast, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { BeanControllerFormBase } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormActionRowRecord {
    'start-form:actionSubmit'?: ControllerActionSubmitProps;
  }
}

export interface ControllerActionSubmitProps extends IResourceFormActionRowOptionsBase {
  color?: string;
}

@Controller()
export class ControllerActionSubmit extends BeanControllerBase {
  static $propsDefault = { color: 'primary' };
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
        type="submit"
        loading={isSubmitting}
        nativeOnClick={(e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          this.onClick(e);
        }}
      >
        {this.scope.locale.Submit()}
      </VBtn>
    );
  }

  private async onClick(e: Event) {
    const { $host, $$pageEntry } = this.$$renderContext;
    const formRef: BeanControllerFormBase = $$pageEntry.formRef;
    const res = await formRef.submit();
    if (!res) return;
    const pointerType = cast<PointerEvent>(e).pointerType;
    if (pointerType) {
      // back
      this.$router.back();
      return;
    }
    // edit
    if (!isNil($$pageEntry.entryId)) return;
    // create: replace by edit page
    await $host.$performCommand(
      'start-commands:edit',
      {
        replace: true,
        resource: $$pageEntry.resource,
        id: $$pageEntry.entryIdCreated,
      },
      this.$$renderContext,
    );
  }
}
