// eslint-disable
/** api: begin */
export * from '../api/paypal.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-paypal' {
  
        export interface ApiPaypal {
          /** @internal */
          get scope(): ScopeModuleStartPaypal;
        }

        export interface ApiPaypal {
          get $beanFullName(): 'start-paypal.api.paypal';
          get $onionName(): 'start-paypal:paypal';
          
        } 
}
/** api: end */
/** api: begin */
import { ApiPaypal } from '../api/paypal.js';
export interface IModuleApi {
  'paypal': ApiPaypal;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-paypal.api.paypal': ApiPaypal;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/paypal.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-paypal' {
  
        export interface ApiSchemaPaypal {
          /** @internal */
          get scope(): ScopeModuleStartPaypal;
        }

        export interface ApiSchemaPaypal {
          get $beanFullName(): 'start-paypal.apiSchema.paypal';
          get $onionName(): 'start-paypal:paypal';
          
        } 
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaPaypal } from '../apiSchema/paypal.js';
export interface IModuleApiSchema {
  'paypal': ApiSchemaPaypal;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-paypal.apiSchema.paypal': ApiSchemaPaypal;
  }
}
/** apiSchema: end */
/** service: begin */
export * from '../service/paypalOrderProcess.js';

import 'zova-module-a-bean';
declare module 'zova-module-a-bean' {
  
    export interface IServiceRecord {
      'start-paypal:paypalOrderProcess': never;
    }

  
}
declare module 'zova-module-start-paypal' {
  
        export interface ServicePaypalOrderProcess {
          /** @internal */
          get scope(): ScopeModuleStartPaypal;
        }

        export interface ServicePaypalOrderProcess {
          get $beanFullName(): 'start-paypal.service.paypalOrderProcess';
          get $onionName(): 'start-paypal:paypalOrderProcess';
          
        } 
}
/** service: end */
/** service: begin */
import { ServicePaypalOrderProcess } from '../service/paypalOrderProcess.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-paypal.service.paypalOrderProcess': ServicePaypalOrderProcess;
  }
}
/** service: end */
/** controller: begin */
export * from '../page/paypalCancel/controller.jsx';
export * from '../page/paypalReturn/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-paypal' {
  
        export interface ControllerPagePaypalCancel {
          /** @internal */
          get scope(): ScopeModuleStartPaypal;
        }

        export interface ControllerPagePaypalReturn {
          /** @internal */
          get scope(): ScopeModuleStartPaypal;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerPagePaypalCancel } from '../page/paypalCancel/controller.jsx';
import { ControllerPagePaypalReturn } from '../page/paypalReturn/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-paypal.controller.pagePaypalCancel': ControllerPagePaypalCancel;
'start-paypal.controller.pagePaypalReturn': ControllerPagePaypalReturn;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/paypalCancel.js';
import { NSControllerPagePaypalCancel } from './page/paypalCancel.js';
export * from './page/paypalReturn.js';
import { NSControllerPagePaypalReturn } from './page/paypalReturn.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/start/paypal/paypalCancel': TypePagePathSchema<undefined,NSControllerPagePaypalCancel.QueryInput>;
'/start/paypal/paypalReturn': TypePagePathSchema<undefined,NSControllerPagePaypalReturn.QueryInput>;
}
export interface IPageNameRecord {
  
}
}
export const pagePathSchemas = {
'/start/paypal/paypalCancel': {
          query: NSControllerPagePaypalCancel.querySchema,
        },
'/start/paypal/paypalReturn': {
          query: NSControllerPagePaypalReturn.querySchema,
        },
};
export const pageNameSchemas = {

};
declare module 'zova-module-start-paypal' {
  export interface ControllerPagePaypalCancel {
        $query: NSControllerPagePaypalCancel.QueryOutput;
      }
export interface ControllerPagePaypalReturn {
        $query: NSControllerPagePaypalReturn.QueryOutput;
      }
}
/** pages: end */

/** render: begin */
export * from '../page/paypalCancel/render.jsx';
export * from '../page/paypalReturn/render.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-paypal' {
  
        export interface RenderPagePaypalCancel {
          /** @internal */
          get scope(): ScopeModuleStartPaypal;
        }

        export interface RenderPagePaypalReturn {
          /** @internal */
          get scope(): ScopeModuleStartPaypal;
        } 
}
/** render: end */
/** render: begin */
import { RenderPagePaypalCancel } from '../page/paypalCancel/render.jsx';
import { RenderPagePaypalReturn } from '../page/paypalReturn/render.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-paypal.render.pagePaypalCancel': RenderPagePaypalCancel;
'start-paypal.render.pagePaypalReturn': RenderPagePaypalReturn;
  }
}
/** render: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartPaypal extends BeanScopeBase {}

export interface ScopeModuleStartPaypal {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-paypal': ScopeModuleStartPaypal;
  }
  
  

  export interface IBeanScopeLocale {
    'start-paypal': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `start-paypal::${K}` {
  return `start-paypal::${key}`;
}  
/** scope: end */
