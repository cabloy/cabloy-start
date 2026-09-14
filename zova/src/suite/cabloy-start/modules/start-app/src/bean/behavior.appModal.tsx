import type { VNode } from 'vue';
import type { IDecoratorBehaviorOptions, NextBehavior } from 'zova-module-a-behavior';
import type { IIconRecord } from 'zova-module-a-icon';

import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VDialog,
  VIcon,
  VProgressCircular,
  VTextField,
} from 'vuetify/components';
import { BeanBehaviorBase, Behavior } from 'zova-module-a-behavior';
import { $iconName } from 'zova-module-a-icon';

import {
  AlertType,
  IModalAlertOptions,
  IModalConfirmOptionsInner,
  IModalDialogOptions,
  IModalDialogRenderContext,
  IModalDialogRenderOptions,
  IModalItem,
  IModalPromptOptionsInner,
  IModalResponsiveMaxWidth,
  IModalResponsiveTopGutter,
  IModalRoutedDialogItem,
  IModalRoutedDialogPresentationOptions,
  ModalRoutedDialogMaxWidth,
  ModalRoutedDialogTopGutter,
  ModalType,
  ModalWidth,
} from '../types/appModal.js';

export interface IBehaviorPropsInputAppModal {}

export interface IBehaviorPropsOutputAppModal extends IBehaviorPropsInputAppModal {}

export interface IBehaviorOptionsAppModal extends IDecoratorBehaviorOptions {}

interface IPreparedDialogOptions extends Omit<IModalDialogOptions, 'maxWidth'> {
  maxWidth?: ModalRoutedDialogMaxWidth;
  topGutter?: ModalRoutedDialogTopGutter;
  showBackButton?: boolean;
}

interface IRenderDialogBaseOptions {
  modalItem: IModalItem;
  dialogOptions: IPreparedDialogOptions;
  iconName?: keyof IIconRecord;
  title: string;
  body?: VNode;
  actions?: VNode;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  onBack?: () => void;
  onClose: () => void;
}

const responsiveMaxWidthClass = {
  maxWidth: 'var(--zova-routed-dialog-max-width-default)',
  $nest: {
    '@media (min-width: 48rem)': {
      maxWidth:
        'var(--zova-routed-dialog-max-width-md, var(--zova-routed-dialog-max-width-default))',
    },
    '@media (min-width: 64rem)': {
      maxWidth:
        'var(--zova-routed-dialog-max-width-lg, var(--zova-routed-dialog-max-width-md, var(--zova-routed-dialog-max-width-default)))',
    },
  },
};

const responsiveTopGutterClass = {
  top: 'var(--zova-routed-dialog-top-gutter-default, 0px)',
  bottom: 'var(--zova-routed-dialog-top-gutter-default, 0px)',
  $nest: {
    '@media (min-width: 48rem)': {
      top: 'var(--zova-routed-dialog-top-gutter-md, var(--zova-routed-dialog-top-gutter-default, 0px))',
      bottom:
        'var(--zova-routed-dialog-top-gutter-md, var(--zova-routed-dialog-top-gutter-default, 0px))',
    },
    '@media (min-width: 64rem)': {
      top: 'var(--zova-routed-dialog-top-gutter-lg, var(--zova-routed-dialog-top-gutter-md, var(--zova-routed-dialog-top-gutter-default, 0px)))',
      bottom:
        'var(--zova-routed-dialog-top-gutter-lg, var(--zova-routed-dialog-top-gutter-md, var(--zova-routed-dialog-top-gutter-default, 0px)))',
    },
  },
};

const routedDialogContentClass = {
  margin: '0 24px !important',
};

@Behavior<IBehaviorOptionsAppModal>()
export class BehaviorAppModal extends BeanBehaviorBase<
  IBehaviorOptionsAppModal,
  IBehaviorPropsInputAppModal,
  IBehaviorPropsOutputAppModal
