import type { IComponentOptions } from 'zova';

import { VBtn } from 'vuetify/components';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

import type { IBehaviorOptionsPerform } from '../../bean/behavior.perform.js';

export interface ControllerButtonProps extends Omit<VBtn['$props'], ''> {
  onPerform?: (e: MouseEvent) => Promise<void> | void;
}

@Controller()
export class ControllerButton extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false };

  protected async __init__() {}

  protected render() {
    const { loading, onPerform, ...props } = this.$props as ControllerButtonProps;
    const behaviorPerformOptions: IBehaviorOptionsPerform = {
      isLoading: loading,
      onPerform,
    };
    return (
      <VBtn {...props} bs-start-button-perform={behaviorPerformOptions}>
        {this.$slotDefault?.()}
      </VBtn>
    );
  }
}
