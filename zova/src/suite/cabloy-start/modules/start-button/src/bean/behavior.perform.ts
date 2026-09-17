import type { VNode } from 'vue';
import type { IDecoratorBehaviorOptions, NextBehavior } from 'zova-module-a-behavior';

import { isNavigationFailure } from '@cabloy/vue-router';
import { BeanBehaviorBase, Behavior } from 'zova-module-a-behavior';

export interface IBehaviorPropsInputPerform {
  'disabled'?: boolean | '' | 'true' | 'false';
  'loading'?: boolean | string;
  'onClick'?: (e: MouseEvent) => unknown;
  'nativeOnClick'?: (e: MouseEvent) => unknown;
  ['aria-busy']?: boolean | 'true' | 'false';
}

export interface IBehaviorPropsOutputPerform extends IBehaviorPropsInputPerform {
  disabled?: boolean;
  onClick?: (e: MouseEvent) => unknown;
  nativeOnClick?: (e: MouseEvent) => unknown;
}

export interface IBehaviorOptionsPerform extends IDecoratorBehaviorOptions {
  isLoading?: boolean | string;
  onPerform?: (e: MouseEvent) => Promise<void> | void;
}

@Behavior<IBehaviorOptionsPerform>()
export class BehaviorPerform extends BeanBehaviorBase<
  IBehaviorOptionsPerform,
  IBehaviorPropsInputPerform,
  IBehaviorPropsOutputPerform
> {
  private _isLoading = false;

  protected render(
    props: IBehaviorPropsInputPerform,
    next: NextBehavior<IBehaviorPropsOutputPerform>,
  ): VNode {
    const isLoading = this._isLoading || Boolean(this.$options.isLoading);
    const propsPatch: IBehaviorPropsOutputPerform = {
      ...props,
      'loading': this._isLoading ? true : this.$options.isLoading,
      'disabled':
        props.disabled === true || props.disabled === '' || props.disabled === 'true' || isLoading,
      'aria-busy': isLoading || props['aria-busy'],
    };
    if (this.$$behaviorTag.name) {
      propsPatch.onClick = e => this._handleClick(e, props.onClick);
    } else {
      propsPatch.nativeOnClick = e => this._handleClick(e, props.nativeOnClick);
    }
    return next(propsPatch);
  }

  private _handleClick(e: MouseEvent, onClick?: (e: MouseEvent) => unknown) {
    if (this._isLoading || Boolean(this.$options.isLoading)) return;
    return this._perform(e, onClick);
  }

  private async _perform(e: MouseEvent, onClick?: (e: MouseEvent) => unknown) {
    try {
      this._isLoading = true;
      await onClick?.(e);
      await this.$options.onPerform?.(e);
    } catch (error) {
      if (isActionControlFlowError(error)) throw error;
      await this.$performCommand('start-commands:alert', {
        type: 'error',
        text: getActionErrorMessage(error),
      });
    } finally {
      this._isLoading = false;
    }
  }
}

export function isActionControlFlowError(error: unknown) {
  return isNavigationFailure(error) || [301, 302, 401, 600].includes(Number((error as any)?.code));
}

export function getActionErrorMessage(error: unknown) {
  if (error && (typeof error === 'object' || typeof error === 'function')) {
    const message = (error as { message?: unknown }).message;
    if (message !== undefined && message !== null) return String(message);
  }
  return String(error);
}