> {
  private _windowKeydownHandler?: (event: KeyboardEvent) => void;

  protected async __init__() {
    if (!process.env.CLIENT) return;
    this._windowKeydownHandler = event => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      const modalItems = this.$appModal.modalItems;
      const modalItem = modalItems[modalItems.length - 1];
      if (!modalItem) return;
      const dialogOptions = this._prepareDialogOptions(modalItem.type, modalItem.dialogOptions);
      if (!dialogOptions.closeOnEscape) return;
      event.preventDefault();
      event.stopPropagation();
      this._closeModalByEscape(modalItem);
    };
    window.addEventListener('keydown', this._windowKeydownHandler);
  }

  protected __dispose__() {
    if (this._windowKeydownHandler) {
      window.removeEventListener('keydown', this._windowKeydownHandler);
    }
  }

  private _closeModalByEscape(modalItem: IModalItem) {
    if (modalItem.type === 'confirm') {
      const options = modalItem.options as IModalConfirmOptionsInner | undefined;
      this.$appModal.close(modalItem.id, 'escape');
      options?.onCallback?.(false);
      return;
    }
    if (modalItem.type === 'prompt') {
      const options = modalItem.options as IModalPromptOptionsInner | undefined;
      this.$appModal.close(modalItem.id, 'escape');
      options?.onCallback?.(undefined);
      return;
    }
    this.$appModal.close(modalItem.id, 'escape');
  }

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
    return <>{this.$appModal.modalItems.map(modalItem => this._renderAppModal(modalItem))}</>;
  }

  private _renderAppModal(modalItem: IModalItem) {
    if (modalItem.type === 'alert') return this._renderAppModalAlert(modalItem);
    if (modalItem.type === 'confirm') return this._renderAppModalConfirm(modalItem);
    if (modalItem.type === 'prompt') return this._renderAppModalPrompt(modalItem);
    if (modalItem.type === 'routedDialog') return this._renderAppModalRoutedDialog(modalItem);
    return this._renderAppModalDialog(modalItem);
  }

  private _renderAppModalAlert(modalItem: IModalItem) {
    const options = modalItem.options as IModalAlertOptions | undefined;
    const type = options?.type ?? 'info';
    const dialogOptions = this._prepareDialogOptions(modalItem.type, modalItem.dialogOptions);
    return this._renderDialogBase({
      modalItem,
      dialogOptions,
      iconName: (options?.icon ?? this.scope.config.model.alert.icons[type]) as keyof IIconRecord,
      title: options?.title ?? this.sys.env.APP_TITLE ?? '',
      body: options?.text ? <p class="whitespace-pre-wrap leading-6">{options.text}</p> : undefined,
      actions: (
        <VBtn
          color={this._getButtonColor(type)}
          nativeOnClick={() => this.$appModal.close(modalItem.id, 'button')}
        >
          {this.scope.locale.Close()}
        </VBtn>
      ),
      showCloseButton: dialogOptions.showCloseButton,
      onClose: () => this.$appModal.close(modalItem.id),
    });
  }

  private _renderAppModalConfirm(modalItem: IModalItem) {
    const options = modalItem.options as IModalConfirmOptionsInner | undefined;
    const dialogOptions = this._prepareDialogOptions(modalItem.type, modalItem.dialogOptions);
    return this._renderDialogBase({
      modalItem,
      dialogOptions,
      iconName: options?.icon ?? this.scope.config.model.confirm.icons.confirm,
      title: options?.title ?? this.sys.env.APP_TITLE ?? '',
      body: options?.text ? <p class="whitespace-pre-wrap leading-6">{options.text}</p> : undefined,
      actions: (
        <>
          <VBtn
            nativeOnClick={() => {
              this.$appModal.close(modalItem.id, 'button');
              options?.onCallback?.(false);
            }}
          >
            {this.scope.locale.No()}
          </VBtn>
          <VBtn
            color="primary"
            nativeOnClick={() => {
              this.$appModal.close(modalItem.id, 'button');
              options?.onCallback?.(true);
            }}
          >
            {this.scope.locale.Yes()}
          </VBtn>
        </>
      ),
      showCloseButton: dialogOptions.showCloseButton,
      onClose: () => {
        this.$appModal.close(modalItem.id);
        options?.onCallback?.(false);
      },
    });
  }

  private _renderAppModalPrompt(modalItem: IModalItem) {
    const options = modalItem.options as IModalPromptOptionsInner | undefined;
    const dialogOptions = this._prepareDialogOptions(modalItem.type, modalItem.dialogOptions);
    return this._renderDialogBase({
      modalItem,
      dialogOptions,
      iconName: options?.icon ?? this.scope.config.model.prompt.icons.prompt,
      title: options?.title ?? this.sys.env.APP_TITLE ?? '',
      body: (
        <VTextField
          modelValue={options?.defaultValue ?? ''}
          onUpdate:modelValue={value => {
            options!.defaultValue = value;
          }}
          label={options?.text}
          autofocus
          clearable
        />
      ),
      actions: (
        <>
          <VBtn
            nativeOnClick={() => {
              this.$appModal.close(modalItem.id, 'button');
              options?.onCallback?.(undefined);
            }}
          >
            {this.scope.locale.Cancel()}
          </VBtn>
          <VBtn
            color="primary"
            nativeOnClick={() => {
              this.$appModal.close(modalItem.id, 'button');
              options?.onCallback?.(options?.defaultValue ?? '');
            }}
          >
            {this.scope.locale.Ok()}
          </VBtn>
        </>
      ),
      showCloseButton: dialogOptions.showCloseButton,
      onClose: () => {
        this.$appModal.close(modalItem.id);
        options?.onCallback?.(undefined);
      },
    });
  }

  private _renderAppModalRoutedDialog(modalItem: IModalRoutedDialogItem) {
    const options = modalItem.options;
    const dialogOptions = this._prepareDialogOptions(
      modalItem.type,
      modalItem.dialogOptions,
      options,
    );
    const state = modalItem.state;
    let body: VNode;
    if (state.status === 'error') {
      body = <div class="text-error whitespace-pre-wrap">{String(state.error)}</div>;
    } else if (state.status === 'ready' && state.router) {
      const RoutedDialog = this.$zovaComponent('start-app:routedDialog' as any) as any;
      body = <RoutedDialog item={modalItem}></RoutedDialog>;
    } else {
      body = (
        <div class="d-flex justify-center pa-4">
          <VProgressCircular indeterminate />
        </div>
      );
    }
    return this._renderDialogBase({
      modalItem,
      dialogOptions,
      iconName: options.icon,
      title: options.title ?? this.sys.env.APP_TITLE ?? '',
      body,
      showBackButton: dialogOptions.showBackButton && state.status === 'ready' && state.canGoBack,
      showCloseButton: dialogOptions.showCloseButton,
      onBack: () => state.router?.back(),
      onClose: () => this.$appModal.close(modalItem.id, 'button'),
    });
  }

  private _renderAppModalDialog(modalItem: IModalItem) {
    const options = modalItem.options as IModalDialogRenderOptions | undefined;
    const dialogOptions = this._prepareDialogOptions(modalItem.type, modalItem.dialogOptions);
    const dialog: IModalDialogRenderContext = {
      id: modalItem.id,
      close: () => this.$appModal.close(modalItem.id),
    };
    return this._renderDialogBase({
      modalItem,
      dialogOptions,
      iconName: options?.icon,
      title: options?.title ?? this.sys.env.APP_TITLE ?? '',
      body: options?.slotDefault?.(dialog),
      actions: options?.slotActions?.(dialog),
      showCloseButton: dialogOptions.showCloseButton,
      onClose: dialog.close,
    });
  }

  private _renderDialogBase({
    modalItem,
    dialogOptions,
    iconName,
    title,
    body,
    actions,
    showBackButton,
    showCloseButton,
    onBack,
    onClose,
  }: IRenderDialogBaseOptions) {
    const isRouted = modalItem.type === 'routedDialog';
    const maxWidth = this._resolveScalar(dialogOptions.maxWidth);
    const maxHeight = this._resolveScalar(dialogOptions.maxHeight);
    const cardStyle: Record<string, string> = {};
    const cardClasses: string[] = [];
    const contentStyle: Record<string, string> = {};
    const contentClasses: string[] = [];
    if (isRouted) {
      cardClasses.push('w-100');
      cardStyle.marginInline = 'auto';
      if (this._isResponsiveLength(dialogOptions.maxWidth)) {
        cardClasses.push(this.$style(responsiveMaxWidthClass));
        this._setResponsiveMaxWidth(cardStyle, 'default', dialogOptions.maxWidth.default);
        this._setResponsiveMaxWidth(cardStyle, 'md', dialogOptions.maxWidth.md);
        this._setResponsiveMaxWidth(cardStyle, 'lg', dialogOptions.maxWidth.lg);
      } else if (maxWidth !== undefined) {
        cardStyle.maxWidth = this._normalizeWidth(maxWidth);
      }
      contentClasses.push(this.$style(routedDialogContentClass));
      if (maxHeight !== undefined) {
        contentStyle.maxHeight = this._normalizeWidth(maxHeight);
      }
      if (this._isResponsiveLength(dialogOptions.topGutter)) {
        contentClasses.push(this.$style(responsiveTopGutterClass));
        this._setResponsiveTopGutter(contentStyle, 'default', dialogOptions.topGutter.default);
        this._setResponsiveTopGutter(contentStyle, 'md', dialogOptions.topGutter.md);
        this._setResponsiveTopGutter(contentStyle, 'lg', dialogOptions.topGutter.lg);
      } else if (dialogOptions.topGutter !== undefined) {
        const topGutter = this._normalizeWidth(dialogOptions.topGutter);
        contentStyle.top = topGutter;
        contentStyle.bottom = topGutter;
        contentStyle['--zova-routed-dialog-top-gutter-current'] = topGutter;
      }
    } else {
      if (maxWidth !== undefined) cardStyle.maxWidth = this._normalizeWidth(maxWidth);
      if (maxHeight !== undefined) cardStyle.maxHeight = this._normalizeWidth(maxHeight);
    }
    return (
      <VDialog
        key={modalItem.id}
        modelValue
        maxWidth={isRouted ? '100%' : maxWidth}
        maxHeight={isRouted ? undefined : maxHeight}
        location={isRouted ? 'top center' : undefined}
        contentClass={isRouted ? this.$cssMerge(...contentClasses) : undefined}
        contentProps={isRouted ? { style: contentStyle } : undefined}
        scrollable
        persistent={!dialogOptions.closeOnBackdrop || !dialogOptions.closeOnEscape}
        closeOnBack={false}
        {...{
          'onClick:outside': () => {
            if (dialogOptions.closeOnBackdrop) onClose();
          },
          'onKeydown': (event: KeyboardEvent) => {
            if (event.key === 'Escape' && dialogOptions.closeOnEscape) onClose();
          },
        }}
        onUpdate:modelValue={value => {
          if (value === false) onClose();
        }}
      >
        <VCard style={cardStyle} class={isRouted ? this.$cssMerge(...cardClasses) : undefined}>
          <VCardTitle class="d-flex align-center ga-2">
            {showBackButton && (
              <VBtn
                icon={$iconName('::arrow-back')}
                variant="text"
                aria-label={this.scope.locale.Back()}
                nativeOnClick={onBack}
              ></VBtn>
            )}
            {iconName && <VIcon icon={$iconName(iconName)} class="me-1"></VIcon>}
            <span class="flex-grow-1 text-truncate">{title}</span>
            {showCloseButton && (
              <VBtn icon={$iconName('::close')} variant="text" nativeOnClick={onClose}></VBtn>
            )}
          </VCardTitle>
          {body && <VCardText class={isRouted ? 'pa-0' : undefined}>{body}</VCardText>}
          {actions && <VCardActions class="justify-end">{actions}</VCardActions>}
        </VCard>
      </VDialog>
    );
  }

  private _prepareDialogOptions(
    type: ModalType,
    dialogOptions?: IModalDialogOptions | IModalRoutedDialogPresentationOptions,
    routedDialogOptions?: IModalRoutedDialogPresentationOptions,
  ): IPreparedDialogOptions {
    const defaults = this.scope.config.model[type].default as IPreparedDialogOptions;
    const routed = type === 'routedDialog';
    return {
      maxWidth: routed
        ? this._mergeResponsiveLength(
            defaults.maxWidth,
            routedDialogOptions?.maxWidth,
            (dialogOptions as IModalRoutedDialogPresentationOptions | undefined)?.maxWidth,
          )
        : ((dialogOptions as IModalDialogOptions | undefined)?.maxWidth ?? defaults.maxWidth),
      maxHeight: dialogOptions?.maxHeight ?? defaults.maxHeight,
      topGutter: routed
        ? this._mergeResponsiveLength(
            defaults.topGutter,
            routedDialogOptions?.topGutter,
            (dialogOptions as IModalRoutedDialogPresentationOptions | undefined)?.topGutter,
          )
        : undefined,
      closeOnBackdrop: dialogOptions?.closeOnBackdrop ?? defaults.closeOnBackdrop,
      closeOnEscape: dialogOptions?.closeOnEscape ?? defaults.closeOnEscape,
      showCloseButton: dialogOptions?.showCloseButton ?? defaults.showCloseButton ?? false,
      showBackButton: routed
        ? ((dialogOptions as IModalRoutedDialogPresentationOptions | undefined)?.showBackButton ??
          routedDialogOptions?.showBackButton ??
          defaults.showBackButton ??
          false)
        : undefined,
    };
  }

  private _mergeResponsiveLength(
    ...values: (ModalRoutedDialogMaxWidth | ModalRoutedDialogTopGutter | undefined)[]
  ) {
    let resolved: ModalRoutedDialogMaxWidth | ModalRoutedDialogTopGutter | undefined;
    for (const value of values) {
      if (value === undefined) continue;
      if (typeof value !== 'object') {
        resolved = value;
      } else {
        resolved = {
          ...(typeof resolved === 'object' ? resolved : { default: resolved }),
          ...value,
        };
      }
    }
    return resolved;
  }

  private _resolveScalar(
    value: ModalWidth | IModalResponsiveMaxWidth | IModalResponsiveTopGutter | undefined,
  ) {
    if (value === undefined) return undefined;
    return typeof value === 'object' ? (value.default ?? value.md ?? value.lg) : value;
  }

  private _isResponsiveLength(
    value: ModalRoutedDialogMaxWidth | ModalRoutedDialogTopGutter | undefined,
  ): value is IModalResponsiveMaxWidth | IModalResponsiveTopGutter {
    return !!value && typeof value === 'object';
  }

  private _setResponsiveMaxWidth(
    style: Record<string, string>,
    breakpoint: keyof IModalResponsiveMaxWidth,
    value: ModalWidth | undefined,
  ) {
    if (value === undefined) return;
    style[`--zova-routed-dialog-max-width-${breakpoint}`] = this._normalizeWidth(value);
  }

  private _setResponsiveTopGutter(
    style: Record<string, string>,
    breakpoint: keyof IModalResponsiveTopGutter,
    value: ModalWidth | undefined,
  ) {
    if (value === undefined) return;
    style[`--zova-routed-dialog-top-gutter-${breakpoint}`] = this._normalizeWidth(value);
  }

  private _normalizeWidth(value: ModalWidth) {
    return typeof value === 'number' ? `${value}px` : value;
  }

  private _getButtonColor(type: AlertType) {
    if (type === 'success') return 'success';
    if (type === 'warning') return 'warning';
    if (type === 'error') return 'error';
    return 'primary';
  }
}
