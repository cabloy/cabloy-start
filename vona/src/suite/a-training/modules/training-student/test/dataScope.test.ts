import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const ActionKeys = [
  'training-student.controller.student#create',
  'training-student.controller.student#select',
  'training-student.controller.student#view',
  'training-student.controller.student#update',
  'training-student.controller.student#delete',
] as const;
describe('dataScope.test.ts', { concurrency: false }, () => {
  it('ATP-ADM-SCP-02 scopes delegated Student actions and bulk mutations', async () => {
    const suffix = crypto.randomUUID();
    const studentIds: string[] = [];
    const grantIds: string[] = [];
    const grantDepartmentIds: string[] = [];
    const membershipIds: string[] = [];
    const departmentIds: string[] = [];
    const userIds: string[] = [];
    let roleId: string | undefined;
    let delegatedUserName: string | undefined;
    let delegatedUserId: string | undefined;
    let allowedDepartmentId: string | undefined;
    let scopedStudentId: string | undefined;
    let foreignStudentId: string | undefined;

    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          const delegatedUser = await app.bean.user.register({
            name: `training-student-scope-${suffix}`,
          });
          await app.bean.user.activate(delegatedUser);
          delegatedUserName = delegatedUser.name;
          delegatedUserId = String(delegatedUser.id);
          userIds.push(delegatedUserId);

          const role = await app.scope('admin-role').service.role.create({
            name: `training-student-scope-role-${suffix}`,
            title: 'Training Student scoped role',
            siteIds: ['admin'],
          });
          roleId = String(role.id);

          const allowedDepartment = await app.scope('admin-department').service.department.create({
            name: `Training Student allowed ${suffix}`,
            parentId: null,
          });
          const foreignDepartment = await app.scope('admin-department').service.department.create({
            name: `Training Student foreign ${suffix}`,
            parentId: null,
          });
          allowedDepartmentId = String(allowedDepartment.id);
          departmentIds.push(allowedDepartmentId, String(foreignDepartment.id));

          const membership = await app
            .scope('admin-department')
            .service.department.createMembership(allowedDepartment.id, {
              userId: delegatedUser.id,
            });
          membershipIds.push(String(membership.id));

          const adminRbac = app.scope('admin-rbac');
          for (const actionKey of ActionKeys) {
            const grant = await adminRbac.service.rbacGrant.create({
              roleId: role.id,
              actionKey,
              dataScope: 'customDepartments',
              enabled: true,
            });
            grantIds.push(String(grant.id));
            const grantDepartment = await adminRbac.service.rbacGrantDepartment.create({
              rbacGrantId: grant.id,
              departmentId: allowedDepartment.id,
            });
            grantDepartmentIds.push(String(grantDepartment.id));
          }

          const studentModel = app.scope('training-student').model.student;
          const scopedStudent = await studentModel.insert({
            name: `Scoped Student ${suffix}`,
            description: 'scope-visible',
            mobile: `138${String(Date.now()).slice(-8)}`,
            level: 1,
            departmentId: allowedDepartment.id,
            userIdOwner: delegatedUser.id,
          });
          const foreignStudent = await studentModel.insert({
            name: `Foreign Student ${suffix}`,
            description: 'scope-hidden',
            mobile: `139${String(Date.now() + 1).slice(-8)}`,
            level: 2,
            departmentId: foreignDepartment.id,
            userIdOwner: delegatedUser.id,
          });
          scopedStudentId = String(scopedStudent.id);
          foreignStudentId = String(foreignStudent.id);
          studentIds.push(scopedStudentId, foreignStudentId);
        } finally {
          await app.bean.passport.signout();
        }
      });

      assert.ok(delegatedUserName);
      assert.ok(delegatedUserId);
      assert.ok(allowedDepartmentId);
      assert.ok(scopedStudentId);
      assert.ok(foreignStudentId);
      assert.ok(roleId);

      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinSystem('mock', -10001 as any, delegatedUserName!);
        try {
          const [result, error] = await catchError(() =>
            app.bean.executor.performAction('get', '/training/student', { innerAccess: false }),
          );
          assert.equal(result, undefined);
          assert.equal(error?.code, 403);
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          await app.scope('admin-role').service.role.replaceUserRoles(delegatedUserId!, {
            roleIds: [roleId!],
          });
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinSystem('mock', -10001 as any, delegatedUserName!);
        try {
          const list = await app.bean.executor.performAction('get', '/training/student', {
            innerAccess: false,
          });
          assert.equal(
            list.list.some(item => String(item.id) === scopedStudentId),
            true,
          );
          assert.equal(
            list.list.some(item => String(item.id) === foreignStudentId),
            false,
          );

          const scoped = await app.bean.executor.performAction('get', '/training/student/:id', {
            innerAccess: false,
            params: { id: scopedStudentId },
          });
          assert.equal(String(scoped.id), scopedStudentId);
          const [hiddenResult, hiddenError] = await catchError(() =>
            app.bean.executor.performAction('get', '/training/student/:id', {
              innerAccess: false,
              params: { id: foreignStudentId },
            }),
          );
          assert.equal(hiddenResult, undefined);
          assert.equal(hiddenError?.code, 403);

          const [updateResult, updateError] = await catchError(() =>
            app.bean.executor.performAction('patch', '/training/student/:id', {
              innerAccess: false,
              params: { id: foreignStudentId },
              body: {
                name: `Blocked update ${suffix}`,
                mobile: `136${String(Date.now()).slice(-8)}`,
                level: 1,
                description: 'must not update',
                departmentId: allowedDepartmentId,
                userIdOwner: delegatedUserId,
              },
            }),
          );
          assert.equal(updateResult, undefined);
          assert.equal(updateError?.code, 403);

          const [bulkResult, bulkError] = await catchError(() =>
            app.bean.executor.performAction('delete', '/training/student/bulk', {
              innerAccess: false,
              body: { ids: [scopedStudentId, foreignStudentId] },
            }),
          );
          assert.equal(bulkResult, undefined);
          assert.equal(bulkError?.code, 403);
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinSystem('mock', -10001 as any, delegatedUserName!);
        try {
          const createdId = await app.bean.executor.performAction('post', '/training/student', {
            innerAccess: false,
            body: {
              name: `Created Student ${suffix}`,
              mobile: `137${String(Date.now()).slice(-8)}`,
              level: 3,
              departmentId: foreignStudentId,
              userIdOwner: foreignStudentId,
              iid: 'forged',
            },
          });
          studentIds.push(String(createdId));
          const studentModel = app.scope('training-student').model.student;
          const created = await studentModel.getById(createdId!, { disableDeleted: true });
          assert.equal(String(created?.departmentId), allowedDepartmentId);
          assert.equal(String(created?.userIdOwner), delegatedUserId);

          const updateResult = await app.bean.executor.performAction(
            'patch',
            '/training/student/:id',
            {
              innerAccess: false,
              params: { id: scopedStudentId },
              body: {
                name: `Updated Student ${suffix}`,
                mobile: `136${String(Date.now()).slice(-8)}`,
                level: 2,
                departmentId: foreignStudentId,
                userIdOwner: foreignStudentId,
              },
            },
          );
          assert.equal(updateResult, null);
          const updated = await app
            .scope('training-student')
            .model.student.getById(scopedStudentId!, { disableDeleted: true });
          assert.equal(updated?.name, `Updated Student ${suffix}`);
          assert.equal(String(updated?.departmentId), allowedDepartmentId);
          assert.equal(String(updated?.userIdOwner), delegatedUserId);

          const bulkDeleteResult = await app.bean.executor.performAction(
            'delete',
            '/training/student/bulk',
            { innerAccess: false, body: { ids: [createdId!] } },
          );
          assert.equal(bulkDeleteResult, null);
          const bulkDeleted = await studentModel.getById(createdId);
          assert.equal(bulkDeleted, undefined);
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        const scoped = await app
          .scope('training-student')
          .model.student.getById(scopedStudentId!, { disableDeleted: true });
        const foreign = await app
          .scope('training-student')
          .model.student.getById(foreignStudentId!, { disableDeleted: true });
        assert.equal(scoped?.description, 'scope-visible');
        assert.equal(foreign?.description, 'scope-hidden');
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const studentModel = app.scope('training-student').model.student;
        for (const studentId of studentIds.toReversed()) {
          const student = await studentModel.getById(studentId, { disableDeleted: true });
          if (student) await studentModel.deleteById(student.id, { disableDeleted: true });
        }

        const adminRbac = app.scope('admin-rbac');
        for (const grantDepartmentId of grantDepartmentIds.toReversed()) {
          const grantDepartment =
            await adminRbac.model.rbacGrantDepartment.getById(grantDepartmentId);
          if (grantDepartment) {
            await adminRbac.service.rbacGrantDepartment.delete(grantDepartment.id);
          }
        }
        for (const grantId of grantIds.toReversed()) {
          const grant = await adminRbac.model.rbacGrant.getById(grantId);
          if (grant) await adminRbac.service.rbacGrant.delete(grant.id);
        }

        const departmentScope = app.scope('admin-department');
        if (membershipIds.length) {
          await departmentScope.model.departmentMembership.deleteBulk(membershipIds);
        }
        for (const departmentId of departmentIds.toReversed()) {
          const department = await departmentScope.model.department.getById(departmentId);
          if (department) await departmentScope.service.department.delete(department.id);
        }

        const homeUser = app.scope('home-user');
        if (userIds.length) await homeUser.model.roleUser.delete({ userId: { _in_: userIds } });
        if (roleId) {
          const role = await homeUser.model.role.getById(roleId);
          if (role) await app.scope('admin-role').service.role.delete(role.id);
        }
        for (const userId of userIds.toReversed()) {
          await app.bean.user.removeById(userId);
        }
      });
    }
  });

  it('admits the unrestricted system administrator across Department rows', async () => {
    const suffix = crypto.randomUUID();
    const departmentIds: string[] = [];
    const studentIds: string[] = [];
    let firstStudentId: string | undefined;
    let secondStudentId: string | undefined;

    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          const departmentScope = app.scope('admin-department');
          const firstDepartment = await departmentScope.service.department.create({
            name: `System admin Student A ${suffix}`,
            parentId: null,
          });
          const secondDepartment = await departmentScope.service.department.create({
            name: `System admin Student B ${suffix}`,
            parentId: null,
          });
          departmentIds.push(String(firstDepartment.id), String(secondDepartment.id));

          const studentModel = app.scope('training-student').model.student;
          const firstStudent = await studentModel.insert({
            name: `System Admin Student A ${suffix}`,
            mobile: `138${String(Date.now()).slice(-8)}`,
            level: 1,
            departmentId: firstDepartment.id,
            userIdOwner: app.bean.passport.currentUser!.id,
          });
          const secondStudent = await studentModel.insert({
            name: `System Admin Student B ${suffix}`,
            mobile: `139${String(Date.now() + 1).slice(-8)}`,
            level: 1,
            departmentId: secondDepartment.id,
            userIdOwner: app.bean.passport.currentUser!.id,
          });
          firstStudentId = String(firstStudent.id);
          secondStudentId = String(secondStudent.id);
          studentIds.push(firstStudentId, secondStudentId);
        } finally {
          await app.bean.passport.signout();
        }
      });

      assert.ok(firstStudentId);
      assert.ok(secondStudentId);
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          const list = await app.bean.executor.performAction('get', '/training/student', {
            innerAccess: false,
          });
          assert.equal(
            list.list.some(item => String(item.id) === firstStudentId),
            true,
          );
          assert.equal(
            list.list.some(item => String(item.id) === secondStudentId),
            true,
          );
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const studentModel = app.scope('training-student').model.student;
        for (const studentId of studentIds.toReversed()) {
          const student = await studentModel.getById(studentId, { disableDeleted: true });
          if (student) await studentModel.deleteById(student.id, { disableDeleted: true });
        }
        const departmentScope = app.scope('admin-department');
        for (const departmentId of departmentIds.toReversed()) {
          const department = await departmentScope.model.department.getById(departmentId);
          if (department) await departmentScope.service.department.delete(department.id);
        }
      });
    }
  });
});
