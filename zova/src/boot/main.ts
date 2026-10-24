import { defineBoot } from '@quasar/app-vite/wrappers';

import vuetify from './vuetify.ts';

export default defineBoot(({ app, ssrContext: _ssrContext }) => {
  app.use(vuetify);
});
