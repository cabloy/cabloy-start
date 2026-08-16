import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockDepartmentMembershipsProps } from '../../component/blockDepartmentMemberships/controller.jsx';

import { ControllerBlockDepartmentMemberships } from '../../component/blockDepartmentMemberships/controller.jsx';
export type ZBlockDepartmentMembershipsProps = {
  controllerRef?: (ref: ControllerBlockDepartmentMemberships) => void;
} & ControllerBlockDepartmentMembershipsProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockDepartmentMembershipsProps,
  keyof typeof ControllerBlockDepartmentMemberships.$propsDefault
>;
declare module 'zova-module-admin-department' {
  export interface ControllerBlockDepartmentMemberships {
    $props: ControllerInnerProps;
  }
}

export const ZBlockDepartmentMemberships = defineComponent(
  (_props: ZBlockDepartmentMembershipsProps) => {
    useController(ControllerBlockDepartmentMemberships, undefined, undefined);
    return () => {};
  },
  prepareComponentOptions(ControllerBlockDepartmentMemberships.$componentOptions),
);
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'admin-department:blockDepartmentMemberships': ControllerBlockDepartmentMembershipsProps;
  }
}
