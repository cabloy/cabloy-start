import type { HTMLAttributes } from 'vue';
import type { IComponentOptions, ISlot } from 'zova';

import { nextTick, Teleport, useId } from 'vue';
import { VBtnGroup, VMenu } from 'vuetify/components';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-start-button';

export interface ControllerRowOperationsProps {
  compact?: boolean;
  class?: unknown;
  slotDefault?: ISlot;
}

@Controller()
export class ControllerRowOperations extends BeanControllerBase {
  static $propsDefault = { compact: false };
  static $componentOptions: IComponentOptions = { inheritAttrs: false };

  private _id: string;
  private _actionsRef?: HTMLDivElement;
  private _menuHost?: HTMLDivElement;
  private _teleportTarget?: HTMLElement;
  private _open = false;
  private _disposed = false;
  private _focusFrame?: number;
  private _cActions: string;
  private _onActionsRef: (ref: unknown) => void;
  private _onMenuHostRef: (ref: unknown) => void;
  private _onModelValue: (value: boolean) => void;
  private _onResize: () => void;
  private _onActionClick: (event: MouseEvent) => void;

  protected async __init__() {
    this._onActionsRef = ref => {
      if (this._disposed) return;
      this._setActionsRef((ref as HTMLDivElement | null) ?? undefined);
    };
    this._onMenuHostRef = ref => {
      if (this._disposed) return;
      this._menuHost = (ref as HTMLDivElement | null) ?? undefined;
    };
    this._onActionClick = event => this._handleActionClick(event);
    this._onModelValue = value => this._setOpen(value);
    this._onResize = () => this._setOpen(false);
    this._id = this.$composable(useId);
    const targetId = `${this._id}-teleport`;
    if (process.env.SERVER) {
      const context = this.$ssr.context as typeof this.$ssr.context & {
        teleports?: Record<string, string>;
      };
      // Actions stay inline on the server; client-owned parking targets avoid orphaned SSR IDs.
      context.onRendered(() => {
        if (context.teleports) delete context.teleports[`#${targetId}`];
      });
    }
    if (process.env.CLIENT) {
      this._teleportTarget = document.getElementById(targetId) ?? undefined;
      if (!this._teleportTarget) {
        const target = document.createElement('div');
        target.id = targetId;
        // Disabled Teleport hydration adopts two anchors; this parking target is client-owned.
        if (this.$ssr.isRuntimeSsrPreHydration) {
          target.append(document.createTextNode(''), document.createTextNode(''));
        }
        document.body.appendChild(target);
        this._teleportTarget = target;
      }
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
        '& > .v-btn-group': {
          width: '100%',
          gap: '4px',
          overflow: 'visible',
        },
        '& > .v-btn-group .v-btn': {
          width: '100%',
          minWidth: 0,
          minHeight: '36px',
          flexShrink: 0,
          justifyContent: 'flex-start',
          textAlign: 'left',
          paddingInline: '12px',
          border: 0,
          borderRadius: '4px',
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
    this._setActionsRef(undefined);
    this._disposed = true;
    this._menuHost = undefined;
    this._teleportTarget?.remove();
    this._teleportTarget = undefined;
  }

  private _setActionsRef(element?: HTMLDivElement) {
    if (element === this._actionsRef) return;
    this._actionsRef?.removeEventListener('click', this._onActionClick, true);
    this._actionsRef = element;
    // Capture dismisses before descendant handlers without consuming or redispatching their click.
    element?.addEventListener('click', this._onActionClick, true);
  }

  private _setOpen(value: boolean) {
    if (this._disposed) return;
    this._open = value;
    const element = this._actionsRef;
    const view = element?.ownerDocument.defaultView;
    view?.removeEventListener('resize', this._onResize);
    if (this._focusFrame !== undefined) {
      view?.cancelAnimationFrame(this._focusFrame);
      this._focusFrame = undefined;
    }
    // VMenu updates v-show on the next render. Hide synchronously so an action can open
    // its own dialog only after the menu has actually disappeared, retaining the action.
    const content = this._menuHost?.closest<HTMLElement>('.v-overlay__content');
    if (content) content.style.visibility = value ? '' : 'hidden';
    if (!value || !view) return;
    view.addEventListener('resize', this._onResize);
    void nextTick(() => {
      if (this._disposed || !this._open) return;
      this._focusFrame = view.requestAnimationFrame(() => {
        this._focusFrame = undefined;
        if (this._disposed || !this._open) return;
        const document = element!.ownerDocument;
        if (
          document.activeElement?.id === `${this._id}-trigger` ||
          document.activeElement === document.body
        ) {
          element!
            .querySelector<HTMLElement>(
              'button:not(:disabled):not([aria-disabled="true"]), a[href]:not([aria-disabled="true"]), [tabindex="0"]:not([aria-disabled="true"])',
            )
            ?.focus({ preventScroll: true });
        }
      });
    });
  }

  private _handleActionClick(event: MouseEvent) {
    if (!this.$props.compact || !this._open || !(event.target instanceof Element)) return;
    const action = event.target.closest('button, a[href], [role="button"]');
    if (
      !action ||
      !this._actionsRef?.contains(action) ||
      action.matches(':disabled, [disabled], [aria-disabled="true"]')
    ) {
      return;
    }
    this._setOpen(false);
  }

  protected render() {
    const { compact } = this.$props;
    const triggerAttrs: Pick<
      HTMLAttributes,
      'id' | 'aria-label' | 'aria-controls' | 'aria-expanded'
    > = {
      'id': `${this._id}-trigger`,
      'aria-label': this.scope.locale.MoreActions(),
      'aria-controls': this._id,
      'aria-expanded': this._open,
    };
    return (
      <div class="d-inline-flex align-center">
        <VMenu
          id={`${this._id}-menu`}
          activatorProps={{ 'aria-controls': this._id, 'aria-haspopup': undefined }}
          disabled={!compact}
          modelValue={this._open}
          onUpdate:modelValue={this._onModelValue}
          eager
          openOnClick={false}
          closeOnContentClick={false}
          scrollStrategy="close"
          location="bottom end"
          offset={4}
          transition={false}
          v-slots={{
            activator: ({ props }) =>
              compact && (
                <ZButton
                  variant="text"
                  icon="::more-horiz"
                  {...props}
                  {...triggerAttrs}
                  onPerform={() => this._setOpen(!this._open)}
                />
              ),
            default: () => <div ref={this._onMenuHostRef} />,
          }}
        />
        {/* SSR and hydration retain actions inline, hidden while compact has no menu host.
            Teleport moves, rather than remounts, the same subtree when the host is ready. */}
        <Teleport
          to={this._menuHost ?? `#${this._id}-teleport`}
          disabled={!compact || !this._menuHost}
        >
          <div
            ref={this._onActionsRef}
            id={this._id}
            data-row-actions-content
            class={compact ? [this._cActions, 'elevation-8'] : undefined}
            style={{ display: compact && !this._menuHost ? 'none' : undefined }}
          >
            <VBtnGroup
              class={this.$props.class}
              variant={compact ? 'text' : 'outlined'}
              divided={!compact}
              direction={compact ? 'vertical' : 'horizontal'}
              role="group"
              aria-label={this.scope.locale.RowActions()}
            >
              {this.$slotDefault?.()}
            </VBtnGroup>
          </div>
        </Teleport>
      </div>
    );
  }
}
