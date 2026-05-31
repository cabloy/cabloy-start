import type { VNode } from 'vue';
import type { IDecoratorBehaviorOptions, NextBehavior } from 'zova-module-a-behavior';

import { VCol } from 'vuetify/components';
import { BeanBehaviorBase, Behavior } from 'zova-module-a-behavior';
import { IFormFieldRenderContext } from 'zova-module-a-form';

export interface IBehaviorPropsInputFormFieldLayoutCol extends IFormFieldRenderContext {}

export interface IBehaviorPropsOutputFormFieldLayoutCol extends IBehaviorPropsInputFormFieldLayoutCol {}

export interface IBehaviorOptionsFormFieldLayoutCol extends IDecoratorBehaviorOptions {}

@Behavior<IBehaviorOptionsFormFieldLayoutCol>()
export class BehaviorFormFieldLayoutCol extends BeanBehaviorBase<
  IBehaviorOptionsFormFieldLayoutCol,
  IBehaviorPropsInputFormFieldLayoutCol,
  IBehaviorPropsOutputFormFieldLayoutCol
> {
  protected render(
    _renderContext: IFormFieldRenderContext,
    next: NextBehavior<IBehaviorPropsOutputFormFieldLayoutCol>,
  ): VNode {
    const vnode = next();
    return (
      <VCol cols={12} md={4}>
        {vnode}
      </VCol>
    );
  }
}
