import type { APIRequestContext, APIResponse, TestInfo } from '@playwright/test';

import { expect } from '@playwright/test';

export type TableIdentity = number | string;

export interface RegisteredAccount {
  id: TableIdentity;
  username: string;
  password: string;
  accessToken: string;
}

export interface ApiRequestOptions {
  accessToken?: string;
  data?: unknown;
  params?: Record<string, unknown>;
}

export interface ApiEnvelope<T> {
  data: T;
}

export async function requestApi(
  request: APIRequestContext,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  pathname: string,
  options: ApiRequestOptions = {},
): Promise<APIResponse> {
  return await request.fetch(pathname, {
    method,
    data: options.data,
    params: serializeApiParams(options.params),
    headers: options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : undefined,
  });
}

function serializeApiParams(params: ApiRequestOptions['params']): URLSearchParams | undefined {
  if (!params) return undefined;
  const serialized = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    serialized.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
  }
  return serialized;
}

export async function requestApiOk<T>(
  request: APIRequestContext,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  pathname: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const response = await requestApi(request, method, pathname, options);
  expect(response.ok(), `${method} ${pathname} returned ${response.status()}`).toBeTruthy();
  const body = await response.body();
  if (!body.length) return undefined as T;
  return (JSON.parse(body.toString()) as ApiEnvelope<T>).data;
}

export async function loginAsAccount(
  request: APIRequestContext,
  username: string,
  password: string,
): Promise<RegisteredAccount> {
  const captcha = await createCaptcha(request);
  const passport = await requestApiOk<{
    passport: { user: { id: TableIdentity } };
    jwt: { accessToken: string };
  }>(request, 'POST', '/api/home/user/passport/login', {
    data: {
      username,
      password,
      captcha,
    },
  });
  return {
    id: passport.passport.user.id,
    username,
    password,
    accessToken: passport.jwt.accessToken,
  };
}

export async function loginAsAdmin(request: APIRequestContext): Promise<RegisteredAccount> {
  return await loginAsAccount(request, 'admin', '123456');
}

export async function registerAccountUser(
  request: APIRequestContext,
  testInfo: TestInfo,
): Promise<RegisteredAccount> {
  const suffix = `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${crypto.randomUUID()}`;
  const username = `e2e-fixture-admin-rbac-${suffix}`;
  const password = 'rbac-e2e-pass';
  const captcha = await createCaptcha(request);
  const baseURL = testInfo.project.use.baseURL;
  if (!baseURL) throw new Error('account E2E base URL is unavailable');
  const registration = await requestApiOk<{
    passport: { user: { id: TableIdentity } };
    jwt: { accessToken: string };
  }>(request, 'POST', '/api/home/user/passport/register', {
    data: {
      username,
      email: `${username}@example.test`,
      password,
      passwordConfirm: password,
      consumerUrl: new URL('/home/user/activation', baseURL).toString(),
      captcha,
    },
  });
  await requestApiOk<null>(request, 'POST', '/api/home/user/passportTest/activateCurrent', {
    accessToken: registration.jwt.accessToken,
  });
  return {
    id: registration.passport.user.id,
    username,
    password,
    accessToken: registration.jwt.accessToken,
  };
}

export async function removeAccountFixture(
  request: APIRequestContext,
  account: RegisteredAccount,
): Promise<void> {
  await requestApiOk<null>(request, 'DELETE', '/api/home/user/passportTest/removeCurrentFixture', {
    accessToken: account.accessToken,
  });
}

export async function runCleanup(steps: Array<() => Promise<void>>): Promise<void> {
  const errors: unknown[] = [];
  for (const step of steps) {
    try {
      await step();
    } catch (error) {
      errors.push(error);
    }
  }
  if (errors.length) {
    throw new AggregateError(errors, 'One or more E2E fixture cleanup steps failed');
  }
}

async function createCaptcha(request: APIRequestContext): Promise<{ id: string; token: string }> {
  const captcha = await requestApiOk<{ id: string; token: string }>(
    request,
    'POST',
    '/api/captcha/create',
    {
      data: { scene: 'captcha-simple:simple' },
    },
  );
  expect(captcha.id).toEqual(expect.any(String));
  expect(captcha.token).toEqual(expect.any(String));
  return { id: captcha.id, token: captcha.token };
}
