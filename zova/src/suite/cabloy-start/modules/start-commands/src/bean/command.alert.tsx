import type {
  ICommandExecute,
  ICommandOptionsBase,
  NextCommandExecute,
} from 'zova-module-a-command';
import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import { VDialog } from 'vuetify/components';
import { BeanBase } from 'zova';
import { Command } from 'zova-module-a-command';
import { IModalAlertOptions } from 'zova-module-start-app';

export type TypeCommandAlertResult = unknown;

export interface ICommandOptionsAlert
  extends ICommandOptionsBase<TypeCommandAlertResult>, IModalAlertOptions {
  dialogOptions?: VDialog['$props'];
}

@Command<ICommandOptionsAlert>()
export class CommandAlert extends BeanBase implements ICommandExecute {
  execute(
    options: ICommandOptionsAlert,
    renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    const { $host } = renderContext;
    $host.$appModal.alert(options, options.dialogOptions);
    return next();
  }
}
