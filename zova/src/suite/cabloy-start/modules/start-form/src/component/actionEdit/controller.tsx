import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPageEntry,
  IResourceFormActionRowOptionsBase,
} from 'zova-module-a-openapi';

import { VBtn } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormActionRowRecord {
    'start-form:actionEdit'?: ControllerActionEditProps;
  }
}

export interface ControllerActionEditProps extends IResourceFormActionRowOptionsBase {
  color?: string;
}

@Controller()
export class ControllerActionEdit extends BeanControllerBase {
  static $propsDefault = { color: 'primary' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPageEntry;

  protected async __init__() {}

  protected render() {
    const { $$pageEntry } = this.$$renderContext;
    const resource = this.$props.resource ?? $$pageEntry.resource;
    const id = this.$props.id ?? $$pageEntry.entryId;
    if (!resource || id == null) return;
    const to = this.$router.getPagePath('/rest/resource/:resource/:id/:formScene?', {
      params: { resource, id: id.toString(), formScene: 'edit' },
    });
    return (
      <VBtn class={this.$props.class} color={this.$props.color} prependIcon="::draft" to={to}>
        {this.scope.locale.Edit()}
      </VBtn>
    );
  }
}
