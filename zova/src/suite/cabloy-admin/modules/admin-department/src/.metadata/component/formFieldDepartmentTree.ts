import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldDepartmentTreeProps } from '../../component/formFieldDepartmentTree/controller.jsx';

import { ControllerFormFieldDepartmentTree } from '../../component/formFieldDepartmentTree/controller.jsx';
export type ZFormFieldDepartmentTreeProps = {
  controllerRef?: (ref: ControllerFormFieldDepartmentTree) => void;
} & ControllerFormFieldDepartmentTreeProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldDepartmentTreeProps,
  keyof typeof ControllerFormFieldDepartmentTree.$propsDefault
>;
declare module 'zova-module-admin-department' {
  export interface ControllerFormFieldDepartmentTree {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldDepartmentTree = defineComponent((_props: ZFormFieldDepartmentTreeProps) => {
  useController(ControllerFormFieldDepartmentTree, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldDepartmentTree.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'admin-department:formFieldDepartmentTree': ControllerFormFieldDepartmentTreeProps;
  }
}
