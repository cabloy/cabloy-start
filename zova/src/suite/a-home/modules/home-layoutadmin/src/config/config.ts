import type { ZovaSys } from 'zova';

export const config = (_sys: ZovaSys) => {
  return {
    layout: {
      sidebar: {
        bodyReadyObserver: true,
        breakpoint: 1023,
        leftOpenPCCapability: true,
        leftOpenPCFallback: true,
      },
    },
    tabs: {
      scene: '',
      max: 6,
      maxItems: 6,
      cache: true,
    },
    tabItem: {
      maxWidth: '250px',
    },
  };
};
