import type { IMonkeySysInitialize } from 'zova';
import type { IBehaviorItem } from 'zova-module-a-behavior';

import { BeanSimple, deepExtend } from 'zova';

export class MonkeySys extends BeanSimple implements IMonkeySysInitialize {
  async sysInitialize() {
    // config custom
    const configCustom: IBehaviorItem = {
      'start-app:appModal': {},
    };
    // rest
    const scopeAppConfig = this.sys.util.getModuleConfigSafe('a-app');
    scopeAppConfig.behaviors = deepExtend({}, scopeAppConfig.behaviors, configCustom);
  }
}
