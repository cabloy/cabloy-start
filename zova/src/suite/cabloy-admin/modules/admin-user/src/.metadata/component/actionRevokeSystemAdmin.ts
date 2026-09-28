import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerActionRevokeSystemAdminProps } from '../../component/actionRevokeSystemAdmin/controller.jsx';

import { ControllerActionRevokeSystemAdmin } from '../../component/actionRevokeSystemAdmin/controller.jsx';
export type ZActionRevokeSystemAdminProps = {
  controllerRef?: (ref: ControllerActionRevokeSystemAdmin) => void;
} & ControllerActionRevokeSystemAdminProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerActionRevokeSystemAdminProps,
  keyof typeof ControllerActionRevokeSystemAdmin.$propsDefault
>;
declare module 'zova-module-admin-user' {
  export interface ControllerActionRevokeSystemAdmin {
    $props: ControllerInnerProps;
  }
}

export const ZActionRevokeSystemAdmin = defineComponent((_props: ZActionRevokeSystemAdminProps) => {
  useController(ControllerActionRevokeSystemAdmin, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerActionRevokeSystemAdmin.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'admin-user:actionRevokeSystemAdmin': ControllerActionRevokeSystemAdminProps;
  }
}
