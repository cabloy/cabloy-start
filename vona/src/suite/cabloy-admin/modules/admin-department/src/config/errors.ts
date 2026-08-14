export const errors = {
  DepartmentNameAlreadyInUse: { code: 1001, status: 409 },
  DepartmentParentInvalid: { code: 1002, status: 409 },
  DepartmentCycleDetected: { code: 1003, status: 409 },
  DepartmentReorderInvalid: { code: 1004, status: 409 },
  DepartmentLifecycleBlocked: { code: 1005, status: 409 },
  DepartmentMembershipAlreadyExists: { code: 1006, status: 409 },
  DepartmentMembershipManagerReferenced: { code: 1007, status: 409 },
  DepartmentMembershipUnavailable: { code: 1008, status: 409 },
  DepartmentMembershipDepartmentDisabled: { code: 1009, status: 409 },
} as const;
