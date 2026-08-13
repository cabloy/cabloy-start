export const errors = {
  DepartmentNameAlreadyInUse: { code: 1001, status: 409 },
  DepartmentParentInvalid: { code: 1002, status: 409 },
  DepartmentCycleDetected: { code: 1003, status: 409 },
  DepartmentReorderInvalid: { code: 1004, status: 409 },
  DepartmentLifecycleBlocked: { code: 1005, status: 409 },
} as const;
