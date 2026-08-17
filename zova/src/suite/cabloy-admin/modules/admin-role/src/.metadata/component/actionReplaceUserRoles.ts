import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerActionReplaceUserRolesProps } from '../../component/actionReplaceUserRoles/controller.jsx';

import { ControllerActionReplaceUserRoles } from '../../component/actionReplaceUserRoles/controller.jsx';
export type ZActionReplaceUserRolesProps = {
  controllerRef?: (ref: ControllerActionReplaceUserRoles) => void;
} & ControllerActionReplaceUserRolesProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerActionReplaceUserRolesProps,
  keyof typeof ControllerActionReplaceUserRoles.$propsDefault
>;
declare module 'zova-module-admin-role' {
  export interface ControllerActionReplaceUserRoles {
    $props: ControllerInnerProps;
  }
}

export const ZActionReplaceUserRoles = defineComponent((_props: ZActionReplaceUserRolesProps) => {
  useController(ControllerActionReplaceUserRoles, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerActionReplaceUserRoles.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'admin-role:actionReplaceUserRoles': ControllerActionReplaceUserRolesProps;
  }
}
