import type { ZovaSys } from 'zova';

import { en, zhHans } from 'vuetify/locale';

export const config = (_sys: ZovaSys) => {
  return {
    locale: {
      messages: { 'en-us': en, 'zh-cn': zhHans },
    },
  };
};
