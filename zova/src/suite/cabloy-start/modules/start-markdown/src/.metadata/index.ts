// eslint-disable
/** controller: begin */
export * from '../component/formFieldMarkdown/controller.tsx';
export * from '../component/markdownHtml/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-markdown' {

        export interface ControllerFormFieldMarkdown {
          /** @internal */
          get scope(): ScopeModuleStartMarkdown;
        }

        export interface ControllerMarkdownHtml {
          /** @internal */
          get scope(): ScopeModuleStartMarkdown;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerFormFieldMarkdown } from '../component/formFieldMarkdown/controller.tsx';
import type { ControllerMarkdownHtml } from '../component/markdownHtml/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-markdown.controller.formFieldMarkdown': ControllerFormFieldMarkdown;
'start-markdown.controller.markdownHtml': ControllerMarkdownHtml;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldMarkdown.ts';
import { ZFormFieldMarkdown } from './component/formFieldMarkdown.ts';
export * from './component/markdownHtml.ts';
import { ZMarkdownHtml } from './component/markdownHtml.ts';
export const components = {
  'formFieldMarkdown': ZFormFieldMarkdown,
'markdownHtml': ZMarkdownHtml,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'start-markdown:formFieldMarkdown': ControllerFormFieldMarkdown;
'start-markdown:markdownHtml': ControllerMarkdownHtml;
}
export interface IZovaComponentRecord {
  'start-markdown:formFieldMarkdown': typeof ZFormFieldMarkdown;
'start-markdown:markdownHtml': typeof ZMarkdownHtml;
}
}
/** components: end */
/** render: begin */
export * from '../component/formFieldMarkdown/render.tsx';
export * from '../component/markdownHtml/render.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-markdown' {

        export interface RenderFormFieldMarkdown {
          /** @internal */
          get scope(): ScopeModuleStartMarkdown;
        }

        export interface RenderMarkdownHtml {
          /** @internal */
          get scope(): ScopeModuleStartMarkdown;
        }
}
/** render: end */
/** render: begin */
import type { RenderFormFieldMarkdown } from '../component/formFieldMarkdown/render.tsx';
import type { RenderMarkdownHtml } from '../component/markdownHtml/render.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-markdown.render.formFieldMarkdown': RenderFormFieldMarkdown;
'start-markdown.render.markdownHtml': RenderMarkdownHtml;
  }
}
/** render: end */
/** style: begin */
export * from '../component/formFieldMarkdown/style.ts';
export * from '../component/markdownHtml/style.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-start-markdown' {

        export interface StyleFormFieldMarkdown {
          /** @internal */
          get scope(): ScopeModuleStartMarkdown;
        }

        export interface StyleMarkdownHtml {
          /** @internal */
          get scope(): ScopeModuleStartMarkdown;
        }
}
/** style: end */
/** style: begin */
import type { StyleFormFieldMarkdown } from '../component/formFieldMarkdown/style.ts';
import type { StyleMarkdownHtml } from '../component/markdownHtml/style.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-markdown.style.formFieldMarkdown': StyleFormFieldMarkdown;
'start-markdown.style.markdownHtml': StyleMarkdownHtml;
  }
}
/** style: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartMarkdown extends BeanScopeBase {}

export interface ScopeModuleStartMarkdown {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-markdown': ScopeModuleStartMarkdown;
  }



  export interface IBeanScopeLocale {
    'start-markdown': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `start-markdown::${K}` {
  return `start-markdown::${key}`;
}
/** scope: end */
