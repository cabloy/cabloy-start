import { VContainer } from 'vuetify/components';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage, ZSiteEntryTables } from 'zova-module-home-base';

@Controller()
export class ControllerPageDashboard extends BeanControllerPageBase {
  protected render() {
    return (
      <ZPage>
        <VContainer class="py-6" style={{ maxWidth: '1200px' }}>
          <ZSiteEntryTables />
        </VContainer>
      </ZPage>
    );
  }
}
