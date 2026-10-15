import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

import { dateFormatUtil } from '../../src/lib/utils.js';

const source = readFileSync(
  new URL('../../src/component/formFieldDate/controller.tsx', import.meta.url),
  'utf8',
)
  .replace(/^import[\s\S]*?;\n/gm, '')
  .replace(/^\s*@Controller\([^\n]*\)\s*\n/gm, '');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.React,
    jsxFactory: 'createElement',
  },
});
const ZFormField = {};
const ControllerFormFieldDate = new Function(
  'BeanControllerBase',
  'ZFormField',
  'VTextField',
  'dateFormatUtil',
  'createElement',
  `${outputText.replace('export class ControllerFormFieldDate', 'class ControllerFormFieldDate')}\nreturn ControllerFormFieldDate;`,
)(class {}, ZFormField, 'VTextField', dateFormatUtil, (type: unknown, props: any) => ({
  type,
  props,
}));

test('date presentation reads live field values without putting changing values in refresh options', () => {
  const controller = new ControllerFormFieldDate();
  const options = { preset: 'DATE_FULL' as const };
  controller.$props = { name: 'trainingTime', options };
  const rendered = controller.render();
  assert.equal(rendered.type, ZFormField);
  assert.equal(rendered.props.options, options);
  assert.equal(Object.hasOwn(rendered.props.options, 'modelValue'), false);

  let value: unknown = new Date('2026-03-10T00:00:00.000Z');
  let blurs = 0;
  const field = {
    field: { state: { meta: { isValid: true, errors: [] } } },
    setValue(next: unknown, disableNotifyChanged: boolean) {
      assert.equal(disableNotifyChanged, false);
      value = next;
    },
    handleBlur() {
      ++blurs;
    },
  };
  const renderInput = () =>
    rendered.props.slotDefault(
      {
        propsBucket: {
          value,
          options,
          layout: { label: 'Training Time' },
          disableNotifyChanged: false,
        },
        props: {},
      },
      field,
    ).props;
  assert.equal(renderInput().modelValue, dateFormatUtil(value, options));
  renderInput()['onUpdate:modelValue']('2026-04-18T00:00:00.000Z');
  assert.equal(value, '2026-04-18T00:00:00.000Z');
  assert.equal(renderInput().modelValue, dateFormatUtil(value, options));
  assert.equal(rendered.props.options, options);
  assert.equal(Object.hasOwn(rendered.props.options, 'modelValue'), false);
  renderInput()['onUpdate:focused'](true);
  assert.equal(blurs, 0);
  renderInput()['onUpdate:focused'](false);
  assert.equal(blurs, 1);
  renderInput()['onUpdate:modelValue']('');
  assert.equal(value, undefined);
  assert.equal(renderInput().modelValue, undefined);
});
