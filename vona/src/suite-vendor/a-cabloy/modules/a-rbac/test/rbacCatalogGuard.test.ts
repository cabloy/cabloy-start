import type { ContextRoute } from 'vona-module-a-web';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { beanFullNameFromOnionName } from 'vona';
import { GuardRoleName } from 'vona-module-a-user';
import { getCacheControllerRoutes } from 'vona-module-a-web';

import type {
  IRbacActionDescriptor,
  IRbacPolicyDecision,
  IRbacPolicyRequest,
} from '../src/types/rbac.ts';

import { BeanRbacCatalog } from '../src/bean/bean.rbacCatalog.ts';
import { GuardRbac } from '../src/bean/guard.rbac.ts';
import { getRbacDecision, rbacActionKey } from '../src/lib/rbac.ts';

const BeanFullNameGuardRbac = beanFullNameFromOnionName('a-rbac:rbac', 'guard');

interface ITestApp {
  meta: object;
}

function createApp(routes: ContextRoute[]): ITestApp {
  const app: ITestApp = { meta: {} };
  const routesByController = getCacheControllerRoutes(app as never);
  for (const route of routes) {
    (routesByController[route.controllerBeanFullName] ??= []).push(route);
  }
  return app;
}

function createCatalog(routes: ContextRoute[]): BeanRbacCatalog {
  const catalog = Object.create(BeanRbacCatalog.prototype) as BeanRbacCatalog;
  Object.defineProperty(catalog, 'app', { value: createApp(routes) });
  return catalog;
}

function createRoute(
  controllerBeanFullName: string,
  action: string,
  options?: Record<string, unknown>,
): ContextRoute {
  return {
    controller: class {},
    controllerBeanFullName,
    action,
    actionDescriptor: {},
    route: {
      meta: options ? { [BeanFullNameGuardRbac]: options } : {},
    },
    routeMethod: 'get',
    routePath: `/${controllerBeanFullName}/${action}`,
    routePathRaw: `/${controllerBeanFullName}/${action}`,
    routePathOriginal: action,
  } as ContextRoute;
}

function createDescriptor(action = 'select', actionInheritKey?: string): IRbacActionDescriptor {
  const controllerBeanFullName = 'test:controller';
  return {
    actionKey: rbacActionKey(controllerBeanFullName, action),
    controllerBeanFullName,
    action,
    actionInheritKey,
    route: createRoute(controllerBeanFullName, action, {}),
    options: {},
  };
}

function createRoleGuard(matched: boolean): GuardRoleName {
  const guard = Object.create(GuardRoleName.prototype) as GuardRoleName;
  Object.defineProperties(guard, {
    bean: { value: { passport: { checkRoleName: async () => matched } } },
    app: { value: { throw: async () => false } },
  });
  return guard;
}

function createGuard(
  action: IRbacActionDescriptor,
  decision: IRbacPolicyDecision | undefined,
): { guard: GuardRbac; request: () => IRbacPolicyRequest | undefined; state: object } {
  let policyRequest: IRbacPolicyRequest | undefined;
  const state = {};
  const guard = Object.create(GuardRbac.prototype) as GuardRbac;
  Object.defineProperties(guard, {
    bean: { value: { rbacCatalog: { getAction: () => action } } },
    ctx: { value: { route: action.route, state } },
    scope: {
      value: {
        event: {
          resolvePolicy: {
            emit: async (request: IRbacPolicyRequest) => {
              policyRequest = request;
              return decision;
            },
          },
        },
      },
    },
  });
  return { guard, request: () => policyRequest, state };
}

