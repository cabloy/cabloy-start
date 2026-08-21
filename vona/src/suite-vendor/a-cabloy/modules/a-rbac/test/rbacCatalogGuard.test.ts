import type { VonaContext } from 'vona';
import type { ContextRoute } from 'vona-module-a-web';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { beanFullNameFromOnionName } from 'vona';
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

function createGuard(
  action: IRbacActionDescriptor,
  decision: IRbacPolicyDecision | undefined,
  unrestricted = false,
): { guard: GuardRbac; request: () => IRbacPolicyRequest | undefined; ctx: VonaContext } {
  let policyRequest: IRbacPolicyRequest | undefined;
  const ctx = { route: action.route } as VonaContext;
  const guard = Object.create(GuardRbac.prototype) as GuardRbac;
  Object.defineProperties(guard, {
    bean: {
      value: {
        rbacCatalog: { getAction: () => action },
        rbacScope: { isUnrestricted: async () => unrestricted },
      },
    },
    ctx: { value: ctx },
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
  return { guard, request: () => policyRequest, ctx };
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
    const { guard, request, ctx } = createGuard(action, decision);

    assert.equal(await guard.check({}), true);
    assert.equal(request()?.policyActionKey, 'test:controller#update');
    assert.deepEqual(getRbacDecision(ctx), decision);
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
      const { guard, ctx } = createGuard(action, decision);
      assert.equal(await guard.check({}), false);
      assert.equal(getRbacDecision(ctx), undefined);
    }
  });

  it('stores a canonical action instead of resolver-supplied route details', async () => {
    const action = createDescriptor();
    const decision: IRbacPolicyDecision = {
      allowed: true,
      actionKey: action.actionKey,
      action: { ...action, route: undefined as never, options: undefined as never },
    };
    const { guard, ctx } = createGuard(action, decision);

    assert.equal(await guard.check({}), true);
    assert.equal(getRbacDecision(ctx)?.action.route, action.route);
    assert.deepEqual(getRbacDecision(ctx)?.action.options, action.options);
  });

  it('returns valid deny decisions to GuardBase without treating them as malformed', async () => {
    const action = createDescriptor();
    const decision: IRbacPolicyDecision = { allowed: false, actionKey: action.actionKey, action };
    const { guard, ctx } = createGuard(action, decision);

    assert.equal(await guard.check({}), false);
    assert.equal(getRbacDecision(ctx)?.action.route, action.route);
    assert.deepEqual(getRbacDecision(ctx)?.action.options, action.options);
  });

  it('stores an all-scope decision without resolving policy for unrestricted access', async () => {
    const action = createDescriptor();
    const { guard, request, ctx } = createGuard(action, undefined, true);

    assert.equal(await guard.check({}), true);
    assert.equal(request(), undefined);
    assert.deepEqual(getRbacDecision(ctx), {
      allowed: true,
      actionKey: action.actionKey,
      action,
      terms: [{ dataScope: 'all' }],
    });
  });
});
