import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockPageDepartmentsProps } from '../../component/blockPageDepartments/controller.jsx';

import { ControllerBlockPageDepartments } from '../../component/blockPageDepartments/controller.jsx';
export type ZBlockPageDepartmentsProps = {
  controllerRef?: (ref: ControllerBlockPageDepartments) => void;
} & ControllerBlockPageDepartmentsProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockPageDepartmentsProps,
  keyof typeof ControllerBlockPageDepartments.$propsDefault
>;
declare module 'zova-module-admin-department' {
  export interface ControllerBlockPageDepartments {
    $props: ControllerInnerProps;
  }
}

export const ZBlockPageDepartments = defineComponent((_props: ZBlockPageDepartmentsProps) => {
  useController(ControllerBlockPageDepartments, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBlockPageDepartments.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'admin-department:blockPageDepartments': ControllerBlockPageDepartmentsProps;
  }
}
