export interface paths {
  '/api/auth/mock/authorize': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['AuthMock_authorize'];
    put?: never;
    post: operations['AuthMock_authorizePost'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/captcha/create': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Captcha_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/captcha/refresh': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Captcha_refresh'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/captcha/verifyImmediate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Captcha_verifyImmediate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mailconfirm/mail/emailConfirmCallback': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['MailconfirmMail_emailConfirmCallback'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mailconfirm/mail/passwordResetCallback': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['MailconfirmMail_passwordResetCallback'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/base/menu/{publicPath?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeBaseMenu_retrieveMenus'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/base/permission/{resource}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeBasePermission_retrievePermissions'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Home */
    get: operations['Home_index'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/current': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeUserPassport_current'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/logout': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_logout'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/register': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_register'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/login': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_login'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/login/{module}/{providerName}/{clientName?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeUserPassport_loginOauth'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/associate/{module}/{providerName}/{clientName?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeUserPassport_associate'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/migrate/{module}/{providerName}/{clientName?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeUserPassport_migrate'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/refreshAuthToken': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_refreshAuthToken'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/createPassportJwtFromOauthCode': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_createPassportJwtFromOauthCode'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/createTempAuthToken': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_createTempAuthToken'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/cabloy/store/cabloyModule': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CabloyStoreCabloyModule_select'];
    put?: never;
    post: operations['CabloyStoreCabloyModule_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/cabloy/store/cabloyModule/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CabloyStoreCabloyModule_view'];
    put?: never;
    post?: never;
    delete: operations['CabloyStoreCabloyModule_delete'];
    options?: never;
    head?: never;
    patch: operations['CabloyStoreCabloyModule_update'];
    trace?: never;
  };
  '/api/cabloy/store/cabloyModule/viewByName/{name}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CabloyStoreCabloyModule_viewByName'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/cabloy/store/cabloyModule/stat/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['CabloyStoreCabloyModule_stat'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/cabloy/store/cabloyProvider': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CabloyStoreCabloyProvider_select'];
    put?: never;
    post: operations['CabloyStoreCabloyProvider_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/cabloy/store/cabloyProvider/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CabloyStoreCabloyProvider_view'];
    put?: never;
    post?: never;
    delete: operations['CabloyStoreCabloyProvider_delete'];
    options?: never;
    head?: never;
    patch: operations['CabloyStoreCabloyProvider_update'];
    trace?: never;
  };
  '/api/store/purchaseOrder': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['StorePurchaseOrder_select'];
    put?: never;
    post: operations['StorePurchaseOrder_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/store/purchaseOrder/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['StorePurchaseOrder_view'];
    put?: never;
    post?: never;
    delete: operations['StorePurchaseOrder_delete'];
    options?: never;
    head?: never;
    patch: operations['StorePurchaseOrder_update'];
    trace?: never;
  };
  '/api/store/purchaseRecord': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['StorePurchaseRecord_select'];
    put?: never;
    post: operations['StorePurchaseRecord_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/store/purchaseRecord/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['StorePurchaseRecord_view'];
    put?: never;
    post?: never;
    delete: operations['StorePurchaseRecord_delete'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/store/purchaseRecord/getByCurrentUser/{moduleId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['StorePurchaseRecord_getByCurrentUser'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/store/purchaseRecord/purchasePaypal': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['StorePurchaseRecord_purchasePaypal'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/paypal/getRecord/{recordId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Paypal_getRecord'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/paypal/captureOrder/{recordId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Paypal_captureOrder'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/paypal/cancelOrder/{recordId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Paypal_cancelOrder'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/play': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Play_index'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/auth/passport/isAuthenticated': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestAuthPassport_isAuthenticated'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/auth/passport/current': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestAuthPassport_current'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/captcha/signin': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestCaptcha_signin'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    'a-captcha.dto.captchaData': {
      id: string;
      provider: string;
      token?: unknown;
      payload?: unknown;
    };
    'a-menu.dto.menus': {
      menus?: components['schemas']['a-menu.dto.menuItem'][] | undefined;
      groups?: components['schemas']['a-menu.dto.menuGroup'][] | undefined;
    };
    'a-menu.dto.menuItem': {
      name: string;
      title?: string | undefined;
      description?: string | undefined;
      icon?: string | undefined;
      order?: number | undefined;
      group?: string | string[] | undefined;
      separator?: boolean | undefined;
      link?: string | undefined;
      external?: boolean | undefined;
      target?: string | undefined;
      meta?: components['schemas']['a-menu.dto.menuItemMeta'];
    };
    'a-menu.dto.menuItemMeta':
      | {
          params?: unknown;
          query?: unknown;
        }
      | undefined;
    'a-menu.dto.menuGroup': {
      name: string;
      title?: string | undefined;
      description?: string | undefined;
      icon?: string | undefined;
      order?: number | undefined;
      group?: string | string[] | undefined;
      collapsed?: boolean | undefined;
    };
    'a-permission.dto.permissions': {
      roleIds?: (number | string)[] | undefined;
      roleNames?: string[] | undefined;
      actions?: unknown;
    };
    'home-user.dto.passport':
      | {
          user: components['schemas']['home-user.entity.user'];
          auth: components['schemas']['a-auth.dto.auth'];
          roles: components['schemas']['home-user.entity.role'][];
        }
      | undefined;
    /** @description User */
    'home-user.entity.user': {
      /**
       * Format: date
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description User Name */
      name: string;
      /** @description Avatar */
      avatar?: string | undefined;
      /** @description Email */
      email?: string | undefined;
      /** @description Mobile */
      mobile?: string | undefined;
      /**
       * @description Activated
       * @default false
       */
      activated?: boolean;
      /** @description Language */
      locale?: string | undefined;
      /** @description Timezone */
      tz?: string | undefined;
    };
    'a-auth.dto.auth': {
      /** @description ID */
      id: number | string;
      profileId: string;
      authProvider?: {
        /** @description ID */
        id: number;
        providerName: string;
        clientName: string;
      };
    };
    /** @description Role */
    'home-user.entity.role': {
      /**
       * Format: date
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description Role Name */
      name: string;
    };
    'home-user.dto.passportJwt': {
      passport: components['schemas']['home-user.dto.passport'];
      jwt: components['schemas']['a-jwt.dto.jwtToken'];
    };
    'a-jwt.dto.jwtToken': {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    'home-user.dto.register': {
      username: string;
      /** Format: email */
      email: string;
      password: string;
      passwordConfirm: string;
      captcha: components['schemas']['a-captcha.dto.captchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e'];
    };
    'a-captcha.dto.captchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e': {
      id: string;
      token: string;
    };
    'home-user.dto.login': {
      username: string;
      password: string;
      captcha: components['schemas']['a-captcha.dto.captchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2b'];
    };
    'a-captcha.dto.captchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2b': {
      id: string;
      token: string;
    };
    'cabloy-store.dto.cabloyModuleCreate': {
      /** @description Name */
      name: string;
      /** @description Title */
      title: string;
      /** @description Description */
      description?: string | undefined;
      /** @description Description(Chinese) */
      descriptionZhcn?: string | undefined;
      /** @description Version */
      version: string;
      /** @description Repository */
      repoUrl?: string | undefined;
      /** @description Demo */
      demoUrl?: string | undefined;
      /** @description License */
      license: number;
      /**
       * @description Price
       * @default 0
       */
      price?: number | undefined;
      /** @description Provider */
      providerId: number | string;
      /**
       * @description Language
       * @default en-us
       */
      _locale?: string;
      content?: components['schemas']['cabloy-store.entity.cabloyModuleContent_81badf1cb6c91a163ef245059a4656a90b23a2f0_1816ff740d81c738ec055c7038bbd93beb9405a7'];
      _content?: unknown;
      _contentZhcn?: unknown;
    };
    'cabloy-store.entity.cabloyModuleContent_81badf1cb6c91a163ef245059a4656a90b23a2f0_1816ff740d81c738ec055c7038bbd93beb9405a7': {
      /** @description Content */
      content: string;
      /** @description Content(Chinese) */
      contentZhcn?: string | undefined;
    };
    'cabloy-store.dto.cabloyModuleQueryRes': {
      list: components['schemas']['cabloy-store.dto.cabloyModuleQueryResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'cabloy-store.dto.cabloyModuleQueryResItem': {
      /**
       * Format: date
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description Name */
      name: string;
      /** @description Title */
      title: string;
      /** @description Description */
      description?: string | undefined;
      /** @description Description(Chinese) */
      descriptionZhcn?: string | undefined;
      /** @description Version */
      version: string;
      /** @description Repository */
      repoUrl?: string | undefined;
      /** @description Demo */
      demoUrl?: string | undefined;
      /** @description License */
      license: number;
      /**
       * @description Price
       * @default 0
       */
      price?: number | undefined;
      /** @description Provider */
      providerId: number | string;
      /** @description Published */
      published?: boolean | undefined;
      userId?: number | string | undefined;
      /**
       * @description Language
       * @default en-us
       */
      _locale?: string;
      provider?: components['schemas']['cabloy-store.entity.cabloyProvider_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7'];
    };
    'cabloy-store.entity.cabloyProvider_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7': {
      /** @description ID */
      id: number | string;
      /** @description Name */
      name: string;
    };
    'cabloy-store.dto.cabloyModuleView':
      | {
          /**
           * Format: date
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          /** @description Name */
          name: string;
          /** @description Title */
          title: string;
          /** @description Description */
          description?: string | undefined;
          /** @description Description(Chinese) */
          descriptionZhcn?: string | undefined;
          /** @description Version */
          version: string;
          /** @description Repository */
          repoUrl?: string | undefined;
          /** @description Demo */
          demoUrl?: string | undefined;
          /** @description License */
          license: number;
          /**
           * @description Price
           * @default 0
           */
          price?: number | undefined;
          /** @description Provider */
          providerId: number | string;
          /** @description Published */
          published?: boolean | undefined;
          userId?: number | string | undefined;
          /**
           * @description Language
           * @default en-us
           */
          _locale?: string;
          content?: components['schemas']['cabloy-store.entity.cabloyModuleContent_1c9d53f3af6f7dcc5939f31fcb21323dc5f0c0f2_1816ff740d81c738ec055c7038bbd93beb9405a7'];
          provider?: components['schemas']['cabloy-store.entity.cabloyProvider_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7'];
          _content?: unknown;
          _contentZhcn?: unknown;
        }
      | undefined;
    'cabloy-store.entity.cabloyModuleContent_1c9d53f3af6f7dcc5939f31fcb21323dc5f0c0f2_1816ff740d81c738ec055c7038bbd93beb9405a7': {
      /** @description ID */
      id: number | string;
      /** @description Content */
      content: string;
      /** @description Content(Chinese) */
      contentZhcn?: string | undefined;
    };
    'cabloy-store.dto.cabloyModuleUpdate': {
      /** @description Name */
      name: string;
      /** @description Title */
      title: string;
      /** @description Description */
      description?: string | undefined;
      /** @description Description(Chinese) */
      descriptionZhcn?: string | undefined;
      /** @description Version */
      version: string;
      /** @description Repository */
      repoUrl?: string | undefined;
      /** @description Demo */
      demoUrl?: string | undefined;
      /** @description License */
      license: number;
      /**
       * @description Price
       * @default 0
       */
      price?: number | undefined;
      /** @description Provider */
      providerId: number | string;
      /**
       * @description Language
       * @default en-us
       */
      _locale?: string;
      content?: components['schemas']['cabloy-store.entity.cabloyModuleContent_e7b4a0d4d4633f151e39304b0c3e984921d39abe_1816ff740d81c738ec055c7038bbd93beb9405a7'];
      _content?: unknown;
      _contentZhcn?: unknown;
    };
    'cabloy-store.entity.cabloyModuleContent_e7b4a0d4d4633f151e39304b0c3e984921d39abe_1816ff740d81c738ec055c7038bbd93beb9405a7': {
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean | undefined;
      /** @description ID */
      id?: number | string | undefined;
      /** @description Content */
      content: string;
      /** @description Content(Chinese) */
      contentZhcn?: string | undefined;
    };
    'cabloy-store.dto.cabloyModuleViewByName':
      | {
          /**
           * Format: date
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          /** @description Name */
          name: string;
          /** @description Title */
          title: string;
          /** @description Description */
          description?: string | undefined;
          /** @description Description(Chinese) */
          descriptionZhcn?: string | undefined;
          /** @description Version */
          version: string;
          /** @description Repository */
          repoUrl?: string | undefined;
          /** @description Demo */
          demoUrl?: string | undefined;
          /** @description License */
          license: number;
          /**
           * @description Price
           * @default 0
           */
          price?: number | undefined;
          /** @description Provider */
          providerId: number | string;
          /** @description Published */
          published?: boolean | undefined;
          userId?: number | string | undefined;
          /**
           * @description Language
           * @default en-us
           */
          _locale?: string;
          provider?: components['schemas']['cabloy-store.entity.cabloyProvider_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7'];
          html?: {
            /** @description ID */
            id: number | string;
            html: string;
            htmlZhcn?: string | undefined;
          };
          stat?: {
            /** @description ID */
            id: number | string;
            /**
             * @description Views
             * @default 0
             */
            views?: number;
            /**
             * @description Purchaseds
             * @default 0
             */
            purchaseds?: number;
          };
        }
      | undefined;
    'cabloy-store.entity.cabloyModuleStat': {
      /**
       * Format: date
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      moduleId: number | string;
      /**
       * @description Views
       * @default 0
       */
      views?: number;
      /**
       * @description Purchaseds
       * @default 0
       */
      purchaseds?: number;
    };
    'cabloy-store.dto.cabloyProviderCreate': {
      /** @description Name */
      name: string;
      /** @description Description */
      description?: string | undefined;
      /**
       * @description GitHub Account
       * @default false
       */
      githubAccount?: boolean | undefined;
    };
    'cabloy-store.dto.cabloyProviderQueryRes': {
      list: {
        /**
         * Format: date
         * @description Created At
         */
        createdAt: Date;
        /**
         * Format: date
         * @description Updated At
         */
        updatedAt: Date;
        /**
         * @description Deleted
         * @default false
         */
        deleted?: boolean;
        /**
         * @description Instance ID
         * @default 0
         */
        iid?: number;
        /** @description ID */
        id: number | string;
        /** @description Name */
        name: string;
        /** @description Description */
        description?: string | undefined;
        /**
         * @description GitHub Account
         * @default false
         */
        githubAccount?: boolean | undefined;
        userId?: number | string | undefined;
      }[];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    /** @description Provider */
    'cabloy-store.entity.cabloyProvider':
      | {
          /**
           * Format: date
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          /** @description Name */
          name: string;
          /** @description Description */
          description?: string | undefined;
          /**
           * @description GitHub Account
           * @default false
           */
          githubAccount?: boolean | undefined;
          userId?: number | string | undefined;
        }
      | undefined;
    'cabloy-store.dto.cabloyProviderUpdate': {
      /** @description Name */
      name: string;
      /** @description Description */
      description?: string | undefined;
      /**
       * @description GitHub Account
       * @default false
       */
      githubAccount?: boolean | undefined;
    };
    'store-purchase.dto.purchaseOrderCreate': {
      userId: number | string;
      moduleId: number | string;
      /** @description Remark */
      remark?: string | undefined;
      /** @description License */
      license: number;
      /** @description Amount */
      amount: number;
      /** @default 0 */
      status?: number;
      paypalRecordId?: number | string | undefined;
      /** @description Gross Amount */
      grossAmount: number;
      /** @description Paypal Fee */
      paypalFee: number;
      /** @description Net Amount */
      netAmount: number;
    };
    'store-purchase.dto.purchaseOrderQueryRes': {
      list: {
        /**
         * Format: date
         * @description Created At
         */
        createdAt: Date;
        /**
         * Format: date
         * @description Updated At
         */
        updatedAt: Date;
        /**
         * @description Deleted
         * @default false
         */
        deleted?: boolean;
        /**
         * @description Instance ID
         * @default 0
         */
        iid?: number;
        /** @description ID */
        id: number | string;
        userId: number | string;
        moduleId: number | string;
        /** @description Remark */
        remark?: string | undefined;
        /** @description License */
        license: number;
        /** @description Amount */
        amount: number;
        /** @default 0 */
        status?: number;
        paypalRecordId?: number | string | undefined;
        /** @description Gross Amount */
        grossAmount: number;
        /** @description Paypal Fee */
        paypalFee: number;
        /** @description Net Amount */
        netAmount: number;
      }[];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    /** @description Purchase Order */
    'store-purchase.entity.purchaseOrder':
      | {
          /**
           * Format: date
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          userId: number | string;
          moduleId: number | string;
          /** @description Remark */
          remark?: string | undefined;
          /** @description License */
          license: number;
          /** @description Amount */
          amount: number;
          /** @default 0 */
          status?: number;
          paypalRecordId?: number | string | undefined;
          /** @description Gross Amount */
          grossAmount: number;
          /** @description Paypal Fee */
          paypalFee: number;
          /** @description Net Amount */
          netAmount: number;
        }
      | undefined;
    'store-purchase.dto.purchaseOrderUpdate': {
      userId: number | string;
      moduleId: number | string;
      /** @description Remark */
      remark?: string | undefined;
      /** @description License */
      license: number;
      /** @description Amount */
      amount: number;
      /** @default 0 */
      status?: number;
      paypalRecordId?: number | string | undefined;
      /** @description Gross Amount */
      grossAmount: number;
      /** @description Paypal Fee */
      paypalFee: number;
      /** @description Net Amount */
      netAmount: number;
    };
    'store-purchase.dto.purchaseRecordCreate': {
      /** @description User */
      userId: number | string;
      /** @description Module */
      moduleId: number | string;
      /**
       * Format: date
       * @description Last Purchase Time
       */
      lastPurchaseTime: Date;
      /**
       * Format: date
       * @description Expiration Date
       */
      expirationDate?: Date;
    };
    'store-purchase.dto.purchaseRecordQueryRes': {
      list: {
        /**
         * Format: date
         * @description Created At
         */
        createdAt: Date;
        /**
         * Format: date
         * @description Updated At
         */
        updatedAt: Date;
        /**
         * @description Deleted
         * @default false
         */
        deleted?: boolean;
        /**
         * @description Instance ID
         * @default 0
         */
        iid?: number;
        /** @description ID */
        id: number | string;
        /** @description User */
        userId: number | string;
        /** @description Module */
        moduleId: number | string;
        /**
         * Format: date
         * @description Last Purchase Time
         */
        lastPurchaseTime: Date;
        /**
         * Format: date
         * @description Expiration Date
         */
        expirationDate?: Date;
        user?: components['schemas']['home-user.entity.user_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7'];
        module?: components['schemas']['cabloy-store.entity.cabloyModule_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7'];
      }[];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'home-user.entity.user_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7': {
      /** @description ID */
      id: number | string;
      /** @description User Name */
      name: string;
    };
    'cabloy-store.entity.cabloyModule_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7': {
      /** @description ID */
      id: number | string;
      /** @description Name */
      name: string;
      content?: components['schemas']['cabloy-store.entity.cabloyModuleContent_1c9d53f3af6f7dcc5939f31fcb21323dc5f0c0f2_1816ff740d81c738ec055c7038bbd93beb9405a7'];
      provider?: components['schemas']['cabloy-store.entity.cabloyProvider_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7'];
    };
    /** @description Purchase Record */
    'store-purchase.entity.purchaseRecord':
      | {
          /**
           * Format: date
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          /** @description User */
          userId: number | string;
          /** @description Module */
          moduleId: number | string;
          /**
           * Format: date
           * @description Last Purchase Time
           */
          lastPurchaseTime: Date;
          /**
           * Format: date
           * @description Expiration Date
           */
          expirationDate?: Date;
        }
      | undefined;
    'store-purchase.dto.purchaseRecordView':
      | {
          /**
           * Format: date
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          /** @description User */
          userId: number | string;
          /** @description Module */
          moduleId: number | string;
          /**
           * Format: date
           * @description Last Purchase Time
           */
          lastPurchaseTime: Date;
          /**
           * Format: date
           * @description Expiration Date
           */
          expirationDate?: Date;
          user?: components['schemas']['home-user.entity.user_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7'];
          module?: components['schemas']['cabloy-store.entity.cabloyModule_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7'];
        }
      | undefined;
    'store-purchase.dto.purchasePaypalResBody': {
      orderId: number | string;
      approveUrl: string;
    };
    'store-purchase.dto.purchasePaypalReqBody': {
      moduleId: number | string;
      remark: string;
      returnTo: string;
      returnUrl: string;
      cancelUrl: string;
    };
    'a-paypal.entity.paypalRecord': {
      /**
       * Format: date
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      userId: number | string;
      /** @default 0 */
      status?: number;
      prepayId: string;
      payload: components['schemas']['a-paypal.dto.paypalOrderRecordPayload'];
      options: components['schemas']['a-paypal.dto.paypalOrderRecordOptions'];
    };
    'a-paypal.dto.paypalOrderRecordPayload': {
      remark: string;
      total: string;
      currencyCode: string;
    };
    'a-paypal.dto.paypalOrderRecordOptions': {
      brandName: string;
      returnUrl: string;
      cancelUrl: string;
      returnTo: string;
      scene: string;
      orderId: number | string;
    };
    'a-play.dto.play': {
      args: string[];
      projectPath: string;
    };
    'test-captcha.dto.signin': {
      username: string;
      password: string;
      captcha?: unknown;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  AuthMock_authorize: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  AuthMock_authorizePost: {
    parameters: {
      query: {
        redirect_uri: string;
        state: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          username: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  Captcha_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          scene: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-captcha.dto.captchaData'];
          };
        };
      };
    };
  };
  Captcha_refresh: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          id: string;
          scene: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-captcha.dto.captchaData'];
          };
        };
      };
    };
  };
  Captcha_verifyImmediate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          id: string;
          token?: unknown;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: string;
          };
        };
      };
    };
  };
  MailconfirmMail_emailConfirmCallback: {
    parameters: {
      query: {
        token: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  MailconfirmMail_passwordResetCallback: {
    parameters: {
      query: {
        token: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  HomeBaseMenu_retrieveMenus: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        publicPath: ((string | undefined) | undefined) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-menu.dto.menus'];
          };
        };
      };
    };
  };
  HomeBasePermission_retrievePermissions: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        resource: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-permission.dto.permissions'];
          };
        };
      };
    };
    authToken: true;
  };
  Home_index: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  HomeUserPassport_current: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['home-user.dto.passport'];
          };
        };
      };
    };
  };
  HomeUserPassport_logout: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  HomeUserPassport_register: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['home-user.dto.register'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
  };
  HomeUserPassport_login: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['home-user.dto.login'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
  };
  HomeUserPassport_loginOauth: {
    parameters: {
      query?: {
        redirect?: string | undefined;
      };
      header?: never;
      path: {
        module: string;
        providerName: string;
        clientName: ((string | undefined) | undefined) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  HomeUserPassport_associate: {
    parameters: {
      query?: {
        redirect?: string | undefined;
      };
      header?: never;
      path: {
        module: string;
        providerName: string;
        clientName: ((string | undefined) | undefined) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
    authToken: true;
  };
  HomeUserPassport_migrate: {
    parameters: {
      query?: {
        redirect?: string | undefined;
      };
      header?: never;
      path: {
        module: string;
        providerName: string;
        clientName: ((string | undefined) | undefined) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
    authToken: true;
  };
  HomeUserPassport_refreshAuthToken: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          refreshToken: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-jwt.dto.jwtToken'];
          };
        };
      };
    };
  };
  HomeUserPassport_createPassportJwtFromOauthCode: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          code: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
  };
  HomeUserPassport_createTempAuthToken: {
    parameters: {
      query?: {
        path?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: string;
          };
        };
      };
    };
    authToken: true;
  };
  CabloyStoreCabloyModule_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        name?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['cabloy-store.dto.cabloyModuleQueryRes'];
          };
        };
      };
    };
    authToken: true;
  };
  CabloyStoreCabloyModule_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['cabloy-store.dto.cabloyModuleCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  CabloyStoreCabloyModule_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['cabloy-store.dto.cabloyModuleView'];
          };
        };
      };
    };
    authToken: true;
  };
  CabloyStoreCabloyModule_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  CabloyStoreCabloyModule_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['cabloy-store.dto.cabloyModuleUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  CabloyStoreCabloyModule_viewByName: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        name: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['cabloy-store.dto.cabloyModuleViewByName'];
          };
        };
      };
    };
  };
  CabloyStoreCabloyModule_stat: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: unknown;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['cabloy-store.entity.cabloyModuleStat'];
          };
        };
      };
    };
  };
  CabloyStoreCabloyProvider_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        name?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['cabloy-store.dto.cabloyProviderQueryRes'];
          };
        };
      };
    };
    authToken: true;
  };
  CabloyStoreCabloyProvider_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['cabloy-store.dto.cabloyProviderCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  CabloyStoreCabloyProvider_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['cabloy-store.entity.cabloyProvider'];
          };
        };
      };
    };
    authToken: true;
  };
  CabloyStoreCabloyProvider_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  CabloyStoreCabloyProvider_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['cabloy-store.dto.cabloyProviderUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  StorePurchaseOrder_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['store-purchase.dto.purchaseOrderQueryRes'];
          };
        };
      };
    };
    authToken: true;
  };
  StorePurchaseOrder_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['store-purchase.dto.purchaseOrderCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  StorePurchaseOrder_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['store-purchase.entity.purchaseOrder'];
          };
        };
      };
    };
    authToken: true;
  };
  StorePurchaseOrder_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  StorePurchaseOrder_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['store-purchase.dto.purchaseOrderUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  StorePurchaseRecord_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['store-purchase.dto.purchaseRecordQueryRes'];
          };
        };
      };
    };
    authToken: true;
  };
  StorePurchaseRecord_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['store-purchase.dto.purchaseRecordCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  StorePurchaseRecord_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['store-purchase.entity.purchaseRecord'];
          };
        };
      };
    };
    authToken: true;
  };
  StorePurchaseRecord_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  StorePurchaseRecord_getByCurrentUser: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        moduleId: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['store-purchase.dto.purchaseRecordView'];
          };
        };
      };
    };
  };
  StorePurchaseRecord_purchasePaypal: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['store-purchase.dto.purchasePaypalReqBody'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['store-purchase.dto.purchasePaypalResBody'];
          };
        };
      };
    };
    authToken: true;
  };
  Paypal_getRecord: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        recordId: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-paypal.entity.paypalRecord'];
          };
        };
      };
    };
    authToken: true;
  };
  Paypal_captureOrder: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        recordId: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  Paypal_cancelOrder: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        recordId: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  Play_index: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-play.dto.play'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestAuthPassport_isAuthenticated: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: boolean;
          };
        };
      };
    };
    authToken: true;
  };
  TestAuthPassport_current: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestCaptcha_signin: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-captcha.dto.signin'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
}
