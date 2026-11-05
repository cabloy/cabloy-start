import type { SchemaObject } from 'openapi3-ts/oas31';
import type { IPassport } from 'vona-module-a-user';

import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { app } from 'vona-mock';

import { ControllerPassport } from '../src/controller/passport.ts';

function createPassport(): IPassport {
  return {
    user: {
      id: 'passport-response-user',
      name: 'Passport response fixture',
      displayName: 'Passport display fixture',
      activated: true,
      accountStatus: 'active',
      instanceId: 'untrusted-user-instance',
    },
    auth: { id: 'passport-response-auth', instanceId: 'untrusted-auth-instance' },
    roles: [],
  } as IPassport;
}

async function withPassportFixture(
  fn: () => Promise<void>,
  options?: Parameters<typeof app.bean.executor.mockCtx>[1],
) {
  await app.bean.executor.mockCtx(async () => {
    const findOne = mock.method(app.bean.auth, 'findOne', async () => ({
      id: 'passport-response-auth',
      profileId: 'passport-response-profile',
      authProvider: { id: 1, providerName: 'auth-simple:simple', clientName: 'default' },
    }));
    try {
      await fn();
    } finally {
      findOne.mock.restore();
    }
  }, options);
}

const jwt = {
  accessToken: 'passport-response-access',
  refreshToken: 'passport-response-refresh',
  expiresIn: 3600,
};

