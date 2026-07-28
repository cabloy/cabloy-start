// eslint-disable
/** model: begin */
export * from '../model/metrics.js';
import { IModelOptionsMetrics } from '../model/metrics.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'start-metrics:metrics': IModelOptionsMetrics;
    }

  
}
declare module 'zova-module-start-metrics' {
  
        export interface ModelMetrics {
          /** @internal */
          get scope(): ScopeModuleStartMetrics;
        }

        export interface ModelMetrics {
          get $beanFullName(): 'start-metrics.model.metrics';
          get $onionName(): 'start-metrics:metrics';
          get $onionOptions(): IModelOptionsMetrics;
        } 
}
/** model: end */
/** model: begin */
import { ModelMetrics } from '../model/metrics.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-metrics.model.metrics': ModelMetrics;
  }
}
/** model: end */
/** api: begin */
export * from '../api/startMetrics.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-metrics' {
  
        export interface ApiStartMetrics {
          /** @internal */
          get scope(): ScopeModuleStartMetrics;
        }

        export interface ApiStartMetrics {
          get $beanFullName(): 'start-metrics.api.startMetrics';
          get $onionName(): 'start-metrics:startMetrics';
          
        } 
}
/** api: end */
/** api: begin */
import { ApiStartMetrics } from '../api/startMetrics.js';
export interface IModuleApi {
  'startMetrics': ApiStartMetrics;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-metrics.api.startMetrics': ApiStartMetrics;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/startMetrics.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-metrics' {
  
        export interface ApiSchemaStartMetrics {
          /** @internal */
          get scope(): ScopeModuleStartMetrics;
        }

        export interface ApiSchemaStartMetrics {
          get $beanFullName(): 'start-metrics.apiSchema.startMetrics';
          get $onionName(): 'start-metrics:startMetrics';
          
        } 
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaStartMetrics } from '../apiSchema/startMetrics.js';
export interface IModuleApiSchema {
  'startMetrics': ApiSchemaStartMetrics;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-metrics.apiSchema.startMetrics': ApiSchemaStartMetrics;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../page/dashboard/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-metrics' {
  
        export interface ControllerPageDashboard {
          /** @internal */
          get scope(): ScopeModuleStartMetrics;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerPageDashboard } from '../page/dashboard/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-metrics.controller.pageDashboard': ControllerPageDashboard;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/dashboard.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/start/metrics/dashboard': TypePagePathSchema<undefined,undefined>;
}
export interface IPageNameRecord {
  
}
}
export const pagePathSchemas = {

};
export const pageNameSchemas = {

};
declare module 'zova-module-start-metrics' {
  
}
/** pages: end */

/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartMetrics extends BeanScopeBase {}

export interface ScopeModuleStartMetrics {
  util: BeanScopeUtil;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-metrics': ScopeModuleStartMetrics;
  }
  
  

  

  
}

/** scope: end */
