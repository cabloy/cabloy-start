// eslint-disable
/** controller: begin */
export * from '../page/appModal/controller.tsx';
export * from '../page/routedDialog/controller.tsx';
export * from '../page/routedDialogDetail/controller.tsx';
export * from '../page/routedDialogEntry/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-demo' {

        export interface ControllerPageAppModal {
          /** @internal */
          get scope(): ScopeModuleStartDemo;
        }

        export interface ControllerPageRoutedDialog {
          /** @internal */
          get scope(): ScopeModuleStartDemo;
        }

        export interface ControllerPageRoutedDialogDetail {
          /** @internal */
          get scope(): ScopeModuleStartDemo;
        }

        export interface ControllerPageRoutedDialogEntry {
          /** @internal */
          get scope(): ScopeModuleStartDemo;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerPageAppModal } from '../page/appModal/controller.tsx';
import type { ControllerPageRoutedDialog } from '../page/routedDialog/controller.tsx';
import type { ControllerPageRoutedDialogDetail } from '../page/routedDialogDetail/controller.tsx';
import type { ControllerPageRoutedDialogEntry } from '../page/routedDialogEntry/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-demo.controller.pageAppModal': ControllerPageAppModal;
'start-demo.controller.pageRoutedDialog': ControllerPageRoutedDialog;
'start-demo.controller.pageRoutedDialogDetail': ControllerPageRoutedDialogDetail;
'start-demo.controller.pageRoutedDialogEntry': ControllerPageRoutedDialogEntry;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/appModal.ts';
export * from './page/routedDialog.ts';
export * from './page/routedDialogDetail.ts';
import { NSControllerPageRoutedDialogDetail } from './page/routedDialogDetail.ts';
export * from './page/routedDialogEntry.ts';
import { NSControllerPageRoutedDialogEntry } from './page/routedDialogEntry.ts';
export * from '../routes.ts';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/start/demo/appModal': TypePagePathSchema<undefined,undefined>;
'/start/demo/routedDialog': TypePagePathSchema<undefined,undefined>;
'/start/demo/routedDialogDetail/:id': TypePagePathSchema<NSControllerPageRoutedDialogDetail.ParamsInput,NSControllerPageRoutedDialogDetail.QueryInput>;
'/start/demo/routedDialogEntry': TypePagePathSchema<NSControllerPageRoutedDialogEntry.ParamsInput,NSControllerPageRoutedDialogEntry.QueryInput>;
}
export interface IPageNameRecord {
  'start-demo:routedDialogDetail': TypePagePathSchema<NSControllerPageRoutedDialogDetail.ParamsInput,NSControllerPageRoutedDialogDetail.QueryInput>;
}
}
export const pagePathSchemas = {
'/start/demo/routedDialogEntry': {
          query: NSControllerPageRoutedDialogEntry.querySchema,
        },
};
export const pageNameSchemas = {
'start-demo:routedDialogDetail': {
          params: NSControllerPageRoutedDialogDetail.paramsSchema,
          query: NSControllerPageRoutedDialogDetail.querySchema,
        },
};
declare module 'zova-module-start-demo' {
  export interface ControllerPageRoutedDialogDetail {
        $params: NSControllerPageRoutedDialogDetail.ParamsOutput;
$query: NSControllerPageRoutedDialogDetail.QueryOutput;
      }
export interface ControllerPageRoutedDialogEntry {
        $params: NSControllerPageRoutedDialogEntry.ParamsOutput;
$query: NSControllerPageRoutedDialogEntry.QueryOutput;
      }
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
