export const errors = {
  RoleNameAlreadyInUse: { code: 1001, status: 409 },
  BuiltinRoleProtected: { code: 1002, status: 409 },
  InvalidRoleMembership: { code: 1003, status: 409 },
  FreshProofInvalid: { code: 1004, status: 401 },
  ProtectedCommandInvalid: { code: 1005, status: 409 },
  FinalSystemAdminProtected: { code: 1006, status: 409 },
  InactiveSystemAdminTarget: { code: 1007, status: 409 },
  InvalidProtectedReason: { code: 1008, status: 422 },
} as const;
