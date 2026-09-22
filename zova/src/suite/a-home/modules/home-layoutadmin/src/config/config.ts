import type { ZovaSys } from 'zova';

export const config = (_sys: ZovaSys) => {
  return {
    layout: {
      sidebar: {
        width: 360,
        bodyReadyObserver: true,
        breakpoint: 1023,
        leftOpenPCCapability: true,
        leftOpenPCFallback: true,
      },
      navbar: {
        height: 112,
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
