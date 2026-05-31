import type { IComponentOptions } from 'zova';
import type {
  IFormMeta,
  IJsxRenderContextPage,
  IResourceBlockOptionsBase,
  IResourceFormFieldLayoutOptions,
} from 'zova-module-a-openapi';

import { isNilOrEmptyString } from '@cabloy/utils';
import { VBtn, VBtnGroup, VContainer, VRow } from 'vuetify/components';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { TypeFormOnSubmitData, ZForm } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'start-page:blockFilter'?: ControllerBlockFilterProps;
  }
}

export interface ControllerBlockFilterProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockFilter extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  formMeta: IFormMeta;
  formFieldLayout: IResourceFormFieldLayoutOptions;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  protected async __init__() {
    this.formMeta = { formMode: 'edit' };
    this.formFieldLayout = { inline: true };
  }

  get schemaFilter() {
    const { $$page } = this.$$renderContext;
    return $$page.schemaFilter;
  }

  submitData(data: TypeFormOnSubmitData) {
    this._onFilter(data.value);
  }

  resetData(data: any) {
    this._onFilter(data);
  }

  _onFilter(dataOld: any) {
    const { $$page } = this.$$renderContext;
    const dataNew = {};
    for (const key in dataOld) {
      const value = dataOld[key];
      if (!isNilOrEmptyString(value)) {
        dataNew[key] = value;
      }
    }
    $$page.onFilter(dataNew);
  }

  protected render() {
    const { $$page } = this.$$renderContext;
    return (
      <ZForm
        class={this.$props.class}
        inline={true}
        data={$$page.queryFilterData}
        schema={this.schemaFilter}
        schemaScene="filter"
        formMeta={this.formMeta}
        formFieldLayout={this.formFieldLayout}
        onSubmitData={data => this.submitData(data as never)}
        slotWrapper={children => {
          return (
            <VContainer>
              <VRow>{children}</VRow>
            </VContainer>
          );
        }}
        slotFooter={$$form => {
          return (
            <VBtnGroup variant="outlined" divided>
              <VBtn
                color="primary"
                nativeOnClick={() => {
                  $$form.submit();
                }}
              >
                {this.scope.locale.Search()}
              </VBtn>
              <VBtn
                nativeOnClick={() => {
                  const data = $$form.reset();
                  this.resetData(data);
                }}
              >
                {this.scope.locale.Reset()}
              </VBtn>
            </VBtnGroup>
          );
        }}
      ></ZForm>
    );
  }
}
