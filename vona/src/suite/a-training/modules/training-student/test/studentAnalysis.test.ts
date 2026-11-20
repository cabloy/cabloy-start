import type { TableIdentity } from 'table-identity';
import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';
import type { TypeQueryPredicate } from 'vona-module-a-orm';

import { ZodMetadata } from '@cabloy/zod-openapi';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $schema } from 'vona-module-a-openapiutils';
import { prepareAnalysisFilter } from 'vona-module-a-web';
import { controllerToolQuery } from 'vona-module-cabloy-mcp';

import enUS from '../src/config/locale/en-us.ts';
import zhCN from '../src/config/locale/zh-cn.ts';
import { DtoStudentAggregateRes } from '../src/dto/studentAggregateRes.tsx';
import { DtoStudentGroupResItem } from '../src/dto/studentGroupResItem.tsx';
import { DtoStudentSelectReq, studentQuery } from '../src/dto/studentSelectReq.tsx';

type StudentGroup = { level: number; count_all: string };
type StudentAggregate = { count_all: string; count_imageId: string };

async function dropStudents(ids: TableIdentity[]) {
  const student = app.scope('training-student');
  for (const id of ids.toReversed()) {
    await student.model.studentContent.delete({ studentId: id }, { disableDeleted: true });
    await student.model.student.deleteById(id, { disableDeleted: true });
  }
}

async function readAnalysis(query: Record<string, unknown>) {
  const groups: StudentGroup[] = await app.bean.executor.performAction(
    'get',
    '/training/student/group',
    { innerAccess: false, query },
  );
  const aggregate: StudentAggregate = await app.bean.executor.performAction(
    'get',
    '/training/student/aggregate',
    { innerAccess: false, query },
  );
  return { groups: groups.sort((a, b) => a.level - b.level), aggregate };
}

