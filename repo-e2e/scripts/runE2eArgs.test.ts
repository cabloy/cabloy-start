import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';

import { combineGreps, parseE2eArgs } from './runE2eArgs.ts';

const specsDir = resolve(import.meta.dirname, '../specs');

describe('runE2eArgs', () => {
  it('runs all specs by default without a mode flag', () => {
    assert.deepEqual(parseE2eArgs([], specsDir), {
      specNames: [],
      playwrightArgs: [],
      tags: [],
    });
  });

  it('keeps spec, tag and Playwright filters', () => {
    const parsed = parseE2eArgs(['cabloy-spec', '--grep', 'ATP-SPEC', '--tag', '@web'], specsDir);
    assert.deepEqual(parsed.specNames, ['cabloy-spec']);
    assert.deepEqual(parsed.tags, ['@web']);
    assert.deepEqual(combineGreps(parsed.playwrightArgs, parsed.tags), [
      '--grep',
      '(?=.*(?:ATP-SPEC))(?=.*@web)',
    ]);
  });

  it('rejects removed mode flags instead of forwarding them to Playwright', () => {
    for (const flag of ['--clean', '--fast', '--clean=true', '--fast=false']) {
      assert.throws(() => parseE2eArgs([flag], specsDir), /modes have been removed/);
    }
  });
});
