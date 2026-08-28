import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const StudentActions = [
  'training-student.controller.student#create',
  'training-student.controller.student#view',
] as const;
const RecordActions = [
  'training-record.controller.record#create',
  'training-record.controller.record#select',
  'training-record.controller.record#view',
  'training-record.controller.record#update',
  'training-record.controller.record#delete',
] as const;
describe('dataScope.test.ts', { concurrency: false }, () => {
  it('ATP-ADM-SCP-02 scopes Records, inherits Student scope, and protects Subjects', async () => {
    const suffix = crypto.randomUUID().slice(0, 16);
    const studentIds: string[] = [];
    const recordIds: string[] = [];
    const subjectIds: string[] = [];
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
    let scopedRecordId: string | undefined;
    let foreignRecordId: string | undefined;
    let foreignSubjectId: string | undefined;

    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          const delegatedUser = await app.bean.user.register({
            name: `training-record-scope-${suffix}`,
          });
          await app.bean.user.activate(delegatedUser);
          delegatedUserName = delegatedUser.name;
          delegatedUserId = String(delegatedUser.id);
          userIds.push(delegatedUserId);

          const role = await app.scope('admin-role').service.role.create({
            name: `training-record-scope-role-${suffix}`,
            title: 'Training Record scoped role',
            siteIds: ['admin'],
          });
          roleId = String(role.id);

          const allowedDepartment = await app.scope('admin-department').service.department.create({
            name: `Training Record allowed ${suffix}`,
            parentId: null,
          });
          const foreignDepartment = await app.scope('admin-department').service.department.create({
            name: `Training Record foreign ${suffix}`,
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
          for (const actionKey of [...StudentActions, ...RecordActions]) {
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

          const student = await app.scope('training-student').model.student.insert({
            name: `Scoped Record Student ${suffix}`,
            mobile: `138${String(Date.now()).slice(-8)}`,
            level: 1,
            departmentId: allowedDepartment.id,
            userIdOwner: delegatedUser.id,
          });
          scopedStudentId = String(student.id);
          studentIds.push(scopedStudentId);

          const recordModel = app.scope('training-record').model.record;
          const scopedRecord = await recordModel.insert({
            name: `Scoped Record ${suffix}`,
            studentId: student.id,
            departmentId: allowedDepartment.id,
            userIdOwner: delegatedUser.id,
          });
          const foreignRecord = await recordModel.insert({
            name: `Foreign Record ${suffix}`,
            studentId: student.id,
            departmentId: foreignDepartment.id,
            userIdOwner: delegatedUser.id,
          });
          scopedRecordId = String(scopedRecord.id);
          foreignRecordId = String(foreignRecord.id);
          recordIds.push(scopedRecordId, foreignRecordId);

          const foreignSubject = await app.scope('training-recordsubject').model.subject.insert({
            recordId: foreignRecord.id,
            name: `Foreign Subject ${suffix}`,
            score: 80,
          });
          foreignSubjectId = String(foreignSubject.id);
          subjectIds.push(foreignSubjectId);
        } finally {
          await app.bean.passport.signout();
        }
      });

      assert.ok(delegatedUserName);
      assert.ok(delegatedUserId);
      assert.ok(allowedDepartmentId);
      assert.ok(scopedStudentId);
      assert.ok(scopedRecordId);
      assert.ok(foreignRecordId);
      assert.ok(foreignSubjectId);
      assert.ok(roleId);

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
          const list = await app.bean.executor.performAction('get', '/training/record', {
            innerAccess: false,
          });
          assert.equal(
            list.list.some(item => String(item.id) === scopedRecordId),
            true,
          );
          assert.equal(
            list.list.some(item => String(item.id) === foreignRecordId),
            false,
          );

          const [hiddenResult, hiddenError] = await catchError(() =>
            app.bean.executor.performAction('get', '/training/record/:id', {
              innerAccess: false,
              params: { id: foreignRecordId },
            }),
          );
          assert.equal(hiddenResult, undefined);
          assert.equal(hiddenError?.code, 403);

          const [forgedCapabilityResult, forgedCapabilityError] = await catchError(() =>
            app.bean.executor.performAction('patch', '/training/record/:id', {
              innerAccess: false,
              params: { id: foreignRecordId },
              body: {
                name: `Forged capability ${suffix}`,
                capability: {
                  key: 'training-record.controller.record#update',
                  allowed: true,
                },
              },
            }),
          );
          assert.equal(forgedCapabilityResult, undefined);
          assert.equal(forgedCapabilityError?.code, 403);

          const [updateResult, updateError] = await catchError(() =>
            app.bean.executor.performAction('patch', '/training/record/:id', {
              innerAccess: false,
              params: { id: foreignRecordId },
              body: { name: `Blocked Record ${suffix}` },
            }),
          );
          assert.equal(updateResult, undefined);
          assert.equal(updateError?.code, 403);

          const [bulkResult, bulkError] = await catchError(() =>
            app.bean.executor.performAction('delete', '/training/record/bulk', {
              innerAccess: false,
              body: { ids: [scopedRecordId, foreignRecordId] },
            }),
          );
          assert.equal(bulkResult, undefined);
          assert.equal(bulkError?.code, 403);

          for (const [ids, code] of [
            [[], 422],
            [[scopedRecordId, scopedRecordId], 422],
            [[-1], 404],
          ] as const) {
            const [invalidResult, invalidError] = await catchError(() =>
              app.bean.executor.performAction('delete', '/training/record/bulk', {
                innerAccess: false,
                body: { ids },
              }),
            );
            assert.equal(invalidResult, undefined);
            assert.equal(invalidError?.code, code);
          }
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinSystem('mock', -10001 as any, delegatedUserName!);
        try {
          const createdId = await app.bean.executor.performAction('post', '/training/record', {
            innerAccess: false,
            body: {
              studentId: scopedStudentId,
              name: `Created Record ${suffix}`,
              departmentId: foreignRecordId,
              userIdOwner: foreignRecordId,
              iid: 'forged',
            },
          });
          recordIds.push(String(createdId));
          const created = await app
            .scope('training-record')
            .model.record.getById(createdId, { disableDeleted: true });
          assert.equal(String(created?.studentId), scopedStudentId);
          assert.equal(String(created?.departmentId), allowedDepartmentId);
          assert.equal(String(created?.userIdOwner), delegatedUserId);
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const subjectModel = app.scope('training-recordsubject').model.subject;
        for (const subjectId of subjectIds.toReversed()) {
          const subject = await subjectModel.getById(subjectId, { disableDeleted: true });
          if (subject) await subjectModel.deleteById(subject.id, { disableDeleted: true });
        }

        const recordModel = app.scope('training-record').model.record;
        for (const recordId of recordIds.toReversed()) {
          const record = await recordModel.getById(recordId, { disableDeleted: true });
          if (record) await recordModel.deleteById(record.id, { disableDeleted: true });
        }

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
    const suffix = crypto.randomUUID().slice(0, 16);
    const departmentIds: string[] = [];
    const studentIds: string[] = [];
    const recordIds: string[] = [];
    let firstRecordId: string | undefined;
    let secondRecordId: string | undefined;

    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          const departmentScope = app.scope('admin-department');
          const firstDepartment = await departmentScope.service.department.create({
            name: `System admin Record A ${suffix}`,
            parentId: null,
          });
          const secondDepartment = await departmentScope.service.department.create({
            name: `System admin Record B ${suffix}`,
            parentId: null,
          });
          departmentIds.push(String(firstDepartment.id), String(secondDepartment.id));

          const userIdOwner = app.bean.passport.currentUser!.id;
          const studentModel = app.scope('training-student').model.student;
          const firstStudent = await studentModel.insert({
            name: `System Admin Record Student A ${suffix}`,
            mobile: `138${String(Date.now()).slice(-8)}`,
            level: 1,
            departmentId: firstDepartment.id,
            userIdOwner,
          });
          const secondStudent = await studentModel.insert({
            name: `System Admin Record Student B ${suffix}`,
            mobile: `139${String(Date.now() + 1).slice(-8)}`,
            level: 1,
            departmentId: secondDepartment.id,
            userIdOwner,
          });
          studentIds.push(String(firstStudent.id), String(secondStudent.id));

          const recordModel = app.scope('training-record').model.record;
          const firstRecord = await recordModel.insert({
            name: `System Admin Record A ${suffix}`,
            studentId: firstStudent.id,
            departmentId: firstDepartment.id,
            userIdOwner,
          });
          const secondRecord = await recordModel.insert({
            name: `System Admin Record B ${suffix}`,
            studentId: secondStudent.id,
            departmentId: secondDepartment.id,
            userIdOwner,
          });
          firstRecordId = String(firstRecord.id);
          secondRecordId = String(secondRecord.id);
          recordIds.push(firstRecordId, secondRecordId);
        } finally {
          await app.bean.passport.signout();
        }
      });

      assert.ok(firstRecordId);
      assert.ok(secondRecordId);
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          const list = await app.bean.executor.performAction('get', '/training/record', {
            innerAccess: false,
          });
          assert.equal(
            list.list.some(item => String(item.id) === firstRecordId),
            true,
          );
          assert.equal(
            list.list.some(item => String(item.id) === secondRecordId),
            true,
          );
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const recordModel = app.scope('training-record').model.record;
        for (const recordId of recordIds.toReversed()) {
          const record = await recordModel.getById(recordId, { disableDeleted: true });
          if (record) await recordModel.deleteById(record.id, { disableDeleted: true });
        }
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
