import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

import { ServicePaypalOrderProcess } from '../../service/paypalOrderProcess.js';

export const ControllerPagePaypalCancelSchemaQuery = z.object({
  recordId: z.string(),
});

@Controller()
export class ControllerPagePaypalCancel extends BeanControllerPageBase {
  @Use()
  $$servicePaypalOrderProcess: ServicePaypalOrderProcess;

  protected async __init__() {
    if (process.env.CLIENT) {
      const recordId = this.$query.recordId;
      await this.$$servicePaypalOrderProcess.initialize(recordId, async () => {
        await this.scope.api.paypal.cancelOrder(undefined, { params: { recordId } });
      });
      this.$controllerMounted(() => {
        this.onClickProcessOrder();
      });
    }
  }

  async onClickProcessOrder() {
    await this.$$servicePaypalOrderProcess.processOrder();
  }

  onClickRedirect() {
    this.$$servicePaypalOrderProcess.redirect();
  }
}
