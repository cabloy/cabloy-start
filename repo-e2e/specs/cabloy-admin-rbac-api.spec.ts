import type { APIRequestContext, APIResponse, TestInfo } from '@playwright/test';

import { expect, test } from '@playwright/test';

import type { RegisteredAccount, TableIdentity } from './helpers/cabloy-admin-api.ts';

import {
  loginAsAdmin,
  registerAccountUser,
  removeAccountFixture,
  requestApi,
  requestApiOk,
  runCleanup,
} from './helpers/cabloy-admin-api.ts';

test.describe.configure({ mode: 'serial' });

type DataScope =
  | 'all'
  | 'customDepartments'
  | 'ownDepartment'
  | 'ownDepartmentAndDescendants'
  | 'mine';

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type ActionKey =
  | 'training-student.controller.student#create'
  | 'training-student.controller.student#select'
  | 'training-student.controller.student#view'
  | 'training-student.controller.student#update'
  | 'training-student.controller.student#delete'
  | 'training-record.controller.record#create'
  | 'training-record.controller.record#select'
  | 'training-record.controller.record#view'
  | 'training-record.controller.record#update'
  | 'training-record.controller.record#delete';

interface Paged<T> {
  list: T[];
  total: number | string;
  pageCount: number;
  pageSize: number;
  pageNo: number;
}

interface ScopedEntity {
  id: TableIdentity;
  name: string;
  departmentId?: TableIdentity | null;
  userIdOwner?: TableIdentity;
  iid?: string;
  mobile?: string;
  level?: number;
  description?: string;
  studentId?: TableIdentity;
}

interface MembershipFixture {
  departmentId: TableIdentity;
  membershipId: TableIdentity;
}

interface ApiFixtureLedger {
  accounts: RegisteredAccount[];
  roles: TableIdentity[];
  departments: TableIdentity[];
  memberships: MembershipFixture[];
  grants: TableIdentity[];
  grantDepartments: TableIdentity[];
  students: TableIdentity[];
  records: TableIdentity[];
}

const actionKeys = {
  student: {
    create: 'training-student.controller.student#create',
    select: 'training-student.controller.student#select',
    view: 'training-student.controller.student#view',
    update: 'training-student.controller.student#update',
    delete: 'training-student.controller.student#delete',
  },
  record: {
    create: 'training-record.controller.record#create',
    select: 'training-record.controller.record#select',
    view: 'training-record.controller.record#view',
    update: 'training-record.controller.record#update',
    delete: 'training-record.controller.record#delete',
  },
} as const satisfies Record<string, Record<string, ActionKey>>;

function createLedger(): ApiFixtureLedger {
  return {
    accounts: [],
    roles: [],
    departments: [],
    memberships: [],
    grants: [],
    grantDepartments: [],
    students: [],
    records: [],
  };
}

function idMatches(left: TableIdentity, right: TableIdentity): boolean {
  return String(left) === String(right);
}

function apiId(id: TableIdentity): string {
  return String(id);
}

function removeFixtureId(ids: TableIdentity[], id: TableIdentity) {
  const index = ids.findIndex(item => idMatches(item, id));
  if (index >= 0) ids.splice(index, 1);
}

function testSuffix(testInfo: TestInfo): string {
  return `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${Date.now()}`;
}

function mobile(seed: number): string {
  return `139${String(seed).padStart(8, '0').slice(-8)}`;
}

async function expectStatus(
  request: APIRequestContext,
  method: Method,
  pathname: string,
  status: number,
  options: Parameters<typeof requestApi>[3] = {},
): Promise<APIResponse> {
  const response = await requestApi(request, method, pathname, options);
  expect(response.status(), `${method} ${pathname}`).toBe(status);
  return response;
}

async function createRole(
  request: APIRequestContext,
  admin: RegisteredAccount,
  ledger: ApiFixtureLedger,
  name: string,
): Promise<TableIdentity> {
  const role = await requestApiOk<{ id: TableIdentity }>(request, 'POST', '/api/admin/role', {
    accessToken: admin.accessToken,
    data: { name, title: name, siteIds: ['admin'] },
  });
  ledger.roles.push(role.id);
  return role.id;
}

async function assignRole(
  request: APIRequestContext,
  admin: RegisteredAccount,
  account: RegisteredAccount,
  roleId: TableIdentity,
): Promise<void> {
  await requestApiOk<null>(request, 'PUT', `/api/admin/role/user/${account.id}/roles`, {
    accessToken: admin.accessToken,
    data: { roleIds: [roleId] },
  });
}

