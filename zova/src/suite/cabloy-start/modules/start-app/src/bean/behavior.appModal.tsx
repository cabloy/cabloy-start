import type { VNode } from 'vue';
import type { IDecoratorBehaviorOptions, NextBehavior } from 'zova-module-a-behavior';

import { VBtn, VCard, VCardActions, VCardText, VDialog, VTextField } from 'vuetify/components';
import { BeanBehaviorBase, Behavior } from 'zova-module-a-behavior';

import {
  IModalAlertOptions,
  IModalConfirmOptionsInner,
  IModalItem,
  IModalPromptOptionsInner,
} from '../types/appModal.js';

export interface IBehaviorPropsInputAppModal {}

export interface IBehaviorPropsOutputAppModal extends IBehaviorPropsInputAppModal {}

export interface IBehaviorOptionsAppModal extends IDecoratorBehaviorOptions {}

@Behavior<IBehaviorOptionsAppModal>()
export class BehaviorAppModal extends BeanBehaviorBase<
  IBehaviorOptionsAppModal,
  IBehaviorPropsInputAppModal,
  IBehaviorPropsOutputAppModal
> {
  protected render(
    _props: IBehaviorPropsInputAppModal,
    next: NextBehavior<IBehaviorPropsOutputAppModal>,
  ): VNode {
    const vnodeDefault = next();
    return (
      <>
        {vnodeDefault}
        {this._renderAppModals()}
      </>
    );
  }

  private _renderAppModals() {
    if (this.$appModal.modalItems.length === 0) return;
    const children: VNode[] = [];
    for (const modalItem of this.$appModal.modalItems) {
      let domModalItem;
      if (modalItem.type === 'alert') {
        domModalItem = this._renderAppModalAlert(modalItem);
      } else if (modalItem.type === 'confirm') {
        domModalItem = this._renderAppModalConfirm(modalItem);
      } else if (modalItem.type === 'prompt') {
        domModalItem = this._renderAppModalPrompt(modalItem);
      }
      if (domModalItem) {
        children.push(domModalItem);
      }
    }
    return <div>{children}</div>;
  }

  private _renderAppModalAlert(modalItem: IModalItem) {
    const options: IModalAlertOptions | undefined = modalItem.options;
    let dialogOptions: VDialog['$props'] | undefined = modalItem.dialogOptions;
    // icon
    const type = options?.type ?? 'info';
    const iconName = options?.icon ?? this.scope.config.model.alert.icons[type];
    // title
    const title = options?.title ?? this.sys.env.APP_TITLE;
    // text
    const text = options?.text;
    // width
    const hasWidth =
      dialogOptions?.minWidth ??
      dialogOptions?.maxWidth ??
      dialogOptions?.width ??
      dialogOptions?.fullscreen;
    if (!hasWidth) {
      dialogOptions = {
        ...dialogOptions,
        maxWidth: this.scope.config.model.alert.default.maxWidth,
      };
    }
    // slots
    return (
      <VDialog
        {...dialogOptions}
        key={modalItem.id}
        modelValue={true}
        onUpdate:modelValue={value => {
          if (value === false) {
            this.$appModal.close(modalItem.id);
          }
        }}
      >
        <VCard prependIcon={iconName} title={title} text={text}>
          <VCardActions>
            <VBtn
              text={this.scope.locale.Close()}
              nativeOnClick={() => {
                this.$appModal.close(modalItem.id);
              }}
            ></VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    );
  }

  private _renderAppModalConfirm(modalItem: IModalItem) {
    const options: IModalConfirmOptionsInner | undefined = modalItem.options;
    let dialogOptions: VDialog['$props'] | undefined = modalItem.dialogOptions;
    // icon
    const iconName = options?.icon ?? this.scope.config.model.confirm.icons.confirm;
    // title
    const title = options?.title ?? this.sys.env.APP_TITLE;
    // text
    const text = options?.text;
    // width
    const hasWidth =
      dialogOptions?.minWidth ??
      dialogOptions?.maxWidth ??
      dialogOptions?.width ??
      dialogOptions?.fullscreen;
    if (!hasWidth) {
      dialogOptions = {
        ...dialogOptions,
        maxWidth: this.scope.config.model.confirm.default.maxWidth,
      };
    }
    // slots
    return (
      <VDialog
        {...dialogOptions}
        key={modalItem.id}
        modelValue={true}
        onUpdate:modelValue={value => {
          if (value === false) {
            this.$appModal.close(modalItem.id);
            options!.onCallback!(false);
          }
        }}
      >
        <VCard prependIcon={iconName} title={title} text={text}>
          <VCardActions>
            <VBtn
              color=""
              text={this.scope.locale.No()}
              nativeOnClick={() => {
                this.$appModal.close(modalItem.id);
                options!.onCallback!(false);
              }}
            ></VBtn>
            <VBtn
              text={this.scope.locale.Yes()}
              nativeOnClick={() => {
                this.$appModal.close(modalItem.id);
                options!.onCallback!(true);
              }}
            ></VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    );
  }

  private _renderAppModalPrompt(modalItem: IModalItem) {
    const options: IModalPromptOptionsInner | undefined = modalItem.options;
    let dialogOptions: VDialog['$props'] | undefined = modalItem.dialogOptions;
    // icon
    const iconName = options?.icon ?? this.scope.config.model.prompt.icons.prompt;
    // title
    const title = options?.title ?? this.sys.env.APP_TITLE;
    // text
    const text = options?.text;
    // width
    const hasWidth =
      dialogOptions?.minWidth ??
      dialogOptions?.maxWidth ??
      dialogOptions?.width ??
      dialogOptions?.fullscreen;
    if (!hasWidth) {
      dialogOptions = {
        ...dialogOptions,
        maxWidth: this.scope.config.model.prompt.default.maxWidth,
      };
    }
    // slots
    return (
      <VDialog
        {...dialogOptions}
        key={modalItem.id}
        modelValue={true}
        onUpdate:modelValue={value => {
          if (value === false) {
            this.$appModal.close(modalItem.id);
            options!.onCallback!(undefined);
          }
        }}
      >
        <VCard prependIcon={iconName} title={title}>
          <VCardText>
            <VTextField
              modelValue={options?.defaultValue ?? ''}
              onUpdate:modelValue={value => {
                options!.defaultValue = value;
              }}
              label={text}
              clearable={true}
            ></VTextField>
          </VCardText>
          <VCardActions>
            <VBtn
              color=""
              text={this.scope.locale.Cancel()}
              nativeOnClick={() => {
                this.$appModal.close(modalItem.id);
                options!.onCallback!(undefined);
              }}
            ></VBtn>
            <VBtn
              text={this.scope.locale.Ok()}
              nativeOnClick={() => {
                this.$appModal.close(modalItem.id);
                options!.onCallback!(options?.defaultValue ?? '');
              }}
            ></VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    );
  }
}