describe('rbacCatalogGuard.test.ts', { concurrency: false }, () => {
  it('includes explicitly decorated Resource and non-Resource routes only', () => {
    const resource = createRoute('test:resource', 'select', {});
    const nonResource = createRoute('test:command', 'run', {});
    const undecorated = createRoute('test:resource', 'legacy');
    const catalog = createCatalog([resource, nonResource, undecorated]);

    assert.deepEqual(
      [...catalog.getCatalog().keys()],
      ['test:resource#select', 'test:command#run'],
    );
    assert.equal(catalog.getAction(undecorated), undefined);
    assert.equal(catalog.getAction(resource)?.route.routePath, '/test:resource/select');
    assert.equal(rbacActionKey('test:resource', 'select'), 'test:resource#select');
  });

  it('resolves aliases to the terminal same-controller grant identity', () => {
    const controller = 'test:controller';
    const catalog = createCatalog([
      createRoute(controller, 'create', { actionInherit: 'update' }),
      createRoute(controller, 'update', { actionInherit: 'legacy' }),
      createRoute(controller, 'legacy'),
    ]);

    assert.equal(
      catalog.getAction(createRoute(controller, 'create'))?.actionInheritKey,
      `${controller}#legacy`,
    );
    assert.equal(
      catalog.getAction(createRoute(controller, 'update'))?.actionInheritKey,
      `${controller}#legacy`,
    );
    assert.equal(catalog.getAction(createRoute(controller, 'legacy')), undefined);
  });

  it('fails closed for invalid aliases', () => {
    const controller = 'test:controller';
    assert.throws(
      () =>
        createCatalog([
          createRoute(controller, 'create', { actionInherit: 'missing' }),
        ]).getCatalog(),
      /target not found/,
    );
    assert.throws(
      () =>
        createCatalog([
          createRoute(controller, 'create', { actionInherit: 'create' }),
        ]).getCatalog(),
      /cannot reference itself/,
    );
    assert.throws(
      () =>
        createCatalog([
          createRoute(controller, 'create', { actionInherit: 'update' }),
          createRoute(controller, 'update', { actionInherit: 'create' }),
        ]).getCatalog(),
      /cycle/,
    );
    assert.throws(
      () =>
        createCatalog([
          createRoute(controller, 'create', { actionInherit: 'update' }),
          createRoute('test:otherController', 'update'),
        ]).getCatalog(),
      /target not found/,
    );
  });

  it('uses terminal aliases for grant lookup and stores only valid decisions', async () => {
    const action = createDescriptor('create', 'test:controller#update');
    const decision: IRbacPolicyDecision = {
      allowed: true,
      actionKey: action.actionKey,
      action,
      terms: [{ dataScope: 'mine', ownerId: '1' }],
    };
    const { guard, request, state } = createGuard(action, decision);

    assert.equal(await guard.check({}), true);
    assert.equal(request()?.policyActionKey, 'test:controller#update');
    assert.deepEqual(getRbacDecision({ state }), decision);
  });

  it('denies malformed policy decisions without storing them', async () => {
    const action = createDescriptor();
    const cases: Array<IRbacPolicyDecision | undefined> = [
      undefined,
      { allowed: true, actionKey: 'test:controller#other', action },
      { allowed: 1 as never, actionKey: action.actionKey, action },
      { allowed: true, actionKey: action.actionKey, action, revision: 1 as never },
      {
        allowed: true,
        actionKey: action.actionKey,
        action: { ...action, actionInheritKey: 'test:controller#other' },
      },
      { allowed: true, actionKey: action.actionKey, action, terms: [] },
      {
        allowed: true,
        actionKey: action.actionKey,
        action,
        terms: [{ dataScope: 'mine' } as never],
      },
      {
        allowed: true,
        actionKey: action.actionKey,
        action,
        terms: [{ dataScope: 'customDepartments' } as never],
      },
      {
        allowed: true,
        actionKey: action.actionKey,
        action,
        terms: [{ dataScope: 'ownDepartment', departmentIds: [] }],
      },
      {
        allowed: true,
        actionKey: action.actionKey,
        action,
        terms: [{ dataScope: 'invalid' as never }],
      },
    ];
    for (const decision of cases) {
      const { guard, state } = createGuard(action, decision);
      assert.equal(await guard.check({}), false);
      assert.equal(getRbacDecision({ state }), undefined);
    }
  });

  it('stores a canonical action instead of resolver-supplied route details', async () => {
    const action = createDescriptor();
    const decision: IRbacPolicyDecision = {
      allowed: true,
      actionKey: action.actionKey,
      action: { ...action, route: undefined as never, options: undefined as never },
    };
    const { guard, state } = createGuard(action, decision);

    assert.equal(await guard.check({}), true);
    assert.equal(getRbacDecision({ state })?.action.route, action.route);
    assert.deepEqual(getRbacDecision({ state })?.action.options, action.options);
  });

  it('returns valid deny decisions to GuardBase without treating them as malformed', async () => {
    const action = createDescriptor();
    const decision: IRbacPolicyDecision = { allowed: false, actionKey: action.actionKey, action };
    const { guard, state } = createGuard(action, decision);

    assert.equal(await guard.check({}), false);
    assert.equal(getRbacDecision({ state })?.action.route, action.route);
    assert.deepEqual(getRbacDecision({ state })?.action.options, action.options);
  });

  it('preserves independent systemAdmin and RBAC guard composition', async () => {
    const action = createDescriptor();
    const decision: IRbacPolicyDecision = { allowed: true, actionKey: action.actionKey, action };
    const rbacGuard = createGuard(action, decision).guard;
    let nextCalls = 0;
    const rbacNext = async () => {
      nextCalls++;
      return await rbacGuard.execute({}, async () => true);
    };

    const systemAdminMatch = createRoleGuard(true);
    assert.equal(
      await systemAdminMatch.execute(
        { name: 'systemAdmin', passWhenMatched: true, rejectWhenDismatched: false },
        rbacNext,
      ),
      true,
    );
    assert.equal(nextCalls, 0);

    const systemAdminMismatch = createRoleGuard(false);
    assert.equal(
      await systemAdminMismatch.execute(
        { name: 'systemAdmin', passWhenMatched: true, rejectWhenDismatched: false },
        rbacNext,
      ),
      true,
    );
    assert.equal(nextCalls, 1);
  });
});
