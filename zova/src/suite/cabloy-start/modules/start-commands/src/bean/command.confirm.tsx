import type {
  ICommandExecute,
  ICommandOptionsBase,
  NextCommandExecute,
} from 'zova-module-a-command';
import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import { VDialog } from 'vuetify/components';
import { BeanBase } from 'zova';
import { Command } from 'zova-module-a-command';
import { IModalConfirmOptions } from 'zova-module-start-app';

export type TypeCommandConfirmResult = unknown;

export interface ICommandOptionsConfirm
  extends ICommandOptionsBase<TypeCommandConfirmResult>, IModalConfirmOptions {
  dialogOptions?: VDialog['$props'];
}

@Command<ICommandOptionsConfirm>()
export class CommandConfirm extends BeanBase implements ICommandExecute {
  async execute(
    options: ICommandOptionsConfirm,
    renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    const { $host } = renderContext;
    const res = await $host.$appModal.confirm(options, options.dialogOptions);
    return next(res);
  }
}
