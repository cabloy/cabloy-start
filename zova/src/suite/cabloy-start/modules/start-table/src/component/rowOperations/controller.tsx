import type { HTMLAttributes } from 'vue';
import type { IComponentOptions, ISlot } from 'zova';

import { nextTick, Teleport, useId } from 'vue';
import { VBtnGroup, VMenu } from 'vuetify/components';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-start-button';

export interface ControllerRowOperationsProps {
  compact?: boolean;
  overflow?: boolean;
  class?: unknown;
  slotDefault?: ISlot;
  slotPrimary?: ISlot;
  slotOverflow?: ISlot;
}

@Controller()
export class ControllerRowOperations extends BeanControllerBase {
  static $propsDefault = { compact: false, overflow: false };
  static $componentOptions: IComponentOptions = { inheritAttrs: false };

  private _id: string;
  private _menuHost?: HTMLDivElement;
  private _teleportTarget?: HTMLElement;
  private _teleportTargetOverflow?: HTMLElement;
  private _open = false;
  private _disposed = false;
  private _focusFrame?: number;
  private _cActions: string;
  private _onMenuHostRef: (ref: unknown) => void;
  private _onModelValue: (value: boolean) => void;
  private _onResize: () => void;
  private _onActionClick: (event: MouseEvent) => void;
  private _onDocumentKeydown: (event: KeyboardEvent) => void;

  protected async __init__() {
    this._onMenuHostRef = ref => {
      if (this._disposed) return;
      const element = (ref as HTMLDivElement | null) ?? undefined;
      if (element === this._menuHost) return;
      this._menuHost?.removeEventListener('click', this._onActionClick, true);
      this._menuHost = element;
      // Capture dismisses before descendant handlers without consuming or redispatching their click.
      element?.addEventListener('click', this._onActionClick, true);
    };
    this._onActionClick = event => this._handleActionClick(event);
    this._onDocumentKeydown = event => {
      if (event.key !== 'Escape' || !this._open) return;
      event.stopImmediatePropagation();
      this._setOpen(false);
      this._menuHost?.ownerDocument
        .getElementById(`${this._id}-trigger`)
        ?.focus({ preventScroll: true });
    };
    this._onModelValue = value => this._setOpen(value);
    this._onResize = () => this._setOpen(false);
    this._id = this.$composable(useId);
    const targetId = `${this._id}-teleport`;
    const overflowTargetId = `${this._id}-teleport-overflow`;
    if (process.env.SERVER) {
      const context = this.$ssr.context as typeof this.$ssr.context & {
        teleports?: Record<string, string>;
      };
      // Actions stay inline on the server; client-owned parking targets avoid orphaned SSR IDs.
      context.onRendered(() => {
        if (context.teleports) {
          delete context.teleports[`#${targetId}`];
          delete context.teleports[`#${overflowTargetId}`];
        }
      });
    }
    if (process.env.CLIENT) {
      const createTeleportTarget = (id: string) => {
        const existing = document.getElementById(id);
        if (existing) return existing;
        const target = document.createElement('div');
        target.id = id;
        // Disabled Teleport hydration adopts two anchors from its client-owned target.
        if (this.$ssr.isRuntimeSsrPreHydration) {
          target.append(document.createTextNode(''), document.createTextNode(''));
        }
        document.body.appendChild(target);
        return target;
      };
      this._teleportTarget = createTeleportTarget(targetId);
      this._teleportTargetOverflow = createTeleportTarget(overflowTargetId);
    }
    this._cActions = this.$style({
      padding: '0.5rem',
      minWidth: 'min(160px, calc(100vw - 16px))',
      maxWidth: 'calc(100vw - 16px)',
      maxHeight: 'calc(100vh - 16px)',
      overflowY: 'auto',
      backgroundColor: 'rgb(var(--v-theme-surface))',
      color: 'rgb(var(--v-theme-on-surface))',
      border: '1px solid rgba(var(--v-border-color), var(--v-border-opacity))',
      borderRadius: '4px',
      $nest: {
        '& .v-btn-group': {
          width: '100%',
          minWidth: 'min(160px, calc(100vw - 16px))',
          gap: '4px',
          overflow: 'visible',
        },
        '& .v-btn-group .v-btn': {
          width: '100%',
          minWidth: 0,
          minHeight: '36px',
          flexShrink: 0,
          display: 'grid',
          gridTemplateColumns: '24px minmax(0, 1fr)',
          columnGap: '8px',
          justifyContent: 'flex-start',
          textAlign: 'left',
          paddingInline: '12px',
          border: 0,
          borderRadius: '4px',
        },
        '& .v-btn-group .v-btn__prepend': {
          gridColumn: 1,
          marginInline: 0,
        },
        '& .v-btn-group .v-btn__content': {
          gridColumn: 2,
          justifyContent: 'flex-start',
        },
      },
    });
    this.$watch(
      () => this.$props.compact,
      () => this._setOpen(false),
      { flush: 'sync' },
    );
  }

  protected __dispose__() {
    this._setOpen(false);
    this._menuHost?.removeEventListener('click', this._onActionClick, true);
    this._menuHost = undefined;
    this._disposed = true;
    this._teleportTarget?.remove();
    this._teleportTarget = undefined;
    this._teleportTargetOverflow?.remove();
    this._teleportTargetOverflow = undefined;
  }

