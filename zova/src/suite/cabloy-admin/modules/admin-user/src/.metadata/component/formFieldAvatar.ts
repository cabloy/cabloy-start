import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldAvatarProps } from '../../component/formFieldAvatar/controller.tsx';

import { ControllerFormFieldAvatar } from '../../component/formFieldAvatar/controller.tsx';
export type ZFormFieldAvatarProps = {
  controllerRef?: (ref: ControllerFormFieldAvatar) => void;
} & ControllerFormFieldAvatarProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldAvatarProps,
  keyof typeof ControllerFormFieldAvatar.$propsDefault
>;
declare module 'zova-module-admin-user' {
  export interface ControllerFormFieldAvatar {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldAvatar = defineComponent((_props: ZFormFieldAvatarProps) => {
  useController(ControllerFormFieldAvatar, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldAvatar.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'admin-user:formFieldAvatar': ControllerFormFieldAvatarProps;
  }
}
