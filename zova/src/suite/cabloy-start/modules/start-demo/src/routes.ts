import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageAppModal } from './.metadata/page/appModal.ts';
import { ZPageRoutedDialog } from './.metadata/page/routedDialog.ts';
import { ZPageRoutedDialogDetail } from './.metadata/page/routedDialogDetail.ts';
import { ZPageRoutedDialogEntry } from './.metadata/page/routedDialogEntry.ts';

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
