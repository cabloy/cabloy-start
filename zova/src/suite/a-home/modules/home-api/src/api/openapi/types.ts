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
  '/api/image/upload-token': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Image_createUploadToken'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/image/upload': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Image_upload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/image/direct-upload': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Image_createDirectUpload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/image/upload-url': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Image_uploadUrl'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/image/delivery/{imageId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Image_delivery'];
    put?: never;
    post?: never;
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
      meta?: components['schemas']['a-menu.dto.menuItemMeta_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
    };
    'a-menu.dto.menuItemMeta_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
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
    'home-user.dto.passport_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          user: components['schemas']['home-user.entity.user'];
          auth: components['schemas']['a-auth.dto.auth'];
          roles: components['schemas']['home-user.entity.role'][];
        }
      | undefined;
    'home-user.entity.user': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
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
    'home-user.entity.role': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
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
    'home-user.dto.passport': {
      user: components['schemas']['home-user.entity.user'];
      auth: components['schemas']['a-auth.dto.auth'];
      roles: components['schemas']['home-user.entity.role'][];
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
      captcha: components['schemas']['a-captcha.dto.captchaVerify_42dbf1a77dd2259bc46e709048a4a5eaa5f766ef'];
    };
    'a-captcha.dto.captchaVerify_42dbf1a77dd2259bc46e709048a4a5eaa5f766ef': {
      id: string;
      token: string;
    };
    'home-user.dto.login': {
      username: string;
      password: string;
      captcha: components['schemas']['a-captcha.dto.captchaVerify_42dbf1a77dd2259bc46e709048a4a5eaa5f766ef_f73253d699f0fd90b98fded80a123a0a180dbca2_521117d88e78d91bd8791d711d8297e186ca1540_626802c24df1498cec99aab0854fedf90c9b6dd3_c961397f84976b27de33206aaa32153d70a77381'];
    };
    'a-captcha.dto.captchaVerify_42dbf1a77dd2259bc46e709048a4a5eaa5f766ef_f73253d699f0fd90b98fded80a123a0a180dbca2_521117d88e78d91bd8791d711d8297e186ca1540_626802c24df1498cec99aab0854fedf90c9b6dd3_c961397f84976b27de33206aaa32153d70a77381': {
      id: string;
      token: string;
    };
    'a-image.dto.imageUploadTokenResponse': {
      token: string;
      expiresIn?: number | undefined;
    };
    'a-image.dto.imageUploadTokenRequest': {
      imageScene: string;
      size: number;
      mimeType: string;
      expiresIn?: number | undefined;
    };
    'a-image.dto.imageUploadResponse': {
      id: number | string;
      provider: string;
      clientName: string;
      resourceId: string;
      filename?: string | undefined;
      contentType?: string | undefined;
      size?: number | undefined;
      width?: number | undefined;
      height?: number | undefined;
      requireSignedURLs?: boolean | undefined;
      variants?:
        | {
            [key: string]: components['schemas']['a-image.dto.imageTransformOptions'];
          }
        | undefined;
      imageScene?: string | undefined;
      /** Format: date-time */
      uploadedAt?: Date;
      url?: string | undefined;
      signed?: boolean | undefined;
    };
    'a-image.dto.imageTransformOptions': {
      width?: number | undefined;
      height?: number | undefined;
      /** @enum {string|null} */
      fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad' | null | undefined;
      /** @enum {string|null} */
      gravity?: 'auto' | 'center' | 'top' | 'bottom' | 'left' | 'right' | null | undefined;
      background?: string | undefined;
      quality?: number | undefined;
      /** @enum {string|null} */
      format?: 'auto' | 'avif' | 'webp' | 'jpeg' | 'png' | null | undefined;
      dpr?: number | undefined;
      rotate?: number | undefined;
      sharpen?: number | undefined;
    };
    'a-image.dto.imageDirectUploadResponse': {
      id: number | string;
      provider: string;
      clientName: string;
      resourceId: string;
      uploadUrl: string;
      draft?: boolean | undefined;
      filename?: string | undefined;
      imageScene?: string | undefined;
    };
    'a-image.dto.imageDirectUploadRequest': {
      imageScene: string;
      filename?: string | undefined;
      size: number;
      mimeType: string;
      contentType?: string | undefined;
      requireSignedURLs?: boolean | undefined;
      expiry?: string | undefined;
      customId?: string | undefined;
    };
    'a-image.dto.imageUploadUrlRequest': {
      imageScene: string;
      /** Format: uri */
      url: string;
      size: number;
      mimeType: string;
      filename?: string | undefined;
      contentType?: string | undefined;
      requireSignedURLs?: boolean | undefined;
    };
    'a-image.dto.imageTransformOptions_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          width?: number | undefined;
          height?: number | undefined;
          /** @enum {string|null} */
          fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad' | null | undefined;
          /** @enum {string|null} */
          gravity?: 'auto' | 'center' | 'top' | 'bottom' | 'left' | 'right' | null | undefined;
          background?: string | undefined;
          quality?: number | undefined;
          /** @enum {string|null} */
          format?: 'auto' | 'avif' | 'webp' | 'jpeg' | 'png' | null | undefined;
          dpr?: number | undefined;
          rotate?: number | undefined;
          sharpen?: number | undefined;
        }
      | undefined;
    'a-paypal.entity.paypalRecord': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
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
            data?: components['schemas']['home-user.dto.passport_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
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
  Image_createUploadToken: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-image.dto.imageUploadTokenRequest'];
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
            data: components['schemas']['a-image.dto.imageUploadTokenResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  Image_upload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'multipart/form-data': {
          token: string;
          /** Format: binary */
          image: Blob;
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
            data: components['schemas']['a-image.dto.imageUploadResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  Image_createDirectUpload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-image.dto.imageDirectUploadRequest'];
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
            data: components['schemas']['a-image.dto.imageDirectUploadResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  Image_uploadUrl: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-image.dto.imageUploadUrlRequest'];
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
            data: components['schemas']['a-image.dto.imageUploadResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  Image_delivery: {
    parameters: {
      query?: {
        variantName?: string | undefined;
        transformOptions?: components['schemas']['a-image.dto.imageTransformOptions_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
        token?: string | undefined;
      };
      header?: never;
      path: {
        imageId: number | string;
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
}
