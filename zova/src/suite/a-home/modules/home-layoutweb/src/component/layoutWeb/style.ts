import { BeanStyleBase } from 'zova';
import { Style } from 'zova-module-a-bean';

@Style()
export class StyleLayoutWeb extends BeanStyleBase {
  cHeader: string;

  protected async __init__() {
    this.cHeader = this.$style({
      $nest: {
        '& .v-toolbar__content': { overflow: 'visible' },
        '& .v-toolbar-title': { minWidth: 0, flexShrink: 1 },
        '& .header-navigation': { minWidth: 0, flex: '1 1 0' },
        '& .header-navigation .v-tabs': { minWidth: 0, maxWidth: '100%' },
        '& .header-actions': { position: 'relative', flexShrink: 0 },
        '& .header-actions-more': { display: 'none' },
        '& .header-actions-panel': { display: 'flex', alignItems: 'center' },
        '& .header-action-label': { display: 'none' },
        '& .header-account-name': {
          display: 'block',
          width: '8rem',
          height: '1.5rem',
          lineHeight: '1.5rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textTransform: 'none',
          textAlign: 'start',
        },
        '@media (width < 1024px)': {
          $nest: {
            '& .header-actions-more': { display: 'inline-grid' },
            '& .header-actions-panel': {
              display: 'none',
              position: 'absolute',
              top: '100%',
              right: 0,
              zIndex: 10,
              width: '16rem',
              maxWidth: 'calc(100vw - 1rem)',
              maxHeight: 'calc(100dvh - 5rem)',
              overflowY: 'auto',
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: 'rgb(var(--v-theme-surface))',
              color: 'rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))',
              boxShadow: '0 4px 12px rgba(0, 0, 0, .2)',
              flexDirection: 'column',
              alignItems: 'stretch',
            },
            '& .header-actions-panel.is-open': { display: 'flex' },
            '& .header-action': {
              width: '100%',
              minHeight: '40px',
              borderRadius: '4px',
              justifyContent: 'start',
              paddingInline: '16px',
            },
            '& .header-action > .v-btn__content': {
              width: '100%',
              justifyContent: 'start',
              gap: '16px',
            },
            '& .header-action-label': { display: 'inline' },
            '& .header-account-name': { width: 'auto', minWidth: 0, flex: '1 1 0' },
            '& .header-account > .v-btn__prepend': {
              flex: '0 0 24px',
              marginInline: '0 16px',
            },
            '& .header-account > .v-btn__content': { minWidth: 0, flex: '1 1 0' },
          },
        },
      },
    });
  }
}
