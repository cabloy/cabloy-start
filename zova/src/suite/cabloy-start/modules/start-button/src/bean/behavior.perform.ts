import type { VNode } from 'vue';
import type { IDecoratorBehaviorOptions, NextBehavior } from 'zova-module-a-behavior';

import { BeanBehaviorBase, Behavior } from 'zova-module-a-behavior';

export interface IBehaviorPropsInputPerform {}

export interface IBehaviorPropsOutputPerform extends IBehaviorPropsInputPerform {
  loading?: boolean;
  onClick?: (e: MouseEvent) => void;
  nativeOnClick?: (e: MouseEvent) => void;
}

export interface IBehaviorOptionsPerform extends IDecoratorBehaviorOptions {
  isLoading?: boolean;
  onPerform?: (e: MouseEvent) => Promise<void>;
}

@Behavior<IBehaviorOptionsPerform>()
export class BehaviorPerform extends BeanBehaviorBase<
  IBehaviorOptionsPerform,
  IBehaviorPropsInputPerform,
  IBehaviorPropsOutputPerform
> {
  private _isLoading: boolean = false;

  protected render(
    props: IBehaviorPropsInputPerform,
    next: NextBehavior<IBehaviorPropsOutputPerform>,
  ): VNode {
    const propsPatch: IBehaviorPropsOutputPerform = { ...props };
    // loading
    propsPatch.loading = this.$options.isLoading || this._isLoading;
    // click
    if (this.$$behaviorTag.name) {
      // native element
      propsPatch.onClick = e => {
        this._handleClick(e);
      };
    } else {
      // vue element
      propsPatch.nativeOnClick = e => {
        this._handleClick(e);
      };
    }
    return next(propsPatch);
  }

  private async _handleClick(e: MouseEvent) {
    if (this._isLoading) return;
    try {
      this._isLoading = true;
      await this.$options.onPerform?.(e);
    } catch (err: any) {
      if (err.code === 401) throw err;
      this.$performCommand('start-commands:alert', { type: 'error', text: err.message });
    } finally {
      this._isLoading = false;
    }
  }
}
