// eslint-disable
/** service: begin */
export * from '../service/appModal.js';

import 'zova-module-a-bean';
declare module 'zova-module-a-bean' {

    export interface IServiceRecord {
      'start-app:appModal': never;
    }


}
declare module 'zova-module-start-app' {

        export interface ServiceAppModal {
          /** @internal */
          get scope(): ScopeModuleStartApp;
        }

        export interface ServiceAppModal {
          get $beanFullName(): 'start-app.service.appModal';
          get $onionName(): 'start-app:appModal';

        }
}
/** service: end */
/** service: begin */
import type { ServiceAppModal } from '../service/appModal.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-app.service.appModal': ServiceAppModal;
  }
}
/** service: end */
/** controller: begin */
export * from '../component/routedDialog/controller.jsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-app' {

        export interface ControllerRoutedDialog {
          /** @internal */
          get scope(): ScopeModuleStartApp;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerRoutedDialog } from '../component/routedDialog/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-app.controller.routedDialog': ControllerRoutedDialog;
  }
}
/** controller: end */

/** components: begin */
export * from './component/routedDialog.js';
import { ZRoutedDialog } from './component/routedDialog.js';
export const components = {
  'routedDialog': ZRoutedDialog,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-app:routedDialog': ControllerRoutedDialog;
}
export interface IZovaComponentRecord {
  'start-app:routedDialog': typeof ZRoutedDialog;
}
}
/** components: end */
/** behavior: begin */
export * from '../bean/behavior.appModal.jsx';
export * from '../bean/behavior.overlay.jsx';
import { IBehaviorOptionsAppModal } from '../bean/behavior.appModal.jsx';
import { IBehaviorOptionsOverlay } from '../bean/behavior.overlay.jsx';
import 'zova-module-a-behavior';
declare module 'zova-module-a-behavior' {

    export interface IBehaviorRecord {
      'start-app:appModal': IBehaviorOptionsAppModal;
'start-app:overlay': IBehaviorOptionsOverlay;
    }


}
declare module 'zova-module-start-app' {

        export interface BehaviorAppModal {
          /** @internal */
          get scope(): ScopeModuleStartApp;
        }

        export interface BehaviorAppModal {
          get $beanFullName(): 'start-app.behavior.appModal';
          get $onionName(): 'start-app:appModal';
          get $onionOptions(): IBehaviorOptionsAppModal;
        }

        export interface BehaviorOverlay {
          /** @internal */
          get scope(): ScopeModuleStartApp;
        }

        export interface BehaviorOverlay {
          get $beanFullName(): 'start-app.behavior.overlay';
          get $onionName(): 'start-app:overlay';
          get $onionOptions(): IBehaviorOptionsOverlay;
        }
}
/** behavior: end */
/** behavior: begin */
import type { BehaviorAppModal } from '../bean/behavior.appModal.jsx';
import type { BehaviorOverlay } from '../bean/behavior.overlay.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-app.behavior.appModal': BehaviorAppModal;
'start-app.behavior.overlay': BehaviorOverlay;
  }
}
/** behavior: end */
/** behaviors: begin */
import 'vue';
import 'vue/jsx-runtime';

declare module 'vue' {
  export interface InputHTMLAttributes {
    'bs-start-app-appModal'?: IBehaviorOptionsAppModal | '' | boolean;
'bs-start-app-overlay'?: IBehaviorOptionsOverlay | '' | boolean;
  }
}

declare module 'vue/jsx-runtime' {
  namespace JSX {
    // need define class/style in IntrinsicAttributes
    export interface IntrinsicAttributes {
      'bs-start-app-appModal'?: IBehaviorOptionsAppModal | '' | boolean;
'bs-start-app-overlay'?: IBehaviorOptionsOverlay | '' | boolean;
    }
  }
}
/** behaviors: end */
/** config: begin */
export * from '../config/config.js';
import { config } from '../config/config.js';
/** config: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** monkey: begin */
export * from '../monkey.js';
/** monkey: end */
/** monkeySys: begin */
export * from '../monkeySys.js';
/** monkeySys: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartApp extends BeanScopeBase {}

export interface ScopeModuleStartApp {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-app': ScopeModuleStartApp;
  }

  export interface IBeanScopeConfig {
    'start-app': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'start-app': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `start-app::${K}` {
  return `start-app::${key}`;
}
/** scope: end */
