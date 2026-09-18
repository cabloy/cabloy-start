import type { IComponentOptions } from 'zova';

import { VBtn } from 'vuetify/components';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

import type { IBehaviorOptionsPerform, TypeBehaviorOnError } from '../../bean/behavior.perform.js';

export interface ControllerButtonProps extends Omit<VBtn['$props'], 'onError'> {
  onPerform?: (e: MouseEvent) => Promise<void> | void;
  onError?: TypeBehaviorOnError;
}

@Controller()
export class ControllerButton extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false };

  protected async __init__() {}

  protected render() {
    const { loading, onError, onPerform, ...props } = this.$props as ControllerButtonProps;
    const behaviorPerformOptions: IBehaviorOptionsPerform = {
      isLoading: loading,
      onError,
      onPerform,
    };
    if (this.$slotDefault) {
      return (
        <VBtn {...props} bs-start-button-perform={behaviorPerformOptions}>
          {this.$slotDefault()}
        </VBtn>
      );
    }
    return <VBtn {...props} bs-start-button-perform={behaviorPerformOptions}></VBtn>;
  }
}
