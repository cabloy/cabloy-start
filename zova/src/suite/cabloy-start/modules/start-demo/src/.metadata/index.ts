// eslint-disable
/** controller: begin */
export * from '../page/appModal/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-demo' {
  
        export interface ControllerPageAppModal {
          /** @internal */
          get scope(): ScopeModuleStartDemo;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerPageAppModal } from '../page/appModal/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-demo.controller.pageAppModal': ControllerPageAppModal;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/appModal.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/start/demo/appModal': TypePagePathSchema<undefined,undefined>;
}
export interface IPageNameRecord {
  
}
}
export const pagePathSchemas = {

};
export const pageNameSchemas = {

};
declare module 'zova-module-start-demo' {
  
}
/** pages: end */

/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartDemo extends BeanScopeBase {}

export interface ScopeModuleStartDemo {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-demo': ScopeModuleStartDemo;
  }
  
  

  

  
}

/** scope: end */
