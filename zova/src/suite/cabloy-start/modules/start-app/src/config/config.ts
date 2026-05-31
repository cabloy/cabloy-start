import type { ZovaSys } from 'zova';
import type { IIconRecord } from 'zova-module-a-icon';

export const config = (_sys: ZovaSys) => {
  return {
    model: {
      alert: {
        icons: {
          success: '$success',
          info: '$info',
          warning: '$warning',
          error: '$error',
        },
        default: {
          maxWidth: 360,
        },
      },
      confirm: {
        icons: {
          confirm: ':outline:help-outline' as keyof IIconRecord,
        },
        default: {
          maxWidth: 360,
        },
      },
      prompt: {
        icons: {
          prompt: ':outline:help-outline' as keyof IIconRecord,
        },
        default: {
          maxWidth: 360,
        },
      },
    },
  };
};
