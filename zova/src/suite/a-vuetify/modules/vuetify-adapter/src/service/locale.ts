import { inject } from 'vue';
import { LocaleSymbol } from 'vuetify/lib/composables/locale.mjs';
import { BeanBase } from 'zova';
import { Service } from 'zova-module-a-bean';

@Service()
export class ServiceLocale extends BeanBase {
  public async initialize() {
    this.app.ctx.util.instanceScope(() => {
      const localeVuetify = inject(LocaleSymbol);
      if (localeVuetify) {
        localeVuetify.messages.value = this.scope.config.locale.messages;
        localeVuetify.current.value = this.app.meta.locale.current;
      }
    });
    this.$watch(
      () => this.app.meta.locale.current,
      locale => {
        this.app.ctx.util.instanceScope(() => {
          const localeVuetify = inject(LocaleSymbol);
          if (localeVuetify) {
            localeVuetify.current.value = locale;
          }
        });
      },
    );
  }
}
