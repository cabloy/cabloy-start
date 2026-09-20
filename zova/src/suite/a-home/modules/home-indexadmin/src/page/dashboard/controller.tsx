import { VContainer } from 'vuetify/components';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage, ZSiteEntryTables } from 'zova-module-home-base';

@Controller()
export class ControllerPageDashboard extends BeanControllerPageBase {
  private _timer?: number;
  currentTime = '';

  protected __init__() {
    if (!this.$pageRoute) return;
    this.$ssr.handleDirectOrOnHydrated(() => {
      this.currentTime = new Date().toLocaleTimeString();
      this._timer = window.setInterval(() => {
        this.currentTime = new Date().toLocaleTimeString();
      }, 1000);
    });
    this.$router.setPageMeta(this.$pageRoute, {
      onCustomRenderIsolate: () => (
        <div class="d-flex flex-grow-1 align-center justify-center">
          <div
            class="d-flex align-center ga-2 rounded-pill px-4 py-2 text-primary"
            style={{
              backgroundColor: 'rgba(var(--v-theme-primary), 0.1)',
              border: '1px solid rgba(var(--v-theme-primary), 0.3)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            }}
          >
            <span
              class="pulse-dot rounded-circle bg-primary"
              aria-hidden="true"
              style={{ width: '8px', height: '8px' }}
            ></span>
            <span
              class="font-weight-semibold text-body-1"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {this.currentTime || '--:--:--'}
            </span>
          </div>
        </div>
      ),
    });
  }

  protected __dispose__() {
    if (this._timer !== undefined) {
      window.clearInterval(this._timer);
    }
  }

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
