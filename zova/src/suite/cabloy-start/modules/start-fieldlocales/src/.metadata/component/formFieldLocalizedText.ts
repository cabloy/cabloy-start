import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldLocalizedTextProps } from '../../component/formFieldLocalizedText/controller.jsx';

import { ControllerFormFieldLocalizedText } from '../../component/formFieldLocalizedText/controller.jsx';
export type ZFormFieldLocalizedTextProps = {
  controllerRef?: (ref: ControllerFormFieldLocalizedText) => void;
} & ControllerFormFieldLocalizedTextProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldLocalizedTextProps,
  keyof typeof ControllerFormFieldLocalizedText.$propsDefault
>;
declare module 'zova-module-start-fieldlocales' {
  export interface ControllerFormFieldLocalizedText {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldLocalizedText = defineComponent((_props: ZFormFieldLocalizedTextProps) => {
  useController(ControllerFormFieldLocalizedText, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldLocalizedText.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'start-fieldlocales:formFieldLocalizedText': ControllerFormFieldLocalizedTextProps;
  }
}
