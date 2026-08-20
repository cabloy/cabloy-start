import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageAppModal } from './.metadata/page/appModal.js';

export const routes: IModuleRoute[] = [
  { path: 'appModal', component: ZPageAppModal, meta: { ssrProfile: 'public' } },
];
