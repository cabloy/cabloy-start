import type { TableIdentity } from 'table-identity';
import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';
import type { IMcpToolOptions } from 'vona-module-a-openapiutils';
import type { DtoRecordCreate } from 'vona-module-training-record';
import type { DtoStudentCreate } from 'vona-module-training-student';

import { ZodMetadata } from '@cabloy/zod-openapi';
import fse from 'fs-extra';
import assert from 'node:assert';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { appMetadata, appResource } from 'vona';
import { app } from 'vona-mock';
import { getTargetDecoratorRules, SymbolMcpOptions } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';

import { DtoDetailRecordSubjectResItem } from '../src/dto/detailRecordSubjectResItem.tsx';
import { DtoHighestScoresBySubjectResItem } from '../src/dto/highestScoresBySubjectResItem.tsx';
import { DtoRecordSelectReq, recordQuery } from '../src/dto/recordSelectReq.tsx';
import { DtoRecordSelectResItem } from '../src/dto/recordSelectResItem.tsx';
import { DtoRecordUpdate } from '../src/dto/recordUpdate.tsx';
import { DtoRecordView } from '../src/dto/recordView.tsx';
import { ModelRecord } from '../src/model/record.ts';

const dossierTextAttendance = Buffer.from('attendance dossier file');
const dossierTextAssessment = Buffer.from('assessment dossier file');