async function createDepartment(
  request: APIRequestContext,
  admin: RegisteredAccount,
  ledger: ApiFixtureLedger,
  name: string,
  parentId: TableIdentity | null = null,
): Promise<TableIdentity> {
  const id = await requestApiOk<TableIdentity>(request, 'POST', '/api/admin/department', {
    accessToken: admin.accessToken,
    data: { name, parentId },
  });
  ledger.departments.push(id);
  return id;
}

async function createMembership(
  request: APIRequestContext,
  admin: RegisteredAccount,
  ledger: ApiFixtureLedger,
  departmentId: TableIdentity,
  account: RegisteredAccount,
): Promise<TableIdentity> {
  const membershipId = await requestApiOk<TableIdentity>(
    request,
    'POST',
    `/api/admin/department/${departmentId}/memberships`,
    {
      accessToken: admin.accessToken,
      data: { userId: account.id },
    },
  );
  ledger.memberships.push({ departmentId, membershipId });
  return membershipId;
}

async function createGrant(
  request: APIRequestContext,
  admin: RegisteredAccount,
  ledger: ApiFixtureLedger,
  roleId: TableIdentity,
  actionKey: ActionKey,
  dataScope: DataScope,
  enabled = true,
): Promise<TableIdentity> {
  const id = await requestApiOk<TableIdentity>(request, 'POST', '/api/admin/rbac/rbacGrant', {
    accessToken: admin.accessToken,
    data: { roleId, actionKey, dataScope, enabled },
  });
  ledger.grants.push(id);
  return id;
}

async function mapGrantDepartment(
  request: APIRequestContext,
  admin: RegisteredAccount,
  ledger: ApiFixtureLedger,
  rbacGrantId: TableIdentity,
  departmentId: TableIdentity,
): Promise<TableIdentity> {
  const id = await requestApiOk<TableIdentity>(
    request,
    'POST',
    '/api/admin/rbac/rbacGrantDepartment',
    {
      accessToken: admin.accessToken,
      data: { rbacGrantId, departmentId },
    },
  );
  ledger.grantDepartments.push(id);
  return id;
}

async function deleteGrant(
  request: APIRequestContext,
  admin: RegisteredAccount,
  ledger: ApiFixtureLedger,
  grantId: TableIdentity,
): Promise<void> {
  await requestApiOk<null>(request, 'DELETE', `/api/admin/rbac/rbacGrant/${grantId}`, {
    accessToken: admin.accessToken,
  });
  removeFixtureId(ledger.grants, grantId);
}

async function deleteGrantDepartment(
  request: APIRequestContext,
  admin: RegisteredAccount,
  ledger: ApiFixtureLedger,
  grantDepartmentId: TableIdentity,
): Promise<void> {
  await requestApiOk<null>(
    request,
    'DELETE',
    `/api/admin/rbac/rbacGrantDepartment/${grantDepartmentId}`,
    { accessToken: admin.accessToken },
  );
  removeFixtureId(ledger.grantDepartments, grantDepartmentId);
}

async function createStudent(
  request: APIRequestContext,
  account: RegisteredAccount,
  ledger: ApiFixtureLedger,
  data: Record<string, unknown>,
): Promise<TableIdentity> {
  const id = await requestApiOk<TableIdentity>(request, 'POST', '/api/training/student', {
    accessToken: account.accessToken,
    data,
  });
  ledger.students.push(id);
  return id;
}

async function createRecord(
  request: APIRequestContext,
  account: RegisteredAccount,
  ledger: ApiFixtureLedger,
  data: Record<string, unknown>,
): Promise<TableIdentity> {
  const id = await requestApiOk<TableIdentity>(request, 'POST', '/api/training/record', {
    accessToken: account.accessToken,
    data,
  });
  ledger.records.push(id);
  return id;
}

async function getStudent(
  request: APIRequestContext,
  account: RegisteredAccount,
  id: TableIdentity,
): Promise<ScopedEntity> {
  return await requestEntity(request, account, `/api/training/student/${id}`);
}

async function getRecord(
  request: APIRequestContext,
  account: RegisteredAccount,
  id: TableIdentity,
): Promise<ScopedEntity> {
  return await requestEntity(request, account, `/api/training/record/${id}`);
}

async function requestEntity(
  request: APIRequestContext,
  account: RegisteredAccount,
  pathname: string,
): Promise<ScopedEntity> {
  const response = await requestApi(request, 'GET', pathname, { accessToken: account.accessToken });
  expect(response.ok(), `GET ${pathname}`).toBeTruthy();
  const body = (await response.json()) as { data?: ScopedEntity } | ScopedEntity;
  const data = 'data' in body ? body.data : body;
  if (!data) throw new Error(`${pathname} response is missing data`);
  return data;
}

