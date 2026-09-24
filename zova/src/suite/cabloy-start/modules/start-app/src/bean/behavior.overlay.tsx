import type { VNode } from 'vue';
import type { IDecoratorBehaviorOptions, NextBehavior } from 'zova-module-a-behavior';

import { VDefaultsProvider } from 'vuetify/components';
import { useTeleport } from 'vuetify/lib/composables/teleport.js';
import { BeanBehaviorBase, Behavior } from 'zova-module-a-behavior';

import { cabloyAdminDefaults } from '../lib/vuetifyDefaults.js';

export interface IBehaviorPropsInputOverlay {}

export interface IBehaviorPropsOutputOverlay extends IBehaviorPropsInputOverlay {}

export interface IBehaviorOptionsOverlay extends IDecoratorBehaviorOptions {}

const classAdmin = 'cabloy-admin';
const overlayContainerOwners = new WeakMap<Element, { count: number; hadClass: boolean }>();

@Behavior<IBehaviorOptionsOverlay>()
export class BehaviorOverlay extends BeanBehaviorBase<
  IBehaviorOptionsOverlay,
  IBehaviorPropsInputOverlay,
  IBehaviorPropsOutputOverlay
> {
  private _overlayContainer?: Element;

  protected __init__() {
    if (this.sys.env.SSR_PROFILE !== 'session') return;
    this.$ssr.handleDirectOrOnHydrated(() => {
      if (this.ctx.disposed) return;
      const { teleportTarget } = useTeleport(() => false);
      const overlayContainer = teleportTarget.value;
      if (!overlayContainer) return;
      const owner = overlayContainerOwners.get(overlayContainer);
      if (owner) {
        owner.count += 1;
      } else {
        overlayContainerOwners.set(overlayContainer, {
          count: 1,
          hadClass: overlayContainer.classList.contains(classAdmin),
        });
        overlayContainer.classList.add(classAdmin);
      }
      this._overlayContainer = overlayContainer;
    });
  }

  protected __dispose__() {
    if (!this._overlayContainer) return;
    const owner = overlayContainerOwners.get(this._overlayContainer);
    if (!owner) return;
    owner.count -= 1;
    if (owner.count === 0) {
      if (!owner.hadClass) this._overlayContainer.classList.remove(classAdmin);
      overlayContainerOwners.delete(this._overlayContainer);
    }
    this._overlayContainer = undefined;
  }

  protected render(
    _props: IBehaviorPropsInputOverlay,
    next: NextBehavior<IBehaviorPropsOutputOverlay>,
  ): VNode {
    const vnodeDefault = next();
    if (this.sys.env.SSR_PROFILE !== 'session') return vnodeDefault;
    return (
      <VDefaultsProvider defaults={cabloyAdminDefaults}>
        <div class={classAdmin}>{vnodeDefault}</div>
      </VDefaultsProvider>
    );
  }
}
