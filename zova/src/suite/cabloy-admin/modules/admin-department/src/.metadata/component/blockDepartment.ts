import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockDepartmentProps } from '../../component/blockDepartment/controller.jsx';

import { ControllerBlockDepartment } from '../../component/blockDepartment/controller.jsx';
export type ZBlockDepartmentProps = {
  controllerRef?: (ref: ControllerBlockDepartment) => void;
} & ControllerBlockDepartmentProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockDepartmentProps,
  keyof typeof ControllerBlockDepartment.$propsDefault
>;
declare module 'zova-module-admin-department' {
  export interface ControllerBlockDepartment {
    $props: ControllerInnerProps;
  }
}

export const ZBlockDepartment = defineComponent((_props: ZBlockDepartmentProps) => {
  useController(ControllerBlockDepartment, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBlockDepartment.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'admin-department:blockDepartment': ControllerBlockDepartmentProps;
  }
}