async function listStudents(
  request: APIRequestContext,
  account: RegisteredAccount,
  names: string[],
  where?: Record<string, unknown>,
): Promise<ScopedEntity[]> {
  const response = await requestApi(request, 'GET', '/api/training/student', {
    accessToken: account.accessToken,
    params: {
      pageNo: 1,
      pageSize: 100,
      where: where ?? { name: { _in_: names } },
      orders: [['name', 'asc']],
    },
  });
  expect(response.ok(), 'GET /api/training/student').toBeTruthy();
  const body = (await response.json()) as { data?: Paged<ScopedEntity> } | Paged<ScopedEntity>;
  const data = 'data' in body ? body.data : body;
  if (!data) throw new Error('Student select response is missing data');
  expect(data.total).toEqual(expect.anything());
  return data.list;
}

async function deleteIfPresent(
  request: APIRequestContext,
  pathname: string,
  accessToken: string,
): Promise<void> {
  const response = await requestApi(request, 'DELETE', pathname, { accessToken });
  expect([200, 204, 404], `DELETE ${pathname}`).toContain(response.status());
}

async function cleanupFixtures(
  request: APIRequestContext,
  admin: RegisteredAccount,
  ledger: ApiFixtureLedger,
): Promise<void> {
  await runCleanup([
    ...ledger.records.toReversed().map(id => async () => {
      await deleteIfPresent(request, `/api/training/record/${id}`, admin.accessToken);
    }),
    ...ledger.students.toReversed().map(id => async () => {
      await deleteIfPresent(request, `/api/training/student/deleteForce/${id}`, admin.accessToken);
    }),
    ...ledger.grantDepartments.toReversed().map(id => async () => {
      await deleteIfPresent(
        request,
        `/api/admin/rbac/rbacGrantDepartment/${id}`,
        admin.accessToken,
      );
    }),
    ...ledger.grants.toReversed().map(id => async () => {
      await deleteIfPresent(request, `/api/admin/rbac/rbacGrant/${id}`, admin.accessToken);
    }),
    ...ledger.memberships.toReversed().map(({ departmentId, membershipId }) => async () => {
      await deleteIfPresent(
        request,
        `/api/admin/department/${departmentId}/memberships/${membershipId}`,
        admin.accessToken,
      );
    }),
    ...ledger.departments.toReversed().map(id => async () => {
      await deleteIfPresent(request, `/api/admin/department/${id}`, admin.accessToken);
    }),
    ...ledger.roles.toReversed().map(id => async () => {
      await deleteIfPresent(request, `/api/admin/role/${id}`, admin.accessToken);
    }),
    ...ledger.accounts.toReversed().map(account => async () => {
      await removeAccountFixture(request, account);
    }),
  ]);
}

async function cleanupWithoutMaskingFailure(
  request: APIRequestContext,
  admin: RegisteredAccount,
  ledger: ApiFixtureLedger,
  testInfo: TestInfo,
  testFailure: unknown,
): Promise<void> {
  try {
    await cleanupFixtures(request, admin, ledger);
  } catch (cleanupError) {
    await testInfo.attach('fixture-cleanup-error.txt', {
      body: String(cleanupError),
      contentType: 'text/plain',
    });
    if (!testFailure) throw cleanupError;
  }
}

async function createAccount(
  request: APIRequestContext,
  ledger: ApiFixtureLedger,
  testInfo: TestInfo,
): Promise<RegisteredAccount> {
  const account = await registerAccountUser(request, testInfo);
  ledger.accounts.push(account);
  return account;
}

async function grantReadScope(
  request: APIRequestContext,
  admin: RegisteredAccount,
  ledger: ApiFixtureLedger,
  roleId: TableIdentity,
  dataScope: DataScope,
  departmentIds: TableIdentity[] = [],
): Promise<{ grants: TableIdentity[]; grantDepartments: TableIdentity[] }> {
  const grants: TableIdentity[] = [];
  const grantDepartments: TableIdentity[] = [];
  for (const actionKey of [actionKeys.student.select, actionKeys.student.view]) {
    const grantId = await createGrant(request, admin, ledger, roleId, actionKey, dataScope);
    grants.push(grantId);
    for (const departmentId of departmentIds) {
      grantDepartments.push(
        await mapGrantDepartment(request, admin, ledger, grantId, departmentId),
      );
    }
  }
  return { grants, grantDepartments };
}

async function revokeReadScope(
  request: APIRequestContext,
  admin: RegisteredAccount,
  ledger: ApiFixtureLedger,
  scope: { grants: TableIdentity[]; grantDepartments: TableIdentity[] },
): Promise<void> {
  for (const id of scope.grantDepartments.toReversed()) {
    await deleteGrantDepartment(request, admin, ledger, id);
  }
  for (const id of scope.grants.toReversed()) {
    await deleteGrant(request, admin, ledger, id);
  }
}

