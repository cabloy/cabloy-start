// eslint-disable
/** controller: begin */
export * from '../component/card/controller.tsx';
export * from '../page/component/controller.tsx';
export * from '../page/state/controller.tsx';
export * from '../page/style/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-demo-basic' {

        export interface ControllerCard {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerPageComponent {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerPageState {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerPageStyle {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerCard } from '../component/card/controller.tsx';
import type { ControllerPageComponent } from '../page/component/controller.tsx';
import type { ControllerPageState } from '../page/state/controller.tsx';
import type { ControllerPageStyle } from '../page/style/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'demo-basic.controller.card': ControllerCard;
'demo-basic.controller.pageComponent': ControllerPageComponent;
'demo-basic.controller.pageState': ControllerPageState;
'demo-basic.controller.pageStyle': ControllerPageStyle;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/component.ts';
export * from './page/state.ts';
export * from './page/style.ts';
export * from '../routes.ts';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/demo/basic/component': TypePagePathSchema<undefined,undefined>;
'/demo/basic/state': TypePagePathSchema<undefined,undefined>;
'/demo/basic/style': TypePagePathSchema<undefined,undefined>;
}
export interface IPageNameRecord {

}
}
export const pagePathSchemas = {

};
export const pageNameSchemas = {

};
declare module 'zova-module-demo-basic' {

}
/** pages: end */

/** components: begin */
export * from './component/card.ts';
import { ZCard } from './component/card.ts';
export const components = {
  'card': ZCard,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'demo-basic:card': ControllerCard;
}
export interface IZovaComponentRecord {
  'demo-basic:card': typeof ZCard;
}
}
/** components: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleDemoBasic extends BeanScopeBase {}

export interface ScopeModuleDemoBasic {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'demo-basic': ScopeModuleDemoBasic;
  }






}

/** scope: end */
