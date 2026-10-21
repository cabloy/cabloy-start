import type { SchemaObject } from 'openapi3-ts/oas31';
import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('accountOpenapi.test.ts', () => {
  it('emits the dedicated Account operation family', async () => {
    await app.bean.executor.mockCtx(async () => {
      const controller = app.bean.onion.controller
        .getOnionsEnabledCached()
        .find(item => item.beanOptions.beanFullName === 'home-user.controller.account')
        ?.beanOptions.beanClass;
      if (!controller) throw new Error('home-user.controller.account not found');

      const expectations = [
        { action: 'current', method: 'get', isPublic: false },
        { action: 'updateProfile', method: 'patch', isPublic: false },
        {
          action: 'consumeActivation',
          method: 'post',
          isPublic: true,
        },
        {
          action: 'changePassword',
          method: 'post',
          isPublic: false,
        },
        {
          action: 'issuePasswordSetLink',
          method: 'post',
          isPublic: false,
        },
        {
          action: 'consumePasswordSet',
          method: 'post',
          isPublic: true,
        },
        {
          action: 'requestPasswordReset',
          method: 'post',
          isPublic: true,
        },
        {
          action: 'consumePasswordReset',
          method: 'post',
          isPublic: true,
        },
      ] as const;

      for (const expectation of expectations) {
        const doc = await app.bean.openapi.generateJsonOfControllerAction(
          controller,
          expectation.action,
          'V31',
        );
        const resolve = (schema: SchemaObject): SchemaObject & ISchemaObjectExtensionField => {
          assert.ok(schema);
          if (!schema.$ref) return schema;
          const resolved =
            doc.components?.schemas?.[schema.$ref.replace('#/components/schemas/', '')];
          assert.ok(resolved);
          return resolve(resolved as SchemaObject);
        };
        const path = Object.values(doc.paths ?? {}).find(item => item?.[expectation.method]);
        const operation = path?.[expectation.method];
        assert.ok(operation);
        assert.equal(operation.operationId, `HomeUserAccount_${expectation.action}`);
        assert.deepEqual(operation.tags, ['HomeUserAccount']);
        assert.equal(!operation.security, expectation.isPublic);
        if (['issuePasswordSetLink', 'requestPasswordReset'].includes(expectation.action)) {
          assert.ok(operation.requestBody && 'content' in operation.requestBody);
          const schema = operation.requestBody.content['application/json']?.schema as SchemaObject;
          assert.ok(schema?.$ref);
          const schemaResolved = resolve(schema);
          assert.ok(schemaResolved.properties?.consumerUrl);
          assert.ok(schemaResolved.required?.includes('consumerUrl'));
          if (expectation.action === 'issuePasswordSetLink') {
            assert.equal(resolve(schemaResolved.properties?.email as SchemaObject).format, 'email');
            assert.ok(schemaResolved.required?.includes('email'));
          }
        }
        if (expectation.action === 'consumeActivation') {
          assert.ok(operation.requestBody && 'content' in operation.requestBody);
          const schema = operation.requestBody.content['application/json']?.schema as SchemaObject;
          assert.ok(schema?.$ref);
          const schemaResolved = resolve(schema);
          assert.deepEqual(Object.keys(schemaResolved?.properties ?? {}), ['token']);
          assert.deepEqual(schemaResolved?.required, ['token']);
          const token = resolve(schemaResolved.properties?.token as SchemaObject);
          assert.equal(token.minLength, 32);
          assert.equal(token.maxLength, 255);
        }
        if (expectation.action === 'changePassword') {
          assert.ok(operation.requestBody && 'content' in operation.requestBody);
          const schema = operation.requestBody.content['application/json']?.schema as SchemaObject;
          assert.ok(schema?.$ref);
          const schemaResolved = resolve(schema);
          assert.deepEqual(Object.keys(schemaResolved?.properties ?? {}), [
            'currentPassword',
            'newPassword',
            'passwordConfirm',
          ]);
          assert.deepEqual(schemaResolved?.required, [
            'currentPassword',
            'newPassword',
            'passwordConfirm',
          ]);
          for (const [field, title] of [
            ['currentPassword', 'home-user::CurrentPassword'],
            ['newPassword', 'home-user::NewPassword'],
            ['passwordConfirm', 'home-user::PasswordConfirm'],
          ]) {
            const property = resolve(schemaResolved.properties?.[field] as SchemaObject);
            assert.equal(property?.title?.toString(), title);
            assert.equal(property?.minLength, 6);
            assert.equal(property?.maxLength, 20);
            const form = property.rest?.form;
            assert.ok(form && 'options' in form);
            assert.equal(form.render, 'start-input:formFieldInput');
            assert.deepEqual(form.options, { type: 'password' });
            assert.equal(form.required, true);
          }
        }
        if (expectation.action === 'updateProfile') {
          assert.ok(operation.requestBody && 'content' in operation.requestBody);
          const schema = operation.requestBody.content['application/json']?.schema as SchemaObject;
          assert.ok(schema?.$ref);
          const schemaResolved = resolve(schema);
          assert.deepEqual(Object.keys(schemaResolved?.properties ?? {}), [
            'name',
            'avatar',
            'locale',
            'tz',
          ]);
          assert.deepEqual(schemaResolved?.required, ['name']);
          for (const [field, title] of [
            ['name', 'home-user::AccountDisplayName'],
            ['avatar', 'home-user::AccountAvatar'],
            ['locale', 'home-user::AccountLocale'],
            ['tz', 'home-user::AccountTimezone'],
          ]) {
            const property = resolve(schemaResolved.properties?.[field] as SchemaObject);
            assert.equal(property.title?.toString(), title);
          }
          const name = resolve(schemaResolved.properties?.name as SchemaObject);
          assert.equal(name.minLength, 1);
          assert.equal(name.maxLength, 100);
          for (const field of ['avatar', 'locale', 'tz']) {
            const property = resolve(schemaResolved.properties?.[field] as SchemaObject);
            assert.deepEqual(property.type, ['string', 'null']);
          }
          assert.equal(schemaResolved?.properties?.avatarImageId, undefined);
          assert.equal(schemaResolved?.properties?.avatarFileId, undefined);
        }
      }
    });
  });
});
