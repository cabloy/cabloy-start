export interface paths {
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
  '/api/home/user/account/current': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeUserAccount_current'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/account/profile': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch: operations['HomeUserAccount_updateProfile'];
    trace?: never;
  };
  '/api/home/user/account/activation/consume': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserAccount_consumeActivation'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/account/password/change': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserAccount_changePassword'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/account/password-set/issue': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserAccount_issuePasswordSetLink'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/account/password-set/consume': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserAccount_consumePasswordSet'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/account/password-reset/request': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserAccount_requestPasswordReset'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/account/password-reset/consume': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserAccount_consumePasswordReset'];
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
    /** List Student Training Records */
    get: operations['TrainingRecord_select'];
    put?: never;
    /** Create Student Training Record */
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
    /** View Student Training Record */
    get: operations['TrainingRecord_view'];
    put?: never;
    post?: never;
    /** Delete Student Training Record */
    delete: operations['TrainingRecord_delete'];
    options?: never;
    head?: never;
    /** Update Student Training Record */
    patch: operations['TrainingRecord_update'];
    trace?: never;
  };
  '/api/training/record/bulk': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /** Bulk Delete Student Training Records */
    delete: operations['TrainingRecord_deleteBulk'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training/student': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List Students */
    get: operations['TrainingStudent_select'];
    put?: never;
    /** Create Student */
    post: operations['TrainingStudent_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training/student/group': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Group Students */
    get: operations['TrainingStudent_group'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training/student/aggregate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Aggregate Students */
    get: operations['TrainingStudent_aggregate'];
    put?: never;
    post?: never;
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
    /** View Student */
    get: operations['TrainingStudent_view'];
    put?: never;
    post?: never;
    /** Delete Student */
    delete: operations['TrainingStudent_delete'];
    options?: never;
    head?: never;
    /** Update Student */
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
    /** View Student Summary */
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
    /** Permanently Delete Student */
    delete: operations['TrainingStudent_deleteForce'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training/student/bulk/delete': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Bulk Delete Students */
    post: operations['TrainingStudent_deleteBulk'];
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
  '/api/layoutprofile/load': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Layoutprofile_load'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/layoutprofile/save': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Layoutprofile_save'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/layoutprofile/reset': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete: operations['Layoutprofile_reset'];
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
  '/mcp/auth/summary': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Authorization_summary'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/mcp/auth/decision': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Authorization_decision'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/auth/authorizationGrant/mine': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['McpAuthAuthorizationGrant_mine'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/auth/authorizationGrant/revokeMine/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['McpAuthAuthorizationGrant_revokeMine'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/auth/authorizationGrant/deleteMine/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete: operations['McpAuthAuthorizationGrant_deleteMine'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/auth/customScope/mine': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List personal MCP scopes */
    get: operations['McpAuthCustomScope_mine'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/auth/customScope/catalog': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Available MCP tools */
    get: operations['McpAuthCustomScope_catalog'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/auth/customScope/createMine': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Create personal MCP scope */
    post: operations['McpAuthCustomScope_createMine'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/auth/customScope/updateMine/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Update personal MCP scope */
    post: operations['McpAuthCustomScope_updateMine'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/auth/customScope/deleteMine/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /** Delete personal MCP scope */
    delete: operations['McpAuthCustomScope_deleteMine'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/test/catalog/categories': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['McpTestCatalog_categories'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/test/catalog/products': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['McpTestCatalog_products'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/test/catalog/products/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['McpTestCatalog_detail'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/test/catalog/excluded': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['McpTestCatalog_excluded'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/test/actions/status': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Action Web summary
     * @description Action Web description
     */
    get: operations['McpTestToolFixture_status'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/test/actions/effect/{label}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['McpTestToolFixture_effect'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/test/actions/array': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['McpTestToolFixture_array'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/test/actions/unsupported': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['McpTestToolFixture_unsupported'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/test/actions/excluded': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['McpTestToolFixture_excluded'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mcp/test/actions/closed': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Action Web summary */
    get: operations['McpTestToolFixture_closed'];
    put?: never;
    post?: never;
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
      /** @enum {string} */
      status?: 'accepted' | 'rejected' | 'unknown' | 'limited';
      serverNow?: number;
      expiresAt?: number;
      resendAt?: number;
      retryAt?: number;
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
      actions?:
        | {
            [key: string]:
              | boolean
              | {
                  key: string;
                  allowed: boolean;
                  matcher:
                    | {
                        /** @enum {string} */
                        mode: 'all';
                      }
                    | {
                        /** @enum {string} */
                        mode: 'any';
                        rules: {
                          field: string;
                          values: string[];
                        }[];
                      };
                };
          }
        | undefined;
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
    'home-user.dto.accountCurrent': {
      name: string;
      displayName?: string | undefined;
      avatar?: string | undefined;
      locale?: unknown;
      tz?: string | undefined;
      hasSimpleAuth: boolean;
      canSendSetPasswordLink: boolean;
      eligibleEmailMasked?: string | undefined;
    };
    'home-user.dto.accountProfileUpdate': {
      /** @description Display name */
      displayName?: string | undefined;
      /**
       * Avatar
       * @description Absolute HTTP(S) avatar URL or API delivery URL
       */
      avatar?: string | undefined;
      /** @description Locale */
      locale?: string | undefined;
      /** @description Time zone */
      tz?: string | undefined;
    };
    'home-user.dto.accountActivation': {
      token: string;
    };
    'home-user.dto.accountRelogin': {
      requiresRelogin: boolean;
    };
    'home-user.dto.accountPasswordChange': {
      /** @description Current Password */
      currentPassword: string;
      /** @description New Password */
      newPassword: string;
      /** @description Confirm Password */
      passwordConfirm: string;
    };
    'home-user.dto.accountPasswordSetIssue': {
      /** Format: email */
      email: string;
      consumerUrl: string;
    };
    'home-user.dto.accountPasswordSet': {
      token: string;
      /** @description Password */
      newPassword: string;
      /** @description Confirm Password */
      passwordConfirm: string;
    };
    'home-user.dto.accountPasswordResetRequestResult': {
      accepted: boolean;
    };
    'home-user.dto.accountPasswordResetRequest': {
      /** Format: email */
      email: string;
      consumerUrl: string;
      captcha: components['schemas']['a-captcha.dto.captchaVerify_42dbf1a77dd2259bc46e709048a4a5eaa5f766ef_626802c24df1498cec99aab0854fedf90c9b6dd3_bb4fbbbf2ac4822c1e541f79b527745b9c7aa662'];
    };
    'a-captcha.dto.captchaVerify_42dbf1a77dd2259bc46e709048a4a5eaa5f766ef_626802c24df1498cec99aab0854fedf90c9b6dd3_bb4fbbbf2ac4822c1e541f79b527745b9c7aa662': {
      id: string;
      token: string;
    };
    'home-user.dto.accountPasswordReset': {
      token: string;
      /** @description Password */
      newPassword: string;
      /** @description Confirm Password */
      passwordConfirm: string;
    };
    'home-user.dto.passport_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          instanceId: number | string | undefined;
          user: components['schemas']['home-user.dto.passportUser'];
          auth: components['schemas']['a-auth.dto.auth'];
          roles: components['schemas']['home-user.entity.role'][];
        }
      | undefined;
    'home-user.dto.passportUser': {
      id: number | string;
      name: string;
      displayName?: string | undefined;
      avatar?: string | undefined;
      email?: string | undefined;
      mobile?: string | undefined;
      activated?: boolean | undefined;
      /**
       * @default active
       * @enum {string}
       */
      accountStatus?: 'active' | 'disabled';
      locale?: unknown;
      tz?: string | undefined;
      anonymous?: boolean | undefined;
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
      /** @default false */
      builtin?: boolean;
    };
    'home-user.dto.passportJwt': {
      passport: components['schemas']['home-user.dto.passport'];
      jwt: components['schemas']['a-jwt.dto.jwtToken'];
    };
    'home-user.dto.passport': {
      instanceId: number | string | undefined;
      user: components['schemas']['home-user.dto.passportUser'];
      auth: components['schemas']['a-auth.dto.auth'];
      roles: components['schemas']['home-user.entity.role'][];
    };
    'a-jwt.dto.jwtToken': {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    'home-user.dto.register': {
      /** @description User Name */
      username: string;
      /**
       * Format: email
       * @description Email
       */
      email: string;
      consumerUrl: string;
      /** @description Password */
      password: string;
      /** @description Confirm Password */
      passwordConfirm: string;
      captcha: components['schemas']['a-captcha.dto.captchaVerify_42dbf1a77dd2259bc46e709048a4a5eaa5f766ef_626802c24df1498cec99aab0854fedf90c9b6dd3_bb4fbbbf2ac4822c1e541f79b527745b9c7aa662_0aab216abd3467dd07f61c69172266c2441af477_885000189fd007fcdf19470e3413af66a203abe0'];
    };
    /** @description Captcha */
    'a-captcha.dto.captchaVerify_42dbf1a77dd2259bc46e709048a4a5eaa5f766ef_626802c24df1498cec99aab0854fedf90c9b6dd3_bb4fbbbf2ac4822c1e541f79b527745b9c7aa662_0aab216abd3467dd07f61c69172266c2441af477_885000189fd007fcdf19470e3413af66a203abe0': {
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
    /** @description Create Student Training Record */
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
      departmentId: number | string | undefined;
      userIdOwner: number | string;
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
    'TrainingRecordSelectQueryPredicate_12e26675b7b232083b85f3bb960e6f1048755230':
      | {
          /** @enum {string} */
          field: 'name';
          /** @enum {string} */
          op: 'eq' | 'containsI';
          value: string;
        }
      | {
          /** @enum {string} */
          field: 'studentId';
          /** @enum {string} */
          op: 'eq';
          value: string;
        }
      | {
          /** @enum {string} */
          field: 'studentName';
          /** @enum {string} */
          op: 'containsI';
          value: string;
        }
      | {
          /** @enum {string} */
          field: 'createdAt';
          /** @enum {string} */
          op: 'gte' | 'lt' | 'lte';
          /** Format: date-time */
          value: Date;
        }
      | {
          and: components['schemas']['TrainingRecordSelectQueryPredicate'][];
        }
      | {
          or: components['schemas']['TrainingRecordSelectQueryPredicate'][];
        }
      | {
          not: components['schemas']['TrainingRecordSelectQueryPredicate'];
        };
    'TrainingRecordSelectQueryPredicate':
      | {
          /** @enum {string} */
          field: 'name';
          /** @enum {string} */
          op: 'eq' | 'containsI';
          value: string;
        }
      | {
          /** @enum {string} */
          field: 'studentId';
          /** @enum {string} */
          op: 'eq';
          value: string;
        }
      | {
          /** @enum {string} */
          field: 'studentName';
          /** @enum {string} */
          op: 'containsI';
          value: string;
        }
      | {
          /** @enum {string} */
          field: 'createdAt';
          /** @enum {string} */
          op: 'gte' | 'lt' | 'lte';
          /** Format: date-time */
          value: Date;
        }
      | {
          and: components['schemas']['TrainingRecordSelectQueryPredicate'][];
        }
      | {
          or: components['schemas']['TrainingRecordSelectQueryPredicate'][];
        }
      | {
          not: components['schemas']['TrainingRecordSelectQueryPredicate'];
        };
    /** @description View Student Training Record */
    'training-record.dto.recordView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_79ca06e0fa89c8f250537d4a0b8a8cc1e39df05a':
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
          departmentId: number | string | undefined;
          userIdOwner: number | string;
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
    /** @description Update Student Training Record */
    'training-record.dto.recordUpdate': {
      /** @description Training Record Name */
      name: string;
      /** @description Student */
      studentId?: number | string | undefined;
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
    'training-record.dto.recordBulkDelete': {
      ids: (number | string)[];
    };
    /** @description Create Student */
    'training-student.dto.studentCreate': {
      /** @description Student Name */
      name: string;
      /** @description Mobile */
      mobile: string;
      /** @description Student Image */
      imageId?: number | string | undefined;
      /** @description Training Stage */
      level: 1 | 2 | 3;
      content?: {
        /** @description Description */
        descriptionMarkdown?: string | undefined;
      };
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
      /** @description Mobile */
      mobile: string;
      /** @description Student Image */
      imageId?: number | string | undefined;
      departmentId: number | string | undefined;
      userIdOwner: number | string;
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
    'TrainingStudentSelectQueryPredicate_1a30b20933e90ac2c50faf88c8a6099328e0ded8':
      | {
          /** @enum {string} */
          field: 'id';
          /** @enum {string} */
          op: 'eq';
          value: string;
        }
      | {
          /** @enum {string} */
          field: 'id';
          /** @enum {string} */
          op: 'in';
          value: string[];
        }
      | {
          /** @enum {string} */
          field: 'name';
          /** @enum {string} */
          op: 'eq' | 'containsI' | 'startsWith';
          value: string;
        }
      | {
          /** @enum {string} */
          field: 'level';
          /** @enum {string} */
          op: 'eq' | 'gte';
          value: 1 | 2 | 3;
        }
      | {
          /** @enum {string} */
          field: 'createdAt';
          /** @enum {string} */
          op: 'gte' | 'lt' | 'lte';
          /** Format: date-time */
          value: Date;
        }
      | {
          and: components['schemas']['TrainingStudentSelectQueryPredicate'][];
        }
      | {
          or: components['schemas']['TrainingStudentSelectQueryPredicate'][];
        }
      | {
          not: components['schemas']['TrainingStudentSelectQueryPredicate'];
        };
    'TrainingStudentSelectQueryPredicate':
      | {
          /** @enum {string} */
          field: 'id';
          /** @enum {string} */
          op: 'eq';
          value: string;
        }
      | {
          /** @enum {string} */
          field: 'id';
          /** @enum {string} */
          op: 'in';
          value: string[];
        }
      | {
          /** @enum {string} */
          field: 'name';
          /** @enum {string} */
          op: 'eq' | 'containsI' | 'startsWith';
          value: string;
        }
      | {
          /** @enum {string} */
          field: 'level';
          /** @enum {string} */
          op: 'eq' | 'gte';
          value: 1 | 2 | 3;
        }
      | {
          /** @enum {string} */
          field: 'createdAt';
          /** @enum {string} */
          op: 'gte' | 'lt' | 'lte';
          /** Format: date-time */
          value: Date;
        }
      | {
          and: components['schemas']['TrainingStudentSelectQueryPredicate'][];
        }
      | {
          or: components['schemas']['TrainingStudentSelectQueryPredicate'][];
        }
      | {
          not: components['schemas']['TrainingStudentSelectQueryPredicate'];
        };
    'training-student.dto.studentGroupResItem': {
      /** @description Training Stage */
      level?: 1 | 2 | 3 | undefined;
      count_all?: string | undefined;
      count_imageId?: string | undefined;
    };
    'training-student.dto.studentAggregateRes': {
      count_all?: string | undefined;
      count_imageId?: string | undefined;
    };
    /** @description View Student */
    'training-student.dto.studentView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_1587266c819c8b70731e8ba64e7460d7f2809951':
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
          /** @description Mobile */
          mobile: string;
          /** @description Student Image */
          imageId?: number | string | undefined;
          departmentId: number | string | undefined;
          userIdOwner: number | string;
          /** @description Training Stage */
          level: 1 | 2 | 3;
          content?: {
            /** @description Description */
            descriptionMarkdown?: string | undefined;
          };
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
          _descriptionMarkdown?: string | undefined;
        }
      | undefined;
    /** @description Update Student */
    'training-student.dto.studentUpdate': {
      /** @description Student Name */
      name: string;
      /** @description Mobile */
      mobile: string;
      /** @description Student Image */
      imageId?: number | string | undefined;
      /** @description Training Stage */
      level: 1 | 2 | 3;
      content?: {
        /**
         * @description Deleted
         * @default false
         */
        deleted?: boolean | undefined;
        /** @description ID */
        id?: number | string | undefined;
        /** @description Description */
        descriptionMarkdown?: string | undefined;
      };
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
          /** @description Mobile */
          mobile: string;
          /** @description Training Stage */
          level: 1 | 2 | 3;
          /** @description Description */
          descriptionMarkdown: string;
          /** @description Description */
          descriptionHtml: string;
          /** @description Level Title */
          levelTitle: string;
          /** @description Description Length */
          descriptionLength: number;
          /** @description Summary */
          summaryText: string;
        }
      | undefined;
    'training-student.dto.studentDeleteBulk': {
      ids: (number | string)[];
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
    'a-layoutprofile.dto.layoutProfile_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          /** @enum {number} */
          version: 1;
          schemaFingerprint?: string | undefined;
          columns: {
            key: string;
            visible: true | false;
            width: 'auto' | number;
          }[];
        }
      | undefined;
    'a-layoutprofile.dto.layoutProfile': {
      /** @enum {number} */
      version: 1;
      schemaFingerprint?: string | undefined;
      columns: {
        key: string;
        visible: true | false;
        width: 'auto' | number;
      }[];
    };
    'a-layoutprofile.dto.layoutProfileSave': {
      layoutKey: string;
      profile: {
        /** @enum {number} */
        version: 1;
        schemaFingerprint?: string | undefined;
        columns: {
          key: string;
          visible: true | false;
          width: 'auto' | number;
        }[];
      };
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
    'mcp-auth.dto.authorizationSummary': {
      clientName: string;
      resource: string;
      scope: string;
      options: components['schemas']['mcp-auth.dto.mcpScopeOption'][];
      expiresAt: number;
    };
    'mcp-auth.dto.mcpScopeOption': {
      scope: string;
      name: string;
      description: string;
      tools: components['schemas']['mcp-auth.dto.mcpScopeTool'][];
      allowed: boolean;
      /** @enum {string|null} */
      reason?:
        | 'outside_requested_scope'
        | 'outside_client_scope'
        | 'tools_unavailable'
        | null
        | undefined;
    };
    'mcp-auth.dto.mcpScopeTool': {
      name: string;
      controller: string;
      action: string;
      controllerSummary: string;
      summary: string;
      description: string;
      readOnly: boolean;
      available: boolean;
    };
    'mcp-auth.dto.authorizationRedirect': {
      redirectUrl: string;
    };
    'mcp-auth.dto.authorizationDecision': {
      request: string;
      allow: boolean;
      scope?: ('mcp:all' | 'mcp:read') | string | undefined;
    };
    'mcp-auth.dto.authorizationGrantMineRes': {
      list: components['schemas']['mcp-auth.dto.authorizationGrant'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'mcp-auth.dto.authorizationGrant': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /** @description ID */
      id: number | string;
      resource: string;
      scope: string;
      /** @default  */
      requestedScope?: string;
      /** @enum {string} */
      state: 'pending' | 'codeReady' | 'tokenActive' | 'denied' | 'revoked';
      expiresAt: number;
      tokenExpiresAt: number;
      /** @default false */
      refreshEnabled?: boolean;
      /** @default 0 */
      refreshExpiresAt?: number;
      clientId: string;
      clientName: string;
    };
    'mcp-auth.dto.customScopeMineRes': {
      list: components['schemas']['mcp-auth.dto.customScopeView'][];
    };
    'mcp-auth.dto.customScopeView': {
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
      /** @description ID */
      id: number | string;
      scope: string;
      /**
       * Name
       * @description Use 1–100 letters, digits, underscores or hyphens. Names are case-sensitive; test becomes mcp:custom:test.
       */
      name: string;
      /** @description Description */
      description: string;
      /** @description Tools */
      tools: components['schemas']['mcp-auth.dto.mcpToolIdentity'][];
    };
    'mcp-auth.dto.mcpToolIdentity': {
      name: string;
      controller: string;
      action: string;
    };
    'mcp-auth.dto.mcpTool': {
      name: string;
      controller: string;
      action: string;
      controllerSummary: string;
      summary: string;
      description: string;
      readOnly: boolean;
    };
    'mcp-auth.dto.customScopeCreate_1ff20af69286149eb0b25291d9450172f7bd0054': {
      /**
       * Name
       * @description Use 1–100 letters, digits, underscores or hyphens. Names are case-sensitive; test becomes mcp:custom:test.
       */
      name: string;
      /** @description Description */
      description: string;
      /** @description Tools */
      tools: components['schemas']['mcp-auth.dto.mcpToolIdentity'][];
    };
    'mcp-test.dto.categoryPublicSelectRes': {
      list: components['schemas']['mcp-test.dto.categoryPublic'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'mcp-test.dto.categoryPublic': {
      id: number | string;
      name: string;
      description?: string | undefined;
    };
    'mcp-test.dto.productPublicSelectRes': {
      list: components['schemas']['mcp-test.dto.productPublic'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'mcp-test.dto.productPublic': {
      id: number | string;
      title: string;
      description?: string | undefined;
      categoryId: number | string;
      categoryName: string;
      priceCents: number;
      available: number;
      skuAvailables: components['schemas']['mcp-test.dto.productPublicSku'][];
    };
    'mcp-test.dto.productPublicSku': {
      id: number | string;
      code: string;
      priceCents: number;
      available: number;
    };
    'mcp-test.dto.productPublicDetail_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          id: number | string;
          title: string;
          description?: string | undefined;
          categoryId: number | string;
          categoryName: string;
          priceCents: number;
          available: number;
          skuAvailables: components['schemas']['mcp-test.dto.productPublicSku'][];
          descriptionHtml?: string | undefined;
        }
      | undefined;
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
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
          payload?: unknown;
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
          id?: string | undefined;
          scene: string;
          payload?: unknown;
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
  HomeUserAccount_current: {
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
            data: components['schemas']['home-user.dto.accountCurrent'];
          };
        };
      };
    };
    authToken: true;
  };
  HomeUserAccount_updateProfile: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['home-user.dto.accountProfileUpdate'];
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
            data: components['schemas']['home-user.dto.accountCurrent'];
          };
        };
      };
    };
    authToken: true;
  };
  HomeUserAccount_consumeActivation: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['home-user.dto.accountActivation'];
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
  HomeUserAccount_changePassword: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['home-user.dto.accountPasswordChange'];
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
            data: components['schemas']['home-user.dto.accountRelogin'];
          };
        };
      };
    };
    authToken: true;
  };
  HomeUserAccount_issuePasswordSetLink: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['home-user.dto.accountPasswordSetIssue'];
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
  HomeUserAccount_consumePasswordSet: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['home-user.dto.accountPasswordSet'];
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
            data: components['schemas']['home-user.dto.accountRelogin'];
          };
        };
      };
    };
  };
  HomeUserAccount_requestPasswordReset: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['home-user.dto.accountPasswordResetRequest'];
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
            data: components['schemas']['home-user.dto.accountPasswordResetRequestResult'];
          };
        };
      };
    };
  };
  HomeUserAccount_consumePasswordReset: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['home-user.dto.accountPasswordReset'];
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
            data: components['schemas']['home-user.dto.accountRelogin'];
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
        createdAt?: string | undefined;
        name?: string | undefined;
        studentId?: string | undefined;
        where?: components['schemas']['TrainingRecordSelectQueryPredicate_12e26675b7b232083b85f3bb960e6f1048755230'];
        orders?:
          | {
              /** @enum {string} */
              field: 'id' | 'name' | 'studentId' | 'studentName' | 'createdAt';
              /** @enum {string} */
              direction: 'asc' | 'desc';
            }[]
          | undefined;
        pageNo?: number | undefined;
        pageSize?: number | undefined;
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
            data?: components['schemas']['training-record.dto.recordView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_79ca06e0fa89c8f250537d4a0b8a8cc1e39df05a'];
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
  TrainingRecord_deleteBulk: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['training-record.dto.recordBulkDelete'];
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
        createdAt?: string | undefined;
        name?: string | undefined;
        level?: 1 | 2 | 3 | undefined;
        where?: components['schemas']['TrainingStudentSelectQueryPredicate_1a30b20933e90ac2c50faf88c8a6099328e0ded8'];
        orders?:
          | {
              /** @enum {string} */
              field: 'id' | 'name' | 'level' | 'createdAt';
              /** @enum {string} */
              direction: 'asc' | 'desc';
            }[]
          | undefined;
        pageNo?: number | undefined;
        pageSize?: number | undefined;
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
  TrainingStudent_group: {
    parameters: {
      query?: {
        createdAt?: string | undefined;
        name?: string | undefined;
        level?: 1 | 2 | 3 | undefined;
        where?: components['schemas']['TrainingStudentSelectQueryPredicate_1a30b20933e90ac2c50faf88c8a6099328e0ded8'];
        aggrs?: {
          count?: ('*' | 'imageId')[] | undefined;
        };
        groups?: 'level'[];
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
            data: components['schemas']['training-student.dto.studentGroupResItem'][];
          };
        };
      };
    };
    authToken: true;
  };
  TrainingStudent_aggregate: {
    parameters: {
      query?: {
        createdAt?: string | undefined;
        name?: string | undefined;
        level?: 1 | 2 | 3 | undefined;
        where?: components['schemas']['TrainingStudentSelectQueryPredicate_1a30b20933e90ac2c50faf88c8a6099328e0ded8'];
        aggrs?: {
          count?: ('*' | 'imageId')[] | undefined;
        };
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
            data: components['schemas']['training-student.dto.studentAggregateRes'];
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
            data?: components['schemas']['training-student.dto.studentView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_1587266c819c8b70731e8ba64e7460d7f2809951'];
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
  TrainingStudent_deleteBulk: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['training-student.dto.studentDeleteBulk'];
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
  Layoutprofile_load: {
    parameters: {
      query: {
        layoutKey: string;
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
            data?: components['schemas']['a-layoutprofile.dto.layoutProfile_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
          };
        };
      };
    };
    authToken: true;
  };
  Layoutprofile_save: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-layoutprofile.dto.layoutProfileSave'];
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
            data: components['schemas']['a-layoutprofile.dto.layoutProfile'];
          };
        };
      };
    };
    authToken: true;
  };
  Layoutprofile_reset: {
    parameters: {
      query: {
        layoutKey: string;
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
  Authorization_summary: {
    parameters: {
      query: {
        request: string;
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
            data: components['schemas']['mcp-auth.dto.authorizationSummary'];
          };
        };
      };
    };
    authToken: true;
  };
  Authorization_decision: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['mcp-auth.dto.authorizationDecision'];
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
            data: components['schemas']['mcp-auth.dto.authorizationRedirect'];
          };
        };
      };
    };
    authToken: true;
  };
  McpAuthAuthorizationGrant_mine: {
    parameters: {
      query?: {
        pageNo?: number;
        pageSize?: number;
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
            data: components['schemas']['mcp-auth.dto.authorizationGrantMineRes'];
          };
        };
      };
    };
    authToken: true;
  };
  McpAuthAuthorizationGrant_revokeMine: {
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
  McpAuthAuthorizationGrant_deleteMine: {
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
  McpAuthCustomScope_mine: {
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
            data: components['schemas']['mcp-auth.dto.customScopeMineRes'];
          };
        };
      };
    };
    authToken: true;
  };
  McpAuthCustomScope_catalog: {
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
            data: components['schemas']['mcp-auth.dto.mcpTool'][];
          };
        };
      };
    };
    authToken: true;
  };
  McpAuthCustomScope_createMine: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['mcp-auth.dto.customScopeCreate_1ff20af69286149eb0b25291d9450172f7bd0054'];
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
            data: components['schemas']['mcp-auth.dto.customScopeView'];
          };
        };
      };
    };
    authToken: true;
  };
  McpAuthCustomScope_updateMine: {
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
        'application/json': components['schemas']['mcp-auth.dto.customScopeCreate_1ff20af69286149eb0b25291d9450172f7bd0054'];
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
            data: components['schemas']['mcp-auth.dto.customScopeView'];
          };
        };
      };
    };
    authToken: true;
  };
  McpAuthCustomScope_deleteMine: {
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
  McpTestCatalog_categories: {
    parameters: {
      query?: {
        pageNo?: number;
        pageSize?: number;
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
            data: components['schemas']['mcp-test.dto.categoryPublicSelectRes'];
          };
        };
      };
    };
  };
  McpTestCatalog_products: {
    parameters: {
      query?: {
        pageNo?: number;
        pageSize?: number;
        categoryId?: number | string | undefined;
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
            data: components['schemas']['mcp-test.dto.productPublicSelectRes'];
          };
        };
      };
    };
  };
  McpTestCatalog_detail: {
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
            data?: components['schemas']['mcp-test.dto.productPublicDetail_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
          };
        };
      };
    };
  };
  McpTestCatalog_excluded: {
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
            data: components['schemas']['mcp-test.dto.categoryPublicSelectRes'];
          };
        };
      };
    };
  };
  McpTestToolFixture_status: {
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
            data: {
              count: number;
            };
          };
        };
      };
    };
  };
  McpTestToolFixture_effect: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        label: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          amount: number;
          priority?: number | undefined;
          note?: string | undefined;
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
            data: {
              count: number;
              label: string;
              priority?: number | undefined;
              note?: string | undefined;
            };
          };
        };
      };
    };
  };
  McpTestToolFixture_array: {
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
            data: string[];
          };
        };
      };
    };
  };
  McpTestToolFixture_unsupported: {
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
          'text/plain': string;
        };
      };
    };
  };
  McpTestToolFixture_excluded: {
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
          'text/plain': string;
        };
      };
    };
  };
  McpTestToolFixture_closed: {
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
            data: {
              count: number;
            };
          };
        };
      };
    };
  };
}
