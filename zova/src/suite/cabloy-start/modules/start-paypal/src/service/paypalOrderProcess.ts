import { BeanBase } from 'zova';
import { Service } from 'zova-module-a-bean';

import { ApiApiPaypalgetRecordResponseBody } from '../api/paypal.js';

@Service()
export class ServicePaypalOrderProcess extends BeanBase {
  step: number = 0;
  processing: boolean = false;
  processingError: boolean = false;
  record: ApiApiPaypalgetRecordResponseBody;
  timerId: number = 0;
  timerCount: number = 10;
  onProcessOrder: Function;

  protected __dispose__() {
    this.stopCountDown();
  }

  public async initialize(recordId: string, onProcessOrder: Function) {
    this.onProcessOrder = onProcessOrder;
    this.record = await this.scope.api.paypal.getRecord({ params: { recordId } });
  }

  async processOrder() {
    this.processing = true;
    this.processingError = false;
    try {
      await this.onProcessOrder();
      this.processing = false;
      this.processingError = false;
      this.step = 1;
      this.startCountDown();
    } catch (_err) {
      this.processing = false;
      this.processingError = true;
    }
  }

  redirect() {
    this.stopCountDown();
    // returnTo
    const returnTo = this.record.options.returnTo;
    this.app.$gotoReturnTo(returnTo);
  }

  startCountDown() {
    this.stopCountDown();
    this.timerId = window.setInterval(() => {
      if (--this.timerCount === 0) {
        this.redirect();
      }
    }, 1000);
  }

  stopCountDown() {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = 0;
    }
  }
}
