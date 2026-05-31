import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VChip,
  VCol,
  VRow,
  VSpacer,
} from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

@Render()
export class RenderPagePaypalCancel extends BeanRenderBase {
  public render() {
    const record = this.$$servicePaypalOrderProcess.record;
    return (
      <ClientOnly>
        <ZPage>
          <div class="text-center">
            <h1 class="text-display-large font-weight-black">{record.options.brandName}</h1>
          </div>
          <VRow>
            <VCol cols={12} md={6} lg={6} offsetMd={3} offsetLg={3}>
              {this._renderDetails()}
            </VCol>
          </VRow>
        </ZPage>
      </ClientOnly>
    );
  }

  private _renderDetails() {
    const { record, step, processing, processingError, timerCount } =
      this.$$servicePaypalOrderProcess;
    return (
      <VCard variant="outlined" class="mx-auto">
        <VCardTitle class="mt-2 mb-1">{record.payload.remark}</VCardTitle>
        {step === 1 && <VCardText>{this.scope.locale.PaypalCancelledTip()}</VCardText>}
        <VCardActions class="mt-2">
          <VSpacer></VSpacer>
          {step === 0 && processing && (
            <VChip class="ml-3" variant="tonal" color="cyan" label>
              {this.scope.locale.OrderCancelling()}
            </VChip>
          )}
          {step === 0 && processingError && (
            <VBtn
              nativeOnClick={() => {
                this.onClickProcessOrder();
              }}
            >
              {this.scope.locale.TryAgain()}
            </VBtn>
          )}
          {step === 1 && (
            <VBtn
              nativeOnClick={() => {
                this.onClickRedirect();
              }}
            >
              {this.scope.locale.RedirectCountDown(timerCount)}
            </VBtn>
          )}
        </VCardActions>
      </VCard>
    );
  }
}
