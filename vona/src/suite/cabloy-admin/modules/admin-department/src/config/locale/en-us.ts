export default {
  Operations: 'Operations',
  Department: 'Department',
  AllDepartments: 'All Departments',
  DepartmentName: 'Department Name',
  ParentDepartment: 'Parent Department',
  PlaceBeforeDepartment: 'Place Before Department',
  Enabled: 'Enabled',
  SortOrder: 'Sort Order',
  DepartmentMembership: 'Department Membership',
  DepartmentMemberships: 'Department Memberships',
  User: 'User',
  Position: 'Position',
  Primary: 'Primary',
  DepartmentManager: 'Department Manager',
  DepartmentNameAlreadyInUse: 'The Department name is already in use for this parent',
  DepartmentParentInvalid: 'The requested parent Department is unavailable',
  DepartmentCycleDetected: 'The requested move would create a Department cycle',
  DepartmentReorderInvalid: 'The requested Department reorder is invalid',
  DepartmentLifecycleBlocked: 'The Department has dependent records that must be handled first',
  DepartmentMembershipAlreadyExists: 'The user is already a member of this Department',
  DepartmentMembershipManagerReferenced:
    'The membership is the Department manager and must be handled explicitly',
  DepartmentMembershipUnavailable: 'The requested Department membership is unavailable',
  DepartmentMembershipDepartmentDisabled:
    'The Department must be enabled before adding or enabling memberships and assigning a manager',
  DepartmentMembershipPrimaryRequiresEnabled: 'Only an enabled membership can be primary',
  DepartmentManagerMembershipInvalid:
    'The Department manager must be an enabled membership of this Department',
  DepartmentMembershipManagerReplacementRequired:
    'The Department manager must be cleared or replaced before this membership changes',
  DepartmentMembershipManagerTransitionInvalid:
    'A manager transition is valid only when changing the current Department manager membership',
};
