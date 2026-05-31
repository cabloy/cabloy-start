import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldChipsProps } from '../../component/formFieldChips/controller.jsx';

import { ControllerFormFieldChips } from '../../component/formFieldChips/controller.jsx';
export type ZFormFieldChipsProps = {
  controllerRef?: (ref: ControllerFormFieldChips) => void;
} & ControllerFormFieldChipsProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldChipsProps,
  keyof typeof ControllerFormFieldChips.$propsDefault
>;
declare module 'zova-module-start-select' {
  export interface ControllerFormFieldChips {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldChips = defineComponent((_props: ZFormFieldChipsProps) => {
  useController(ControllerFormFieldChips, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldChips.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'start-select:formFieldChips': ControllerFormFieldChipsProps;
  }
}
