import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockPolicyEditorProps } from '../../component/blockPolicyEditor/controller.jsx';

import { ControllerBlockPolicyEditor } from '../../component/blockPolicyEditor/controller.jsx';
export type ZBlockPolicyEditorProps = {
  controllerRef?: (ref: ControllerBlockPolicyEditor) => void;
} & ControllerBlockPolicyEditorProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockPolicyEditorProps,
  keyof typeof ControllerBlockPolicyEditor.$propsDefault
>;
declare module 'zova-module-admin-rbac' {
  export interface ControllerBlockPolicyEditor {
    $props: ControllerInnerProps;
  }
}

export const ZBlockPolicyEditor = defineComponent((_props: ZBlockPolicyEditorProps) => {
  useController(ControllerBlockPolicyEditor, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBlockPolicyEditor.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'admin-rbac:blockPolicyEditor': ControllerBlockPolicyEditorProps;
  }
}