  private _setOpen(value: boolean) {
    if (this._disposed) return;
    this._open = value;
    const element = this._menuHost;
    const view = element?.ownerDocument.defaultView;
    view?.removeEventListener('resize', this._onResize);
    if (this._focusFrame !== undefined) {
      view?.cancelAnimationFrame(this._focusFrame);
      this._focusFrame = undefined;
    }
    // VMenu updates v-show on the next render. Hide synchronously so an action can open
    // its own dialog only after the menu has actually disappeared, retaining the action.
    const content = element?.closest<HTMLElement>('.v-overlay__content');
    if (content) {
      content.style.visibility = value ? '' : 'hidden';
      content.inert = !value;
    }
    if (!value || !view) {
      view?.document.removeEventListener('keydown', this._onDocumentKeydown, true);
      return;
    }
    view.addEventListener('resize', this._onResize);
    view.document.addEventListener('keydown', this._onDocumentKeydown, true);
    this._focusOverflowAction(view);
  }

  private _focusOverflowAction(view: Window) {
    const tryFocus = (attempt = 0) => {
      if (this._disposed || !this._open) return;
      const action = this._menuHost?.querySelector<HTMLElement>(
        '.row-actions-overflow-group button:not(:disabled):not([aria-disabled="true"]), .row-actions-overflow-group a[href]:not([aria-disabled="true"]), .row-actions-overflow-group [tabindex="0"]:not([aria-disabled="true"])',
      );
      const content = this._menuHost?.closest<HTMLElement>('.v-overlay__content');
      if (!action || !content || content.inert || action.getClientRects().length === 0) {
        if (attempt < 10) {
          this._focusFrame = view.requestAnimationFrame(() => {
            this._focusFrame = undefined;
            tryFocus(attempt + 1);
          });
        }
        return;
      }
      action.focus({ preventScroll: true });
      if (view.document.activeElement !== action && attempt < 10) {
        this._focusFrame = view.requestAnimationFrame(() => {
          this._focusFrame = undefined;
          tryFocus(attempt + 1);
        });
      }
    };
    tryFocus();
    void nextTick(() => {
      tryFocus();
      view.setTimeout(() => tryFocus(), 0);
      this._focusFrame = view.requestAnimationFrame(() => {
        this._focusFrame = undefined;
        tryFocus();
      });
    });
  }

  private _handleActionClick(event: MouseEvent) {
    if (!this._open || !(event.target instanceof Element)) return;
    const action = event.target.closest('button, a[href], [role="button"]');
    if (
      !action ||
      !this._menuHost?.contains(action) ||
      action.matches(':disabled, [disabled], [aria-disabled="true"]')
    ) {
      return;
    }
    this._setOpen(false);
  }

  protected render() {
    const { compact, overflow } = this.$props;
    const menuEnabled = compact || overflow;
    const menuReady = this._menuHost !== undefined;
    const primarySlot = this.$props.slotPrimary ?? this.$props.slotDefault;
    const label = this.scope.locale.MoreActions();
    const rowActionsLabel = this.scope.locale.RowActions();
    const overflowTarget =
      compact && menuReady
        ? `#${this._id}-overflow-anchor`
        : (this._menuHost ?? this._teleportTargetOverflow ?? `#${this._id}-teleport-overflow`);
    const triggerAttrs: Pick<
      HTMLAttributes,
      'id' | 'title' | 'aria-label' | 'aria-controls' | 'aria-expanded'
    > = {
      'id': `${this._id}-trigger`,
      'title': label,
      'aria-label': label,
      'aria-controls': `${this._id}-menu`,
      'aria-expanded': this._open,
    };
    return (
      <div class="d-inline-flex align-center">
        <Teleport
          to={this._menuHost ?? this._teleportTarget ?? `#${this._id}-teleport`}
          disabled={process.env.SERVER || !compact || !menuReady}
        >
          <div
            id={this._id}
            data-row-actions-content
            class={compact ? [this._cActions, 'elevation-8'] : undefined}
            style={{ display: compact && !menuReady ? 'none' : undefined }}
            role="group"
            aria-label={rowActionsLabel}
          >
            <VBtnGroup
              class={[this.$props.class, 'row-actions-group row-actions-primary-group']}
              variant="text"
              divided={false}
              direction={compact ? 'vertical' : 'horizontal'}
            >
              {primarySlot?.()}
            </VBtnGroup>
            {overflow && (
              <span id={`${this._id}-overflow-anchor`} style={{ display: 'contents' }} />
            )}
          </div>
        </Teleport>
        {overflow && (
          <Teleport to={overflowTarget} disabled={process.env.SERVER || !menuReady}>
            <div
              class={!compact ? this._cActions : undefined}
              style={{ display: !menuReady ? 'none' : undefined }}
              role="group"
              aria-label={rowActionsLabel}
            >
              <VBtnGroup
                class="row-actions-group row-actions-overflow-group"
                variant="text"
                divided={false}
                direction="vertical"
              >
                {this.$props.slotOverflow?.()}
              </VBtnGroup>
            </div>
          </Teleport>
        )}
        <VMenu
          id={`${this._id}-menu-overlay`}
          activatorProps={{ 'aria-controls': `${this._id}-menu`, 'aria-haspopup': undefined }}
          class={overflow && !compact ? 'row-actions-overflow-menu' : undefined}
          disabled={!menuEnabled}
          modelValue={this._open}
          onUpdate:modelValue={this._onModelValue}
          eager
          captureFocus={false}
          openOnClick={false}
          closeOnContentClick={false}
          scrollStrategy="close"
          location="bottom end"
          offset={4}
          transition={false}
          v-slots={{
            activator: ({ props }) =>
              menuEnabled && (
                <ZButton
                  variant="text"
                  icon="::more-horiz"
                  {...props}
                  {...triggerAttrs}
                  onPerform={() => this._setOpen(!this._open)}
                />
              ),
            default: () => <div ref={this._onMenuHostRef} id={`${this._id}-menu`} />,
          }}
        />
      </div>
    );
  }
}
