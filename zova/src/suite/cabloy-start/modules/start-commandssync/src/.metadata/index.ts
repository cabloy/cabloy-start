// eslint-disable
/** command: begin */
export * from '../bean/command.expr.jsx';
export * from '../bean/command.log.jsx';
import { ICommandOptionsExpr } from '../bean/command.expr.jsx';
import { ICommandOptionsLog } from '../bean/command.log.jsx';
import 'zova-module-a-command';
declare module 'zova-module-a-command' {
  
    export interface ICommandRecord {
      'start-commandssync:expr': ICommandOptionsExpr;
'start-commandssync:log': ICommandOptionsLog;
    }

  
}
declare module 'zova-module-start-commandssync' {
  
        export interface CommandExpr {
          /** @internal */
          get scope(): ScopeModuleStartCommandssync;
        }

        export interface CommandExpr {
          get $beanFullName(): 'start-commandssync.command.expr';
          get $onionName(): 'start-commandssync:expr';
          get $onionOptions(): ICommandOptionsExpr;
        }

        export interface CommandLog {
          /** @internal */
          get scope(): ScopeModuleStartCommandssync;
        }

        export interface CommandLog {
          get $beanFullName(): 'start-commandssync.command.log';
          get $onionName(): 'start-commandssync:log';
          get $onionOptions(): ICommandOptionsLog;
        } 
}
/** command: end */
/** command: begin */
import { CommandExpr } from '../bean/command.expr.jsx';
import { CommandLog } from '../bean/command.log.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-commandssync.command.expr': CommandExpr;
'start-commandssync.command.log': CommandLog;
  }
}
/** command: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartCommandssync extends BeanScopeBase {}

export interface ScopeModuleStartCommandssync {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-commandssync': ScopeModuleStartCommandssync;
  }
  
  

  

  
}

/** scope: end */
