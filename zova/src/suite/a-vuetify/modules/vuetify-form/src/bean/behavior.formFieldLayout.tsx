import type { VNode } from 'vue';
import type { IDecoratorBehaviorOptions, NextBehavior } from 'zova-module-a-behavior';

import { classes } from 'typestyle';
import { BeanBehaviorBase, Behavior } from 'zova-module-a-behavior';
import { IFormFieldRenderContext } from 'zova-module-a-form';
import { IIconRecord } from 'zova-module-a-icon';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldLayoutOptions extends IBehaviorResourceFormFieldLayoutOptions {}
}

export interface IBehaviorResourceFormFieldLayoutOptions {
  label?: string | false;
  inline?: boolean;
  iconPrefix?: keyof IIconRecord;
  iconSuffix?: keyof IIconRecord;
}

export interface IBehaviorPropsInputFormFieldLayout extends IFormFieldRenderContext {}

export interface IBehaviorPropsOutputFormFieldLayout extends IBehaviorPropsInputFormFieldLayout {}

export interface IBehaviorOptionsFormFieldLayout extends IDecoratorBehaviorOptions {}

@Behavior<IBehaviorOptionsFormFieldLayout>()
export class BehaviorFormFieldLayout extends BeanBehaviorBase<
  IBehaviorOptionsFormFieldLayout,
  IBehaviorPropsInputFormFieldLayout,
  IBehaviorPropsOutputFormFieldLayout
> {
  cFieldRequired: string;

  protected async __init__() {
    this.cFieldRequired = this.$style({
      $nest: {
        '.v-field-label::after': {
          'content': '" *"',
          'color': 'rgb(var(--v-theme-error))',
          // @ts-ignore
          '--v-field-label-scale': '1.5em',
          'fontSize': 'var(--v-field-label-scale)',
        },
      },
    });
  }

  protected render(
    renderContext: IFormFieldRenderContext,
    next: NextBehavior<IBehaviorPropsOutputFormFieldLayout>,
  ): VNode {
    const { propsBucket, props } = renderContext;
    if (propsBucket.required) {
      props.class = classes(props.class, this.cFieldRequired);
    }
    return next();
  }
}
