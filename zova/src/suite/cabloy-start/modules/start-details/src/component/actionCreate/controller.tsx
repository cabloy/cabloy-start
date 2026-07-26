import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextDetails,
  IResourceDetailsActionBulkOptionsBase,
} from 'zova-module-a-openapi';
import type { AppModalItem, IModalDialogOptions } from 'zova-module-start-app';

import { VBtn } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { TypeFormOnSubmitData } from 'zova-module-a-form';
import { IIconRecord } from 'zova-module-a-icon';

import { ServiceDetail } from '../../service/detail.jsx';
import { IDialogFormOptions } from '../../types/dialogForm.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionBulkRecord {
    'start-details:actionCreate'?: ControllerActionCreateProps;
  }
}

export interface ControllerActionCreateProps extends IResourceDetailsActionBulkOptionsBase {
  color?: string;
  dialogOptions?: IModalDialogOptions & { icon?: keyof IIconRecord; title?: string };
}

@Controller()
export class ControllerActionCreate extends BeanControllerBase {
  static $propsDefault = { color: 'primary' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextDetails;

  protected render() {
    return (
      <VBtn
        class={this.$props.class}
        color={this.$props.color}
        nativeOnClick={async () => {
          const { $$details } = this.$$renderContext;
          const detailService = await this.bean._newBean(ServiceDetail, true, {
            locale: this.scope.locale,
            schema: $$details.schemaForm,
            data: {},
            formScene: 'create',
            schemaScene: 'form-create',
            icon: this.$props.dialogOptions?.icon,
            title: this.$props.dialogOptions?.title ?? this.scope.locale.AddDetail(),
            dialogOptions: this.$props.dialogOptions,
            onSubmitData: (
              data: TypeFormOnSubmitData<Record<string, any>>,
              dialog: AppModalItem,
            ) => {
              const detailItem = detailService.buildSubmittedDetailItem(data);
              $$details.data = [...$$details.data, detailItem];
              dialog.close();
            },
          } satisfies IDialogFormOptions);
          detailService.openDialogForm();
        }}
      >
        {this.scope.locale.AddDetail()}
      </VBtn>
    );
  }
}
