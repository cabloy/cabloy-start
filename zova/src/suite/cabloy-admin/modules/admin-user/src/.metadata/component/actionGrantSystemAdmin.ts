import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerActionGrantSystemAdminProps } from '../../component/actionGrantSystemAdmin/controller.jsx';

import { ControllerActionGrantSystemAdmin } from '../../component/actionGrantSystemAdmin/controller.jsx';
export type ZActionGrantSystemAdminProps = {
  controllerRef?: (ref: ControllerActionGrantSystemAdmin) => void;
} & ControllerActionGrantSystemAdminProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerActionGrantSystemAdminProps,
  keyof typeof ControllerActionGrantSystemAdmin.$propsDefault
>;
declare module 'zova-module-admin-user' {
  export interface ControllerActionGrantSystemAdmin {
    $props: ControllerInnerProps;
  }
}

export const ZActionGrantSystemAdmin = defineComponent((_props: ZActionGrantSystemAdminProps) => {
  useController(ControllerActionGrantSystemAdmin, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerActionGrantSystemAdmin.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'admin-user:actionGrantSystemAdmin': ControllerActionGrantSystemAdminProps;
  }
}
