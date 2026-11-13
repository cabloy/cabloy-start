import { BeanStyleBase } from 'zova';
import { Style } from 'zova-module-a-bean';

@Style()
export class StyleLayoutMine extends BeanStyleBase {
  cLayout: string;
  cHeader: string;

  protected async __init__() {
    this.cLayout = this.$style({
      $nest: {
        '& .mine-body': {
          display: 'grid',
          gridTemplateColumns: '16rem minmax(0, 1fr)',
          minHeight: 'calc(100dvh - 64px)',
        },
        '& .mine-sidebar': {
          minWidth: 0,
          backgroundColor: 'rgb(var(--v-theme-surface))',
          borderRight: '1px solid rgba(var(--v-border-color), var(--v-border-opacity))',
        },
        '& .mine-sidebar nav': {
          position: 'sticky',
          top: '64px',
          maxHeight: 'calc(100dvh - 64px)',
          overflowY: 'auto',
        },
        '& .mine-content': { minWidth: 0 },
        '& .mine-menu': { listStyle: 'none', padding: '0 8px 8px', margin: 0 },
        '& .mine-menu-link': {
          display: 'block',
          padding: '12px 16px',
          borderRadius: '4px',
          color: 'inherit',
          textDecoration: 'none',
          overflowWrap: 'anywhere',
        },
        '& .mine-menu-link:hover': {
          backgroundColor: 'rgba(var(--v-theme-on-surface), .04)',
        },
        '& .mine-menu-link.is-active': {
          color: 'rgb(var(--v-theme-primary))',
          backgroundColor: 'rgba(var(--v-theme-primary), .12)',
        },
        '@media (width < 1024px)': {
          $nest: {
            '& .mine-body': { gridTemplateColumns: 'minmax(0, 1fr)' },
            '& .mine-sidebar': { display: 'none', borderRight: 'none' },
            '& .mine-sidebar.is-open': { display: 'block' },
            '& .mine-sidebar nav': { position: 'static' },
          },
        },
      },
    });
    this.cHeader = this.$style({
      $nest: {
        '& .v-toolbar__content': { overflow: 'visible', paddingInline: '8px' },
        '& .v-toolbar-title': { minWidth: 0, marginInlineStart: '8px' },
        '& .mine-menu-toggle': { display: 'none' },
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
            '& .mine-menu-toggle': { display: 'inline-grid' },
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
