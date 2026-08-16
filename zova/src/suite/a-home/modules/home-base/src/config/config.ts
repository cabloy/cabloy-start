import type { ZovaSys } from 'zova';

import AvatarUser from '../../assets/img/avatar_user.png';

export const config = (_sys: ZovaSys) => {
  return {
    layout: {
      sidebar: {
        width: 360,
      },
      navbar: {
        height: 112,
      },
    },
    avatar: {
      empty: AvatarUser,
    },
  };
};