test(
  'ATP-ADM-POL-02: direct policy admission, control-plane protection, and invalidation',
  { tag: ['@admin', '@cabloy-admin', '@admin-rbac-api'] },
  async ({ request }, testInfo) => {
    const suffix = testSuffix(testInfo);
    const ledger = createLedger();
    const admin = await loginAsAdmin(request);
    const delegated = await createAccount(request, ledger, testInfo);
    let testFailure: unknown;

    try {
      const roleId = await createRole(request, admin, ledger, `ATP API Policy ${suffix}`);
      await assignRole(request, admin, delegated, roleId);

      const unrestrictedList = await requestApi(request, 'GET', '/api/training/student', {
        accessToken: admin.accessToken,
        params: { pageNo: 1, pageSize: 1 },
      });
      expect(unrestrictedList.ok()).toBeTruthy();

      await expectStatus(request, 'GET', '/api/training/student', 403, {
        accessToken: delegated.accessToken,
      });
      await expectStatus(request, 'GET', '/api/admin/rbac/rbacGrant', 403, {
        accessToken: delegated.accessToken,
      });
      await expectStatus(request, 'GET', '/api/admin/rbac/rbacGrantDepartment', 403, {
        accessToken: delegated.accessToken,
      });
      await expectStatus(request, 'GET', '/api/admin/rbac/rbacPolicy/catalog', 403, {
        accessToken: delegated.accessToken,
      });
      await expectStatus(
        request,
        'GET',
        `/api/admin/rbac/rbacPolicy/roles/${roleId}/configuration`,
        403,
        { accessToken: delegated.accessToken },
      );

      for (const pathname of [
        '/api/admin/rbac/rbacGrant',
        '/api/admin/rbac/rbacGrantDepartment',
        '/api/admin/rbac/rbacPolicy/catalog',
        `/api/admin/rbac/rbacPolicy/roles/${roleId}/configuration`,
      ]) {
        const response = await requestApi(request, 'GET', pathname, {
          accessToken: admin.accessToken,
        });
        expect(response.ok(), `system administrator ${pathname}`).toBeTruthy();
      }

      const selectGrantId = await createGrant(
        request,
        admin,
        ledger,
        roleId,
        actionKeys.student.select,
        'all',
        false,
      );
      await expectStatus(request, 'GET', '/api/training/student', 403, {
        accessToken: delegated.accessToken,
      });

      await requestApiOk<null>(request, 'PATCH', `/api/admin/rbac/rbacGrant/${selectGrantId}`, {
        accessToken: admin.accessToken,
        data: { enabled: true },
      });
      const admitted = await requestApi(request, 'GET', '/api/training/student', {
        accessToken: delegated.accessToken,
        params: { pageNo: 1, pageSize: 1 },
      });
      expect(admitted.ok()).toBeTruthy();

      await expectStatus(request, 'GET', '/api/training/student/999999999', 403, {
        accessToken: delegated.accessToken,
      });

      await requestApiOk<null>(request, 'PATCH', `/api/admin/rbac/rbacGrant/${selectGrantId}`, {
        accessToken: admin.accessToken,
        data: { enabled: false },
      });
      await expectStatus(request, 'GET', '/api/training/student', 403, {
        accessToken: delegated.accessToken,
      });

      await requestApiOk<null>(request, 'PATCH', `/api/admin/rbac/rbacGrant/${selectGrantId}`, {
        accessToken: admin.accessToken,
        data: { enabled: true },
      });
      const readmitted = await requestApi(request, 'GET', '/api/training/student', {
        accessToken: delegated.accessToken,
        params: { pageNo: 1, pageSize: 1 },
      });
      expect(readmitted.ok()).toBeTruthy();

      await deleteGrant(request, admin, ledger, selectGrantId);
      await expectStatus(request, 'GET', '/api/training/student', 403, {
        accessToken: delegated.accessToken,
      });

      const recreatedGrantId = await createGrant(
        request,
        admin,
        ledger,
        roleId,
        actionKeys.student.select,
        'all',
      );
      const recreatedAdmission = await requestApi(request, 'GET', '/api/training/student', {
        accessToken: delegated.accessToken,
        params: { pageNo: 1, pageSize: 1 },
      });
      expect(recreatedAdmission.ok()).toBeTruthy();
      await deleteGrant(request, admin, ledger, recreatedGrantId);
    } catch (error) {
      testFailure = error;
      throw error;
    } finally {
      await cleanupWithoutMaskingFailure(request, admin, ledger, testInfo, testFailure);
    }
  },
);

