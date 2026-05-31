import type { ZovaSys } from 'zova';

import { IFormProvider } from 'zova-module-a-openapi';

export const config = (_sys: ZovaSys) => {
  const formProvider: IFormProvider = {
    behaviors: {
      FormField: 'start-form:formField',
      FormFieldLayout: 'start-form:formFieldLayout',
    },
    components: {
      Input: 'start-input:formFieldInput',
    },
  };
  return {
    formProvider,
  };
};
