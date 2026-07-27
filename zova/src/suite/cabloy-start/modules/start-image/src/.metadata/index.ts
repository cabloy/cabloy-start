// eslint-disable
/** model: begin */
export * from '../model/image.js';
import { IModelOptionsImage } from '../model/image.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'start-image:image': IModelOptionsImage;
    }

  
}
declare module 'zova-module-start-image' {
  
        export interface ModelImage {
          /** @internal */
          get scope(): ScopeModuleStartImage;
        }

        export interface ModelImage {
          get $beanFullName(): 'start-image.model.image';
          get $onionName(): 'start-image:image';
          get $onionOptions(): IModelOptionsImage;
        } 
}
/** model: end */
/** model: begin */
import { ModelImage } from '../model/image.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-image.model.image': ModelImage;
  }
}
/** model: end */
/** api: begin */
export * from '../api/image.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-image' {
  
        export interface ApiImage {
          /** @internal */
          get scope(): ScopeModuleStartImage;
        }

        export interface ApiImage {
          get $beanFullName(): 'start-image.api.image';
          get $onionName(): 'start-image:image';
          
        } 
}
/** api: end */
/** api: begin */
import { ApiImage } from '../api/image.js';
export interface IModuleApi {
  'image': ApiImage;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-image.api.image': ApiImage;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/image.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-image' {
  
        export interface ApiSchemaImage {
          /** @internal */
          get scope(): ScopeModuleStartImage;
        }

        export interface ApiSchemaImage {
          get $beanFullName(): 'start-image.apiSchema.image';
          get $onionName(): 'start-image:image';
          
        } 
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaImage } from '../apiSchema/image.js';
export interface IModuleApiSchema {
  'image': ApiSchemaImage;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-image.apiSchema.image': ApiSchemaImage;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../component/formFieldImage/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-start-image' {
  
        export interface ControllerFormFieldImage {
          /** @internal */
          get scope(): ScopeModuleStartImage;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldImage } from '../component/formFieldImage/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-image.controller.formFieldImage': ControllerFormFieldImage;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldImage.js';
import { ZFormFieldImage } from './component/formFieldImage.js';
export const components = {
  'formFieldImage': ZFormFieldImage,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-image:formFieldImage': ControllerFormFieldImage;
}
export interface IZovaComponentRecord {
  'start-image:formFieldImage': typeof ZFormFieldImage;
}
}
/** components: end */
/** tableCell: begin */
export * from '../bean/tableCell.image.jsx';
import { ITableCellOptionsImage } from '../bean/tableCell.image.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'start-image:image': ITableCellOptionsImage;
    }

  
}
declare module 'zova-module-start-image' {
  
        export interface TableCellImage {
          /** @internal */
          get scope(): ScopeModuleStartImage;
        }

        export interface TableCellImage {
          get $beanFullName(): 'start-image.tableCell.image';
          get $onionName(): 'start-image:image';
          get $onionOptions(): ITableCellOptionsImage;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellImage } from '../bean/tableCell.image.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-image.tableCell.image': TableCellImage;
  }
}
/** tableCell: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartImage extends BeanScopeBase {}

export interface ScopeModuleStartImage {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-image': ScopeModuleStartImage;
  }
  
  

  export interface IBeanScopeLocale {
    'start-image': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `start-image::${K}` {
  return `start-image::${key}`;
}
/** scope: end */
