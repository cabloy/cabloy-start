import { BeanStyleBase } from 'zova';
import { Style } from 'zova-module-a-bean';

@Style()
export class StyleLayoutAdmin extends BeanStyleBase {
  cTab: string;
  cHeader: string;
  cTabItemsMenu: string;

  protected async __init__() {
    this.cHeader = this.$style({
      $nest: {
        '& .v-toolbar__content': { overflow: 'visible' },
        '& .v-toolbar-title': { minWidth: 0, flexShrink: 1 },
        '& .header-navigation': { minWidth: 0, flex: '1 1 0' },
        '& .header-navigation .v-tabs': { minWidth: 0, maxWidth: '100%' },
        '&:has(.tab-items) .v-toolbar-title': { flex: '0 1 auto', maxWidth: '10rem' },
        '&:has(.tab-items) .v-toolbar__content > .v-spacer': { flexGrow: 0 },
        '@media (width < 600px)': {
          $nest: {
            '&:has(.tab-items) .v-toolbar-title': { display: 'none' },
          },
        },
        '& .tab-items': { display: 'flex', alignItems: 'center', minWidth: 0, height: '48px' },
        '& .tab-items-scroll': { position: 'relative', minWidth: 0, flex: '1 1 0' },
        '& .tab-items-scroll::before, & .tab-items-scroll::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '16px',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0,
        },
        '& .tab-items-scroll::before': {
          left: 0,
          background: 'linear-gradient(to right, rgb(var(--v-theme-surface)), transparent)',
        },
        '& .tab-items-scroll::after': {
          right: 0,
          background: 'linear-gradient(to left, rgb(var(--v-theme-surface)), transparent)',
        },
        '& .tab-items-scroll.has-start::before, & .tab-items-scroll.has-end::after': { opacity: 1 },
        '& .tab-items-more': { flex: '0 0 40px', width: '40px', height: '40px' },
        '& .tab-items-more .v-btn__content': { fontSize: '20px' },
        '& .tab-items.is-compact .v-tab': { minWidth: 0, maxWidth: '100%', paddingInline: '12px' },
        '& .tab-items.is-compact .v-btn__content': { minWidth: 0, overflow: 'hidden' },
        '& .tab-items.is-compact .v-slide-group__content': { maxWidth: '100%' },
        '& .tab-items.is-compact .close': { display: 'none' },
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
              flex: '0 0 18px',
              marginInline: '0 16px',
            },
            '& .header-account > .v-btn__content': { minWidth: 0, flex: '1 1 0' },
          },
        },
      },
    });
    this.cTabItemsMenu = this.$style({
      width: '22rem',
      maxWidth: 'calc(100vw - 1rem)',
      $nest: {
        '& .tab-items-select': { minWidth: 0, flex: '1 1 0', height: 'auto', minHeight: '40px' },
        '& .tab-items-select .v-btn__content': { minWidth: 0, flex: '1 1 0' },
        '& .tab-items-label': {
          minWidth: 0,
          flex: '1 1 0',
          whiteSpace: 'normal',
          overflowWrap: 'anywhere',
          textAlign: 'start',
          paddingBlock: '8px',
        },
      },
    });
    this.cTab = this.$style({
      $nest: {
        '.close': {
          display: 'none',
          position: 'absolute',
          top: '2px',
          right: '4px',
        },
        '&:hover .close': {
          display: 'block',
        },
      },
    });
  }
}
