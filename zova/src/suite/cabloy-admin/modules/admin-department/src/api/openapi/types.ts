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
  '/api/home/base/siteCatalog': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeBaseSiteCatalog_select'];
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
  '/api/training/record': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TrainingRecord_select'];
    put?: never;
    post: operations['TrainingRecord_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training/record/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TrainingRecord_view'];
    put?: never;
    post?: never;
    delete: operations['TrainingRecord_delete'];
    options?: never;
    head?: never;
    patch: operations['TrainingRecord_update'];
    trace?: never;
  };
  '/api/training/student': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TrainingStudent_select'];
    put?: never;
    post: operations['TrainingStudent_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training/student/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TrainingStudent_view'];
    put?: never;
    post?: never;
    delete: operations['TrainingStudent_delete'];
    options?: never;
    head?: never;
    patch: operations['TrainingStudent_update'];
    trace?: never;
  };
  '/api/training/student/summary/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TrainingStudent_summary'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training/student/deleteForce/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete: operations['TrainingStudent_deleteForce'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/department': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['AdminDepartment_select'];
    put?: never;
    post: operations['AdminDepartment_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/department/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['AdminDepartment_view'];
    put?: never;
    post?: never;
    delete: operations['AdminDepartment_delete'];
    options?: never;
    head?: never;
    patch: operations['AdminDepartment_update'];
    trace?: never;
  };
  '/api/admin/department/{id}/move': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations['AdminDepartment_move'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/department/{id}/reorder': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations['AdminDepartment_reorder'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/department/{id}/activation': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations['AdminDepartment_updateActivation'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/role': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['AdminRole_select'];
    put?: never;
    post: operations['AdminRole_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/role/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['AdminRole_view'];
    put?: never;
    post?: never;
    delete: operations['AdminRole_delete'];
    options?: never;
    head?: never;
    patch: operations['AdminRole_update'];
    trace?: never;
  };
  '/api/admin/role/user/{userId}/roles': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations['AdminRole_replaceUserRoles'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/role/system-admin/fresh-proof': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['AdminRole_issueSystemAdminFreshProof'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/role/system-admin/grant/{userId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['AdminRole_grantSystemAdmin'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/role/system-admin/revoke/{userId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['AdminRole_revokeSystemAdmin'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/role/system-admin/account-status/{userId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations['AdminRole_updateSystemAdminAccountStatus'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/role/system-admin/activation/{userId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations['AdminRole_updateSystemAdminActivation'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/user': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['AdminUser_select'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/user/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['AdminUser_view'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch: operations['AdminUser_update'];
    trace?: never;
  };
  '/api/admin/user/activate/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['AdminUser_activate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/admin/user/account-status/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations['AdminUser_updateAccountStatus'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/start/metrics/snapshot': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['StartMetrics_snapshot'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/file/upload-policy': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['File_getUploadPolicy'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/file/upload': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['File_upload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/file/direct-upload': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['File_createDirectUpload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/file/direct-upload/finalize': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['File_finalizeDirectUpload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/file/upload-url': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['File_uploadUrl'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/file/download': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['File_download'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/image/upload-policy': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Image_getUploadPolicy'];
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
  '/api/image/direct-upload/finalize': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Image_finalizeDirectUpload'];
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
  '/api/image/delivery': {
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
  '/api/pay/payment-callback/return': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['PayPaymentCallback_returned'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/pay/payment-callback/cancel': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['PayPaymentCallback_cancelled'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/pay/payment-session/{id}/start': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['PayPaymentSession_start'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/pay/payment-session/{id}/reconcile': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['PayPaymentSession_reconcile'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/pay/payment-session/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['PayPaymentSession_view'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/pay/mock/payment-session/{id}/complete': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['PayMockMockPayment_complete'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/pay/mock/payment-session/refund-operation/{id}/complete': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['PayMockMockPayment_completeRefund'];
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
    'home-base.dto.siteCatalogSelectRes': {
      list: components['schemas']['home-base.dto.siteCatalogSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'home-base.dto.siteCatalogSelectResItem': {
      siteId: string;
      title: string;
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
       * @description Identity Activated
       * @default false
       */
      activated?: boolean;
      /**
       * @description Account Status
       * @default active
       * @enum {string}
       */
      accountStatus?: 'active' | 'disabled';
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
      /** @description Role Title */
      title: string;
      /** @description Role Locales */
      titleLocales?:
        | {
            [key: string]: string;
          }
        | undefined;
      siteIds: string[];
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
    'training-record.dto.recordCreate': {
      /** @description Training Record Name */
      name: string;
      /** @description Student */
      studentId: number | string;
      /** @description Subject Count */
      subjectCount?: number | undefined;
      /** @description Total Score */
      totalScore?: number | undefined;
      /** @description Average Score */
      averageScore?: number | undefined;
      /**
       * Format: date-time
       * @description Training Time
       */
      trainingTime?: Date;
      /** @description Scene Photos */
      sceneImageIds?: (number | string)[] | undefined;
      /** @description Dossier Files */
      dossierFileIds?: (number | string)[] | undefined;
      /** @description Description */
      description?: string | undefined;
      /** @description Student Training Record Details */
      trainingRecordSubjects?:
        | {
            /** @description Subject Name */
            name: string;
            /** @description Subject Score */
            score: number;
            /** @description Description */
            description?: string | undefined;
          }[]
        | undefined;
      _trainingRecordSubjects?:
        | components['schemas']['training-record.dto.detailRecordSubjectResItem'][]
        | undefined;
    };
    'training-record.dto.detailRecordSubjectResItem': {
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /** @description ID */
      id: number | string;
      /** @description Subject Name */
      name: string;
      /** @description Subject Score */
      score: number;
      /** @description Description */
      description?: string | undefined;
      /** @description # */
      _lineNumber?: number | undefined;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'training-record.dto.recordSelectRes': {
      list: components['schemas']['training-record.dto.recordSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'training-record.dto.recordSelectResItem': {
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
      /** @description Training Record Name */
      name: string;
      /** @description Student */
      studentId: number | string;
      /** @description Subject Count */
      subjectCount?: number | undefined;
      /** @description Total Score */
      totalScore?: number | undefined;
      /** @description Average Score */
      averageScore?: number | undefined;
      /**
       * Format: date-time
       * @description Training Time
       */
      trainingTime?: Date;
      /** @description Scene Photos */
      sceneImageIds?: (number | string)[] | undefined;
      /** @description Dossier Files */
      dossierFileIds?: (number | string)[] | undefined;
      /** @description Description */
      description?: string | undefined;
      student?: {
        /** @description ID */
        id: number | string;
        /** @description Student Name */
        name: string;
      };
      sceneImages?: components['schemas']['a-image.dto.imageView'][] | undefined;
      /** @description Dossier Files */
      dossierFiles?: components['schemas']['a-file.dto.fileView'][] | undefined;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'a-image.dto.imageView': {
      id: number | string;
      url: string;
      filename?: string | undefined;
      width?: number | undefined;
      height?: number | undefined;
      public?: boolean | undefined;
      /** @default true */
      signed?: boolean;
    };
    'a-file.dto.fileView': {
      id: number | string;
      filename?: string | undefined;
      contentType?: string | undefined;
      size?: number | undefined;
      public?: boolean | undefined;
      /** Format: date-time */
      uploadedAt?: Date;
      downloadUrl: string;
      /** @default true */
      signed?: boolean;
    };
    'training-record.dto.recordView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_88947ca8c18d5d4ad1f377d379e77df5fe5c0ce5':
      | {
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
          /** @description Training Record Name */
          name: string;
          /** @description Student */
          studentId: number | string;
          /** @description Subject Count */
          subjectCount?: number | undefined;
          /** @description Total Score */
          totalScore?: number | undefined;
          /** @description Average Score */
          averageScore?: number | undefined;
          /**
           * Format: date-time
           * @description Training Time
           */
          trainingTime?: Date;
          /** @description Scene Photos */
          sceneImageIds?: (number | string)[] | undefined;
          /** @description Dossier Files */
          dossierFileIds?: (number | string)[] | undefined;
          /** @description Description */
          description?: string | undefined;
          student?: {
            /** @description ID */
            id: number | string;
            /** @description Student Name */
            name: string;
          };
          /** @description Student Training Record Details */
          trainingRecordSubjects: {
            /**
             * @description Deleted
             * @default false
             */
            deleted?: boolean;
            /** @description ID */
            id: number | string;
            /** @description Subject Name */
            name: string;
            /** @description Subject Score */
            score: number;
            /** @description Description */
            description?: string | undefined;
          }[];
          sceneImages?: components['schemas']['a-image.dto.imageView'][] | undefined;
          /** @description Dossier Files */
          dossierFiles?: components['schemas']['a-file.dto.fileView'][] | undefined;
          _trainingRecordSubjects?:
            | components['schemas']['training-record.dto.detailRecordSubjectResItem'][]
            | undefined;
        }
      | undefined;
    'training-record.dto.recordUpdate': {
      /** @description Training Record Name */
      name: string;
      /** @description Student */
      studentId: number | string;
      /** @description Subject Count */
      subjectCount?: number | undefined;
      /** @description Total Score */
      totalScore?: number | undefined;
      /** @description Average Score */
      averageScore?: number | undefined;
      /**
       * Format: date-time
       * @description Training Time
       */
      trainingTime?: Date;
      /** @description Scene Photos */
      sceneImageIds?: (number | string)[] | undefined;
      /** @description Dossier Files */
      dossierFileIds?: (number | string)[] | undefined;
      /** @description Description */
      description?: string | undefined;
      /** @description Student Training Record Details */
      trainingRecordSubjects?:
        | {
            /**
             * @description Deleted
             * @default false
             */
            deleted?: boolean | undefined;
            /** @description ID */
            id?: number | string | undefined;
            /** @description Subject Name */
            name: string;
            /** @description Subject Score */
            score: number;
            /** @description Description */
            description?: string | undefined;
          }[]
        | undefined;
      _trainingRecordSubjects?:
        | components['schemas']['training-record.dto.detailRecordSubjectResItem'][]
        | undefined;
    };
    'training-student.dto.studentCreate': {
      /** @description Student Name */
      name: string;
      /** @description Description */
      description?: string | undefined;
      /** @description Mobile */
      mobile: string;
      /** @description Student Image */
      imageId?: number | string | undefined;
      /** @description Training Stage */
      level: 1 | 2 | 3;
      /** @description Student Training Records */
      trainingRecords?:
        | {
            /** @description Training Record Name */
            name: string;
            /** @description Subject Count */
            subjectCount?: number | undefined;
            /** @description Total Score */
            totalScore?: number | undefined;
            /** @description Average Score */
            averageScore?: number | undefined;
            /**
             * Format: date-time
             * @description Training Time
             */
            trainingTime?: Date;
            /** @description Scene Photos */
            sceneImageIds?: (number | string)[] | undefined;
            /** @description Dossier Files */
            dossierFileIds?: (number | string)[] | undefined;
            /** @description Description */
            description?: string | undefined;
            /** @description Student Training Record Details */
            trainingRecordSubjects?:
              | {
                  /**
                   * @description Deleted
                   * @default false
                   */
                  deleted?: boolean | undefined;
                  /** @description ID */
                  id?: number | string | undefined;
                  /** @description Subject Name */
                  name: string;
                  /** @description Subject Score */
                  score: number;
                  /** @description Description */
                  description?: string | undefined;
                }[]
              | undefined;
            sceneImages?:
              | {
                  id?: number | string | undefined;
                  url?: string | undefined;
                  filename?: string | undefined;
                  width?: number | undefined;
                  height?: number | undefined;
                  public?: boolean | undefined;
                  /** @default true */
                  signed?: boolean | undefined;
                }[]
              | undefined;
            /** @description Dossier Files */
            dossierFiles?:
              | {
                  id?: number | string | undefined;
                  filename?: string | undefined;
                  contentType?: string | undefined;
                  size?: number | undefined;
                  public?: boolean | undefined;
                  /** Format: date-time */
                  uploadedAt?: Date;
                  downloadUrl?: string | undefined;
                  /** @default true */
                  signed?: boolean | undefined;
                }[]
              | undefined;
            _trainingRecordSubjects?:
              | components['schemas']['training-record.dto.detailRecordSubjectResItem'][]
              | undefined;
          }[]
        | undefined;
      _trainingRecords?:
        | components['schemas']['training-student.dto.detailRecordResItem'][]
        | undefined;
    };
    'training-student.dto.detailRecordResItem': {
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /** @description ID */
      id: number | string;
      /** @description Training Record Name */
      name: string;
      /** @description Subject Count */
      subjectCount?: number | undefined;
      /** @description Total Score */
      totalScore?: number | undefined;
      /** @description Average Score */
      averageScore?: number | undefined;
      /**
       * Format: date-time
       * @description Training Time
       */
      trainingTime?: Date;
      /** @description Scene Photos */
      sceneImageIds?: (number | string)[] | undefined;
      /** @description Dossier Files */
      dossierFileIds?: (number | string)[] | undefined;
      /** @description Description */
      description?: string | undefined;
      /** @description Student Training Record Details */
      trainingRecordSubjects?: unknown;
      sceneImages?:
        | {
            id?: number | string | undefined;
            url?: string | undefined;
            filename?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
            public?: boolean | undefined;
            /** @default true */
            signed?: boolean | undefined;
          }[]
        | undefined;
      /** @description Dossier Files */
      dossierFiles?:
        | {
            id?: number | string | undefined;
            filename?: string | undefined;
            contentType?: string | undefined;
            size?: number | undefined;
            public?: boolean | undefined;
            /** Format: date-time */
            uploadedAt?: Date;
            downloadUrl?: string | undefined;
            /** @default true */
            signed?: boolean | undefined;
          }[]
        | undefined;
      /** @description # */
      _lineNumber?: number | undefined;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'training-student.dto.studentSelectRes': {
      list: components['schemas']['training-student.dto.studentSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'training-student.dto.studentSelectResItem': {
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
      /** @description Student Name */
      name: string;
      /** @description Description */
      description?: string | undefined;
      /** @description Mobile */
      mobile: string;
      /** @description Student Image */
      imageId?: number | string | undefined;
      /** @description Training Stage */
      level: 1 | 2 | 3;
      image?: components['schemas']['a-image.dto.imageView_a83c3e638bca4b30ec8675860cdc52d66f6a16d1_2d063d28bc7243bed02ebd8bddf1212a93c6305b_efb37794d7c03c65122279f90d79919f009c34e5_1816ff740d81c738ec055c7038bbd93beb9405a7_537cd6552a384183a9457fb6a920bbae337277f6'];
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'a-image.dto.imageView_a83c3e638bca4b30ec8675860cdc52d66f6a16d1_2d063d28bc7243bed02ebd8bddf1212a93c6305b_efb37794d7c03c65122279f90d79919f009c34e5_1816ff740d81c738ec055c7038bbd93beb9405a7_537cd6552a384183a9457fb6a920bbae337277f6':
      | {
          id: number | string;
          url: string;
          filename?: string | undefined;
          width?: number | undefined;
          height?: number | undefined;
          public?: boolean | undefined;
          /** @default true */
          signed?: boolean;
        }
      | undefined;
    'training-student.dto.studentView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_2ade7655a06636cfe9aa1cc76e9518982ec19f2e':
      | {
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
          /** @description Student Name */
          name: string;
          /** @description Description */
          description?: string | undefined;
          /** @description Mobile */
          mobile: string;
          /** @description Student Image */
          imageId?: number | string | undefined;
          /** @description Training Stage */
          level: 1 | 2 | 3;
          /** @description Student Training Records */
          trainingRecords: {
            /**
             * @description Deleted
             * @default false
             */
            deleted?: boolean;
            /** @description ID */
            id: number | string;
            /** @description Training Record Name */
            name: string;
            /** @description Subject Count */
            subjectCount?: number | undefined;
            /** @description Total Score */
            totalScore?: number | undefined;
            /** @description Average Score */
            averageScore?: number | undefined;
            /**
             * Format: date-time
             * @description Training Time
             */
            trainingTime?: Date;
            /** @description Scene Photos */
            sceneImageIds?: (number | string)[] | undefined;
            /** @description Dossier Files */
            dossierFileIds?: (number | string)[] | undefined;
            /** @description Description */
            description?: string | undefined;
            /** @description Student Training Record Details */
            trainingRecordSubjects: {
              /**
               * @description Deleted
               * @default false
               */
              deleted?: boolean;
              /** @description ID */
              id: number | string;
              /** @description Subject Name */
              name: string;
              /** @description Subject Score */
              score: number;
              /** @description Description */
              description?: string | undefined;
            }[];
            sceneImages?:
              | {
                  id?: number | string | undefined;
                  url?: string | undefined;
                  filename?: string | undefined;
                  width?: number | undefined;
                  height?: number | undefined;
                  public?: boolean | undefined;
                  /** @default true */
                  signed?: boolean | undefined;
                }[]
              | undefined;
            /** @description Dossier Files */
            dossierFiles?:
              | {
                  id?: number | string | undefined;
                  filename?: string | undefined;
                  contentType?: string | undefined;
                  size?: number | undefined;
                  public?: boolean | undefined;
                  /** Format: date-time */
                  uploadedAt?: Date;
                  downloadUrl?: string | undefined;
                  /** @default true */
                  signed?: boolean | undefined;
                }[]
              | undefined;
            _trainingRecordSubjects?:
              | components['schemas']['training-record.dto.detailRecordSubjectResItem'][]
              | undefined;
          }[];
          image?: components['schemas']['a-image.dto.imageView_a83c3e638bca4b30ec8675860cdc52d66f6a16d1_2d063d28bc7243bed02ebd8bddf1212a93c6305b_efb37794d7c03c65122279f90d79919f009c34e5_1816ff740d81c738ec055c7038bbd93beb9405a7_537cd6552a384183a9457fb6a920bbae337277f6'];
          _trainingRecords?:
            | components['schemas']['training-student.dto.detailRecordResItem'][]
            | undefined;
        }
      | undefined;
    'training-student.dto.studentUpdate': {
      /** @description Student Name */
      name: string;
      /** @description Description */
      description?: string | undefined;
      /** @description Mobile */
      mobile: string;
      /** @description Student Image */
      imageId?: number | string | undefined;
      /** @description Training Stage */
      level: 1 | 2 | 3;
      /** @description Student Training Records */
      trainingRecords?:
        | {
            /**
             * @description Deleted
             * @default false
             */
            deleted?: boolean | undefined;
            /** @description ID */
            id?: number | string | undefined;
            /** @description Training Record Name */
            name: string;
            /** @description Subject Count */
            subjectCount?: number | undefined;
            /** @description Total Score */
            totalScore?: number | undefined;
            /** @description Average Score */
            averageScore?: number | undefined;
            /**
             * Format: date-time
             * @description Training Time
             */
            trainingTime?: Date;
            /** @description Scene Photos */
            sceneImageIds?: (number | string)[] | undefined;
            /** @description Dossier Files */
            dossierFileIds?: (number | string)[] | undefined;
            /** @description Description */
            description?: string | undefined;
            /** @description Student Training Record Details */
            trainingRecordSubjects?:
              | {
                  /**
                   * @description Deleted
                   * @default false
                   */
                  deleted?: boolean | undefined;
                  /** @description ID */
                  id?: number | string | undefined;
                  /** @description Subject Name */
                  name: string;
                  /** @description Subject Score */
                  score: number;
                  /** @description Description */
                  description?: string | undefined;
                }[]
              | undefined;
            sceneImages?:
              | {
                  id?: number | string | undefined;
                  url?: string | undefined;
                  filename?: string | undefined;
                  width?: number | undefined;
                  height?: number | undefined;
                  public?: boolean | undefined;
                  /** @default true */
                  signed?: boolean | undefined;
                }[]
              | undefined;
            /** @description Dossier Files */
            dossierFiles?:
              | {
                  id?: number | string | undefined;
                  filename?: string | undefined;
                  contentType?: string | undefined;
                  size?: number | undefined;
                  public?: boolean | undefined;
                  /** Format: date-time */
                  uploadedAt?: Date;
                  downloadUrl?: string | undefined;
                  /** @default true */
                  signed?: boolean | undefined;
                }[]
              | undefined;
            _trainingRecordSubjects?:
              | components['schemas']['training-record.dto.detailRecordSubjectResItem'][]
              | undefined;
          }[]
        | undefined;
      _trainingRecords?:
        | components['schemas']['training-student.dto.detailRecordResItem'][]
        | undefined;
    };
    'training-student.dto.studentSummary_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          /** @description ID */
          id: number | string;
          /** @description Student Name */
          name: string;
          /** @description Description */
          description?: string | undefined;
          /** @description Mobile */
          mobile: string;
          /** @description Training Stage */
          level: 1 | 2 | 3;
          /** @description Level Title */
          levelTitle: string;
          /** @description Description Length */
          descriptionLength: number;
          /** @description Summary */
          summaryText: string;
        }
      | undefined;
    'admin-department.dto.departmentCreate': {
      /** @description Department Name */
      name: string;
      /** @description Parent Department */
      parentId?: number | string | undefined;
    };
    'admin-department.dto.departmentSelectRes': {
      list: components['schemas']['admin-department.dto.departmentSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'admin-department.dto.departmentSelectResItem': {
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
      /** @description Department Name */
      name: string;
      /** @description Parent Department */
      parentId?: number | string | undefined;
      /** @description Enabled */
      enabled: boolean;
      /** @description Sort Order */
      sortOrder: number;
      managerMembershipId?: number | string | undefined;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'admin-department.dto.departmentView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_72c27d7cd13c5c9702e4249706cbc0b3dea0ff7d':
      | {
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
          /** @description Department Name */
          name: string;
          /** @description Parent Department */
          parentId?: number | string | undefined;
          /** @description Enabled */
          enabled: boolean;
          /** @description Sort Order */
          sortOrder: number;
          managerMembershipId?: number | string | undefined;
        }
      | undefined;
    'admin-department.dto.departmentUpdate': {
      /** @description Department Name */
      name: string;
    };
    'admin-department.dto.departmentMove': {
      /** @description Parent Department */
      parentId: number | string | undefined;
    };
    'admin-department.dto.departmentReorder': {
      /** @description Place Before Department */
      beforeId: number | string | undefined;
    };
    'admin-department.dto.departmentActivation': {
      enabled: boolean;
    };
    'admin-role.dto.roleView': {
      /** @description ID */
      id: number | string;
      /** @description Role Name */
      name: string;
      /** @description Role Title */
      title: string;
      /** @description Role Locales */
      titleLocales?:
        | {
            [key: string]: string;
          }
        | undefined;
      /** @description Site IDs */
      siteIds: string[];
      sites?: components['schemas']['home-base.dto.siteCatalogSelectResItem'][] | undefined;
    };
    'admin-role.dto.roleCreate': {
      /** @description Role Name */
      name: string;
      /** @description Role Title */
      title: string;
      /** @description Role Locales */
      titleLocales?:
        | {
            [key: string]: string;
          }
        | undefined;
      /** @description Site IDs */
      siteIds: string[];
    };
    'admin-role.dto.roleSelectRes': {
      list: components['schemas']['admin-role.dto.roleSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'admin-role.dto.roleSelectResItem': {
      /** @description ID */
      id: number | string;
      /** @description Role Name */
      name: string;
      /** @description Role Title */
      title: string;
      /** @description Role Locales */
      titleLocales?:
        | {
            [key: string]: string;
          }
        | undefined;
      /** @description Site IDs */
      siteIds: string[];
      sites?: components['schemas']['home-base.dto.siteCatalogSelectResItem'][] | undefined;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'admin-role.dto.roleView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_326f9a25887c080b975d143095eec57412beb745':
      | {
          /** @description ID */
          id: number | string;
          /** @description Role Name */
          name: string;
          /** @description Role Title */
          title: string;
          /** @description Role Locales */
          titleLocales?:
            | {
                [key: string]: string;
              }
            | undefined;
          /** @description Site IDs */
          siteIds: string[];
          sites?: components['schemas']['home-base.dto.siteCatalogSelectResItem'][] | undefined;
        }
      | undefined;
    'admin-role.dto.roleUpdate': {
      /** @description Role Name */
      name: string;
      /** @description Role Title */
      title: string;
      /** @description Role Locales */
      titleLocales?:
        | {
            [key: string]: string;
          }
        | undefined;
      /** @description Site IDs */
      siteIds?: string[] | undefined;
    };
    'admin-role.dto.userRoleReplace': {
      roleIds: (number | string)[];
    };
    'admin-role.dto.systemAdminFreshProofIssueRes': {
      proof: string;
      /** Format: date-time */
      expiresAt: Date;
    };
    'admin-role.dto.systemAdminFreshProofIssue': {
      password: string;
    };
    'admin-role.dto.systemAdminGrant': {
      reason: string;
      freshProof: string;
    };
    'admin-role.dto.systemAdminRevoke': {
      reason: string;
      freshProof: string;
    };
    'admin-role.dto.systemAdminAccountStatus': {
      /** @enum {string} */
      accountStatus: 'active' | 'disabled';
      reason: string;
      freshProof: string;
    };
    'admin-role.dto.systemAdminActivation': {
      activated: boolean;
      reason: string;
      freshProof: string;
    };
    'admin-user.dto.userSelectRes': {
      list: components['schemas']['admin-user.dto.userSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'admin-user.dto.userSelectResItem': {
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
       * @description Identity Activated
       * @default false
       */
      activated?: boolean;
      /**
       * @description Account Status
       * @default active
       * @enum {string}
       */
      accountStatus?: 'active' | 'disabled';
      /** @description Locale */
      locale?: string | undefined;
      /** @description Time Zone */
      tz?: string | undefined;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'admin-user.dto.userView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_3af4868dbf0dab6a1b8727d55c4030f401fb2bc7':
      | {
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
           * @description Identity Activated
           * @default false
           */
          activated?: boolean;
          /**
           * @description Account Status
           * @default active
           * @enum {string}
           */
          accountStatus?: 'active' | 'disabled';
          /** @description Locale */
          locale?: string | undefined;
          /** @description Time Zone */
          tz?: string | undefined;
        }
      | undefined;
    'admin-user.dto.userUpdate': {
      /** @description User Name */
      name?: string | undefined;
      /** @description Avatar */
      avatar?: string | undefined;
      /**
       * Format: email
       * @description Email
       */
      email?: string | undefined;
      /** @description Mobile */
      mobile?: string | undefined;
      /** @description Locale */
      locale?: string | undefined;
      /** @description Time Zone */
      tz?: string | undefined;
    };
    'admin-user.dto.userAccountStatusUpdate': {
      /**
       * @description Account Status
       * @enum {string}
       */
      accountStatus: 'active' | 'disabled';
    };
    'start-metrics.dto.metricsSnapshot': {
      enabled: boolean;
      runtime: components['schemas']['start-metrics.dto.metricsRuntime'];
      queues: components['schemas']['start-metrics.dto.metricsQueue'][];
    };
    'start-metrics.dto.metricsRuntime': {
      state: string;
      observedAt?: string | undefined;
      uptimeSeconds?: number | undefined;
      rssBytes?: number | undefined;
      heapUsedBytes?: number | undefined;
      heapTotalBytes?: number | undefined;
      externalBytes?: number | undefined;
      eventLoopDelayMaxSeconds?: number | undefined;
      activeContexts?: number | undefined;
    };
    'start-metrics.dto.metricsQueue': {
      name: string;
      state: string;
      observedAt?: string | undefined;
      jobs?:
        | {
            [key: string]: number;
          }
        | undefined;
      schedulers?: number | undefined;
    };
    'a-file.dto.fileUploadPolicyResponse': {
      fileScene: string;
      maxSize?: number | undefined;
      mimeTypes?: string[] | undefined;
      extensions?: string[] | undefined;
      multiple?: boolean | undefined;
      public?: boolean | undefined;
      directUpload: boolean;
    };
    'a-file.dto.fileUploadPolicyRequest': {
      fileScene: string;
    };
    'a-file.dto.fileUploadResponse': {
      id: number | string;
      filename?: string | undefined;
      contentType?: string | undefined;
      size?: number | undefined;
      public?: boolean | undefined;
      /** Format: date-time */
      uploadedAt?: Date;
      url?: string | undefined;
      signed?: boolean | undefined;
    };
    'a-file.dto.fileDirectUploadResponse': {
      id: number | string;
      uploadUrl: string;
      headers?:
        | {
            [key: string]: string;
          }
        | undefined;
      /** @enum {string|null} */
      method?: 'PUT' | 'POST' | null | undefined;
      filename?: string | undefined;
      public?: boolean | undefined;
    };
    'a-file.dto.fileDirectUploadRequest': {
      fileScene: string;
      filename?: string | undefined;
      size: number;
      mimeType: string;
      contentType?: string | undefined;
      expiry?: string | undefined;
    };
    'a-file.dto.fileDirectUploadFinalizeResponse': {
      id: number | string;
      filename?: string | undefined;
      contentType?: string | undefined;
      size?: number | undefined;
      public?: boolean | undefined;
      /** Format: date-time */
      uploadedAt?: Date;
      url?: string | undefined;
      signed?: boolean | undefined;
    };
    'a-file.dto.fileDirectUploadFinalizeRequest': {
      fileId: number | string;
    };
    'a-file.dto.fileUploadUrlRequest': {
      fileScene: string;
      /** Format: uri */
      url: string;
      size: number;
      mimeType: string;
      filename?: string | undefined;
      contentType?: string | undefined;
      objectKey?: string | undefined;
    };
    'a-image.dto.imageUploadPolicyResponse': {
      imageScene: string;
      maxSize?: number | undefined;
      mimeTypes?: string[] | undefined;
      extensions?: string[] | undefined;
      multiple?: boolean | undefined;
      public?: boolean | undefined;
      directUpload?: boolean | undefined;
    };
    'a-image.dto.imageUploadPolicyRequest': {
      imageScene: string;
    };
    'a-image.dto.imageUploadResponse': {
      id: number | string;
      filename?: string | undefined;
      contentType?: string | undefined;
      size?: number | undefined;
      width?: number | undefined;
      height?: number | undefined;
      public?: boolean | undefined;
      url?: string | undefined;
      signed?: boolean | undefined;
    };
    'a-image.dto.imageDirectUploadResponse': {
      id: number | string;
      uploadUrl: string;
      filename?: string | undefined;
      public?: boolean | undefined;
    };
    'a-image.dto.imageDirectUploadRequest': {
      imageScene: string;
      filename?: string | undefined;
      size: number;
      mimeType: string;
      contentType?: string | undefined;
      expiry?: string | undefined;
      customId?: string | undefined;
    };
    'a-image.dto.imageDirectUploadFinalizeResponse': {
      id: number | string;
      filename?: string | undefined;
      contentType?: string | undefined;
      size?: number | undefined;
      width?: number | undefined;
      height?: number | undefined;
      public?: boolean | undefined;
      url?: string | undefined;
      signed?: boolean | undefined;
    };
    'a-image.dto.imageDirectUploadFinalizeRequest': {
      imageId: number | string;
    };
    'a-image.dto.imageUploadUrlRequest': {
      imageScene: string;
      /** Format: uri */
      url: string;
      size: number;
      mimeType: string;
      filename?: string | undefined;
      contentType?: string | undefined;
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
    'a-pay.dto.paymentSessionView': {
      id: number | string;
      /** @enum {string} */
      state:
        | 'created'
        | 'starting'
        | 'requires_action'
        | 'processing'
        | 'succeeded'
        | 'failed'
        | 'cancelled'
        | 'expired';
      providerName: string;
      nextAction?:
        | {
            /** @enum {string} */
            kind: 'redirect';
            /** Format: uri */
            url: string;
          }
        | {
            /** @enum {string} */
            kind: 'embedded';
            clientToken: string;
            publishableConfig?:
              | {
                  [key: string]: string;
                }
              | undefined;
          }
        | {
            /** @enum {string} */
            kind: 'pending';
            retryAfterSeconds?: number | undefined;
          }
        | {
            /** @enum {string} */
            kind: 'completed';
          }
        | undefined;
      amountMinor: number;
      currency: string;
    };
    'pay-mock.dto.mockPaymentReceipt': {
      paymentSessionId: number | string;
      accepted: boolean;
    };
    'pay-mock.dto.mockPaymentComplete': {
      /** @enum {string} */
      outcome: 'succeeded' | 'failed' | 'cancelled';
    };
    'pay-mock.dto.mockRefundReceipt': {
      refundOperationId: number | string;
      accepted: boolean;
    };
    'pay-mock.dto.mockRefundComplete': {
      /** @enum {string} */
      outcome: 'succeeded' | 'failed' | 'cancelled';
    };
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
  HomeBaseSiteCatalog_select: {
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
            data: components['schemas']['home-base.dto.siteCatalogSelectRes'];
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
  TrainingRecord_select: {
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
        studentId?: number | undefined;
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
            data: components['schemas']['training-record.dto.recordSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  TrainingRecord_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['training-record.dto.recordCreate'];
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
  TrainingRecord_view: {
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
            data?: components['schemas']['training-record.dto.recordView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_88947ca8c18d5d4ad1f377d379e77df5fe5c0ce5'];
          };
        };
      };
    };
    authToken: true;
  };
  TrainingRecord_delete: {
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  TrainingRecord_update: {
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
        'application/json': components['schemas']['training-record.dto.recordUpdate'];
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  TrainingStudent_select: {
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
        level?: number | undefined;
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
            data: components['schemas']['training-student.dto.studentSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  TrainingStudent_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['training-student.dto.studentCreate'];
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
  TrainingStudent_view: {
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
            data?: components['schemas']['training-student.dto.studentView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_2ade7655a06636cfe9aa1cc76e9518982ec19f2e'];
          };
        };
      };
    };
    authToken: true;
  };
  TrainingStudent_delete: {
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  TrainingStudent_update: {
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
        'application/json': components['schemas']['training-student.dto.studentUpdate'];
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  TrainingStudent_summary: {
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
            data?: components['schemas']['training-student.dto.studentSummary_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
          };
        };
      };
    };
    authToken: true;
  };
  TrainingStudent_deleteForce: {
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminDepartment_select: {
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
            data: components['schemas']['admin-department.dto.departmentSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  AdminDepartment_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['admin-department.dto.departmentCreate'];
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
  AdminDepartment_view: {
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
            data?: components['schemas']['admin-department.dto.departmentView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_72c27d7cd13c5c9702e4249706cbc0b3dea0ff7d'];
          };
        };
      };
    };
    authToken: true;
  };
  AdminDepartment_delete: {
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminDepartment_update: {
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
        'application/json': components['schemas']['admin-department.dto.departmentUpdate'];
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminDepartment_move: {
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
        'application/json': components['schemas']['admin-department.dto.departmentMove'];
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminDepartment_reorder: {
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
        'application/json': components['schemas']['admin-department.dto.departmentReorder'];
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminDepartment_updateActivation: {
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
        'application/json': components['schemas']['admin-department.dto.departmentActivation'];
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminRole_select: {
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
        name?: string | undefined;
        title?: string | undefined;
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
            data: components['schemas']['admin-role.dto.roleSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  AdminRole_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['admin-role.dto.roleCreate'];
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
            data: components['schemas']['admin-role.dto.roleView'];
          };
        };
      };
    };
    authToken: true;
  };
  AdminRole_view: {
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
            data?: components['schemas']['admin-role.dto.roleView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_326f9a25887c080b975d143095eec57412beb745'];
          };
        };
      };
    };
    authToken: true;
  };
  AdminRole_delete: {
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminRole_update: {
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
        'application/json': components['schemas']['admin-role.dto.roleUpdate'];
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminRole_replaceUserRoles: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        userId: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['admin-role.dto.userRoleReplace'];
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminRole_issueSystemAdminFreshProof: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['admin-role.dto.systemAdminFreshProofIssue'];
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
            data: components['schemas']['admin-role.dto.systemAdminFreshProofIssueRes'];
          };
        };
      };
    };
    authToken: true;
  };
  AdminRole_grantSystemAdmin: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        userId: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['admin-role.dto.systemAdminGrant'];
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminRole_revokeSystemAdmin: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        userId: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['admin-role.dto.systemAdminRevoke'];
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminRole_updateSystemAdminAccountStatus: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        userId: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['admin-role.dto.systemAdminAccountStatus'];
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminRole_updateSystemAdminActivation: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        userId: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['admin-role.dto.systemAdminActivation'];
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminUser_select: {
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
        name?: string | undefined;
        activated?: boolean | undefined;
        accountStatus?: 'active' | 'disabled' | null | undefined;
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
            data: components['schemas']['admin-user.dto.userSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  AdminUser_view: {
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
            data?: components['schemas']['admin-user.dto.userView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_3af4868dbf0dab6a1b8727d55c4030f401fb2bc7'];
          };
        };
      };
    };
    authToken: true;
  };
  AdminUser_update: {
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
        'application/json': components['schemas']['admin-user.dto.userUpdate'];
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminUser_activate: {
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  AdminUser_updateAccountStatus: {
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
        'application/json': components['schemas']['admin-user.dto.userAccountStatusUpdate'];
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
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  StartMetrics_snapshot: {
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
            data: components['schemas']['start-metrics.dto.metricsSnapshot'];
          };
        };
      };
    };
    authToken: true;
  };
  File_getUploadPolicy: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-file.dto.fileUploadPolicyRequest'];
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
            data: components['schemas']['a-file.dto.fileUploadPolicyResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  File_upload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'multipart/form-data': {
          fileScene: string;
          /** Format: binary */
          file: Blob;
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
            data: components['schemas']['a-file.dto.fileUploadResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  File_createDirectUpload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-file.dto.fileDirectUploadRequest'];
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
            data: components['schemas']['a-file.dto.fileDirectUploadResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  File_finalizeDirectUpload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-file.dto.fileDirectUploadFinalizeRequest'];
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
            data: components['schemas']['a-file.dto.fileDirectUploadFinalizeResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  File_uploadUrl: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-file.dto.fileUploadUrlRequest'];
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
            data: components['schemas']['a-file.dto.fileUploadResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  File_download: {
    parameters: {
      query: {
        fileId: number | string;
        token?: string | undefined;
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
  Image_getUploadPolicy: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-image.dto.imageUploadPolicyRequest'];
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
            data: components['schemas']['a-image.dto.imageUploadPolicyResponse'];
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
          imageScene: string;
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
  Image_finalizeDirectUpload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-image.dto.imageDirectUploadFinalizeRequest'];
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
            data: components['schemas']['a-image.dto.imageDirectUploadFinalizeResponse'];
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
      query: {
        imageId: number | string;
        variantName?: string | undefined;
        transformOptions?: components['schemas']['a-image.dto.imageTransformOptions_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
        token?: string | undefined;
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
  PayPaymentCallback_returned: {
    parameters: {
      query: {
        state: string;
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
  PayPaymentCallback_cancelled: {
    parameters: {
      query: {
        state: string;
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
  PayPaymentSession_start: {
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
            data: components['schemas']['a-pay.dto.paymentSessionView'];
          };
        };
      };
    };
    authToken: true;
  };
  PayPaymentSession_reconcile: {
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
            data: components['schemas']['a-pay.dto.paymentSessionView'];
          };
        };
      };
    };
    authToken: true;
  };
  PayPaymentSession_view: {
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
            data: components['schemas']['a-pay.dto.paymentSessionView'];
          };
        };
      };
    };
    authToken: true;
  };
  PayMockMockPayment_complete: {
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
        'application/json': components['schemas']['pay-mock.dto.mockPaymentComplete'];
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
            data: components['schemas']['pay-mock.dto.mockPaymentReceipt'];
          };
        };
      };
    };
    authToken: true;
  };
  PayMockMockPayment_completeRefund: {
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
        'application/json': components['schemas']['pay-mock.dto.mockRefundComplete'];
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
            data: components['schemas']['pay-mock.dto.mockRefundReceipt'];
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
