import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { resolveDevMode } from '../src/lib/bean/cli.bin.dev.ts';
import command from '../src/lib/command/bin.dev.ts';

describe('bin.dev mode', () => {
  it('keeps dev as the default and accepts test explicitly', () => {
    assert.equal(resolveDevMode(undefined), 'dev');
    assert.equal(resolveDevMode('dev'), 'dev');
    assert.equal(resolveDevMode('test'), 'test');
    assert.deepEqual(command.options.mode.choices, ['dev', 'test']);
  });

  it('rejects malformed and production modes before generation', () => {
    for (const value of ['', 'prod', 'unknown', true, ['dev', 'test'], null]) {
      assert.throws(() => resolveDevMode(value), /Invalid --mode: expected dev or test/);
    }
  });
});
