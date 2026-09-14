import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageAppModal } from './.metadata/page/appModal.js';
import { ZPageRoutedDialog } from './.metadata/page/routedDialog.js';
import { ZPageRoutedDialogDetail } from './.metadata/page/routedDialogDetail.js';
import { ZPageRoutedDialogEntry } from './.metadata/page/routedDialogEntry.js';

export const routes: IModuleRoute[] = [
  {
    path: 'appModal',
    component: ZPageAppModal,
    meta: { requiresAuth: false },
  },
  {
    path: 'routedDialog',
    component: ZPageRoutedDialog,
    meta: { requiresAuth: false },
  },
  {
    path: 'routedDialogEntry',
    component: ZPageRoutedDialogEntry,
    meta: { requiresAuth: false },
  },
  {
    name: 'routedDialogDetail',
    path: 'routedDialogDetail/:id',
    component: ZPageRoutedDialogDetail,
    meta: { requiresAuth: false },
  },
];
