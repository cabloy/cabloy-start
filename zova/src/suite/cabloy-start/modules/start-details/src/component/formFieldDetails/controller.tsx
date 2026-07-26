import type { IComponentOptions } from 'zova';
import type {
  ControllerFormField,
  IFormFieldComponentOptions,
  IFormFieldRenderContext,
} from 'zova-module-a-form';
import type {
  IResourceFormFieldOptionsBase,
  ISchemaObjectExtensionField,
  TypeFormScene,
  TypeOpenapiPermissions,
} from 'zova-module-a-openapi';

import { VNode } from 'vue';
import { BeanControllerBase, deepExtend } from 'zova';
import { ZovaJsx } from 'zova-jsx';
import { Controller } from 'zova-module-a-bean';
import { formMetaFromFormScene, ZFormField } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-details:formFieldDetails'?: IResourceFormFieldDetailsOptions;
  }
}

export interface IResourceFormFieldDetailsOptions extends IResourceFormFieldOptionsBase {}

export interface ControllerFormFieldDetailsProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldDetailsOptions;
}

@Controller()
export class ControllerFormFieldDetails extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  jsxZova: ZovaJsx;

  protected async __init__() {
    this._prepareJsx();
  }

  private _prepareJsx() {
    this.jsxZova = this.bean._newBeanSimple(ZovaJsx, false);
  }

  protected render() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={(formFieldRenderContext, $$formField) => {
          return this._renderBlocks(formFieldRenderContext, $$formField) ?? <></>;
        }}
      ></ZFormField>
    );
  }

  private _renderBlocks(
    formFieldRenderContext: IFormFieldRenderContext,
    $$formField: ControllerFormField,
  ) {
    const { propsBucket } = formFieldRenderContext;
    const schemaRow = this._getSchemaRow($$formField);
    if (!schemaRow) return;
    const schemaForm = $$formField.property!.items;
    if (!schemaForm) return;
    const formScene: TypeFormScene = propsBucket.readonly
      ? 'view'
      : $$formField.formMeta!.formScene!;
    const formMeta = formMetaFromFormScene(formScene);
    const blocks = schemaRow?.rest?.blocks;
    if (!blocks || blocks.length === 0) return;
    const domBlocks: VNode[] = [];
    blocks.forEach((block, index) => {
      const options = deepExtend(
        { key: index },
        {
          formMeta,
          schemaRow,
          schemaForm,
          permissions: (formFieldRenderContext.celScope as { permissions?: TypeOpenapiPermissions })
            .permissions,
          getDetailItems: () => {
            return propsBucket.value;
          },
          setDetailItems: (detailItems: any[]) => {
            $$formField.setValue(detailItems);
          },
        },
        block.options,
      );
      const domBlock = this.jsxZova.render(block.render!, options);
      if (!domBlock) return;
      if (Array.isArray(domBlock)) {
        domBlocks.push(...domBlock);
      } else {
        domBlocks.push(domBlock);
      }
    });
    return <div>{domBlocks}</div>;
  }

  private _getSchemaRow($$formField: ControllerFormField): ISchemaObjectExtensionField | undefined {
    const fieldNameAux = `_${$$formField.name}`;
    const propertyAux = $$formField.$$form.getFieldProperty(fieldNameAux);
    const schemaName = propertyAux?.items?.$ref;
    if (!schemaName) {
      throw new Error(`Should specify the schemaRow of detail by auxiliary Field: ${fieldNameAux}`);
    }
    return this.$sdk.getSchema(schemaName).data;
  }
}
