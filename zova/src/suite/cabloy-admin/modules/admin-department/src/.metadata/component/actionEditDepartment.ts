import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerActionEditDepartmentProps } from '../../component/actionEditDepartment/controller.jsx';

import { ControllerActionEditDepartment } from '../../component/actionEditDepartment/controller.jsx';
export type ZActionEditDepartmentProps = {
  controllerRef?: (ref: ControllerActionEditDepartment) => void;
} & ControllerActionEditDepartmentProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerActionEditDepartmentProps,
  keyof typeof ControllerActionEditDepartment.$propsDefault
>;
declare module 'zova-module-admin-department' {
  export interface ControllerActionEditDepartment {
    $props: ControllerInnerProps;
  }
}

export const ZActionEditDepartment = defineComponent((_props: ZActionEditDepartmentProps) => {
  useController(ControllerActionEditDepartment, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerActionEditDepartment.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'admin-department:actionEditDepartment': ControllerActionEditDepartmentProps;
  }
}
