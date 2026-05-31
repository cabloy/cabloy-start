import type { ZovaSys } from 'zova';

import { IFormProvider } from 'zova-module-a-openapi';

export const config = (_sys: ZovaSys) => {
  const formProvider: IFormProvider = {
    behaviors: {
      FormField: 'vuetify-form:formField',
      FormFieldLayout: 'vuetify-form:formFieldLayout',
    },
    components: {
      Input: 'start-input:formFieldInput',
    },
  };
  return {
    formProvider,
  };
};
