import {
  VAlert,
  VCard,
  VCardText,
  VCardTitle,
  VChip,
  VCol,
  VContainer,
  VRow,
} from 'vuetify/components';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';
import { ZButton } from 'zova-module-start-button';

import type { ApiApiMcpAuthAuthorizationGrantmineResponseBody } from '../../api/mcpAuthAuthorizationGrant.ts';

import { ModelAuthorizationRecords } from '../../model/authorizationRecords.ts';

type AuthorizationItem = ApiApiMcpAuthAuthorizationGrantmineResponseBody['list'][number];

@Controller()
export class ControllerPageAuthorizations extends BeanControllerPageBase {
  @Use()
  $$modelAuthorizationRecords: ModelAuthorizationRecords;

  pageNo = 1;
  readonly pageSize = 20;

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.queryRecords);
  }

  get queryRecords() {
    return this.$$modelAuthorizationRecords.mine({ pageNo: this.pageNo, pageSize: this.pageSize });
  }

  async revoke(item: AuthorizationItem) {
    const confirmed = await this.$performCommand('start-commands:confirm', {
      text: this.scope.locale.McpAuthorizationRevokeConfirm(),
    });
    if (!confirmed) return;
    await this.$$modelAuthorizationRecords.revokeMine(item.id).mutateAsync();
  }

  private _status(state: AuthorizationItem['state']) {
    switch (state) {
      case 'pending':
        return this.scope.locale.McpAuthorizationPending();
      case 'codeReady':
        return this.scope.locale.McpAuthorizationCodeReady();
      case 'tokenActive':
        return this.scope.locale.McpAuthorizationTokenActive();
      case 'denied':
        return this.scope.locale.McpAuthorizationDenied();
      case 'revoked':
        return this.scope.locale.McpAuthorizationRevoked();
      default:
        return state;
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

  private _renderRecord(item: AuthorizationItem) {
    const canRevoke = item.state === 'codeReady' || item.state === 'tokenActive';
    return (
      <VCard key={item.id} data-authorization-id={item.id} class="mb-4">
        <VCardTitle class="d-flex flex-wrap align-center justify-space-between ga-3">
          <span class="text-wrap">{item.clientName}</span>
          {canRevoke && (
            <ZButton variant="outlined" size="small" onPerform={() => this.revoke(item)}>
              {this.scope.locale.Revoke()}
            </ZButton>
          )}
        </VCardTitle>
        <VCardText>
          <VRow dense>
            <VCol cols={12} sm={6}>
              <div class="text-caption">{this.scope.locale.McpAuthorizationStatus()}</div>
              <VChip size="small" class="mt-1">
                {this._status(item.state)}
              </VChip>
            </VCol>
            <VCol cols={12} sm={6}>
              <div class="text-caption">{this.scope.locale.McpGrantedScope()}</div>
              <div class="text-wrap">{item.scope}</div>
            </VCol>
            <VCol cols={12} sm={6}>
              <div class="text-caption">{this.scope.locale.RequestedScopes()}</div>
              <div class="text-wrap">{item.requestedScope}</div>
            </VCol>
            <VCol cols={12} sm={6}>
              <div class="text-caption">{this.scope.locale.McpAuthorizationCreated()}</div>
              <div>{this._renderDate(item.createdAt)}</div>
            </VCol>
            <VCol cols={12} sm={6}>
              <div class="text-caption">{this.scope.locale.McpAuthorizationAccessExpires()}</div>
              <div>
                {item.tokenExpiresAt > 0
                  ? this._renderDate(item.tokenExpiresAt)
                  : this.scope.locale.McpAuthorizationNotIssued()}
              </div>
            </VCol>
            <VCol cols={12} sm={6}>
              <div class="text-caption">{this.scope.locale.McpAuthorizationRefreshExpires()}</div>
              <div>
                {!item.refreshEnabled
                  ? this.scope.locale.McpAuthorizationRefreshDisabled()
                  : item.refreshExpiresAt && item.refreshExpiresAt > 0
                    ? this._renderDate(item.refreshExpiresAt)
                    : this.scope.locale.McpAuthorizationNotIssued()}
              </div>
            </VCol>
          </VRow>
          <details class="mt-4">
            <summary class="cursor-pointer">{this.scope.locale.McpAuthorizationClientId()}</summary>
            <p class="mt-2 text-break font-mono">{item.clientId}</p>
          </details>
        </VCardText>
      </VCard>
    );
  }

  protected render() {
    const query = this.queryRecords;
    const data = query?.data;
    const loading = !query || query.isPending;
    return (
      <ZPage>
        <VContainer class="py-6" style={{ maxWidth: '960px' }}>
          <div class="d-flex flex-wrap align-start justify-space-between ga-4 mb-6">
            <div>
              <h1 class="text-h4">{this.scope.locale.McpAuthorizations()}</h1>
              <p class="text-medium-emphasis mt-2">{this.scope.locale.McpAuthorizationsHelp()}</p>
            </div>
            <ZButton
              variant="outlined"
              size="small"
              disabled={!query}
              onPerform={async () => {
                await this.queryRecords?.refetch({ throwOnError: true });
              }}
            >
              {this.scope.locale.Refresh()}
            </ZButton>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {this.scope.locale.McpAuthorizationsRetention()}
          </p>
          {loading && <p role="status">{this.scope.locale.McpAuthorizationsLoading()}</p>}
          {query?.error && (
            <VAlert
              role="alert"
              type="error"
              class="mb-4"
              text={this.scope.locale.McpAuthorizationsLoadFailed()}
            >
              <template v-slot:append>
                <ZButton
                  size="small"
                  variant="text"
                  onPerform={async () => {
                    await this.queryRecords?.refetch({ throwOnError: true });
                  }}
                >
                  {this.scope.locale.Retry()}
                </ZButton>
              </template>
            </VAlert>
          )}
          {!loading && !query?.error && data?.list.length === 0 && (
            <p>{this.scope.locale.McpAuthorizationsEmpty()}</p>
          )}
          {data?.list.map(item => this._renderRecord(item))}
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
