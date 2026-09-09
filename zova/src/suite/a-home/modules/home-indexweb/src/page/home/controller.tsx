import { VContainer } from 'vuetify/components';
import { z } from 'zod';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage, ZSiteEntryTables } from 'zova-module-home-base';

export const ControllerPageHomeSchemaParams = z.object({
  locale: z.string().optional(),
});

@Controller()
export class ControllerPageHome extends BeanControllerPageBase {
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
