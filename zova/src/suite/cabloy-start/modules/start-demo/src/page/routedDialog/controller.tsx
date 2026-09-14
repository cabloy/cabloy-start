import type {
  IModalRoutedDialogPresentationOptions,
  IRoutedDialogHandle,
} from 'zova-module-start-app';

import { VBtn, VCard, VCardText, VTable } from 'vuetify/components';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

@Controller()
export class ControllerPageRoutedDialog extends BeanControllerPageBase {
  handleA?: IRoutedDialogHandle;
  handleB?: IRoutedDialogHandle;
  statusA = 'idle';
  statusB = 'idle';
  events: string[] = [];

  openA() {
    this._open('A');
  }

  openB() {
    this._open('B');
  }

  openAAndB() {
    this._open('A');
    this._open('B');
  }

  openAWithHandlePush() {
    const handle = this._open('A');
    void this._navigateHandle(handle, 'push');
  }

  openAWithHandleReplace() {
    const handle = this._open('A');
    void this._navigateHandle(handle, 'replace');
  }

  openAWithScalarWidth() {
    this._open('A', { maxWidth: 720 });
  }

  private _open(dialog: 'A' | 'B', dialogOptions?: IModalRoutedDialogPresentationOptions) {
    const route = this.$router.getPagePath('/start/demo/routedDialogEntry', {
      query: { dialog, token: `dialog-${dialog.toLowerCase()}-entry`, via: 'open', step: 0 },
    });
    const handle = this.$appModal.routedDialog(
      {
        route,
        title: `Routed Dialog ${dialog}`,
        onClose: () => {
          this._record(`${dialog}: closed`);
          if (dialog === 'A') {
            this.statusA = 'closed';
            this.handleA = undefined;
          } else {
            this.statusB = 'closed';
            this.handleB = undefined;
          }
        },
      },
      { ...dialogOptions, closeOnEscape: true, showCloseButton: true },
    );
    if (dialog === 'A') {
      this.handleA = handle;
      this.statusA = 'loading';
    } else {
      this.handleB = handle;
      this.statusB = 'loading';
    }
    void this._awaitReady(dialog, handle);
    return handle;
  }

  private async _awaitReady(dialog: 'A' | 'B', handle: IRoutedDialogHandle) {
    try {
      await handle.ready;
      if (dialog === 'A') this.statusA = 'ready';
      else this.statusB = 'ready';
      this._record(`${dialog}: ready`);
    } catch (error) {
      if (dialog === 'A') this.statusA = 'error';
      else this.statusB = 'error';
      this._record(`${dialog}: ${String(error)}`);
    }
  }

  private async _navigateHandle(handle: IRoutedDialogHandle, action: 'push' | 'replace') {
    try {
      await handle.ready;
      const route = this.$router.getPagePath('/start/demo/routedDialogDetail/:id', {
        params: { id: action === 'push' ? 101 : 202 },
        query: { dialog: 'A', token: `handle-${action}`, via: `handle-${action}`, step: 1 },
      });
      if (action === 'push') await handle.push(route);
      else await handle.replace(route);
      this._record(`A: handle.${action}`);
    } catch (error) {
      this._record(`A: handle.${action} ${String(error)}`);
    }
  }

  private _record(event: string) {
    this.events = [...this.events, event];
  }

  private async openStudentList() {
    const route = this.$router.getPagePath('/rest/resource/:resource', {
      params: {
        resource: 'training-student:student',
      },
    });
    this.$appModal.routedDialog({
      route,
      title: 'Student List',
    });
  }

  protected render() {
    return (
      <ZPage>
        <div class="d-flex flex-column ga-6">
          <div>
            <h1 class="text-h4">Routed Dialog</h1>
            <p class="text-medium-emphasis">
              Each dialog owns an independent in-memory router; browser URL remains unchanged.
            </p>
          </div>
          <VCard>
            <VCardText class="d-flex flex-wrap ga-2">
              <VBtn color="primary" nativeOnClick={() => this.openA()}>
                Open A
              </VBtn>
              <VBtn color="secondary" nativeOnClick={() => this.openB()}>
                Open B
              </VBtn>
              <VBtn variant="outlined" nativeOnClick={() => this.openAAndB()}>
                Open A and B
              </VBtn>
              <VBtn variant="outlined" nativeOnClick={() => this.openAWithHandlePush()}>
                Open A with handle.push
              </VBtn>
              <VBtn variant="outlined" nativeOnClick={() => this.openAWithHandleReplace()}>
                Open A with handle.replace
              </VBtn>
              <VBtn variant="outlined" nativeOnClick={() => this.openAWithScalarWidth()}>
                Open A (720px)
              </VBtn>
            </VCardText>
          </VCard>
          <VTable>
            <thead>
              <tr>
                <th>Dialog</th>
                <th>Status</th>
                <th>Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A</td>
                <td>{this.statusA}</td>
                <td>{this.handleA ? 'active' : '-'}</td>
              </tr>
              <tr>
                <td>B</td>
                <td>{this.statusB}</td>
                <td>{this.handleB ? 'active' : '-'}</td>
              </tr>
            </tbody>
          </VTable>
          <VCard>
            <VCardText>
              <strong>Lifecycle log</strong>
              <ol>
                {this.events.map(event => (
                  <li key={event}>{event}</li>
                ))}
              </ol>
            </VCardText>
          </VCard>
          <VCard>
            <VCardText>
              <VBtn variant="outlined" nativeOnClick={() => this.openStudentList()}>
                Student List
              </VBtn>
            </VCardText>
          </VCard>
        </div>
      </ZPage>
    );
  }
}
