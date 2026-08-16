import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerActionCreateMembershipProps } from '../../component/actionCreateMembership/controller.jsx';

import { ControllerActionCreateMembership } from '../../component/actionCreateMembership/controller.jsx';
export type ZActionCreateMembershipProps = {
  controllerRef?: (ref: ControllerActionCreateMembership) => void;
} & ControllerActionCreateMembershipProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerActionCreateMembershipProps,
  keyof typeof ControllerActionCreateMembership.$propsDefault
>;
declare module 'zova-module-admin-department' {
  export interface ControllerActionCreateMembership {
    $props: ControllerInnerProps;
  }
}

export const ZActionCreateMembership = defineComponent((_props: ZActionCreateMembershipProps) => {
  useController(ControllerActionCreateMembership, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerActionCreateMembership.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'admin-department:actionCreateMembership': ControllerActionCreateMembershipProps;
  }
}
