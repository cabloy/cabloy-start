import type {
  ICommandExecute,
  ICommandOptionsBase,
  NextCommandExecute,
} from 'zova-module-a-command';
import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import { VDialog } from 'vuetify/components';
import { BeanBase } from 'zova';
import { Command } from 'zova-module-a-command';
import { IModalPromptOptions } from 'zova-module-start-app';

export type TypeCommandPromptResult = unknown;

export interface ICommandOptionsPrompt
  extends ICommandOptionsBase<TypeCommandPromptResult>, IModalPromptOptions {
  dialogOptions?: VDialog['$props'];
}

@Command<ICommandOptionsPrompt>()
export class CommandPrompt extends BeanBase implements ICommandExecute {
  async execute(
    options: ICommandOptionsPrompt,
    renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    const { $host } = renderContext;
    const res = await $host.$appModal.prompt(options, options.dialogOptions);
    return next(res);
  }
}
