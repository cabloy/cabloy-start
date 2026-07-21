// eslint-disable
/** command: begin */
export * from '../bean/command.alert.jsx';
export * from '../bean/command.confirm.jsx';
export * from '../bean/command.copy.jsx';
export * from '../bean/command.create.jsx';
export * from '../bean/command.delete.jsx';
export * from '../bean/command.edit.jsx';
export * from '../bean/command.prompt.jsx';
export * from '../bean/command.setValue.jsx';
export * from '../bean/command.view.jsx';
import { ICommandOptionsAlert } from '../bean/command.alert.jsx';
import { ICommandOptionsConfirm } from '../bean/command.confirm.jsx';
import { ICommandOptionsCopy } from '../bean/command.copy.jsx';
import { ICommandOptionsCreate } from '../bean/command.create.jsx';
import { ICommandOptionsDelete } from '../bean/command.delete.jsx';
import { ICommandOptionsEdit } from '../bean/command.edit.jsx';
import { ICommandOptionsPrompt } from '../bean/command.prompt.jsx';
import { ICommandOptionsSetValue } from '../bean/command.setValue.jsx';
import { ICommandOptionsView } from '../bean/command.view.jsx';
import 'zova-module-a-command';
declare module 'zova-module-a-command' {
  
    export interface ICommandRecord {
      'start-commands:alert': ICommandOptionsAlert;
'start-commands:confirm': ICommandOptionsConfirm;
'start-commands:copy': ICommandOptionsCopy;
'start-commands:create': ICommandOptionsCreate;
'start-commands:delete': ICommandOptionsDelete;
'start-commands:edit': ICommandOptionsEdit;
'start-commands:prompt': ICommandOptionsPrompt;
'start-commands:setValue': ICommandOptionsSetValue;
'start-commands:view': ICommandOptionsView;
    }

  
}
declare module 'zova-module-start-commands' {
  
        export interface CommandAlert {
          /** @internal */
          get scope(): ScopeModuleStartCommands;
        }

        export interface CommandAlert {
          get $beanFullName(): 'start-commands.command.alert';
          get $onionName(): 'start-commands:alert';
          get $onionOptions(): ICommandOptionsAlert;
        }

        export interface CommandConfirm {
          /** @internal */
          get scope(): ScopeModuleStartCommands;
        }

        export interface CommandConfirm {
          get $beanFullName(): 'start-commands.command.confirm';
          get $onionName(): 'start-commands:confirm';
          get $onionOptions(): ICommandOptionsConfirm;
        }

        export interface CommandCopy {
          /** @internal */
          get scope(): ScopeModuleStartCommands;
        }

        export interface CommandCopy {
          get $beanFullName(): 'start-commands.command.copy';
          get $onionName(): 'start-commands:copy';
          get $onionOptions(): ICommandOptionsCopy;
        }

        export interface CommandCreate {
          /** @internal */
          get scope(): ScopeModuleStartCommands;
        }

        export interface CommandCreate {
          get $beanFullName(): 'start-commands.command.create';
          get $onionName(): 'start-commands:create';
          get $onionOptions(): ICommandOptionsCreate;
        }

        export interface CommandDelete {
          /** @internal */
          get scope(): ScopeModuleStartCommands;
        }

        export interface CommandDelete {
          get $beanFullName(): 'start-commands.command.delete';
          get $onionName(): 'start-commands:delete';
          get $onionOptions(): ICommandOptionsDelete;
        }

        export interface CommandEdit {
          /** @internal */
          get scope(): ScopeModuleStartCommands;
        }

        export interface CommandEdit {
          get $beanFullName(): 'start-commands.command.edit';
          get $onionName(): 'start-commands:edit';
          get $onionOptions(): ICommandOptionsEdit;
        }

        export interface CommandPrompt {
          /** @internal */
          get scope(): ScopeModuleStartCommands;
        }

        export interface CommandPrompt {
          get $beanFullName(): 'start-commands.command.prompt';
          get $onionName(): 'start-commands:prompt';
          get $onionOptions(): ICommandOptionsPrompt;
        }

        export interface CommandSetValue {
          /** @internal */
          get scope(): ScopeModuleStartCommands;
        }

        export interface CommandSetValue {
          get $beanFullName(): 'start-commands.command.setValue';
          get $onionName(): 'start-commands:setValue';
          get $onionOptions(): ICommandOptionsSetValue;
        }

        export interface CommandView {
          /** @internal */
          get scope(): ScopeModuleStartCommands;
        }

        export interface CommandView {
          get $beanFullName(): 'start-commands.command.view';
          get $onionName(): 'start-commands:view';
          get $onionOptions(): ICommandOptionsView;
        } 
}
/** command: end */
/** command: begin */
import { CommandAlert } from '../bean/command.alert.jsx';
import { CommandConfirm } from '../bean/command.confirm.jsx';
import { CommandCopy } from '../bean/command.copy.jsx';
import { CommandCreate } from '../bean/command.create.jsx';
import { CommandDelete } from '../bean/command.delete.jsx';
import { CommandEdit } from '../bean/command.edit.jsx';
import { CommandPrompt } from '../bean/command.prompt.jsx';
import { CommandSetValue } from '../bean/command.setValue.jsx';
import { CommandView } from '../bean/command.view.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'start-commands.command.alert': CommandAlert;
'start-commands.command.confirm': CommandConfirm;
'start-commands.command.copy': CommandCopy;
'start-commands.command.create': CommandCreate;
'start-commands.command.delete': CommandDelete;
'start-commands.command.edit': CommandEdit;
'start-commands.command.prompt': CommandPrompt;
'start-commands.command.setValue': CommandSetValue;
'start-commands.command.view': CommandView;
  }
}
/** command: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartCommands extends BeanScopeBase {}

export interface ScopeModuleStartCommands {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-commands': ScopeModuleStartCommands;
  }
  
  

  

  
}

/** scope: end */