describe('record.test.ts', { concurrency: false }, () => {
  it('action:record:resolvesNamedRelationLazily', async () => {
    await app.bean.executor.mockCtx(async () => {
      const ModelRecordRef = appResource.getBean('training-record.model.record')!
        .beanClass as typeof ModelRecord;
      const modelOptions = appResource.getBean(ModelRecordRef)!.options as any;
      const originalStudent = modelOptions.relations.student;
      modelOptions.relations.student = {
        ...originalStudent,
        model: 'training-student:missingStudent',
      };
      try {
        assert.doesNotThrow(() => {
          $Dto.get(ModelRecordRef, { include: { student: true } });
        });
      } finally {
        modelOptions.relations.student = originalStudent;
      }

      const DtoRecord = $Dto.get(ModelRecordRef, { include: { student: true } });
      const apiJson = await app.bean.openapi.generateJsonOfClass(DtoRecord);
      const component = Object.values(apiJson.components!.schemas as any).find(item => {
        return (item as any).properties?.student;
      }) as any;
      assert.ok(component?.properties?.student);
    });
  });

  it('action:record:imageScenePolicy', async () => {
    await app.bean.executor.mockCtx(async () => {
      const policy = await app.bean.imageUploadPolicy.resolveSceneUploadPolicy({
        imageScene: 'training-record:sceneImage',
      });
      assert.equal(policy.public, false);
      assert.equal(policy.maxSize, 2 * 1024 * 1024);
      assert.deepEqual(policy.mimeTypes, ['image/png', 'image/jpeg', 'image/webp']);
      assert.equal(policy.multiple, true);
      assert.deepEqual(policy.processing, {
        enableCrop: false,
        resize: {
          width: 1280,
          height: 1280,
          fit: 'contain',
          format: 'jpeg',
          quality: 90,
        },
      });
      for (const DtoClass of [DtoRecordUpdate, DtoRecordView]) {
        const apiJson = await app.bean.openapi.generateJsonOfClass(DtoClass);
        const component = Object.values(apiJson.components!.schemas as any).find(item => {
          return (item as any).properties?.studentId;
        }) as any;
        const form = component?.properties?.sceneImageIds?.rest?.form;
        assert.equal(form?.render, 'start-image:formFieldImage');
        assert.deepEqual(form?.options, {
          imageScene: 'training-record:sceneImage',
          maxCount: 3,
          relationName: 'sceneImages',
        });
      }
    });
  });

  it('action:record:emittedDtoSchemas', async () => {
    await app.bean.executor.mockCtx(async () => {
      const subjectApiJson = await app.bean.openapi.generateJsonOfClass(
        DtoDetailRecordSubjectResItem,
      );
      const subjectComponent = Object.values(subjectApiJson.components!.schemas as any).find(
        item => (item as any).properties?._lineNumber,
      ) as any;
      assert.ok(subjectComponent?.properties?._lineNumber);
      assert.equal(subjectComponent.required?.includes('_lineNumber'), false);

      const updateApiJson = await app.bean.openapi.generateJsonOfClass(DtoRecordUpdate);
      const updateComponent = Object.values(updateApiJson.components!.schemas as any).find(item => {
        return (item as any).properties?.studentId;
      }) as any;
      assert.ok(updateComponent, JSON.stringify(updateApiJson.components?.schemas));
      assert.equal(updateComponent.properties.studentId.rest?.readonly, true);
      assert.equal(updateComponent.required?.includes('studentId'), false);

      const selectReqRules = getTargetDecoratorRules(DtoRecordSelectReq.prototype);
      const studentIdMetadata = ZodMetadata.getOpenapiMetadata(selectReqRules.studentId!) as
        | ISchemaObjectExtensionField
        | undefined;
      assert.equal(selectReqRules.studentId?.type, 'optional');
      assert.equal(studentIdMetadata?.filter, undefined);
      assert.deepEqual(recordQuery.conveniences.studentId, {
        field: 'studentName',
        op: 'containsI',
      });
      assert.equal(recordQuery.bindings.studentName?.field, 'name');

      const controller = app.bean.onion.controller
        .getOnionsEnabledCached()
        .find(item => item.beanOptions.beanFullName === 'training-record.controller.record')
        ?.beanOptions.beanClass;
      if (!controller) throw new Error('training-record.controller.record not found');
      const reportApiJson = await app.bean.openapi.generateJsonOfClass(
        DtoHighestScoresBySubjectResItem,
      );
      const reportComponent = Object.values(reportApiJson.components!.schemas as any).find(item => {
        const properties = (item as any).properties;
        return properties?.subjectRecordId && properties?.trainingRecordId && properties?.studentId;
      }) as any;
      assert.ok(reportComponent);
      assert.deepEqual(Object.keys(reportComponent.properties).sort(), [
        'score',
        'studentId',
        'studentName',
        'subjectName',
        'subjectRecordId',
        'trainingRecordId',
        'trainingRecordName',
        'trainingTime',
      ]);
      assert.equal(reportComponent.required.includes('trainingTime'), false);

      const mcpActions = ['select', 'view', 'highestScoresBySubject'] as const;
      for (const action of mcpActions) {
        const mcpOptions = appMetadata.getOwnMetadata<IMcpToolOptions>(
          SymbolMcpOptions,
          controller.prototype,
          action,
        );
        assert.equal(mcpOptions?.readOnly, true);
        assert.deepEqual(mcpOptions?.ssrSites, ['start-siteadmin:admin']);
      }
      assert.deepEqual(
        appMetadata.getOwnMetadata<IMcpToolOptions>(
          SymbolMcpOptions,
          controller.prototype,
          'select',
        )?.discovery,
        { output: [['list', 'items']] },
      );

      const controllerApiJson = await app.bean.openapi.generateJsonOfControllerAction(
        controller,
        'select',
        'V31',
      );
      const parameters = controllerApiJson.paths?.['/api/training/record']?.get?.parameters ?? [];
      const studentIdParameter = parameters.find(
        parameter => !('$ref' in parameter) && parameter.name === 'studentId',
      );
      assert.ok(studentIdParameter && !('$ref' in studentIdParameter));
      assert.equal(studentIdParameter.in, 'query');
      assert.equal(studentIdParameter.required, false);
      const studentIdSchema = studentIdParameter.schema;
      assert.ok(studentIdSchema && !('$ref' in studentIdSchema));
      assert.deepEqual(studentIdSchema.type, ['string', 'null']);
      assert.equal(
        parameters.some(parameter => !('$ref' in parameter) && parameter.name === 'studentName'),
        false,
      );

      for (const [DtoClass, hasTrainingRecordSubjects] of [
        [DtoRecordSelectResItem, false],
        [DtoRecordView, true],
      ] as const) {
        const apiJson = await app.bean.openapi.generateJsonOfClass(DtoClass);
        const component = Object.values(apiJson.components!.schemas as any).find(item => {
          const properties = (item as any).properties;
          return (
            properties?.student &&
            Boolean(properties?.trainingRecordSubjects) === hasTrainingRecordSubjects
          );
        }) as any;
        assert.ok(component);
        assert.ok(component.properties.student);
        assert.equal(
          Boolean(component.properties.trainingRecordSubjects),
          hasTrainingRecordSubjects,
        );
        assert.deepEqual(Object.keys(component.properties.student.properties).sort(), [
          'id',
          'name',
        ]);
        for (const field of [
          'id',
          'name',
          'studentId',
          'subjectCount',
          'totalScore',
          'averageScore',
          'createdAt',
        ]) {
          assert.equal(component.properties[field]?.rest?.table?.enableSorting, undefined);
        }
      }
    });
  });

  it('action:record:highestScoresBySubject', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      const studentModel = app.scope('training-student').model.student;
      const recordModel = app.scope('training-record').model.record;
      const subjectModel = app.scope('training-recordsubject').model.subject;
      const studentIds: TableIdentity[] = [];
      const recordIds: TableIdentity[] = [];
      const subjectIds: TableIdentity[] = [];
      try {
        const studentA = await studentModel.insert({
          name: '__Highest Scores Student A__',
          level: 1,
        });
        const studentB = await studentModel.insert({
          name: '__Highest Scores Student B__',
          level: 1,
        });
        studentIds.push(studentA.id, studentB.id);
        const recordA = await recordModel.insert({
          studentId: studentA.id,
          name: '__Highest Scores Record A__',
          trainingTime: new Date('2026-01-01T00:00:00.000Z'),
        });
        const recordB = await recordModel.insert({
          studentId: studentB.id,
          name: '__Highest Scores Record B__',
        });
        recordIds.push(recordA.id, recordB.id);
        const subjects = await subjectModel.insertBulk([
          { recordId: recordA.id, name: '__Highest Math__', score: 95 },
          { recordId: recordA.id, name: '__Highest Math__', score: 95 },
          { recordId: recordA.id, name: '__Highest English__', score: 80 },
          { recordId: recordB.id, name: '__Highest Math__', score: 95 },
          { recordId: recordB.id, name: '__Highest English__', score: 90 },
          { recordId: recordB.id, name: '__Highest Deleted__', score: 100 },
        ]);
        subjectIds.push(...subjects.map(subject => subject.id));
        await subjectModel.deleteById(subjects[5].id);

        const result: any[] = await app.bean.executor.performAction(
          'get',
          '/training/record/highestScoresBySubject',
          { innerAccess: false },
        );
        assert.deepEqual(
          result.map(item => ({
            subjectName: item.subjectName,
            score: item.score,
            subjectRecordId: String(item.subjectRecordId),
            trainingRecordId: String(item.trainingRecordId),
            trainingRecordName: item.trainingRecordName,
            studentId: String(item.studentId),
            studentName: item.studentName,
          })),
          [
            {
              subjectName: '__Highest English__',
              score: 90,
              subjectRecordId: String(subjects[4].id),
              trainingRecordId: String(recordB.id),
              trainingRecordName: '__Highest Scores Record B__',
              studentId: String(studentB.id),
              studentName: '__Highest Scores Student B__',
            },
            {
              subjectName: '__Highest Math__',
              score: 95,
              subjectRecordId: String(subjects[0].id),
              trainingRecordId: String(recordA.id),
              trainingRecordName: '__Highest Scores Record A__',
              studentId: String(studentA.id),
              studentName: '__Highest Scores Student A__',
            },
            {
              subjectName: '__Highest Math__',
              score: 95,
              subjectRecordId: String(subjects[1].id),
              trainingRecordId: String(recordA.id),
              trainingRecordName: '__Highest Scores Record A__',
              studentId: String(studentA.id),
              studentName: '__Highest Scores Student A__',
            },
            {
              subjectName: '__Highest Math__',
              score: 95,
              subjectRecordId: String(subjects[3].id),
              trainingRecordId: String(recordB.id),
              trainingRecordName: '__Highest Scores Record B__',
              studentId: String(studentB.id),
              studentName: '__Highest Scores Student B__',
            },
          ],
        );
        assert.equal(
          result.every(item => !('description' in item)),
          true,
        );
        assert.equal(
          result.every(item => !('deleted' in item)),
          true,
        );
        assert.equal(
          result.find(item => item.subjectName === '__Highest English__')?.trainingTime,
          undefined,
        );

        await subjectModel.updateById(subjects[0].id, { score: 97 });
        const refreshed: any[] = await app.bean.executor.performAction(
          'get',
          '/training/record/highestScoresBySubject',
          { innerAccess: false },
        );
        assert.deepEqual(
          refreshed
            .filter(item => item.subjectName === '__Highest Math__')
            .map(item => [String(item.subjectRecordId), item.score]),
          [[String(subjects[0].id), 97]],
        );
      } finally {
        for (const id of subjectIds.toReversed()) {
          await subjectModel.deleteById(id, { disableDeleted: true });
        }
        for (const id of recordIds.toReversed()) {
          await recordModel.deleteById(id, { disableDeleted: true });
        }
        for (const id of studentIds.toReversed()) {
          await studentModel.deleteById(id, { disableDeleted: true });
        }
        await app.bean.passport.signout();
      }
    });
  });

  it('action:record', async () => {
    await app.bean.executor.mockCtx(async () => {
      const studentData: DtoStudentCreate = {
        name: '__Student__',
        content: { descriptionMarkdown: 'This is a student for record test' },
        mobile: '13812345678',
        level: 1,
        trainingRecords: [],
      };
      const trainingTime = new Date('2026-01-15T09:30:00.000Z');
      const trainingTimeUpdate = new Date('2026-02-20T14:45:00.000Z');
      const dossierFilePathAttendance = path.join(
        os.tmpdir(),
        'training-record-dossier-attendance.txt',
      );
      const dossierFilePathAssessment = path.join(
        os.tmpdir(),
        'training-record-dossier-assessment.txt',
      );
      let dossierFileAttendance: any;
      let dossierFileAssessment: any;
      let studentId: any;
      let replacementStudentId: any;
      let recordId: any;
      await app.bean.passport.signinMock();
      try {
        await fse.writeFile(dossierFilePathAttendance, dossierTextAttendance);
        dossierFileAttendance = await app.bean.file.upload(
          'file-native:native',
          {
            file: dossierFilePathAttendance,
            filename: 'attendance.txt',
            contentType: 'text/plain',
            public: false,
          },
          {
            clientName: 'default',
            fileScene: 'training-record:dossierFile',
          },
        );
        const recordData = {
          studentId: 0 as any,
          name: '__Record__',
          subjectCount: 1,
          totalScore: 88,
          averageScore: 88,
          trainingTime,
          dossierFileIds: [dossierFileAttendance.id],
          description: 'This is a record',
          trainingRecordSubjects: [
            {
              name: '__Math__',
              score: 95,
              description: 'Math subject',
            },
          ],
        } as any as DtoRecordCreate;
        studentId = await app.bean.executor.performAction('post', '/training/student', {
          innerAccess: false,
          body: studentData,
        });
        recordData.studentId = studentId;
        replacementStudentId = await app.bean.executor.performAction('post', '/training/student', {
          innerAccess: false,
          body: {
            ...studentData,
            name: '__ReplacementStudent__',
            mobile: '13912345678',
          },
        });
        recordId = await app.bean.executor.performAction('post', '/training/record', {
          innerAccess: false,
          body: recordData,
        });
        assert.equal(!!recordId, true);

        const selectRes: any = await app.bean.executor.performAction('get', '/training/record', {
          innerAccess: false,
        });
        const recordItem = selectRes.list.find((item: any) => String(item.id) === String(recordId));
        assert.equal(!!recordItem, true);
        assert.equal(recordItem!.name, recordData.name);
        assert.equal(String(recordItem!.studentId), String(studentId));
        assert.equal(String(recordItem!.student?.id), String(studentId));
        assert.equal(recordItem!.student?.name, studentData.name);

        const filteredSelectRes: any = await app.bean.executor.performAction(
          'get',
          '/training/record',
          { innerAccess: false, query: { studentId: 'tude' } },
        );
        assert.equal(
          filteredSelectRes.list.some((item: any) => String(item.id) === String(recordId)),
          true,
        );
        assert.equal(
          filteredSelectRes.list.every((item: any) => item.student?.name.includes('tude')),
          true,
        );

        const canonicalSelectRes: any = await app.bean.executor.performAction(
          'get',
          '/training/record',
          {
            innerAccess: false,
            query: {
              studentId: 'tude',
              where: { field: 'studentId', op: 'eq', value: String(studentId) },
              orders: [{ field: 'studentName', direction: 'asc' }],
            },
          },
        );
        assert.equal(canonicalSelectRes.total, '1');
        assert.deepEqual(
          canonicalSelectRes.list.map((item: any) => String(item.id)),
          [String(recordId)],
        );
        const conflictingSelectRes: any = await app.bean.executor.performAction(
          'get',
          '/training/record',
          {
            innerAccess: false,
            query: {
              studentId: '__ReplacementStudent__',
              where: { field: 'studentId', op: 'eq', value: String(studentId) },
            },
          },
        );
        assert.equal(conflictingSelectRes.total, '0');
        assert.deepEqual(conflictingSelectRes.list, []);
        const internalSelected = await app.scope('training-record').service.record.select({
          where: { studentId },
          orders: [['name', 'asc']],
          limit: 1,
          offset: 0,
        });
        assert.equal(internalSelected.total, '1');
        assert.equal(String(internalSelected.list[0].id), String(recordId));

        assert.equal(recordItem!.dossierFiles?.length, 1);
        assert.equal(recordItem!.dossierFiles?.[0]?.filename, 'attendance.txt');

        let record: any = await app.bean.executor.performAction('get', '/training/record/:id', {
          innerAccess: false,
          params: { id: recordId },
        });
        const recordSubject = record.trainingRecordSubjects?.[0];
        const recordDossierFile = record.dossierFiles?.[0];
        assert.equal(record.name, recordData.name);
        assert.equal(String(record.studentId), String(studentId));
        assert.equal(String(record.student?.id), String(studentId));
        assert.equal(record.student?.name, studentData.name);
        assert.equal(record.subjectCount, recordData.subjectCount);
        assert.equal(record.totalScore, recordData.totalScore);
        assert.equal(Number(record.averageScore), recordData.averageScore);
        assert.equal(new Date(record.trainingTime).toISOString(), trainingTime.toISOString());
        assert.equal(record.dossierFileIds?.length, 1);
        assert.equal(record.dossierFiles?.length, 1);
        assert.equal(String(recordDossierFile?.id), String(dossierFileAttendance.id));
        assert.equal(recordDossierFile?.filename, 'attendance.txt');
        assert.equal(recordDossierFile?.signed, true);
        assert.equal('meta' in (recordDossierFile ?? {}), false);
        assert.equal('fileScene' in (recordDossierFile ?? {}), false);
        assert.equal(record.trainingRecordSubjects?.length, 1);
        assert.equal(recordSubject?.name, '__Math__');
        assert.equal(recordSubject?.score, 95);
        const passportCode = await app.bean.passport.createTempAuthToken({
          path: '/api/file/download',
        });
        const downloadUrl = new URL(recordDossierFile.downloadUrl);
        downloadUrl.searchParams.set('x-vona-passport-code', passportCode);
        const downloadResponse = await fetch(downloadUrl);
        assert.equal(downloadResponse.ok, true);
        assert.equal(await downloadResponse.text(), dossierTextAttendance.toString());

        let student: any = await app.bean.executor.performAction('get', '/training/student/:id', {
          innerAccess: false,
          params: { id: studentId },
        });
        let studentRecord = student.trainingRecords?.find(
          (item: any) => String(item.id) === String(recordId),
        );
        assert.equal(!!studentRecord, true);
        assert.equal(studentRecord?.dossierFiles?.length, 1);
        assert.equal(studentRecord?.trainingRecordSubjects?.length, 1);

        const recordBeforeUpdate = await app
          .scope('training-record')
          .model.record.getById(recordId);
        assert.ok(recordBeforeUpdate);
        const departmentId = recordBeforeUpdate.departmentId;
        const userIdOwner = recordBeforeUpdate.userIdOwner;

        await fse.writeFile(dossierFilePathAssessment, dossierTextAssessment);
        dossierFileAssessment = await app.bean.file.upload(
          'file-native:native',
          {
            file: dossierFilePathAssessment,
            filename: 'assessment.txt',
            contentType: 'text/plain',
            public: false,
          },
          {
            clientName: 'default',
            fileScene: 'training-record:dossierFile',
          },
        );
        const dataUpdate = {
          studentId: replacementStudentId,
          name: '__RecordNew__',
          subjectCount: 2,
          totalScore: 183,
          averageScore: 91.5,
          trainingTime: trainingTimeUpdate,
          dossierFileIds: [dossierFileAttendance.id, dossierFileAssessment.id],
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
        } as any as DtoRecordUpdate;
        const updateRes = await app.bean.executor.performAction('patch', '/training/record/:id', {
          innerAccess: false,
          params: { id: recordId },
          body: dataUpdate,
        });
        assert.equal(updateRes, null);

        record = await app.bean.executor.performAction('get', '/training/record/:id', {
          innerAccess: false,
          params: { id: recordId },
        });
        const [updatedMathSubject, updatedEnglishSubject] = record.trainingRecordSubjects ?? [];
        const recordAfterUpdate = await app.scope('training-record').model.record.getById(recordId);
        assert.ok(recordAfterUpdate);
        assert.equal(String(record.studentId), String(studentId));
        assert.equal(String(record.student?.id), String(studentId));
        assert.equal(record.student?.name, studentData.name);
        assert.equal(String(recordAfterUpdate.departmentId), String(departmentId));
        assert.equal(String(recordAfterUpdate.userIdOwner), String(userIdOwner));
        assert.equal(record.name, dataUpdate.name);
        assert.equal(record.subjectCount, dataUpdate.subjectCount);
        assert.equal(record.totalScore, dataUpdate.totalScore);
        assert.equal(Number(record.averageScore), dataUpdate.averageScore);
        assert.equal(new Date(record.trainingTime).toISOString(), trainingTimeUpdate.toISOString());
        assert.equal(record.dossierFileIds?.length, 2);
        assert.equal(record.dossierFiles?.length, 2);
        assert.equal(
          record.dossierFiles.some((item: any) => item.filename === 'attendance.txt'),
          true,
        );
        assert.equal(
          record.dossierFiles.some((item: any) => item.filename === 'assessment.txt'),
          true,
        );
        assert.equal(record.trainingRecordSubjects?.length, 2);
        assert.equal(updatedMathSubject?.name, '__MathNew__');
        assert.equal(updatedMathSubject?.score, 96);
        assert.equal(updatedEnglishSubject?.name, '__English__');
        assert.equal(updatedEnglishSubject?.score, 87);

        student = await app.bean.executor.performAction('get', '/training/student/:id', {
          innerAccess: false,
          params: { id: studentId },
        });
        studentRecord = student.trainingRecords?.find(
          (item: any) => String(item.id) === String(recordId),
        );
        assert.equal(studentRecord?.name, dataUpdate.name);
        assert.equal(studentRecord?.dossierFiles?.length, 2);
        assert.equal(studentRecord?.trainingRecordSubjects?.length, 2);

        const deleteRes = await app.bean.executor.performAction('delete', '/training/record/:id', {
          innerAccess: false,
          params: { id: recordId },
        });
        assert.equal(deleteRes, null);

        record = await app.bean.executor.performAction('get', '/training/record/:id', {
          innerAccess: false,
          params: { id: recordId },
        });
        assert.equal(record, undefined);

        student = await app.bean.executor.performAction('get', '/training/student/:id', {
          innerAccess: false,
          params: { id: studentId },
        });
        studentRecord = student.trainingRecords?.find(
          (item: any) => String(item.id) === String(recordId),
        );
        assert.equal(studentRecord, undefined);

        const retainedDossierFileAttendance = await app.bean.file.get(dossierFileAttendance.id);
        const retainedDossierFileAssessment = await app.bean.file.get(dossierFileAssessment.id);
        assert.equal(!!retainedDossierFileAttendance, true);
        assert.equal(!!retainedDossierFileAssessment, true);

        await app.bean.executor.performAction('delete', '/training/student/:id', {
          innerAccess: false,
          params: { id: studentId },
        });
        await app.bean.executor.performAction('delete', '/training/student/:id', {
          innerAccess: false,
          params: { id: replacementStudentId },
        });

        student = await app.bean.executor.performAction('get', '/training/student/:id', {
          innerAccess: false,
          params: { id: studentId },
        });
        assert.equal(student, undefined);
      } finally {
        try {
          if (recordId && (await app.scope('training-record').model.record.getById(recordId))) {
            await app.bean.executor.performAction('delete', '/training/record/:id', {
              innerAccess: false,
              params: { id: recordId },
            });
          }
          for (const id of [studentId, replacementStudentId]) {
            if (id && (await app.scope('training-student').model.student.getById(id))) {
              await app.bean.executor.performAction('delete', '/training/student/:id', {
                innerAccess: false,
                params: { id },
              });
            }
          }
          if (dossierFileAssessment) {
            await app.bean.file.delete(dossierFileAssessment.id);
          }
          if (dossierFileAttendance) {
            await app.bean.file.delete(dossierFileAttendance.id);
          }
        } finally {
          await fse.remove(dossierFilePathAttendance);
          await fse.remove(dossierFilePathAssessment);
          await app.bean.passport.signout();
        }
      }
    });
  });

  it('action:record:rejects legacy and internal public query controls', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        for (const query of [
          { where: { studentId: 1 } },
          { where: { field: 'studentId', op: 'containsI', value: '1' } },
          { where: { field: 'student.name', op: 'containsI', value: 'Student' } },
          { orders: 'name,desc' },
          { orders: [['name', 'desc']] },
          { orders: [{ field: 'name', order: 'desc' }] },
          { columns: ['name'] },
          { limit: 1 },
          { offset: 1 },
          { joins: [{ table: 'trainingStudent' }] },
          { include: { student: true } },
          { studentName: 'Student' },
          { userIdOwner: 'other-owner' },
        ]) {
          await assert.rejects(
            () =>
              app.bean.executor.performAction('get', '/training/record', {
                innerAccess: false,
                query,
              }),
            (error: { code?: number }) => error.code === 422,
            JSON.stringify(query),
          );
        }
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('action:record:systemAdmin', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        app.bean.passport.current!.roles = [];
        const actions = ['create', 'select', 'highestScoresBySubject', 'view', 'update', 'delete'];
        const permissions = await Promise.all(
          actions.map(action =>
            app.bean.permission.retrievePermissionAction('training-record:record', action),
          ),
        );
        assert.deepEqual(
          permissions,
          actions.map(() => false),
        );
      } finally {
        await app.bean.passport.signout();
      }
    });
  });
});