test(
  'ATP-ADM-SCP-01: direct five-scope union and structural-filter matrix',
  { tag: ['@admin', '@cabloy-admin', '@admin-rbac-api'] },
  async ({ request }, testInfo) => {
    const suffix = testSuffix(testInfo);
    const ledger = createLedger();
    const admin = await loginAsAdmin(request);
    const subject = await createAccount(request, ledger, testInfo);
    const rootOther = await createAccount(request, ledger, testInfo);
    const childOwner = await createAccount(request, ledger, testInfo);
    const siblingOwner = await createAccount(request, ledger, testInfo);
    let testFailure: unknown;

    try {
      const rootDepartmentId = await createDepartment(
        request,
        admin,
        ledger,
        `ATP Scope Root ${suffix}`,
      );
      const childDepartmentId = await createDepartment(
        request,
        admin,
        ledger,
        `ATP Scope Child ${suffix}`,
        rootDepartmentId,
      );
      const siblingDepartmentId = await createDepartment(
        request,
        admin,
        ledger,
        `ATP Scope Sibling ${suffix}`,
      );
      await createMembership(request, admin, ledger, rootDepartmentId, subject);
      await createMembership(request, admin, ledger, rootDepartmentId, rootOther);
      await createMembership(request, admin, ledger, childDepartmentId, childOwner);
      await createMembership(request, admin, ledger, siblingDepartmentId, siblingOwner);

      const subjectRoleId = await createRole(request, admin, ledger, `ATP Scope Subject ${suffix}`);
      const rootRoleId = await createRole(request, admin, ledger, `ATP Scope Root Owner ${suffix}`);
      const childRoleId = await createRole(
        request,
        admin,
        ledger,
        `ATP Scope Child Owner ${suffix}`,
      );
      const siblingRoleId = await createRole(
        request,
        admin,
        ledger,
        `ATP Scope Sibling Owner ${suffix}`,
      );
      await assignRole(request, admin, subject, subjectRoleId);
      await assignRole(request, admin, rootOther, rootRoleId);
      await assignRole(request, admin, childOwner, childRoleId);
      await assignRole(request, admin, siblingOwner, siblingRoleId);

      for (const [roleId] of [
        [subjectRoleId],
        [rootRoleId],
        [childRoleId],
        [siblingRoleId],
      ] as const) {
        await createGrant(
          request,
          admin,
          ledger,
          roleId,
          actionKeys.student.create,
          'ownDepartment',
        );
      }

      const names = {
        mine: `ATP Scope Mine ${suffix}`,
        rootOther: `ATP Scope Root Other ${suffix}`,
        child: `ATP Scope Child ${suffix}`,
        sibling: `ATP Scope Sibling ${suffix}`,
      };
      const mineId = await createStudent(request, subject, ledger, {
        name: names.mine,
        mobile: mobile(101),
        level: 1,
      });
      const rootOtherId = await createStudent(request, rootOther, ledger, {
        name: names.rootOther,
        mobile: mobile(102),
        level: 1,
      });
      const childId = await createStudent(request, childOwner, ledger, {
        name: names.child,
        mobile: mobile(103),
        level: 2,
      });
      const siblingId = await createStudent(request, siblingOwner, ledger, {
        name: names.sibling,
        mobile: mobile(104),
        level: 3,
      });
      const allNames = Object.values(names);

      const assertScope = async (
        dataScope: DataScope,
        departmentIds: TableIdentity[],
        expectedNames: string[],
        admittedId: TableIdentity,
        forbiddenId?: TableIdentity,
      ) => {
        const scope = await grantReadScope(
          request,
          admin,
          ledger,
          subjectRoleId,
          dataScope,
          departmentIds,
        );
        try {
          const list = await listStudents(request, subject, allNames);
          expect(list.map(item => item.name).sort()).toEqual(expectedNames.toSorted());
          expect((await getStudent(request, subject, admittedId)).id).toEqual(admittedId);
          if (forbiddenId !== undefined) {
            await expectStatus(request, 'GET', `/api/training/student/${forbiddenId}`, 403, {
              accessToken: subject.accessToken,
            });
          }
        } finally {
          await revokeReadScope(request, admin, ledger, scope);
        }
      };

      await assertScope('all', [], allNames, siblingId);
      await assertScope(
        'customDepartments',
        [rootDepartmentId],
        [names.mine, names.rootOther],
        mineId,
        childId,
      );
      await assertScope('ownDepartment', [], [names.mine, names.rootOther], rootOtherId, childId);
      await assertScope(
        'ownDepartmentAndDescendants',
        [],
        [names.mine, names.rootOther, names.child],
        childId,
        siblingId,
      );
      await assertScope('mine', [], [names.mine], mineId, rootOtherId);

      const unionMine = await grantReadScope(request, admin, ledger, subjectRoleId, 'mine');
      const unionCustom = await grantReadScope(
        request,
        admin,
        ledger,
        subjectRoleId,
        'customDepartments',
        [siblingDepartmentId],
      );
      try {
        const list = await listStudents(request, subject, allNames);
        expect(list.map(item => item.name).sort()).toEqual([names.mine, names.sibling].toSorted());
      } finally {
        await revokeReadScope(request, admin, ledger, unionCustom);
        await revokeReadScope(request, admin, ledger, unionMine);
      }

      const allScope = await grantReadScope(request, admin, ledger, subjectRoleId, 'all');
      const narrowerScope = await grantReadScope(
        request,
        admin,
        ledger,
        subjectRoleId,
        'customDepartments',
        [rootDepartmentId],
      );
      try {
        const list = await listStudents(request, subject, allNames);
        expect(list.map(item => item.name).sort()).toEqual(allNames.toSorted());
      } finally {
        await revokeReadScope(request, admin, ledger, narrowerScope);
        await revokeReadScope(request, admin, ledger, allScope);
      }

      const customRootScope = await grantReadScope(
        request,
        admin,
        ledger,
        subjectRoleId,
        'customDepartments',
        [rootDepartmentId],
      );
      try {
        const constrained = await listStudents(request, subject, allNames, {
          name: { _in_: [names.mine, names.child] },
        });
        expect(constrained.map(item => item.name)).toEqual([names.mine]);
        const blockedByCallerFilter = await listStudents(request, subject, allNames, {
          name: { _in_: [names.child] },
        });
        expect(blockedByCallerFilter).toEqual([]);
      } finally {
        await revokeReadScope(request, admin, ledger, customRootScope);
      }

      const unmappedScope = await grantReadScope(
        request,
        admin,
        ledger,
        subjectRoleId,
        'customDepartments',
      );
      try {
        await expectStatus(request, 'GET', '/api/training/student', 403, {
          accessToken: subject.accessToken,
        });
      } finally {
        await revokeReadScope(request, admin, ledger, unmappedScope);
      }

      await createGrant(
        request,
        admin,
        ledger,
        subjectRoleId,
        actionKeys.student.select,
        'all',
        false,
      );
      await expectStatus(request, 'GET', '/api/training/student', 403, {
        accessToken: subject.accessToken,
      });
    } catch (error) {
      testFailure = error;
      throw error;
    } finally {
      await cleanupWithoutMaskingFailure(request, admin, ledger, testInfo, testFailure);
    }
  },
);

