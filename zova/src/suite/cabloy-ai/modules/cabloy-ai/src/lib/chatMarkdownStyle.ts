import type { NestedCSSProperties } from 'typestyle/lib/types.js';

export function chatMarkdownStyle(): NestedCSSProperties {
  return {
    color: 'rgb(var(--v-theme-on-surface))',
    lineHeight: 1.65,
    minWidth: 0,
    overflowWrap: 'break-word',
    $nest: {
      '& .markstream-vue.markdown-renderer': {
        minWidth: 0,
        overflowWrap: 'break-word',
        // The scroll panel needs the bubble's actual height, not Markstream's offscreen estimate.
        contentVisibility: 'visible',
      },
      '& .markstream-vue > :first-child, & .markstream-vue > :first-child > :first-child': {
        marginTop: 0,
      },
      '& .markstream-vue > :last-child, & .markstream-vue > :first-child > :last-child': {
        marginBottom: 0,
      },
      '& .heading-node': {
        color: 'rgb(var(--v-theme-on-surface))',
        fontWeight: 700,
        lineHeight: 1.25,
        margin: '1.5rem 0 0.75rem',
      },
      '& .heading-1': {
        fontSize: '1.875rem',
      },
      '& .heading-2': {
        fontSize: '1.5rem',
      },
      '& .heading-3': {
        fontSize: '1.25rem',
      },
      '& .heading-4': {
        fontSize: '1.125rem',
      },
      '& .heading-5, & .heading-6': {
        fontSize: '1rem',
      },
      '& .paragraph-node': {
        margin: '0.75rem 0',
      },
      '& .text-node': {
        overflowWrap: 'break-word',
      },
      '& .list-node': {
        margin: '0.75rem 0',
        paddingInlineStart: '1.5rem',
      },
      '& .list-disc': {
        listStyleType: 'disc',
      },
      '& .list-decimal': {
        listStyleType: 'decimal',
      },
      '& .list-item + .list-item': {
        marginTop: '0.25rem',
      },
      '& .list-item > .list-node': {
        margin: '0.25rem 0',
      },
      '& .checkbox-node': {
        accentColor: 'rgb(var(--v-theme-primary))',
        marginInlineEnd: '0.5rem',
      },
      '& .blockquote, & .blockquote-node': {
        borderInlineStart: '0.25rem solid rgb(var(--v-theme-primary))',
        color: 'color-mix(in srgb, rgb(var(--v-theme-on-surface)) 75%, transparent)',
        margin: '1rem 0',
        paddingInlineStart: '1rem',
      },
      '& .inline-code': {
        background: 'rgb(var(--v-theme-surface-variant))',
        borderRadius: 'var(--v-border-radius-root)',
        color: 'rgb(var(--v-theme-on-surface))',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '0.875em',
        overflowWrap: 'break-word',
        padding: '0.125rem 0.25rem',
      },
      '& .code-block-container': {
        background: 'rgb(var(--v-theme-surface-variant))',
        border: '1px solid rgba(var(--v-border-color), var(--v-border-opacity))',
        borderRadius: 'var(--v-border-radius-root)',
        margin: '1rem 0',
        maxWidth: '100%',
        overflowX: 'auto',
      },
      '& .code-pre-fallback': {
        background: 'rgb(var(--v-theme-surface-variant))',
        border: '1px solid rgba(var(--v-border-color), var(--v-border-opacity))',
        borderRadius: 'var(--v-border-radius-root)',
        lineHeight: 1.5,
        margin: '1rem 0',
        maxWidth: '100%',
        overflowX: 'auto',
        padding: '1rem',
      },
      '& .code-pre-fallback code': {
        background: 'transparent',
        display: 'block',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '0.875rem',
        padding: 0,
        whiteSpace: 'pre',
      },
      '& .link-node': {
        color: 'rgb(var(--v-theme-primary))',
        overflowWrap: 'anywhere',
        textDecoration: 'underline',
        textUnderlineOffset: '0.125rem',
      },
      '& .image-node-container': {
        margin: '1rem 0',
        maxWidth: '100%',
      },
      '& .image-node__img': {
        borderRadius: 'var(--v-border-radius-root)',
        display: 'block',
        height: 'auto',
        maxWidth: '100%',
      },
      '& .markstream-vue .hr-node, & .markstream-vue hr': {
        background: 'transparent',
        border: 0,
        borderTop: '1px solid rgba(var(--v-border-color), var(--v-border-opacity))',
        color: 'transparent',
        height: 0,
        margin: '1.5rem 0',
      },
      '& .table-node-wrapper': {
        'maxWidth': '100%',
        'margin': '1rem 0',
        'overflowX': 'auto',
        '-webkit-overflow-scrolling': 'touch',
      },
      '& .markstream-vue .table-node': {
        background: 'rgb(var(--v-theme-surface))',
        border: '1px solid rgba(var(--v-border-color), var(--v-border-opacity))',
        borderCollapse: 'separate',
        borderRadius: 'var(--v-border-radius-root)',
        borderSpacing: 0,
        boxShadow: 'none',
        color: 'rgb(var(--v-theme-on-surface))',
        overflow: 'hidden',
        tableLayout: 'auto',
        width: 'max-content',
        minWidth: '100%',
      },
      '& .markstream-vue .table-node th, & .markstream-vue .table-node td': {
        borderBottom: '1px solid rgba(var(--v-border-color), var(--v-border-opacity))',
        borderRight: '1px solid rgba(var(--v-border-color), var(--v-border-opacity))',
        minWidth: '8rem',
        overflowWrap: 'break-word',
        padding: '0.5rem 0.75rem',
        textAlign: 'start',
        verticalAlign: 'top',
        whiteSpace: 'normal',
        wordBreak: 'normal',
      },
      '& .markstream-vue .table-node th:last-child, & .markstream-vue .table-node td:last-child': {
        borderRight: 0,
      },
      '& .markstream-vue .table-node tbody tr:last-child td': {
        borderBottom: 0,
      },
      '& .markstream-vue .table-node thead th': {
        background:
          'color-mix(in srgb, rgb(var(--v-theme-on-surface)) 12%, rgb(var(--v-theme-surface)))',
        borderBottom: '2px solid rgba(var(--v-border-color), var(--v-border-opacity))',
        color: 'rgb(var(--v-theme-on-surface))',
        fontWeight: 600,
      },
      '& .markstream-vue .table-node tbody tr': {
        background: 'rgb(var(--v-theme-surface))',
        transition: 'background-color 120ms ease',
      },
      '& .markstream-vue .table-node tbody tr:nth-child(even)': {
        background:
          'color-mix(in srgb, rgb(var(--v-theme-on-surface)) 4%, rgb(var(--v-theme-surface)))',
      },
      '& .markstream-vue .table-node tbody tr:hover': {
        background:
          'color-mix(in srgb, rgb(var(--v-theme-on-surface)) 8%, rgb(var(--v-theme-surface)))',
      },
    },
  };
}
