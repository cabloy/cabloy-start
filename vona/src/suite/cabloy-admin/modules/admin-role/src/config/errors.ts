export const errors = {
  RoleNameAlreadyInUse: { code: 1001, status: 409 },
  BuiltinRoleProtected: { code: 1002, status: 409 },
  InvalidRoleMembership: { code: 1003, status: 409 },
} as const;
