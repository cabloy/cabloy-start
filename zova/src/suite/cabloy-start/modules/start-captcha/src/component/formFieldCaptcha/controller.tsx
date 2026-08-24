import type { IComponentOptions, TypeEventOff } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type {
  ICaptchaData,
  ICaptchaSceneRecord,
  IResourceFormFieldOptionsBase,
} from 'zova-module-a-openapi';

import { VTextField } from 'vuetify/components';
import z from 'zod';
import { BeanControllerBase, ClientOnly, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ControllerForm, ZFormField } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-captcha:formFieldCaptcha'?: IResourceFormFieldCaptchaOptions;
  }

  export interface ICaptchaSceneRecord {
    'captcha-simple:simple': never;
  }
}

export interface IResourceFormFieldCaptchaOptions extends IResourceFormFieldOptionsBase {
  scene?: keyof ICaptchaSceneRecord;
}

export interface ControllerFormFieldCaptchaProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldCaptchaOptions;
}

@Controller()
export class ControllerFormFieldCaptcha extends BeanControllerBase {
  static $propsDefault = {
    options: {
      scene: 'captcha-simple:simple',
    },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  eventFormSubmission: TypeEventOff;
  captchaData?: ICaptchaData;

  @Use({ injectionScope: 'host' })
  $$form: ControllerForm;

  protected async __init__() {
    // event
    if (process.env.CLIENT) {
      this.eventFormSubmission = this.app.meta.event.on('a-form:formSubmission', (data, next) => {
        if (data.form.formId === this.$$form.form.formId && data.error) {
          this.refreshCaptchaData();
        }
        return next();
      });
    }
    // captcha data
    if (process.env.CLIENT) {
      this.createCaptchaData();
    }
  }

  protected __dispose__() {
    if (this.eventFormSubmission) {
      this.eventFormSubmission();
    }
  }

  get captchaScene() {
    return this.$props.options!.scene!;
  }

  private async createCaptchaData() {
    this.captchaData = await this.$api.captcha.create(
      {
        scene: this.captchaScene,
      },
      { authToken: false },
    );
    this.setFieldCaptchaData();
  }

  private async refreshCaptchaData() {
    this.captchaData = await this.$api.captcha.refresh(
      {
        id: this.captchaData!.id,
        scene: this.captchaScene,
      },
      { authToken: false },
    );
    this.setFieldCaptchaData();
  }

  private setFieldCaptchaData() {
    if (!this.captchaData) return;
    this.$$form.setFieldValue(this.$props.name!, {
      id: this.captchaData.id,
      token: this.captchaData.token,
    });
  }

  protected render() {
    return (
      <ZFormField
        {...this.$props}
        onFieldStateReady={() => {
          this.setFieldCaptchaData();
        }}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const { field } = $$formField;
          const error = !field.state.meta.isValid;
          const errorObj = field.state.meta.errors[0] as z.ZodError | undefined;
          const propsNew: VTextField['$props'] = {
            'label': this.scope.locale.InputCaptcha(),
            'prependIcon': propsBucket.layout?.iconPrefix,
            'modelValue': this.captchaData?.token as any,
            'onUpdate:modelValue': token => {
              if (this.captchaData) {
                this.captchaData.token = token;
              }
              $$formField.setValue({
                id: this.captchaData?.id,
                token,
              });
            },
            'onUpdate:focused': (focused: boolean) => {
              if (!focused) {
                $$formField.handleBlur();
              }
            },
            'errorMessages': error ? errorObj?.message : undefined,
            ...props,
          };
          return (
            <VTextField {...propsNew}>
              {{
                'append-inner': () => this._renderCaptcha(),
              }}
            </VTextField>
          );
        }}
      ></ZFormField>
    );
  }

  private _renderCaptcha() {
    return (
      <ClientOnly>
        {this.captchaData?.payload && (
          <img
            class="cursor-pointer"
            src={this.captchaData!.payload as string}
            onClick={() => {
              this.refreshCaptchaData();
            }}
          ></img>
        )}
      </ClientOnly>
    );
  }
}
