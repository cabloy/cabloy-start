import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageComponent } from './.metadata/page/component.js';
import { ZPageState } from './.metadata/page/state.js';
import { ZPageStyle } from './.metadata/page/style.js';

export const routes: IModuleRoute[] = [
  { path: 'state', component: ZPageState, meta: { requiresAuth: false, ssrProfile: 'public' } },
  {
    path: 'component',
    component: ZPageComponent,
    meta: {
      requiresAuth: false,
      ssrProfile: 'public',
    },
  },
  { path: 'style', component: ZPageStyle, meta: { requiresAuth: false, ssrProfile: 'public' } },
];
