import type { VNodeChild } from 'vue';
import type {
  TypeComponentBoundaryRenderMode,
  TypeComponentBoundaryRetry,
  ZovaContext,
} from 'zova';

import { VAlert, VBtn, VProgressCircular } from 'vuetify/components';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function renderLoading(
  _ctx: ZovaContext,
  renderMode: TypeComponentBoundaryRenderMode,
): VNodeChild {
  if (renderMode === 'inline') {
    return (
      <span class="d-inline-flex align-center pa-1" role="status">
        <VProgressCircular color="primary" indeterminate size="1em" width="2" />
      </span>
    );
  }
  return (
    <div class="d-flex justify-center pa-4" role="status">
      <VProgressCircular color="primary" indeterminate />
    </div>
  );
}

export function renderError(
  ctx: ZovaContext,
  error: unknown,
  renderMode: TypeComponentBoundaryRenderMode,
  retry?: TypeComponentBoundaryRetry,
): VNodeChild {
  const message = getErrorMessage(error);
  const retryLabel = ctx.app.meta.locale.getText(false, 'home-base', undefined, 'Retry');
  const retryButton = retry && (
    <VBtn
      nativeOnClick={() => {
        void retry();
      }}
    >
      {retryLabel}
    </VBtn>
  );
  if (renderMode === 'inline') {
    return (
      <span class="text-error d-inline-block" role="alert">
        {message}
        {retryButton}
      </span>
    );
  }
  return (
    <VAlert type="error" variant="tonal">
      {message}
      {retryButton}
    </VAlert>
  );
}
