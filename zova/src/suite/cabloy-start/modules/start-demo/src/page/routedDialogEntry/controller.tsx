import { VBtn, VCard, VCardText, VTable } from 'vuetify/components';
import { z } from 'zod';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

export const ControllerPageRoutedDialogEntrySchemaParams = z.object({});
export const ControllerPageRoutedDialogEntrySchemaQuery = z.object({
  dialog: z.enum(['A', 'B']).optional().default('A'),
  token: z.string().optional().default('entry'),
  via: z.string().optional().default('open'),
  step: z.number().optional().default(0),
});

@Controller()
export class ControllerPageRoutedDialogEntry extends BeanControllerPageBase {
  pushDetail() {
    const route = this.$router.getPagePath('/start/demo/routedDialogDetail/:id', {
      params: { id: this.$query.step + 1 },
      query: {
        ...this.$query,
        token: `${this.$query.token}-push`,
        via: 'page-push',
        step: this.$query.step + 1,
      },
    });
    this.$router.push(route);
  }

  replaceDetail() {
    const route = this.$router.getPagePath('/start/demo/routedDialogDetail/:id', {
      params: { id: this.$query.step + 10 },
      query: {
        ...this.$query,
        token: `${this.$query.token}-replace`,
        via: 'page-replace',
        step: this.$query.step + 10,
      },
    });
    this.$router.replace(route);
  }

  protected render() {
    return (
      <ZPage>
        <VCard>
          <VCardText>
            <h2 class="text-h5">Routed Dialog Entry</h2>
            <p class="text-medium-emphasis">This page is rendered by the dialog-local router.</p>
            <VTable density="compact">
              <tbody>
                <tr>
                  <td>fullPath</td>
                  <td>{this.$route.fullPath}</td>
                </tr>
                <tr>
                  <td>dialog</td>
                  <td>{this.$query.dialog}</td>
                </tr>
                <tr>
                  <td>token</td>
                  <td>{this.$query.token}</td>
                </tr>
                <tr>
                  <td>via</td>
                  <td>{this.$query.via}</td>
                </tr>
                <tr>
                  <td>step</td>
                  <td>{this.$query.step}</td>
                </tr>
              </tbody>
            </VTable>
            <div class="d-flex flex-wrap ga-2 mt-4">
              <VBtn color="primary" nativeOnClick={() => this.pushDetail()}>
                Local push to detail
              </VBtn>
              <VBtn variant="outlined" nativeOnClick={() => this.replaceDetail()}>
                Local replace to detail
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </ZPage>
    );
  }
}
