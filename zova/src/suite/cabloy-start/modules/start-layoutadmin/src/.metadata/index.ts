// eslint-disable
/** aop: begin */
export * from '../bean/aop.layoutTabs.jsx';

import { IDecoratorAopOptions } from 'zova-module-a-bean';
declare module 'zova-module-a-bean' {
  
    export interface IAopRecord {
      'start-layoutadmin:layoutTabs': IDecoratorAopOptions;
    }

  
}
declare module 'zova-module-start-layoutadmin' {
  
        export interface AopLayoutTabs {
          /** @internal */
          get scope(): ScopeModuleStartLayoutadmin;
        }

        export interface AopLayoutTabs {
          get $beanFullName(): 'start-layoutadmin.aop.layoutTabs';
          get $onionName(): 'start-layoutadmin:layoutTabs';
          get $onionOptions(): IDecoratorAopOptions;
        } 
}
/** aop: end */
/** aop: begin */
import { AopLayoutTabs } from '../bean/aop.layoutTabs.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-layoutadmin.aop.layoutTabs': AopLayoutTabs;
  }
}
/** aop: end */
/** config: begin */
export * from '../config/config.js';
import { config } from '../config/config.js';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartLayoutadmin extends BeanScopeBase {}

export interface ScopeModuleStartLayoutadmin {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-layoutadmin': ScopeModuleStartLayoutadmin;
  }
  
  export interface IBeanScopeConfig {
    'start-layoutadmin': ReturnType<typeof config>;
  }

  

  
}
  
/** scope: end */
