import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockRoleMenuEditorProps } from '../../component/blockRoleMenuEditor/controller.jsx';

import { ControllerBlockRoleMenuEditor } from '../../component/blockRoleMenuEditor/controller.jsx';
export type ZBlockRoleMenuEditorProps = {
  controllerRef?: (ref: ControllerBlockRoleMenuEditor) => void;
} & ControllerBlockRoleMenuEditorProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockRoleMenuEditorProps,
  keyof typeof ControllerBlockRoleMenuEditor.$propsDefault
>;
declare module 'zova-module-admin-menu' {
  export interface ControllerBlockRoleMenuEditor {
    $props: ControllerInnerProps;
  }
}

export const ZBlockRoleMenuEditor = defineComponent((_props: ZBlockRoleMenuEditorProps) => {
  useController(ControllerBlockRoleMenuEditor, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBlockRoleMenuEditor.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'admin-menu:blockRoleMenuEditor': ControllerBlockRoleMenuEditorProps;
  }
}
