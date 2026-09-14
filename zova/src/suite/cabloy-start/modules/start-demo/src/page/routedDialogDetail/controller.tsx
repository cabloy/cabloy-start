import { VBtn, VCard, VCardText, VTable } from 'vuetify/components';
import { z } from 'zod';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

export const ControllerPageRoutedDialogDetailSchemaParams = z.object({ id: z.number() });
export const ControllerPageRoutedDialogDetailSchemaQuery = z.object({
  dialog: z.enum(['A', 'B']).optional().default('A'),
  token: z.string().optional().default('detail'),
  via: z.string().optional().default('unknown'),
  step: z.number().optional().default(0),
});

@Controller()
export class ControllerPageRoutedDialogDetail extends BeanControllerPageBase {
  pushNextDetail() {
    const route = this.$router.getPagePath('/start/demo/routedDialogDetail/:id', {
      params: { id: this.$params.id + 1 },
      query: {
        ...this.$query,
        token: `${this.$query.token}-push`,
        via: 'detail-push',
        step: this.$query.step + 1,
      },
    });
    this.$router.push(route);
  }

  replaceNextDetail() {
    const route = this.$router.getPagePath('/start/demo/routedDialogDetail/:id', {
      params: { id: this.$params.id + 10 },
      query: {
        ...this.$query,
        token: `${this.$query.token}-replace`,
        via: 'detail-replace',
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
            <h2 class="text-h5">Routed Dialog Detail</h2>
            <p class="text-medium-emphasis">
              The typed route state belongs to this dialog instance.
            </p>
            <VTable density="compact">
              <tbody>
                <tr>
                  <td>fullPath</td>
                  <td>{this.$route.fullPath}</td>
                </tr>
                <tr>
                  <td>id</td>
                  <td>{this.$params.id}</td>
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
              <VBtn color="primary" nativeOnClick={() => this.pushNextDetail()}>
                Local push next detail
              </VBtn>
              <VBtn variant="outlined" nativeOnClick={() => this.replaceNextDetail()}>
                Local replace next detail
              </VBtn>
              <VBtn variant="outlined" nativeOnClick={() => this.$router.back()}>
                Local router.back
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </ZPage>
    );
  }
}