describe('studentAnalysis.test.ts', { concurrency: false }, () => {
  it('emits public query controls and optional analysis response supersets', async () => {
    await app.bean.executor.mockCtx(async () => {
      const request = $schema(DtoStudentSelectReq);
      const metadata = ZodMetadata.getOpenapiMetadata(
        prepareAnalysisFilter(DtoStudentSelectReq).schema,
      ) as ISchemaObjectExtensionField | undefined;
      assert.deepEqual(metadata?.filter?.capabilities?.query?.orderable, [
        'id',
        'name',
        'level',
        'createdAt',
      ]);
      assert.equal(request.safeParse({}).success, true);
      assert.equal(request.safeParse({ name: 'Student', level: 2, pageSize: 1 }).success, true);
      assert.equal(
        request.safeParse({
          where: { field: 'level', op: 'gte', value: 2 },
          orders: [{ field: 'level', direction: 'desc' }],
          pageNo: 2,
          pageSize: 1,
        }).success,
        true,
      );
      assert.equal(
        prepareAnalysisFilter(DtoStudentSelectReq).schema.safeParse({ columns: ['name'] }).success,
        false,
      );
      const relation = metadata?.filter?.capabilities?.query?.relations?.trainingRecords;
      assert.deepEqual(relation?.operators, ['exists', 'notExists']);
      assert.deepEqual(Object.keys(relation?.fields ?? {}).sort(), [
        'averageScore',
        'createdAt',
        'name',
        'subjectCount',
        'totalScore',
        'trainingTime',
      ]);
      assert.equal(
        request.safeParse({
          where: {
            relation: 'trainingRecords',
            op: 'exists',
            where: { field: 'totalScore', op: 'gte', value: 80 },
          },
        }).success,
        true,
      );
      for (const where of [
        {
          relation: 'trainingRecords',
          op: 'exists',
          where: { field: 'studentName', op: 'eq', value: 'hidden' },
        },
        {
          relation: 'trainingRecords',
          op: 'exists',
          where: { field: 'userIdOwner', op: 'eq', value: '1' },
        },
        {
          relation: 'trainingRecords',
          op: 'exists',
          where: { field: 'name', op: 'startsWith', value: 'hidden' },
        },
        { relation: 'trainingRecords', op: 'exists', where: { relation: 'student', op: 'exists' } },
      ]) {
        assert.equal(request.safeParse({ where }).success, false);
      }
      const requestDocument = await app.bean.openapi.generateJsonOfClass(
        DtoStudentSelectReq,
        'V31',
      );
      const requestComponent = Object.values(requestDocument.components!.schemas!).find(
        item => !('$ref' in item) && Object.hasOwn(item.properties ?? {}, 'pageSize'),
      );
      assert.ok(requestComponent && !('$ref' in requestComponent));
      const published = controllerToolQuery(
        requestComponent,
        requestDocument.components!.schemas!,
        [{ type: 'query', query: studentQuery }],
        true,
      );
      const publishedRelation = published.bindings[0].capabilities.query.relations!.trainingRecords;
      assert.deepEqual(Object.keys(publishedRelation).sort(), [
        'description',
        'fields',
        'operators',
        'title',
      ]);
      assert.deepEqual(publishedRelation, JSON.parse(JSON.stringify(relation)));
      for (const privateName of [
        'authorizationRequired',
        'relationScopes',
        'modelLike',
        'modelClass',
        'entityClass',
        'training-record.controller.record',
      ]) {
        assert.equal(JSON.stringify(published).includes(privateName), false);
      }
      assert.deepEqual(Object.keys(requestComponent.properties ?? {}).sort(), [
        'createdAt',
        'level',
        'name',
        'orders',
        'pageNo',
        'pageSize',
        'where',
      ]);
      for (const [DtoClass, fields] of [
        [DtoStudentGroupResItem, ['count_all', 'count_imageId', 'level']],
        [DtoStudentAggregateRes, ['count_all', 'count_imageId']],
      ] as const) {
        const document = await app.bean.openapi.generateJsonOfClass(DtoClass, 'V31');
        const component = Object.values(document.components!.schemas!).find(
          item => !('$ref' in item) && Object.hasOwn(item.properties ?? {}, 'count_all'),
        );
        assert.ok(component && !('$ref' in component));
        assert.deepEqual(Object.keys(component.properties ?? {}).sort(), [...fields]);
        assert.equal(component.required?.length ?? 0, 0);
        for (const field of ['count_all', 'count_imageId']) {
          const schema = component.properties![field];
          assert.ok(schema && !('$ref' in schema));
          assert.deepEqual(schema.type, ['string', 'null']);
        }
      }
      assert.deepEqual($schema(DtoStudentGroupResItem).parse({ level: 2, count_imageId: '1' }), {
        level: 2,
        count_imageId: '1',
      });
      assert.deepEqual($schema(DtoStudentAggregateRes).parse({ count_all: '3' }), {
        count_all: '3',
      });
    });
  });

  it('localizes training-record query semantics without freezing the first locale', async () => {
    for (const locale of ['en-us', 'zh-cn', 'en-us'] as const) {
      await app.bean.executor.mockCtx(
        async () => {
          const expected = locale === 'en-us' ? enUS : zhCN;
          const document = await app.bean.openapi.generateJsonOfClass(DtoStudentSelectReq, 'V31');
          const component = Object.values(document.components!.schemas!).find(
            item => !('$ref' in item) && Object.hasOwn(item.properties ?? {}, 'pageSize'),
          );
          assert.ok(component && !('$ref' in component));
          const published = controllerToolQuery(
            component,
            document.components!.schemas!,
            [{ type: 'query', query: studentQuery }],
            true,
          );
          const binding = published.bindings[0];
          const relation = binding.capabilities.query.relations.trainingRecords;
          assert.equal(relation.title, expected.TrainingRecords);
          assert.equal(relation.description, expected.TrainingRecordsQueryDescription);
          const leaf = binding.predicates.anyOf.find(
            (branch: any) =>
              branch.properties?.relation?.const === 'trainingRecords' ||
              branch.properties?.relation?.enum?.includes('trainingRecords'),
          );
          assert.ok(leaf);
          assert.equal(leaf.title, expected.TrainingRecords);
          assert.equal(leaf.description, expected.TrainingRecordsQueryDescription);
          assert.equal(leaf.properties.where, undefined);
        },
        { locale },
      );
    }
  });

  it('supports filtered defaults and subsets over HTTP and refreshes cached analysis after writes', async () => {
    await app.bean.executor.mockCtx(async () => {
      const jwt = await app.bean.passport.signinMock();
      const ids: TableIdentity[] = [];
      const name = `Analysis-${randomUUID()}`;
      const student = app.scope('training-student');
      let imageId: TableIdentity | undefined;
      let directory: string | undefined;
      try {
        const empty = { groups: [], aggregate: { count_all: '0', count_imageId: '0' } };
        assert.deepEqual(await readAnalysis({ name }), empty);
        directory = await mkdtemp(path.join(os.tmpdir(), 'student-analysis-'));
        const file = path.join(directory, 'student.png');
        await writeFile(
          file,
          Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFAAH/e+m+7wAAAABJRU5ErkJggg==',
            'base64',
          ),
        );
        const image = await app.bean.image.upload(
          'image-native:native',
          { file, filename: 'student.png', contentType: 'image/png' },
          { imageScene: 'training-student:studentImage' },
        );
        imageId = image.id;
        for (const [index, level] of [1, 1, 2].entries()) {
          ids.push(
            await app.bean.executor.performAction('post', '/training/student', {
              innerAccess: false,
              body: {
                name: `${name}-${index}`,
                mobile: '13812345678',
                level,
                ...(index === 0 ? { imageId } : {}),
              },
            }),
          );
          await student.model.student.updateById(ids[index], {
            createdAt: new Date(index === 2 ? '2026-03-11T12:00:00Z' : '2026-03-10T12:00:00Z'),
          });
        }
        const initial = {
          groups: [
            { level: 1, count_all: '2' },
            { level: 2, count_all: '1' },
          ],
          aggregate: { count_all: '3', count_imageId: '1' },
        };
        assert.deepEqual(await readAnalysis({ name }), initial);
        assert.deepEqual(await readAnalysis({ name }), initial);
        assert.deepEqual(await readAnalysis({ name, level: 2 }), {
          groups: [{ level: 2, count_all: '1' }],
          aggregate: { count_all: '1', count_imageId: '0' },
        });
        assert.deepEqual(await readAnalysis({ name, createdAt: '2026-03-10~2026-03-10' }), {
          groups: [{ level: 1, count_all: '2' }],
          aggregate: { count_all: '2', count_imageId: '1' },
        });
        // Canonical predicates and named filters are always composed with AND.
        assert.deepEqual(
          await readAnalysis({ name, level: 1, where: { field: 'level', op: 'eq', value: 2 } }),
          empty,
        );
        assert.deepEqual(
          await readAnalysis({ name, where: { field: 'level', op: 'eq', value: 2 } }),
          {
            groups: [{ level: 2, count_all: '1' }],
            aggregate: { count_all: '1', count_imageId: '0' },
          },
        );
        const selected = await app.bean.executor.performAction('get', '/training/student', {
          innerAccess: false,
          query: { name, pageSize: 1 },
        });
        assert.equal(selected.total, '3');
        assert.equal(selected.list.length, 1);
        assert.equal(Object.hasOwn(selected.list[0], 'count_all'), false);
        assert.deepEqual(
          await student.service.student.group({ where: { name: { _startsWith_: name } } }),
          initial.groups,
        );
        assert.deepEqual(
          await student.service.student.aggregate({
            where: { name: { _startsWith_: name } },
            aggrs: { count: ['imageId'] },
          }),
          { count_imageId: '1' },
        );

        const internalSelected = await student.service.student.select({
          where: { name: { _startsWith_: name } },
          orders: [['createdAt', 'desc']],
          limit: 1,
          offset: 1,
        });
        assert.equal(internalSelected.total, '3');
        assert.equal(internalSelected.list.length, 1);
        assert.equal(internalSelected.list[0].level, 1);

        // Concrete HTTP URLs verify routing ahead of /:id and JSON query control parsing.
        for (const [action, controls, expected] of [
          ['group', {}, initial.groups],
          ['aggregate', {}, initial.aggregate],
          [
            'group',
            { groups: ['level'], aggrs: { count: ['imageId'] } },
            [
              { level: 1, count_imageId: '1' },
              { level: 2, count_imageId: '0' },
            ],
          ],
          ['aggregate', { aggrs: { count: ['*'] } }, { count_all: '3' }],
        ] as const) {
          const url = new URL(app.util.getAbsoluteUrlByApiPath(`/training/student/${action}`));
          url.searchParams.set('name', name);
          for (const [key, value] of Object.entries(controls)) {
            url.searchParams.set(key, JSON.stringify(value));
          }
          const response = await fetch(url, {
            headers: { Accept: 'application/json', Authorization: `Bearer ${jwt.accessToken}` },
          });
          assert.equal(response.status, 200);
          const body = await response.json();
          assert.equal(body.code, 0, JSON.stringify(body));
          assert.deepEqual(body.data, expected);
        }
        for (const [action, field, value] of [
          ['group', 'groups', 'level'],
          ['group', 'groups', '["level"'],
          ['aggregate', 'aggrs', '{"count":'],
        ]) {
          const url = new URL(app.util.getAbsoluteUrlByApiPath(`/training/student/${action}`));
          url.searchParams.set('name', name);
          url.searchParams.set(field, value);
          const response = await fetch(url, {
            headers: { Accept: 'application/json', Authorization: `Bearer ${jwt.accessToken}` },
          });
          assert.equal(response.status, 422);
          assert.equal((await response.json()).code, 422);
        }
        for (const [action, controls] of [
          ['', { groups: ['level'] }],
          ['', { aggrs: { count: ['*'] } }],
          ['group', { groups: [] }],
          ['group', { groups: ['level', 'level'] }],
          ['group', { groups: ['name'] }],
          ['group', { aggrs: {} }],
          ['group', { aggrs: { count: [] } }],
          ['group', { aggrs: { count: ['*', '*'] } }],
          ['group', { aggrs: { count: ['mobile'] } }],
          ['aggregate', { aggrs: { sum: ['level'] } }],
          ['aggregate', { groups: ['level'] }],
          ['aggregate', { groups: [] }],
          ['group', { pageSize: 0 }],
          ['aggregate', { pageNo: 0 }],
        ] as const) {
          await assert.rejects(
            () =>
              app.bean.executor.performAction(
                'get',
                action === '' ? '/training/student' : `/training/student/${action}`,
                { innerAccess: false, query: { name, ...controls } },
              ),
            (error: { code?: number }) => error.code === 422,
          );
        }
        for (const action of ['group', 'aggregate'] as const) {
          for (const controls of [
            { columns: ['name'] },
            { orders: [{ field: 'level', direction: 'desc' }] },
            { pageNo: 2 },
            { pageSize: 1 },
            { where: { level: { _gte_: 2 } } },
            { limit: 1 },
            { offset: 1 },
            { include: { content: true } },
            { unknownFilter: 'not-ignored' },
          ]) {
            await assert.rejects(
              () =>
                app.bean.executor.performAction('get', `/training/student/${action}`, {
                  innerAccess: false,
                  query: { name, ...controls },
                }),
              (error: { code?: number }) => error.code === 422,
              `${action}: ${JSON.stringify(controls)}`,
            );
          }
        }
        await assert.rejects(
          () => student.service.student.group({ groups: ['name'] } as never),
          (error: { code?: number }) => error.code === 422,
        );
        await assert.rejects(
          () => student.service.student.aggregate({ groups: ['level'] } as never),
          (error: { code?: number }) => error.code === 422,
        );
        await app.bean.executor.performAction('patch', '/training/student/:id', {
          innerAccess: false,
          params: { id: ids[1] },
          body: { name: `${name}-1`, mobile: '13812345678', level: 2 },
        });
        assert.deepEqual(await readAnalysis({ name }), {
          groups: [
            { level: 1, count_all: '1' },
            { level: 2, count_all: '2' },
          ],
          aggregate: { count_all: '3', count_imageId: '1' },
        });
        await app.bean.executor.performAction('delete', '/training/student/:id', {
          innerAccess: false,
          params: { id: ids[0] },
        });
        assert.equal(
          (await student.model.student.getById(ids[0], { disableDeleted: true }))?.deleted,
          true,
        );
        assert.deepEqual(await readAnalysis({ name }), {
          groups: [{ level: 2, count_all: '2' }],
          aggregate: { count_all: '2', count_imageId: '0' },
        });
      } finally {
        try {
          await dropStudents(ids);
          if (imageId !== undefined) await app.bean.image.delete(imageId);
        } finally {
          if (directory) await rm(directory, { recursive: true, force: true });
          await app.bean.passport.signout();
        }
      }
    });
  });

  it('keeps root and related Record policy scopes across list, count, group and aggregate', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      const context = app.ctx;
      const ownerId = String(app.bean.passport.currentUser!.id);
      const delegatedOwnerId = '123456789';
      const roles = app.bean.passport.current!.roles;
      const name = `Scope-${randomUUID()}`;
      const studentModel = app.scope('training-student').model.student;
      const recordModel = app.scope('training-record').model.record;
      const ids: TableIdentity[] = [];
      const recordIds: TableIdentity[] = [];
      let off: (() => void) | undefined;
      let recordDenied = false;
      let delegatedRecordTerm = false;
      const policyActions: string[] = [];
      const recordAction = 'training-record.controller.record#select';
      const recordChecks = () => policyActions.filter(action => action === recordAction).length;
      try {
        assert.notEqual(ownerId, '0');
        assert.notEqual(ownerId, delegatedOwnerId);
        for (const [index, level] of [1, 2, 3].entries()) {
          const id = await app.bean.executor.performAction('post', '/training/student', {
            innerAccess: false,
            body: { name: `${name}-${index}`, mobile: '13812345678', level },
          });
          ids.push(id);
          recordIds.push(
            await app.bean.executor.performAction('post', '/training/record', {
              innerAccess: false,
              body: {
                studentId: id,
                name: `${name}-${index}`,
                subjectCount: 2,
                totalScore: 180,
                averageScore: 90,
              },
            }),
          );
        }
        // The second visible parent has only a hidden child. The third parent is hidden,
        // even though its child is allowed by the Record policy.
        await studentModel.updateById(ids[2], { userIdOwner: '0' });
        await recordModel.updateById(recordIds[1], { userIdOwner: '0' });
        const delegated = await recordModel.insert({
          studentId: ids[1],
          name: `${name}-d`,
          departmentId: null,
          userIdOwner: delegatedOwnerId,
          subjectCount: 1,
          totalScore: 70,
          averageScore: 70,
        });
        recordIds.push(delegated.id);
        app.bean.passport.current!.roles = [];
        assert.equal(await app.bean.passport.isSystemAdmin(), false);
        off = app.scope('a-rbac').event.resolvePolicy.on((request, next) => {
          // Relation authorization owns a new child context below performAction.
          // Bind the fixture to this mockCtx ancestry, never to unrelated requests.
          let caller: typeof context | undefined = app.ctx;
          while (caller && caller !== context) caller = caller.ctxCaller;
          if (
            caller !== context ||
            String(app.bean.passport.currentUser?.id) !== ownerId ||
            ![
              'training-student.controller.student#select',
              'training-student.controller.student#group',
              'training-student.controller.student#aggregate',
              recordAction,
            ].includes(request.action.actionKey)
          ) {
            return next();
          }
          assert.equal(request.action.options.dataScope, true);
          policyActions.push(request.action.actionKey);
          const isRecord = request.action.actionKey === recordAction;
          return {
            allowed: !(isRecord && recordDenied),
            actionKey: request.action.actionKey,
            action: request.action,
            terms: [
              { dataScope: 'mine' as const, ownerId },
              ...(isRecord && delegatedRecordTerm
                ? [{ dataScope: 'mine' as const, ownerId: delegatedOwnerId }]
                : []),
            ],
          };
        });
        const select = async (where?: TypeQueryPredicate) =>
          await app.bean.executor.performAction('get', '/training/student', {
            innerAccess: false,
            query: { name, ...(where ? { where } : {}), pageSize: 1 },
          });
        const assertResults = async (
          where: TypeQueryPredicate | undefined,
          indexes: number[],
          relationChecks: number,
        ) => {
          const before = recordChecks();
          const selected = await select(where);
          assert.equal(recordChecks() - before, relationChecks);
          assert.equal(selected.total, String(indexes.length));
          assert.equal(selected.list.length, Math.min(indexes.length, 1));
          for (const item of selected.list) {
            assert.ok(indexes.some(index => String(ids[index]) === String(item.id)));
            assert.equal(Object.hasOwn(item, 'trainingRecords'), false);
          }
          const analysis = await readAnalysis({ name, ...(where ? { where } : {}) });
          assert.equal(recordChecks() - before, relationChecks * 3);
          assert.deepEqual(analysis, {
            groups: indexes.map(index => ({ level: index + 1, count_all: '1' })),
            aggregate: { count_all: String(indexes.length), count_imageId: '0' },
          });
        };
        const exists: TypeQueryPredicate = { relation: 'trainingRecords', op: 'exists' };
        const notExists: TypeQueryPredicate = { relation: 'trainingRecords', op: 'notExists' };
        const highScore: TypeQueryPredicate = {
          relation: 'trainingRecords',
          op: 'exists',
          where: { field: 'averageScore', op: 'gte', value: 80 },
        };
        const hiddenChild: TypeQueryPredicate = {
          relation: 'trainingRecords',
          op: 'exists',
          where: { field: 'name', op: 'eq', value: `${name}-1` },
        };
        const both: TypeQueryPredicate = {
          or: ids.map(id => ({ field: 'id', op: 'eq', value: String(id) })),
        };
        await assertResults(both, [0, 1], 0);
        await assertResults({ field: 'id', op: 'eq', value: String(ids[2]) }, [], 0);
        await assertResults(exists, [0], 1);
        await assertResults(notExists, [1], 1);
        await assertResults(highScore, [0], 1);
        await assertResults(hiddenChild, [], 1);
        await assertResults(
          { relation: 'trainingRecords', op: 'notExists', where: hiddenChild.where },
          [0, 1],
          1,
        );
        await assertResults({ not: exists }, [1], 1);
        await assertResults({ or: [hiddenChild, { field: 'level', op: 'eq', value: 1 }] }, [0], 1);
        // A relation nested in a Boolean group authorizes the target action just once.
        await assertResults({ and: [exists, { field: 'level', op: 'eq', value: 1 }] }, [0], 1);

        // Keep the existing direct Record scope check, independent of the parent scope.
        for (const [where, expected] of [
          [
            { or: ids.map(id => ({ field: 'studentId', op: 'eq', value: String(id) })) },
            recordIds.slice(0, 3).filter((_, index) => index !== 1),
          ],
          [{ field: 'studentId', op: 'eq', value: String(ids[1]) }, []],
        ] as const) {
          const records = await app.bean.executor.performAction('get', '/training/record', {
            innerAccess: false,
            query: { studentId: name, where },
          });
          assert.equal(records.total, String(expected.length));
          assert.deepEqual(
            records.list.map((item: any) => String(item.id)).toSorted(),
            expected.map(String).toSorted(),
          );
        }

        // Policy terms form an OR inside the child EXISTS, not an AND or a root override.
        delegatedRecordTerm = true;
        await assertResults(exists, [0, 1], 1);
        await assertResults(highScore, [0], 1);
        await assertResults(notExists, [], 1);
        delegatedRecordTerm = false;

        // Warmed Student queries must change when the Record source changes.
        assert.equal(studentModel.cacheQuery.enabled, true);
        await assertResults(highScore, [0], 1);
        await recordModel.updateById(recordIds[0], { averageScore: 50 });
        await assertResults(highScore, [], 1);
        await recordModel.updateById(recordIds[0], { averageScore: 90 });
        await assertResults(highScore, [0], 1);
        await recordModel.deleteById(recordIds[0]);
        await assertResults(exists, [], 1);
        await assertResults(notExists, [0, 1], 1);
        await recordModel.updateById(recordIds[0], { deleted: false }, { disableDeleted: true });
        await assertResults(exists, [0], 1);

        recordDenied = true;
        // A denied Record action must not be checked for relation-free requests.
        await assertResults(both, [0, 1], 0);
        for (const where of [
          exists,
          notExists,
          { or: [{ field: 'level', op: 'eq', value: 1 }, exists] },
          { not: exists },
        ] satisfies TypeQueryPredicate[]) {
          for (const path of [
            '/training/student',
            '/training/student/group',
            '/training/student/aggregate',
          ] as const) {
            const before = recordChecks();
            await assert.rejects(
              () =>
                app.bean.executor.performAction('get', path, {
                  innerAccess: false,
                  query: { name, where },
                }),
              (error: { code?: number }) => error.code === 403,
            );
            assert.equal(recordChecks() - before, 1);
          }
        }
        assert.deepEqual([...new Set(policyActions)].toSorted(), [
          recordAction,
          'training-student.controller.student#aggregate',
          'training-student.controller.student#group',
          'training-student.controller.student#select',
        ]);

        // Admin receives an explicit unrestricted child scope, not a missing authorization.
        app.bean.passport.current!.roles = roles;
        assert.equal(await app.bean.passport.isSystemAdmin(), true);
        await assertResults(exists, [0, 1, 2], 0);
        await assertResults(hiddenChild, [1], 0);
      } finally {
        off?.();
        app.bean.passport.current!.roles = roles;
        try {
          for (const id of recordIds.toReversed()) {
            await recordModel.deleteById(id, { disableDeleted: true });
          }
          await dropStudents(ids);
        } finally {
          await app.bean.passport.signout();
        }
      }
    });
  });

  it('excludes students owned by another instance', async () => {
    const name = `Analysis-${randomUUID()}`;
    const ids: TableIdentity[] = [];
    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          ids.push(
            await app.bean.executor.performAction('post', '/training/student', {
              innerAccess: false,
              body: { name, mobile: '13812345678', level: 3 },
            }),
          );
          assert.deepEqual(await readAnalysis({ name }), {
            groups: [{ level: 3, count_all: '1' }],
            aggregate: { count_all: '1', count_imageId: '0' },
          });
        } finally {
          await app.bean.passport.signout();
        }
      });
      await app.bean.executor.mockCtx(
        async () => {
          await app.bean.passport.signinMock();
          try {
            assert.deepEqual(await readAnalysis({ name }), {
              groups: [],
              aggregate: { count_all: '0', count_imageId: '0' },
            });
          } finally {
            await app.bean.passport.signout();
          }
        },
        { instanceName: 'shareTest' as any },
      );
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await dropStudents(ids);
      });
    }
  });
});
