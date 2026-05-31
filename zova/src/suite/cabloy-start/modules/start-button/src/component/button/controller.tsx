import { VBtn } from 'vuetify/components';
import { BeanControllerBase, IComponentOptions } from 'zova';
import { Controller } from 'zova-module-a-bean';

import { IBehaviorOptionsPerform } from '../../bean/behavior.perform.js';

export interface ControllerButtonProps extends Omit<VBtn['$props'], ''> {
  onPerform?: (e: MouseEvent) => Promise<void>;
}

@Controller()
export class ControllerButton extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false };

  protected async __init__() {}

  protected render() {
    const behaviorPerformOptions: IBehaviorOptionsPerform = {
      isLoading: this.$props.loading as boolean,
      onPerform: this.$props.onPerform,
    };
    const props: ControllerButtonProps = {
      ...this.$props,
      loading: undefined,
      onPerform: undefined,
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
