import type { VNode } from 'vue';
import type { ControllerFormField, IFormFieldRenderContext } from 'zova-module-a-form';

import { VField, VInput } from 'vuetify/components';
import z from 'zod';

export interface ICompoundFormFieldState {
  focused: boolean;
  blurTimeout?: ReturnType<typeof setTimeout>;
}

export interface ICompoundFormFieldControlContext {
  id: string;
  labelId: string;
  disabled: boolean;
  readonly: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

export interface IRenderCompoundFormFieldOptions {
  localErrorMessage?: string;
  state: ICompoundFormFieldState;
  renderControl: (context: ICompoundFormFieldControlContext) => VNode;
}

export function createCompoundFormFieldState(): ICompoundFormFieldState {
  return { focused: false };
}

export function renderCompoundFormField(
  renderContext: IFormFieldRenderContext,
  $$formField: ControllerFormField,
  options: IRenderCompoundFormFieldOptions,
): VNode {
  const { propsBucket, props: fieldProps } = renderContext;
  const { field } = $$formField;
  const error = !field.state.meta.isValid;
  const errorObj = field.state.meta.errors[0] as z.ZodError | undefined;
  const errorMessage = error ? errorObj?.message : undefined;
  const propsOptions = { ...propsBucket.options, ...fieldProps };
  const propsInputOptions = VInput.filterProps(propsOptions);
  const propsFieldOptions = VField.filterProps(propsOptions);
  const variant = propsFieldOptions.variant ?? 'outlined';
  const isPlainOrUnderlined = variant === 'plain' || variant === 'underlined';
  const clearBlurTimeout = () => {
    if (!options.state.blurTimeout) return;
    clearTimeout(options.state.blurTimeout);
    options.state.blurTimeout = undefined;
  };
  const slots = {
    default: ({ id, isDirty, isDisabled, isReadonly, isValid, hasDetails }: any) => {
      const fieldId = id.value;
      const propsField: VField['$props'] = {
        ...propsFieldOptions,
        id: fieldId,
        labelId: `${fieldId}-label`,
        label: propsBucket.layout?.label || undefined,
        active: true,
        dirty: isDirty.value || propsFieldOptions.dirty,
        disabled: isDisabled.value,
        focused: options.state.focused,
        details: hasDetails.value,
        error: isValid.value === false || error || !!options.localErrorMessage,
        variant,
      };
      const slotsField = {
        default: ({ props: propsControl, focus, blur }: any) => {
          const context: ICompoundFormFieldControlContext = {
            id: fieldId,
            labelId: `${fieldId}-label`,
            disabled: isDisabled.value,
            readonly: isReadonly.value,
            onFocus: () => {
              clearBlurTimeout();
              options.state.focused = true;
              focus();
            },
            onBlur: () => {
              clearBlurTimeout();
              options.state.blurTimeout = setTimeout(() => {
                options.state.focused = false;
                blur();
                $$formField.handleBlur();
              });
            },
          };
          return (
            <div
              {...propsControl}
              role="group"
              aria-labelledby={context.labelId}
              tabindex={context.disabled || context.readonly ? undefined : -1}
              onFocusin={context.onFocus}
              onFocusout={(event: FocusEvent) => {
                const target = event.currentTarget as HTMLElement | null;
                if (target?.contains(event.relatedTarget as Node | null)) return;
                context.onBlur();
              }}
            >
              {options.renderControl(context)}
            </div>
          );
        },
      };
      return <VField {...propsField} v-slots={slotsField}></VField>;
    },
  };
  const propsInput: VInput['$props'] = {
    ...propsInputOptions,
    prependIcon: propsBucket.layout?.iconPrefix,
    appendIcon: propsBucket.layout?.iconSuffix,
    modelValue: propsBucket.value,
    centerAffix: !isPlainOrUnderlined,
    focused: options.state.focused,
    indentDetails: propsInputOptions.indentDetails ?? !isPlainOrUnderlined,
    error: error || !!options.localErrorMessage,
    errorMessages: [errorMessage, options.localErrorMessage].filter(
      (message): message is string => !!message,
    ),
    class: fieldProps.class,
  };
  return <VInput {...propsInput} v-slots={slots}></VInput>;
}