describe('passport.test.ts', { concurrency: false }, () => {
  it('current returns the authoritative request instance, not persisted passport identities', async () => {
    await withPassportFixture(async () => {
      const passport = createPassport();
      app.ctx.state.passport = passport;
      const instanceId = app.ctx.instance.id;
      assert.notEqual(instanceId, undefined);

      const result = await app.bean._getBean(ControllerPassport).current();
      assert.ok(result);
      assert.equal(result.instanceId, instanceId);
      assert.equal(result.user.id, passport.user!.id);
      assert.equal(result.user.name, passport.user!.name);
      assert.equal(result.user.displayName, passport.user!.displayName);
      assert.deepEqual(Object.keys(result.auth).sort(), ['authProvider', 'id', 'profileId']);
      assert.equal(result.auth.id, passport.auth!.id);
      assert.deepEqual(result.roles, []);
      assert.equal('instanceId' in result.auth, false);
      assert.equal('instanceId' in result.user, false);
    });
  });

  it('current reloads nonempty roles through the safe persisted projection', async () => {
    await withPassportFixture(async () => {
      const modelRole = app.scope('home-user').model.role;
      const role = await modelRole.insert({
        name: `passport-response-role-${crypto.randomUUID()}`,
        title: 'Passport response role',
        titleLocales: { 'zh-cn': '通行证响应角色' },
        siteIds: ['admin'],
        builtin: false,
      });
      try {
        const passport = createPassport();
        const untrustedRole = {
          ...role,
          name: 'Untrusted passport role',
          title: 'Untrusted passport role title',
          instanceId: 'untrusted-role-instance',
          privateMetadata: { secret: 'untrusted-role-secret' },
        };
        passport.roles = [untrustedRole];
        app.ctx.state.passport = passport;

        const result = await app.bean._getBean(ControllerPassport).current();
        assert.ok(result);
        assert.equal(result.roles.length, 1);
        const projectedRole = result.roles[0];
        assert.equal(projectedRole.id, role.id);
        assert.equal(projectedRole.name, role.name);
        assert.equal(projectedRole.title, role.title);
        assert.deepEqual(projectedRole.titleLocales, role.titleLocales);
        assert.deepEqual(projectedRole.siteIds, role.siteIds);
        assert.equal(projectedRole.builtin, false);
        const safeColumns = [
          'id',
          'createdAt',
          'updatedAt',
          'deleted',
          'iid',
          'name',
          'title',
          'titleLocales',
          'siteIds',
          'builtin',
        ];
        assert.ok(Object.keys(projectedRole).every(key => safeColumns.includes(key)));
        assert.equal('instanceId' in projectedRole, false);
        assert.equal('privateMetadata' in projectedRole, false);
      } finally {
        await modelRole.deleteById(role.id);
      }
    });
  });

  it('current returns explicit null when the request has no instance', async () => {
    await withPassportFixture(
      async () => {
        app.ctx.state.passport = createPassport();
        assert.equal(app.ctx.instance, undefined);
        const result = await app.bean._getBean(ControllerPassport).current();
        assert.ok(result);
        assert.equal(result.instanceId, null);
        assert.ok(Object.hasOwn(result, 'instanceId'));
      },
      { instanceName: null },
    );
  });

  it('current preserves the absent-passport and incomplete-passport behavior', async () => {
    await withPassportFixture(async () => {
      const controller = app.bean._getBean(ControllerPassport);
      for (const passport of [undefined, {}, { user: createPassport().user }, { auth: jwt }]) {
        app.ctx.state.passport = passport as IPassport | undefined;
        assert.equal(await controller.current(), undefined);
      }
    });
  });

  it('Passport/JWT assembly rejects a missing JWT or incomplete Passport with 401', async () => {
    await withPassportFixture(async () => {
      const service = app.scope('home-user').service.passport;
      const unauthorized = (error: { code?: number }) => error.code === 401;
      app.ctx.state.passport = createPassport();
      await assert.rejects(() => service.combineDtoPassportJwt(), unauthorized);
      for (const passport of [undefined, {}, { user: createPassport().user }, { auth: jwt }]) {
        app.ctx.state.passport = passport as IPassport | undefined;
        await assert.rejects(() => service.combineDtoPassportJwt(jwt), unauthorized);
      }
    });
  });

  it('every Passport/JWT response uses the same authoritative instance projection', async () => {
    for (const instanceName of ['', null] as const) {
      await withPassportFixture(
        async () => {
          app.ctx.state.passport = createPassport();
          const controller = app.bean._getBean(ControllerPassport);
          const authenticate = mock.method(app.bean.auth, 'authenticate', async () => jwt);
          const fromOauthCode = mock.method(
            app.bean.passport,
            'createAuthTokenFromOauthCode',
            async () => jwt,
          );
          try {
            const login = { username: 'response-user', password: 'response-password', captcha: {} };
            const responses = [
              await controller.login(login as Parameters<ControllerPassport['login']>[0]),
              await controller.register({
                ...login,
                email: 'response@example.com',
                passwordConfirm: login.password,
                consumerUrl: 'http://localhost/account/activation',
              } as Parameters<ControllerPassport['register']>[0]),
              await controller.associate('auth-simple', 'simple', 'default'),
              await controller.migrate('auth-simple', 'simple', 'default'),
              await controller.createPassportJwtFromOauthCode('response-code'),
            ];
            for (const response of responses) {
              assert.equal(response.passport.instanceId, app.ctx.instance?.id ?? null);
              assert.ok(Object.hasOwn(response.passport, 'instanceId'));
              assert.equal(response.passport.user.id, 'passport-response-user');
              assert.equal(response.passport.user.displayName, 'Passport display fixture');
              assert.equal(response.jwt, jwt);
            }
            assert.equal(authenticate.mock.callCount(), 4);
            assert.equal(fromOauthCode.mock.callCount(), 1);
          } finally {
            fromOauthCode.mock.restore();
            authenticate.mock.restore();
          }
        },
        { instanceName },
      );
    }
  });

  it('OpenAPI exposes a required nullable table identity on current and every Passport/JWT response', async () => {
    await app.bean.executor.mockCtx(async () => {
      const actions = [
        ['current', 'get'],
        ['register', 'post'],
        ['login', 'post'],
        ['associate', 'get'],
        ['migrate', 'get'],
        ['createPassportJwtFromOauthCode', 'post'],
      ] as const;
      for (const [action, method] of actions) {
        const doc = await app.bean.openapi.generateJsonOfControllerAction(
          ControllerPassport,
          action,
          'V31',
        );
        const resolve = (schema: SchemaObject): SchemaObject => {
          if (!schema.$ref) return schema;
          const resolved =
            doc.components?.schemas?.[schema.$ref.replace('#/components/schemas/', '')];
          assert.ok(resolved);
          return resolve(resolved as SchemaObject);
        };
        const operation = Object.values(doc.paths ?? {}).find(item => item?.[method])?.[method];
        assert.ok(operation);
        const response = operation.responses?.['200'];
        assert.ok(response && 'content' in response);
        const body = resolve(response.content?.['application/json']?.schema as SchemaObject);
        assert.ok(body.properties?.data);
        const data = resolve(body.properties.data as SchemaObject);
        const passport =
          action === 'current' ? data : resolve(data.properties?.passport as SchemaObject);
        assert.ok(passport.required?.includes('instanceId'));
        const instanceId = resolve(passport.properties?.instanceId as SchemaObject);
        const user = resolve(passport.properties?.user as SchemaObject);
        const userId = resolve(user.properties?.id as SchemaObject);
        const types = (schema: SchemaObject): string[] => {
          if (schema.anyOf)
            return schema.anyOf.flatMap(item => types(resolve(item as SchemaObject)));
          return Array.isArray(schema.type) ? schema.type : schema.type ? [schema.type] : [];
        };
        const instanceTypes = types(instanceId);
        assert.ok(instanceTypes.includes('null'));
        assert.deepEqual(
          instanceTypes.filter(type => type !== 'null').sort(),
          types(userId).sort(),
        );
        assert.equal(user.properties?.instanceId, undefined);
        assert.ok(user.properties?.displayName);
        if (operation.requestBody && 'content' in operation.requestBody) {
          const request = resolve(
            operation.requestBody.content['application/json'].schema as SchemaObject,
          );
          assert.equal(request.properties?.instanceId, undefined);
        }
      }
    });
  });
});
