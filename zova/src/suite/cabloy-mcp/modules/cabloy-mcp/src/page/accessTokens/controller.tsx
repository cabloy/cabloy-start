import type { TableIdentity } from 'table-identity';
import type { TypeFormOnSubmitData } from 'zova-module-a-form';

import {
  VAlert,
  VCard,
  VCardText,
  VCardTitle,
  VChip,
  VCol,
  VContainer,
  VRow,
  VSelect,
  VTextarea,
  VTextField,
} from 'vuetify/components';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZForm, ZFormField } from 'zova-module-a-form';
import { $QueriesEnsureLoaded, $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';
import { ZButton } from 'zova-module-start-button';

import type { AccessTokenDraft, AccessTokenItem } from '../../model/accessTokens.ts';

import { ModelAccessTokens } from '../../model/accessTokens.ts';
import { ModelPersonalScopes } from '../../model/personalScopes.ts';

const secondsPerDay = 24 * 60 * 60;

type DialogHandle = { close: () => void };
type RevealedToken = Pick<
  Awaited<ReturnType<ModelAccessTokens['createMine']>>,
  'accessToken' | 'resource'
>;

@Controller()
export class ControllerPageAccessTokens extends BeanControllerPageBase {
  @Use()
  $$modelAccessTokens: ModelAccessTokens;

  @Use()
  $$modelPersonalScopes: ModelPersonalScopes;

  pageNo = 1;
  readonly pageSize = 20;
  listRefreshFailed = false;

  private _editor?: DialogHandle;
  private _reveal?: DialogHandle;
  private _revealedToken?: RevealedToken;
  private _generation = 0;
  private _disposed = false;

  protected async __init__() {
    this.$watch(
      [() => this.$passport.user?.id, () => this.$passport.isAuthenticated],
      () => {
        this._clearDialogs();
        this.pageNo = 1;
      },
      { flush: 'sync' },
    );
    this.$watch(
      () => this.$currentRoute?.fullPath,
      () => this._clearDialogs(),
      { flush: 'sync' },
    );
    this.$watch(
      () => this.$pageHost?.active,
      active => {
        if (active === false) this._clearDialogs();
      },
      { flush: 'sync' },
    );
    await $QueryEnsureLoaded(() => this.queryTokens);
  }

  protected __dispose__() {
    this._disposed = true;
    this._clearDialogs();
  }

  get queryTokens() {
    return this.$$modelAccessTokens.mine({ pageNo: this.pageNo, pageSize: this.pageSize });
  }

  get queryScopes() {
    return this.$$modelPersonalScopes.mine();
  }

  get apiSchemasCreate() {
    return this.scope.apiSchema.mcpAuthAccessToken.createMine();
  }

  private _clearDialogs() {
    this._generation += 1;
    this._revealedToken = undefined;
    const editor = this._editor;
    const reveal = this._reveal;
    this._editor = undefined;
    this._reveal = undefined;
    editor?.close();
    reveal?.close();
  }

  private _isCurrent(generation: number, userId: TableIdentity | undefined) {
    return (
      !this._disposed &&
      this.$pageHost?.active !== false &&
      this.$passport.isAuthenticated &&
      this.$passport.user?.id === userId &&
      this._generation === generation
    );
  }

  async openCreate() {
    if (!process.env.CLIENT || this._editor || this._reveal) return;
    const generation = ++this._generation;
    const userId = this.$passport.user?.id;
    await $QueriesEnsureLoaded(
      () => this.apiSchemasCreate.sdk,
      () => this.queryScopes,
    );
    if (!this._isCurrent(generation, userId)) return;
    const draft: AccessTokenDraft = { name: '', scope: 'mcp:read', expiresIn: 7 * secondsPerDay };
    this._editor = this.$appModal.dialog(
      {
        title: this.scope.locale.McpAccessTokenCreate(),
        onClose: () => {
          this._editor = undefined;
          this._generation += 1;
        },
        slotDefault: dialog => (
          <ZForm
            slotWrapper={children => (
              <div data-testid="mcp-access-token-create-form">{children}</div>
            )}
            data={draft}
            schema={this.apiSchemasCreate.requestBody}
            localePresentationRefresh={{ identity: 'mcp-access-token:create' }}
            onSubmitData={data => this._create(data, generation, userId, dialog.close)}
            onShowError={async () => {
              await this.$performCommand('start-commands:alert', {
                type: 'error',
                text: this.scope.locale.McpAccessTokenCreateFailed(),
              });
            }}
            slotFooter={form => (
              <div class="d-flex justify-end ga-2">
                <ZButton
                  data-testid="mcp-access-token-create-cancel"
                  variant="text"
                  onPerform={() => dialog.close()}
                >
                  {this.scope.locale.Cancel()}
                </ZButton>
                <ZButton
                  data-testid="mcp-access-token-create-submit"
                  color="primary"
                  disabled={form.formState.isSubmitting}
                  onPerform={async () => {
                    await form.submit();
                  }}
                >
                  {this.scope.locale.McpAccessTokenCreate()}
                </ZButton>
              </div>
            )}
          >
            <ZFormField
              name="name"
              slotDefault={({ propsBucket }, field) => (
                <VTextField
                  data-testid="mcp-access-token-name"
                  label="Name"
                  variant="outlined"
                  modelValue={propsBucket.value}
                  autocomplete="off"
                  onUpdate:modelValue={value =>
                    field.setValue(value, propsBucket.disableNotifyChanged)
                  }
                />
              )}
            />
            <ZFormField
              name="scope"
              slotDefault={({ propsBucket }, field) => (
                <div>
                  <VSelect
                    data-testid="mcp-access-token-scope"
                    label={this.scope.locale.McpGrantedScope()}
                    variant="outlined"
                    modelValue={propsBucket.value}
                    items={[
                      { title: 'mcp:read', value: 'mcp:read' },
                      { title: 'mcp:all', value: 'mcp:all' },
                      ...(this.queryScopes?.data?.list.map(scope => ({
                        title: `${scope.name} (${scope.scope})`,
                        value: scope.scope,
                      })) ?? []),
                    ]}
                    onUpdate:modelValue={value => {
                      field.setValue(value, propsBucket.disableNotifyChanged);
                      field.handleBlur();
                    }}
                  />
                  <p
                    class={
                      propsBucket.value === 'mcp:all' ? 'text-warning' : 'text-medium-emphasis'
                    }
                  >
                    {propsBucket.value === 'mcp:all'
                      ? this.scope.locale.AuthorizationAllScopeHelp()
                      : this.scope.locale.McpAccessTokenScopeHelp()}
                  </p>
                  <a
                    class="text-primary text-body-2"
                    href={this.$router.getPagePath('/cabloy/mcp/scopes')}
                  >
                    {this.scope.locale.McpManageScopes()}
                  </a>
                </div>
              )}
            />
            <ZFormField
              name="expiresIn"
              layout={{ label: this.scope.locale.McpAccessTokenLifetimeDays() }}
              slotDefault={({ propsBucket }, field) => (
                <div>
                  <VTextField
                    data-testid="mcp-access-token-expires-in"
                    variant="outlined"
                    type="number"
                    modelValue={
                      propsBucket.value == null ? undefined : propsBucket.value / secondsPerDay
                    }
                    onUpdate:modelValue={value =>
                      field.setValue(
                        value === '' || value == null ? undefined : Number(value) * secondsPerDay,
                        propsBucket.disableNotifyChanged,
                      )
                    }
                  />
                  <p class="text-medium-emphasis">{this.scope.locale.McpAccessTokenExpiryHelp()}</p>
                </div>
              )}
            />
          </ZForm>
        ),
      },
      { closeOnBackdrop: false, closeOnEscape: true, maxWidth: 600, showCloseButton: true },
    );
  }

  private async _create(
    data: TypeFormOnSubmitData<AccessTokenDraft>,
    generation: number,
    userId: TableIdentity | undefined,
    close: () => void,
  ) {
    if (!process.env.CLIENT || !this._isCurrent(generation, userId)) return;
    const created = await this.$$modelAccessTokens.createMine(data.value);
    if (!this._isCurrent(generation, userId)) return;
    close();
    this._showSecret({ accessToken: created.accessToken, resource: created.resource });
    try {
      await this.$$modelAccessTokens.invalidateMine();
      this.listRefreshFailed = false;
    } catch {
      this.listRefreshFailed = true;
    }
  }

  private _showSecret(secret: RevealedToken) {
    this._revealedToken = secret;
    this._reveal = this.$appModal.dialog(
      {
        title: this.scope.locale.McpAccessTokenCreated(),
        onClose: () => {
          this._revealedToken = undefined;
          this._reveal = undefined;
          this._generation += 1;
        },
        slotDefault: () => (
          <div data-testid="mcp-access-token-reveal" class="d-flex flex-column ga-4">
            <VAlert type="warning" density="compact">
              {this.scope.locale.McpAccessTokenOneTimeHelp()}
            </VAlert>
            <VTextarea
              data-testid="mcp-access-token-secret"
              label={this.scope.locale.McpAccessTokenSecret()}
              variant="outlined"
              readonly
              rows={3}
              modelValue={this._revealedToken?.accessToken ?? ''}
            />
            <ZButton
              data-testid="mcp-access-token-copy-secret"
              variant="outlined"
              size="small"
              onPerform={async () => {
                if (!this._revealedToken) return;
                await this.$performCommand('start-commands:copy', {
                  text: this._revealedToken.accessToken,
                });
              }}
            >
              {this.scope.locale.McpAccessTokenCopySecret()}
            </ZButton>
            <VTextField
              data-testid="mcp-access-token-resource"
              label={this.scope.locale.McpAccessTokenResource()}
              variant="outlined"
              type="url"
              readonly
              modelValue={this._revealedToken?.resource ?? ''}
            />
            <ZButton
              data-testid="mcp-access-token-copy-resource"
              variant="outlined"
              size="small"
              onPerform={async () => {
                if (!this._revealedToken) return;
                await this.$performCommand('start-commands:copy', {
                  text: this._revealedToken.resource,
                });
              }}
            >
              {this.scope.locale.McpAccessTokenCopyResource()}
            </ZButton>
          </div>
        ),
        slotActions: dialog => (
          <ZButton
            data-testid="mcp-access-token-reveal-close"
            color="primary"
            onPerform={() => dialog.close()}
          >
            {this.scope.locale.Close()}
          </ZButton>
        ),
      },
      { closeOnBackdrop: false, closeOnEscape: true, maxWidth: 640, showCloseButton: true },
    );
  }

  async delete(item: AccessTokenItem) {
    const confirmed = await this.$performCommand('start-commands:confirm', {
      text: this.scope.locale.McpAccessTokenDeleteConfirm(),
    });
    if (!confirmed) return;
    await this.$$modelAccessTokens.deleteMine(item.id).mutateAsync();
    const pageCount = this.queryTokens?.data?.pageCount;
    if (pageCount !== undefined && this.pageNo > Math.max(1, pageCount)) {
      this.pageNo = Math.max(1, pageCount);
    }
  }

  private _status(status: AccessTokenItem['status']) {
    switch (status) {
      case 'active':
        return this.scope.locale.McpAccessTokenActive();
      case 'expired':
        return this.scope.locale.McpAccessTokenExpired();
      case 'revoked':
        return this.scope.locale.McpAccessTokenRevoked();
    }
  }

  private _renderDate(value: string | number | Date) {
    const date = value instanceof Date ? value : new Date(value);
    return (
      <time datetime={date.toISOString()}>
        {date.toLocaleString(this.app.meta.locale.current, { timeZone: this.app.meta.locale.tz })}
      </time>
    );
  }

  private _renderToken(item: AccessTokenItem) {
    return (
      <VCard
        key={item.id}
        data-testid="mcp-access-token-row"
        data-mcp-access-token-id={item.id}
        class="mb-4"
      >
        <VCardTitle class="d-flex flex-wrap align-center justify-space-between ga-3">
          <span class="text-wrap">{item.name}</span>
          <ZButton
            data-testid="mcp-access-token-delete"
            color="error"
            variant="outlined"
            size="small"
            onPerform={() => this.delete(item)}
          >
            {this.scope.locale.Delete()}
          </ZButton>
        </VCardTitle>
        <VCardText>
          <VRow dense>
            <VCol cols={12} sm={6}>
              <div class="text-caption">{this.scope.locale.McpAuthorizationStatus()}</div>
              <VChip size="small" class="mt-1">
                {this._status(item.status)}
              </VChip>
            </VCol>
            <VCol cols={12} sm={6}>
              <div class="text-caption">{this.scope.locale.McpGrantedScope()}</div>
              <div class="text-wrap">{item.scope}</div>
            </VCol>
            <VCol cols={12} sm={6}>
              <div class="text-caption">{this.scope.locale.McpAuthorizationCreated()}</div>
              <div>{this._renderDate(item.createdAt)}</div>
            </VCol>
            <VCol cols={12} sm={6}>
              <div class="text-caption">{this.scope.locale.McpAuthorizationAccessExpires()}</div>
              <div>{this._renderDate(item.tokenExpiresAt)}</div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    );
  }

  protected render() {
    const query = this.queryTokens;
    const data = query?.data;
    const loading = !query || query.isPending;
    return (
      <ZPage>
        <VContainer data-testid="mcp-access-tokens" class="py-6" style={{ maxWidth: '960px' }}>
          <div class="d-flex flex-wrap align-start justify-space-between ga-4 mb-6">
            <div>
              <h1 class="text-h4">{this.scope.locale.McpAccessTokens()}</h1>
              <p class="text-medium-emphasis mt-2">{this.scope.locale.McpAccessTokensHelp()}</p>
            </div>
            <ZButton
              data-testid="mcp-access-token-create"
              color="primary"
              onPerform={() => this.openCreate()}
            >
              {this.scope.locale.McpAccessTokenCreate()}
            </ZButton>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {this.scope.locale.McpAccessTokenRetention()}
          </p>
          {loading && <p role="status">{this.scope.locale.McpAccessTokensLoading()}</p>}
          {(query?.error || this.listRefreshFailed) && (
            <VAlert type="error" class="mb-4" text={this.scope.locale.McpAccessTokensLoadFailed()}>
              <template v-slot:append>
                <ZButton
                  size="small"
                  variant="text"
                  onPerform={async () => {
                    await this.queryTokens?.refetch({ throwOnError: true });
                    this.listRefreshFailed = false;
                  }}
                >
                  {this.scope.locale.Retry()}
                </ZButton>
              </template>
            </VAlert>
          )}
          {!loading && !query?.error && data?.list.length === 0 && (
            <p>{this.scope.locale.McpAccessTokensEmpty()}</p>
          )}
          {data?.list.map(item => this._renderToken(item))}
          {data && data.pageCount > 0 && (
            <div class="d-flex flex-wrap align-center justify-space-between ga-3 mt-6">
              <ZButton
                variant="outlined"
                size="small"
                disabled={this.pageNo <= 1}
                onPerform={() => {
                  this.pageNo -= 1;
                }}
              >
                {this.scope.locale.Previous()}
              </ZButton>
              <span class="text-body-2 text-medium-emphasis">
                {this.scope.locale.McpAuthorizationsPage(data.pageNo, data.pageCount, data.total)}
              </span>
              <ZButton
                variant="outlined"
                size="small"
                disabled={this.pageNo >= data.pageCount}
                onPerform={() => {
                  this.pageNo += 1;
                }}
              >
                {this.scope.locale.Next()}
              </ZButton>
            </div>
          )}
        </VContainer>
      </ZPage>
    );
  }
}
