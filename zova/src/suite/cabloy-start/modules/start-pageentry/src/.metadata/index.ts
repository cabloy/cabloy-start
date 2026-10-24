// eslint-disable
/** model: begin */
export * from '../model/draft.ts';
import { IModelOptionsDraft } from '../model/draft.ts';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'start-pageentry:draft': IModelOptionsDraft;
    }


}
declare module 'zova-module-start-pageentry' {

        export interface ModelDraft {
          /** @internal */
          get scope(): ScopeModuleStartPageentry;
        }

        export interface ModelDraft {
          get $beanFullName(): 'start-pageentry.model.draft';
          get $onionName(): 'start-pageentry:draft';
          get $onionOptions(): IModelOptionsDraft;
        }
}
/** model: end */
/** model: begin */
import type { ModelDraft } from '../model/draft.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-pageentry.model.draft': ModelDraft;
  }
}
/** model: end */
/** bean: begin */
export * from '../bean/bean.draftCoordinator.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-pageentry' {

        export interface BeanDraftCoordinator {
          /** @internal */
          get scope(): ScopeModuleStartPageentry;
        }

        export interface BeanDraftCoordinator {
          get $beanFullName(): 'start-pageentry.bean.draftCoordinator';
          get $onionName(): 'start-pageentry:draftCoordinator';

        }
}
/** bean: end */
/** bean: begin */
import type { BeanDraftCoordinator } from '../bean/bean.draftCoordinator.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-pageentry.bean.draftCoordinator': BeanDraftCoordinator;
  }
}
/** bean: end */
/** controller: begin */
export * from '../component/blockForm/controller.tsx';
export * from '../component/blockPageEntry/controller.tsx';
export * from '../component/blockToolbarRow/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-pageentry' {

        export interface ControllerBlockForm {
          /** @internal */
          get scope(): ScopeModuleStartPageentry;
        }

        export interface ControllerBlockPageEntry {
          /** @internal */
          get scope(): ScopeModuleStartPageentry;
        }

        export interface ControllerBlockToolbarRow {
          /** @internal */
          get scope(): ScopeModuleStartPageentry;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerBlockForm } from '../component/blockForm/controller.tsx';
import type { ControllerBlockPageEntry } from '../component/blockPageEntry/controller.tsx';
import type { ControllerBlockToolbarRow } from '../component/blockToolbarRow/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-pageentry.controller.blockForm': ControllerBlockForm;
'start-pageentry.controller.blockPageEntry': ControllerBlockPageEntry;
'start-pageentry.controller.blockToolbarRow': ControllerBlockToolbarRow;
  }
}
/** controller: end */

/** components: begin */
export * from './component/blockForm.ts';
import { ZBlockForm } from './component/blockForm.ts';
export * from './component/blockPageEntry.ts';
import { ZBlockPageEntry } from './component/blockPageEntry.ts';
export * from './component/blockToolbarRow.ts';
import { ZBlockToolbarRow } from './component/blockToolbarRow.ts';
export const components = {
  'blockForm': ZBlockForm,
'blockPageEntry': ZBlockPageEntry,
'blockToolbarRow': ZBlockToolbarRow,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-pageentry:blockForm': ControllerBlockForm;
'start-pageentry:blockPageEntry': ControllerBlockPageEntry;
'start-pageentry:blockToolbarRow': ControllerBlockToolbarRow;
}
export interface IZovaComponentRecord {
  'start-pageentry:blockForm': typeof ZBlockForm;
'start-pageentry:blockPageEntry': typeof ZBlockPageEntry;
'start-pageentry:blockToolbarRow': typeof ZBlockToolbarRow;
}
}
/** components: end */
/** config: begin */
export * from '../config/config.ts';
import { config } from '../config/config.ts';
/** config: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** monkey: begin */
export * from '../monkey.ts';
/** monkey: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartPageentry extends BeanScopeBase {}

export interface ScopeModuleStartPageentry {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-pageentry': ScopeModuleStartPageentry;
  }

  export interface IBeanScopeConfig {
    'start-pageentry': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'start-pageentry': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `start-pageentry::${K}` {
  return `start-pageentry::${key}`;
}
/** scope: end */
