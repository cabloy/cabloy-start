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
            class="d-flex align-center ga-1 rounded-pill px-3 py-1 text-primary"
            style={{
              minHeight: '28px',
              alignSelf: 'center',
              whiteSpace: 'nowrap',
              backgroundColor: 'rgba(var(--v-theme-primary), 0.06)',
              border: '1px solid rgba(var(--v-theme-primary), 0.18)',
            }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true" class="text-primary">
              <circle cx="4" cy="4" r="2.5" fill="currentColor">
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
              class="font-weight-medium text-body-2"
              style={{ fontVariantNumeric: 'tabular-nums', lineHeight: 1.25 }}
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
