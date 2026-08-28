import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPageEntry,
  IResourceFormActionRowOptionsBase,
} from 'zova-module-a-openapi';

import { VBtn } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

export interface ControllerActionEditDepartmentProps extends IResourceFormActionRowOptionsBase {}

declare module 'zova-module-a-openapi' {
  export interface IResourceFormActionRowRecord {
    'admin-department:actionEditDepartment'?: ControllerActionEditDepartmentProps;
  }
}

@Controller()
export class ControllerActionEditDepartment extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPageEntry;

  get editUrl() {
    const { $$pageEntry } = this.$$renderContext;
    const resource = $$pageEntry.jsxCelScope.resource;
    const id = $$pageEntry.entryId;
    if (resource === undefined || id === undefined) {
      throw new Error('should provide Department resource and id in page entry');
    }
    return this.$router.getPagePath('/rest/resource/:resource/:id/:formScene?', {
      params: { resource, id: id.toString(), formScene: 'edit' },
    });
  }

  protected render() {
    const locale = this.scope.locale;
    const props = this.$props as { class?: string };
    return (
      <VBtn class={props.class} color="primary" to={this.editUrl}>
        {locale.EditDepartment()}
      </VBtn>
    );
  }
}