test(
  'ATP-ADM-SCP-02: direct Student and Record ownership, inheritance, and bulk preflight',
  { tag: ['@admin', '@cabloy-admin', '@admin-rbac-api'] },
  async ({ request }, testInfo) => {
    const suffix = testSuffix(testInfo);
    const ledger = createLedger();
    const admin = await loginAsAdmin(request);
    const subject = await createAccount(request, ledger, testInfo);
    const foreignOwner = await createAccount(request, ledger, testInfo);
    let testFailure: unknown;

    try {
      const ownDepartmentId = await createDepartment(
        request,
        admin,
        ledger,
        `ATP Data Own ${suffix}`,
      );
      const foreignDepartmentId = await createDepartment(
        request,
        admin,
        ledger,
        `ATP Data Foreign ${suffix}`,
      );
      await createMembership(request, admin, ledger, ownDepartmentId, subject);
      await createMembership(request, admin, ledger, foreignDepartmentId, foreignOwner);

      const subjectRoleId = await createRole(request, admin, ledger, `ATP Data Subject ${suffix}`);
      const foreignRoleId = await createRole(request, admin, ledger, `ATP Data Foreign ${suffix}`);
      await assignRole(request, admin, subject, subjectRoleId);
      await assignRole(request, admin, foreignOwner, foreignRoleId);

      await createGrant(
        request,
        admin,
        ledger,
        subjectRoleId,
        actionKeys.student.create,
        'ownDepartment',
      );
      await createGrant(
        request,
        admin,
        ledger,
        foreignRoleId,
        actionKeys.student.create,
        'ownDepartment',
      );
      await createGrant(
        request,
        admin,
        ledger,
        foreignRoleId,
        actionKeys.record.create,
        'ownDepartment',
      );
      for (const actionKey of [
        actionKeys.student.select,
        actionKeys.student.view,
        actionKeys.student.update,
        actionKeys.student.delete,
        actionKeys.record.create,
        actionKeys.record.select,
        actionKeys.record.view,
        actionKeys.record.update,
        actionKeys.record.delete,
      ]) {
        const grantId = await createGrant(
          request,
          admin,
          ledger,
          subjectRoleId,
          actionKey,
          'customDepartments',
        );
        await mapGrantDepartment(request, admin, ledger, grantId, ownDepartmentId);
      }

      const forgedIid = `forged-${suffix}`;
      const studentName = `ATP Data Student ${suffix}`;
      const studentId = await createStudent(request, subject, ledger, {
        name: studentName,
        mobile: mobile(201),
        level: 1,
        departmentId: foreignDepartmentId,
        userIdOwner: foreignOwner.id,
        iid: forgedIid,
      });
      const storedStudent = await getStudent(request, admin, studentId);
      expect(storedStudent).toMatchObject({
        id: studentId,
        departmentId: ownDepartmentId,
        userIdOwner: subject.id,
      });
      expect(storedStudent.iid).not.toBe(forgedIid);

      const selectedStudents = await listStudents(request, subject, [studentName]);
      expect(selectedStudents.map(item => item.id)).toEqual([studentId]);
      expect((await getStudent(request, subject, studentId)).name).toBe(studentName);
      const summary = await requestEntity(
        request,
        subject,
        `/api/training/student/summary/${studentId}`,
      );
      expect(summary).toMatchObject({ id: studentId, name: studentName });

      const updatedStudentName = `ATP Data Student Updated ${suffix}`;
      await requestApiOk<null>(request, 'PATCH', `/api/training/student/${studentId}`, {
        accessToken: subject.accessToken,
        data: {
          name: updatedStudentName,
          mobile: mobile(202),
          level: 2,
          departmentId: foreignDepartmentId,
          userIdOwner: foreignOwner.id,
          iid: `forged-update-${suffix}`,
        },
      });
      const updatedStudent = await getStudent(request, admin, studentId);
      expect(updatedStudent).toMatchObject({
        id: studentId,
        name: updatedStudentName,
        departmentId: ownDepartmentId,
        userIdOwner: subject.id,
      });

      const recordName = `ATP Data Record ${suffix}`;
      const recordId = await createRecord(request, subject, ledger, {
        studentId,
        name: recordName,
        departmentId: foreignDepartmentId,
        userIdOwner: foreignOwner.id,
        iid: forgedIid,
      });
      const storedRecord = await getRecord(request, admin, recordId);
      expect(storedRecord).toMatchObject({
        id: recordId,
        studentId,
        departmentId: ownDepartmentId,
        userIdOwner: subject.id,
      });
      expect(storedRecord.iid).not.toBe(forgedIid);

      const recordSelectResponse = await requestApi(request, 'GET', '/api/training/record', {
        accessToken: subject.accessToken,
        params: { pageNo: 1, pageSize: 100, where: { name: { _in_: [recordName] } } },
      });
      expect(recordSelectResponse.ok(), 'GET /api/training/record').toBeTruthy();
      const recordSelectBody = (await recordSelectResponse.json()) as
        | { data?: Paged<ScopedEntity> }
        | Paged<ScopedEntity>;
      const recordSelect = 'data' in recordSelectBody ? recordSelectBody.data : recordSelectBody;
      if (!recordSelect) throw new Error('Record select response is missing data');
      expect(recordSelect.list.map(item => item.id)).toEqual([recordId]);
      expect((await getRecord(request, subject, recordId)).name).toBe(recordName);

      const updatedRecordName = `ATP Data Record Updated ${suffix}`;
      await requestApiOk<null>(request, 'PATCH', `/api/training/record/${recordId}`, {
        accessToken: subject.accessToken,
        data: {
          name: updatedRecordName,
          departmentId: foreignDepartmentId,
          userIdOwner: foreignOwner.id,
          iid: `forged-record-update-${suffix}`,
        },
      });
      expect(await getRecord(request, admin, recordId)).toMatchObject({
        id: recordId,
        name: updatedRecordName,
        studentId,
        departmentId: ownDepartmentId,
        userIdOwner: subject.id,
      });

      const foreignStudentId = await createStudent(request, foreignOwner, ledger, {
        name: `ATP Data Foreign Student ${suffix}`,
        mobile: mobile(203),
        level: 3,
      });
      await expectStatus(request, 'POST', '/api/training/record', 403, {
        accessToken: subject.accessToken,
        data: { studentId: foreignStudentId, name: `ATP Data Blocked Record ${suffix}` },
      });

      const bulkStudentAId = await createStudent(request, subject, ledger, {
        name: `ATP Data Bulk A ${suffix}`,
        mobile: mobile(204),
        level: 1,
      });
      const bulkStudentBId = await createStudent(request, subject, ledger, {
        name: `ATP Data Bulk B ${suffix}`,
        mobile: mobile(205),
        level: 1,
      });
      const retainedStudent = async () => {
        expect((await getStudent(request, subject, bulkStudentAId)).id).toEqual(bulkStudentAId);
      };
      await expectStatus(request, 'DELETE', '/api/training/student/bulk', 422, {
        accessToken: subject.accessToken,
        data: { ids: [] },
      });
      await retainedStudent();
      await expectStatus(request, 'DELETE', '/api/training/student/bulk', 422, {
        accessToken: subject.accessToken,
        data: { ids: [apiId(bulkStudentAId), apiId(bulkStudentAId)] },
      });
      await retainedStudent();
      await expectStatus(request, 'DELETE', '/api/training/student/bulk', 404, {
        accessToken: subject.accessToken,
        data: { ids: [apiId(bulkStudentAId), '999999999'] },
      });
      await retainedStudent();
      await expectStatus(request, 'DELETE', '/api/training/student/bulk', 403, {
        accessToken: subject.accessToken,
        data: { ids: [apiId(foreignStudentId)] },
      });
      await retainedStudent();
      await expectStatus(request, 'DELETE', '/api/training/student/bulk', 403, {
        accessToken: subject.accessToken,
        data: { ids: [apiId(bulkStudentAId), apiId(foreignStudentId)] },
      });
      await retainedStudent();
      const successfulStudentBulk = await requestApi(
        request,
        'DELETE',
        '/api/training/student/bulk',
        {
          accessToken: subject.accessToken,
          data: { ids: [apiId(bulkStudentBId)] },
        },
      );
      expect([200, 204], 'DELETE /api/training/student/bulk').toContain(
        successfulStudentBulk.status(),
      );
      const deletedStudent = await requestApi(
        request,
        'GET',
        `/api/training/student/${bulkStudentBId}`,
        { accessToken: subject.accessToken },
      );
      expect([204, 404], 'GET deleted Student').toContain(deletedStudent.status());
      removeFixtureId(ledger.students, bulkStudentBId);

      const forceStudentId = await createStudent(request, subject, ledger, {
        name: `ATP Data Force ${suffix}`,
        mobile: mobile(206),
        level: 1,
      });
      await requestApiOk<null>(request, 'DELETE', `/api/training/student/${forceStudentId}`, {
        accessToken: subject.accessToken,
      });
      await requestApiOk<null>(
        request,
        'DELETE',
        `/api/training/student/deleteForce/${forceStudentId}`,
        { accessToken: subject.accessToken },
      );
      removeFixtureId(ledger.students, forceStudentId);

      await requestApiOk<null>(request, 'DELETE', `/api/training/record/${recordId}`, {
        accessToken: subject.accessToken,
      });
      removeFixtureId(ledger.records, recordId);

      const recordBulkAId = await createRecord(request, subject, ledger, {
        studentId,
        name: `ATP Data Record Bulk A ${suffix}`,
      });
      const recordBulkBId = await createRecord(request, subject, ledger, {
        studentId,
        name: `ATP Data Record Bulk B ${suffix}`,
      });
      const foreignRecordId = await createRecord(request, foreignOwner, ledger, {
        studentId: foreignStudentId,
        name: `ATP Data Foreign Record ${suffix}`,
      });
      await expectStatus(request, 'DELETE', '/api/training/record/bulk', 403, {
        accessToken: subject.accessToken,
        data: { ids: [apiId(recordBulkAId), apiId(foreignRecordId)] },
      });
      expect((await getRecord(request, subject, recordBulkAId)).id).toEqual(recordBulkAId);
      const successfulRecordBulk = await requestApi(
        request,
        'DELETE',
        '/api/training/record/bulk',
        {
          accessToken: subject.accessToken,
          data: { ids: [apiId(recordBulkBId)] },
        },
      );
      expect([200, 204], 'DELETE /api/training/record/bulk').toContain(
        successfulRecordBulk.status(),
      );
      const deletedRecord = await requestApi(
        request,
        'GET',
        `/api/training/record/${recordBulkBId}`,
        { accessToken: subject.accessToken },
      );
      expect([204, 404], 'GET deleted Record').toContain(deletedRecord.status());
      removeFixtureId(ledger.records, recordBulkBId);
    } catch (error) {
      testFailure = error;
      throw error;
    } finally {
      await cleanupWithoutMaskingFailure(request, admin, ledger, testInfo, testFailure);
    }
  },
);
