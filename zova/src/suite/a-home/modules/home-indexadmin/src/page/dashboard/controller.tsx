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
      this.$watch(
        () => this.$pageHost?.active,
        active => {
          if (active) {
            this._startTimer();
          } else {
            this._stopTimer();
          }
        },
        { immediate: true },
      );
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
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" class="text-primary">
              <circle cx="5" cy="5" r="3" fill="currentColor">
                <animate
                  attributeName="r"
                  values="3;4;3"
                  dur="1.5s"
                  repeatCount="indefinite"
                ></animate>
                <animate
                  attributeName="opacity"
                  values="1;0.5;1"
                  dur="1.5s"
                  repeatCount="indefinite"
                ></animate>
              </circle>
            </svg>
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

  private _startTimer() {
    if (this._timer !== undefined) return;
    this.currentTime = new Date().toLocaleTimeString();
    this._timer = window.setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 1000);
  }

  private _stopTimer() {
    if (this._timer === undefined) return;
    window.clearInterval(this._timer);
    this._timer = undefined;
  }

  protected __dispose__() {
    this._stopTimer();
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
