// eslint-disable
/** controller: begin */
export * from '../component/formFieldMarkdown/controller.jsx';
export * from '../component/markdownHtml/controller.jsx';

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
import { ControllerFormFieldMarkdown } from '../component/formFieldMarkdown/controller.jsx';
import { ControllerMarkdownHtml } from '../component/markdownHtml/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-markdown.controller.formFieldMarkdown': ControllerFormFieldMarkdown;
'start-markdown.controller.markdownHtml': ControllerMarkdownHtml;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldMarkdown.js';
import { ZFormFieldMarkdown } from './component/formFieldMarkdown.js';
export * from './component/markdownHtml.js';
import { ZMarkdownHtml } from './component/markdownHtml.js';
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
export * from '../component/formFieldMarkdown/render.jsx';
export * from '../component/markdownHtml/render.jsx';

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
import { RenderFormFieldMarkdown } from '../component/formFieldMarkdown/render.jsx';
import { RenderMarkdownHtml } from '../component/markdownHtml/render.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-markdown.render.formFieldMarkdown': RenderFormFieldMarkdown;
'start-markdown.render.markdownHtml': RenderMarkdownHtml;
  }
}
/** render: end */
/** style: begin */
export * from '../component/formFieldMarkdown/style.js';
export * from '../component/markdownHtml/style.js';

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
import { StyleFormFieldMarkdown } from '../component/formFieldMarkdown/style.js';
import { StyleMarkdownHtml } from '../component/markdownHtml/style.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'start-markdown.style.formFieldMarkdown': StyleFormFieldMarkdown;
'start-markdown.style.markdownHtml': StyleMarkdownHtml;
  }
}
/** style: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleStartMarkdown extends BeanScopeBase {}

export interface ScopeModuleStartMarkdown {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'start-markdown': ScopeModuleStartMarkdown;
  }
  
  

  

  
}

/** scope: end */
