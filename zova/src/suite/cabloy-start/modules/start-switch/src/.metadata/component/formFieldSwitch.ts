import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldSwitchProps } from '../../component/formFieldSwitch/controller.jsx';

import { ControllerFormFieldSwitch } from '../../component/formFieldSwitch/controller.jsx';
export type ZFormFieldSwitchProps = {
  controllerRef?: (ref: ControllerFormFieldSwitch) => void;
} & ControllerFormFieldSwitchProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldSwitchProps,
  keyof typeof ControllerFormFieldSwitch.$propsDefault
>;
declare module 'zova-module-start-switch' {
  export interface ControllerFormFieldSwitch {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldSwitch = defineComponent((_props: ZFormFieldSwitchProps) => {
  useController(ControllerFormFieldSwitch, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldSwitch.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'start-switch:formFieldSwitch': ControllerFormFieldSwitchProps;
  }
}
