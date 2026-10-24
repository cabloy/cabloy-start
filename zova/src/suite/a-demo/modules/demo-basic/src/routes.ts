import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageComponent } from './.metadata/page/component.ts';
import { ZPageState } from './.metadata/page/state.ts';
import { ZPageStyle } from './.metadata/page/style.ts';

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
