import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const E2E_ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const E2E_PORT = 7103;
export const E2E_LOCAL_BASE_URL = `http://127.0.0.1:${E2E_PORT}`;

const E2E_CONFIG_DIR = resolve(E2E_ROOT_DIR, 'e2e', 'config');
const E2E_SPECS_DIR = resolve(E2E_ROOT_DIR, 'e2e', 'specs');

const e2eSuites = {
  start: {
    externalBaseUrlEnv: 'START_E2E_BASE_URL',
    configFile: resolve(E2E_CONFIG_DIR, 'playwright.start.config.ts'),
    testDir: resolve(E2E_SPECS_DIR, 'cabloy-start'),
    readinessPath: '/',
  },
} as const;

export type E2eSuiteName = keyof typeof e2eSuites;

export function getE2eSuite(name: string | undefined) {
  if (name && name in e2eSuites) {
    return e2eSuites[name as E2eSuiteName];
  }
  throw new Error(`Expected an E2E suite: ${Object.keys(e2eSuites).join(', ')}.`);
}
