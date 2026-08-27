import type { DtoStudentSelectRes, EntityStudent } from 'vona-module-training-student';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import {
  DtoStudentCreate,
  DtoStudentSelectResItem,
  DtoStudentUpdate,
  DtoStudentView,
} from 'vona-module-training-student';

import { DtoDetailRecordResItem } from '../src/dto/detailRecordResItem.tsx';
import { DtoStudentSummary } from '../src/dto/studentSummary.tsx';

describe('student.test.ts', { concurrency: false }, () => {
  it('action:student:formLayoutMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      for (const DtoClass of [DtoStudentCreate, DtoStudentUpdate, DtoStudentView]) {
        const apiJson = await app.bean.openapi.generateJsonOfClass(DtoClass);
        const component = Object.values(apiJson.components!.schemas as any).find(item => {
          return (item as any).properties?.trainingRecords;
        });
        const blocks = (component as any)?.rest?.blocks;
        const formLayout =
          blocks?.[0]?.options?.blocks?.[0]?.options?.blocks?.[0]?.options?.formLayout;
        const tabs = formLayout?.children[0];
        const profileGroup = tabs?.children[0]?.children[0];
        const profileSection = profileGroup?.children[0];
        const descriptionGroup = tabs?.children[0]?.children[1];
        const descriptionSection = descriptionGroup?.children[0];
        const trainingRecordsSection = tabs?.children[1]?.children[1];
        assert.equal(tabs?.type, 'tabs');
        assert.equal(tabs?.id, undefined);
        assert.equal(tabs?.children[1]?.type, 'tab');
        assert.equal(tabs?.children[1]?.id, undefined);
        assert.deepEqual(profileSection?.columns, { default: 1, md: 2 });
        assert.equal(profileGroup?.type, 'group');
        assert.deepEqual(
          profileSection?.children.map(item => item.name),
          ['name', 'mobile', 'imageId'],
        );
        assert.equal(descriptionGroup?.type, 'group');
        assert.deepEqual(
          descriptionSection?.children.map(item => item.name),
          ['content'],
        );
        assert.equal(
          (component as any)?.properties?.content?.properties?.descriptionMarkdown?.rest?.form?.render,
          'start-markdown:formFieldMarkdown',
        );
        assert.equal(tabs?.children[1]?.children[0]?.name, 'level');
        assert.deepEqual(
          trainingRecordsSection?.children.map(item => item.name),
          ['trainingRecords'],
        );
      }
    });
  });

  it('action:student:filterFormLayoutMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const apiJson = await app.bean.openapi.generateJsonOfClass(DtoStudentSelectResItem);
      const component = Object.values(apiJson.components!.schemas as any).find(item => {
        return (item as any).properties?._operationsRow;
      });
      const filterBlock = (component as any)?.rest?.blocks?.[0]?.options?.blocks?.[0];
      assert.equal(filterBlock?.render, 'start-page:blockFilter');
      assert.equal(filterBlock?.options?.formFieldLayout?.inline, true);
      assert.deepEqual(
        filterBlock?.options?.blocks?.map(item => item.render),
        ['start-form:blockFormLayout'],
      );
      const formLayout = filterBlock?.options?.blocks?.[0]?.options?.formLayout;
      const filterLayoutChildren = formLayout?.children[0]?.children;
      assert.equal(formLayout?.children[0]?.layout, 'flow');
      assert.equal(formLayout?.children[0]?.columns, undefined);
      assert.equal(filterLayoutChildren?.length, 4);
      assert.deepEqual(
        filterLayoutChildren?.map(item => item.type),
        ['field', 'field', 'field', 'block'],
      );
      assert.deepEqual(
        filterLayoutChildren?.slice(0, 3).map(item => item.name),
        ['name', 'level', 'createdAt'],
      );
      assert.equal(filterLayoutChildren?.[2]?.span, undefined);
      assert.equal(filterLayoutChildren?.[3]?.block?.render, 'start-page:blockFilterActions');
    });
  });

  it('action:student:emittedDtoSchemas', async () => {
    await app.bean.executor.mockCtx(async () => {
      const summaryApiJson = await app.bean.openapi.generateJsonOfClass(DtoStudentSummary);
      const summaryComponent = Object.values(summaryApiJson.components!.schemas as any).find(
        item => {
          return (item as any).properties?.summaryText;
        },
      ) as any;
      assert.ok(summaryComponent);
      assert.deepEqual(
        Object.keys(summaryComponent.properties).sort(),
        [
          'id',
          'name',
          'mobile',
          'level',
          'descriptionMarkdown',
          'levelTitle',
          'descriptionLength',
          'summaryText',
        ].sort(),
      );

      const detailRecordApiJson =
        await app.bean.openapi.generateJsonOfClass(DtoDetailRecordResItem);
      const detailRecordComponent = Object.values(
        detailRecordApiJson.components!.schemas as any,
      ).find(item => (item as any).properties?._lineNumber) as any;
      assert.ok(detailRecordComponent?.properties?._lineNumber);
      assert.equal(detailRecordComponent.required?.includes('_lineNumber'), false);
    });
  });

  it('action:student', async () => {
    await app.bean.executor.mockCtx(async () => {
      // data
      const mobile = '13812345678';
      const maskedMobile = '138****5678';
      const mobileUpdate = '13987654321';
      const maskedMobileUpdate = '139****4321';
      const trainingTime = new Date('2026-03-10T08:00:00.000Z');
      const trainingTimeUpdate = new Date('2026-04-18T13:20:00.000Z');
      const description = `# Student profile

This Markdown description verifies that a Student can retain content beyond the former 255-character storage limit. It includes **bold text**, _emphasis_, a [reference link](https://cabloy.com), and a practical training overview.

- Build foundational knowledge
- Complete guided exercises
- Record outcomes for each session

> Keep this long-form source intact when saving and viewing Student details.`;
      const descriptionUpdate = `## Updated student profile

This replacement Markdown source is intentionally longer than 255 characters and confirms the update path does not truncate rich content. It has a numbered plan, a code sample, and enough prose to exercise the text database column.

1. Review feedback
2. Practice the topic
3. Share the final result

\`\`\`ts
const trainingComplete = true;
\`\`\`

The stored value must round-trip exactly through the API, model, and summary response.`;
      assert.ok(description.length > 255);
      assert.ok(descriptionUpdate.length > 255);
      const data = {
        name: '__Tom__',
        content: { descriptionMarkdown: description },
        mobile,
        level: 1,
        trainingRecords: [
          {
            name: '__Record__',
            subjectCount: 1,
            totalScore: 88,
            averageScore: 88,
            trainingTime,
            description: 'This is a record',
            trainingRecordSubjects: [
              {
                name: '__Math__',
                score: 95,
                description: 'Math subject',
              },
            ],
          },
        ],
      } as any as DtoStudentCreate;
      // login
      await app.bean.passport.signinMock();
      // create
      const studentId = await app.bean.executor.performAction('post', '/training/student', {
        innerAccess: false,
        body: data,
      });
      assert.equal(!!studentId, true);
      // findMany
      const selectRes: DtoStudentSelectRes = await app.bean.executor.performAction(
        'get',
        '/training/student',
        { innerAccess: false },
      );
      const studentItem = selectRes.list.find(item => item.name === data.name);
      assert.equal(!!studentItem, true);
      assert.equal(studentItem!.level, data.level);
      assert.equal(studentItem!.mobile, maskedMobile);
      assert.equal((studentItem as any).content, undefined);
      // findMany: level filter
      const selectResByLevel: DtoStudentSelectRes = await app.bean.executor.performAction(
        'get',
        '/training/student',
        {
          innerAccess: false,
          query: {
            level: data.level,
          },
        },
      );
      assert.equal(
        selectResByLevel.list.some(item => item.name === data.name),
        true,
      );
      assert.equal(
        selectResByLevel.list.every(item => item.level === data.level),
        true,
      );
      // findOne and nested create check
      let student: any = await app.bean.executor.performAction('get', '/training/student/:id', {
        innerAccess: false,
        params: { id: studentId },
      });
      const record = student.trainingRecords?.[0];
      const recordSubject = record?.trainingRecordSubjects?.[0];
      assert.equal(student.trainingRecords?.length, 1);
      assert.equal(record?.name, '__Record__');
      assert.equal(record?.subjectCount, 1);
      assert.equal(record?.totalScore, 88);
      assert.equal(Number(record?.averageScore), 88);
      assert.equal(new Date(record?.trainingTime).toISOString(), trainingTime.toISOString());
      assert.equal(record?.trainingRecordSubjects?.length, 1);
      assert.equal(recordSubject?.name, '__Math__');
      assert.equal(recordSubject?.score, 95);
      assert.equal(student.content?.descriptionMarkdown, description);
      assert.equal(student.content?.descriptionHtml, undefined);
      // update
      const dataUpdate = {
        name: '__TomNew__',
        content: {
          descriptionMarkdown: descriptionUpdate,
          descriptionHtml: '<script>forged</script>',
        },
        mobile: mobileUpdate,
        level: 2,
        trainingRecords: [
          {
            id: record.id,
            name: '__RecordNew__',
            subjectCount: 2,
            totalScore: 183,
            averageScore: 91.5,
            trainingTime: trainingTimeUpdate,
            description: 'This is an updated record',
            trainingRecordSubjects: [
              {
                id: recordSubject.id,
                name: '__MathNew__',
                score: 96,
                description: 'Updated math subject',
              },
              {
                name: '__English__',
                score: 87,
                description: 'English subject',
              },
            ],
          },
        ],
      } as any as DtoStudentUpdate;
      const updateRes = await app.bean.executor.performAction('patch', '/training/student/:id', {
        innerAccess: false,
        params: { id: studentId },
        body: dataUpdate,
      });
      assert.equal(updateRes, null);
      // findOne after nested update
      student = await app.bean.executor.performAction('get', '/training/student/:id', {
        innerAccess: false,
        params: { id: studentId },
      });
      const updatedRecord = student.trainingRecords?.[0];
      const [updatedMathSubject, updatedEnglishSubject] =
        updatedRecord?.trainingRecordSubjects ?? [];
      assert.equal(student.name, dataUpdate.name);
      assert.equal(student.content?.descriptionMarkdown, descriptionUpdate);
      assert.equal(student.content?.descriptionHtml, undefined);
      assert.equal(student.level, dataUpdate.level);
      assert.equal(student.mobile, maskedMobileUpdate);
      assert.equal(student.trainingRecords?.length, 1);
      assert.equal(updatedRecord?.name, '__RecordNew__');
      assert.equal(updatedRecord?.subjectCount, 2);
      assert.equal(updatedRecord?.totalScore, 183);
      assert.equal(Number(updatedRecord?.averageScore), 91.5);
      assert.equal(
        new Date(updatedRecord?.trainingTime).toISOString(),
        trainingTimeUpdate.toISOString(),
      );
      assert.equal(updatedRecord?.trainingRecordSubjects?.length, 2);
      assert.equal(updatedMathSubject?.name, '__MathNew__');
      assert.equal(updatedMathSubject?.score, 96);
      assert.equal(updatedEnglishSubject?.name, '__English__');
      assert.equal(updatedEnglishSubject?.score, 87);
      const studentRaw = await app.bean.scope('training-student').model.student.getById(studentId, {
        disableDeleted: true,
      });
      assert.equal(studentRaw!.mobile, mobileUpdate);
      const studentContentRaw = await app
        .bean.scope('training-student')
        .model.studentContent.get({ studentId }, { disableDeleted: true });
      assert.equal(studentContentRaw!.descriptionMarkdown, descriptionUpdate);
      assert.equal(studentContentRaw!.descriptionHtml?.includes('<script>'), false);
      assert.equal(studentContentRaw!.descriptionHtml?.includes('<h2>Updated student profile</h2>'), true);
      // summary
      const summary: DtoStudentSummary = await app.bean.executor.performAction(
        'get',
        '/training/student/summary/:id',
        { innerAccess: false, params: { id: studentId } },
      );
      assert.equal(summary.name, dataUpdate.name);
      assert.equal(summary.mobile, maskedMobileUpdate);
      assert.equal(summary.level, dataUpdate.level);
      assert.equal(summary.descriptionMarkdown, descriptionUpdate);
      assert.equal(summary.descriptionLength, descriptionUpdate.length);
      assert.equal(typeof summary.levelTitle, 'string');
      assert.equal(typeof summary.summaryText, 'string');
      // delete
      const deleteRes = await app.bean.executor.performAction('delete', '/training/student/:id', {
        innerAccess: false,
        params: { id: student.id },
      });
      assert.equal(deleteRes, null);
      const studentContentDeleted = await app
        .bean.scope('training-student')
        .model.studentContent.get({ studentId }, { disableDeleted: true });
      assert.equal(studentContentDeleted?.deleted, true);
      assert.equal(
        await app.bean.scope('training-student').model.studentContent.get({ studentId }),
        undefined,
      );
      // findOne
      student = await app.bean.executor.performAction('get', '/training/student/:id', {
        innerAccess: false,
        params: { id: student.id },
      });
      assert.equal(student, undefined);
      // create again for force delete
      const studentIdForce = await app.bean.executor.performAction('post', '/training/student', {
        innerAccess: false,
        body: data,
      });
      const deleteForceRes = await app.bean.executor.performAction(
        'delete',
        '/training/student/deleteForce/:id',
        {
          innerAccess: false,
          params: { id: studentIdForce },
        },
      );
      assert.equal(deleteForceRes, null);
      const studentForce: EntityStudent | undefined = await app.bean
        .scope('training-student')
        .model.student.getById(studentIdForce, {
          disableDeleted: true,
        });
      assert.equal(studentForce, undefined);
      const studentContentForceDeleted = await app
        .bean.scope('training-student')
        .model.studentContent.get({ studentId: studentIdForce }, { disableDeleted: true });
      assert.equal(studentContentForceDeleted, undefined);
      // logout
      await app.bean.passport.signout();
    });
  });

  it('action:student:emptyContentAndBulkDelete', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const emptyStudentId = await app.bean.executor.performAction('post', '/training/student', {
          innerAccess: false,
          body: {
            name: '__Empty Content__',
            mobile: '13612345678',
            level: 1,
          },
        });
        const bulkStudentId = await app.bean.executor.performAction('post', '/training/student', {
          innerAccess: false,
          body: {
            name: '__Bulk Content__',
            content: { descriptionMarkdown: 'Bulk content' },
            mobile: '13712345678',
            level: 1,
          },
        });
        const studentContentModel = app.bean.scope('training-student').model.studentContent;
        const emptyContent = await studentContentModel.get(
          { studentId: emptyStudentId },
          { disableDeleted: true },
        );
        assert.equal(emptyContent?.descriptionMarkdown, '');
        assert.equal(emptyContent?.descriptionHtml, '');

        await app.bean.executor.performAction('patch', '/training/student/:id', {
          innerAccess: false,
          params: { id: emptyStudentId },
          body: {
            name: '__Empty Content Updated__',
            mobile: '13612345678',
            level: 1,
          },
        });
        const preservedContent = await studentContentModel.get(
          { studentId: emptyStudentId },
          { disableDeleted: true },
        );
        assert.equal(preservedContent?.descriptionMarkdown, '');
        assert.equal(preservedContent?.descriptionHtml, '');
        assert.ok(
          await app
            .bean.scope('training-student')
            .model.student.getById(emptyStudentId),
        );
        assert.ok(
          await app
            .bean.scope('training-student')
            .model.student.getById(bulkStudentId),
        );

        const bulkDeleteRes = await app.bean.executor.performAction(
          'delete',
          '/training/student/bulk',
          { innerAccess: false, body: { ids: [emptyStudentId, bulkStudentId] } },
        );
        assert.equal(bulkDeleteRes, null);
        assert.equal(
          (await studentContentModel.get(
            { studentId: emptyStudentId },
            { disableDeleted: true },
          ))?.deleted,
          true,
        );
        assert.equal(
          (await studentContentModel.get(
            { studentId: bulkStudentId },
            { disableDeleted: true },
          ))?.deleted,
          true,
        );
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('action:student:systemAdmin', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        app.bean.passport.current!.roles = [];
        const actions = ['create', 'select', 'view', 'update', 'summary', 'delete', 'deleteForce'];
        for (const action of actions) {
          assert.equal(
            await app.bean.permission.checkPermissionAction('training-student:student', action),
            false,
          );
        }
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('action:student:level invalid', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      await assert.rejects(async () => {
        await app.bean.executor.performAction('post', '/training/student', {
          innerAccess: false,
          body: {
            name: '__Tom__',
            content: { descriptionMarkdown: 'This is a test' },
            mobile: '13812345678',
            level: 4,
          },
        });
      });
      await app.bean.passport.signout();
    });
  });

  it('action:student:mobile required', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      await assert.rejects(async () => {
        await app.bean.executor.performAction('post', '/training/student', {
          innerAccess: false,
          body: {
            name: '__Tom__',
            content: { descriptionMarkdown: 'This is a test' },
            level: 1,
          },
        });
      });
      await app.bean.passport.signout();
    });
  });

  it('action:student:mobile too short', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      await assert.rejects(async () => {
        await app.bean.executor.performAction('post', '/training/student', {
          innerAccess: false,
          body: {
            name: '__Tom__',
            content: { descriptionMarkdown: 'This is a test' },
            mobile: '1381234567',
            level: 1,
          },
        });
      });
      await app.bean.passport.signout();
    });
  });
});
