import { VBtn, VBtnGroup } from 'vuetify/components';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

@Controller()
export class ControllerPageAppModal extends BeanControllerPageBase {
  protected async __init__() {}

  protected render() {
    return <ZPage>{this._renderAppModals()}</ZPage>;
  }

  private _renderAppModals() {
    return (
      <VBtnGroup variant="outlined" divided>
        <VBtn
          nativeOnClick={() => {
            this.$appModal.alert({ type: 'error', text: 'This is a error test' });
          }}
        >
          Alert
        </VBtn>
        <VBtn
          nativeOnClick={async () => {
            // const res = await this.$performCommand('start-commands:confirm', { text: 'Are you sure that you want to delete this one?' });
            const res = await this.$appModal.confirm({
              text: 'Are you sure that you want to delete this one?',
            });
            this.$appModal.alert({ text: String(res) });
          }}
        >
          Confirm
        </VBtn>
        <VBtn
          nativeOnClick={async () => {
            const res = await this.$appModal.prompt({
              text: 'Please input your name',
              defaultValue: 'kevin',
            });
            this.$appModal.alert({ text: String(res) });
          }}
        >
          Prompt
        </VBtn>
      </VBtnGroup>
    );
  }
}
