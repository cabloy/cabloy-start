import {
  VAlert,
  VCard,
  VCardText,
  VCardTitle,
  VChip,
  VContainer,
  VRadio,
  VRadioGroup,
} from 'vuetify/components';
import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';
import { ZButton } from 'zova-module-start-button';

import type { ApiApiAuthorizationsummaryResponseBody } from '../../api/authorization.ts';

import { ModelAuthorization } from '../../model/authorization.ts';
import { toolIdentityKey } from '../../model/personalScopes.ts';

type ScopeOption = ApiApiAuthorizationsummaryResponseBody['options'][number];

export const ControllerPageConsentSchemaQuery = z.object({
  request: z.string().min(1),
});

@Controller()
export class ControllerPageConsent extends BeanControllerPageBase {
  @Use()
  $$modelAuthorization: ModelAuthorization;

  clientReady = false;
  reloginPending = false;
  selectedScope?: string;
  private _querySummary?: ReturnType<ModelAuthorization['summary']>;

  protected __init__() {
    this.$ssr.handleDirectOrOnHydrated(() => {
      this.clientReady = true;
    });
    this.$watch(
      () => this._querySummary?.error,
      error => {
        if (error?.code === 401) {
          return this.requireRelogin().catch(error => this.$errorHandler(error));
        }
      },
      { immediate: true },
    );
    this.$watch(
      () => this.$query.request,
      () => {
        this.selectedScope = undefined;
      },
    );
  }

  get querySummary() {
    if (!this.clientReady || this.reloginPending) return;
    return this.$$modelAuthorization.summary(this.$query.request);
  }

  private _effectiveOption(summary: ApiApiAuthorizationsummaryResponseBody) {
    if (this.selectedScope !== undefined) {
      return summary.options.find(option => option.scope === this.selectedScope && option.allowed);
    }
    return (
      summary.options.find(option => option.scope === summary.scope && option.allowed) ??
      summary.options.find(option => option.allowed)
    );
  }

  private async requireRelogin() {
    if (this.reloginPending) return;
    const returnTo = this.app.$getCurrentPagePath();
    this.reloginPending = true;
    try {
      await this.$passport.requireRelogin(returnTo);
    } catch (error) {
      this.reloginPending = false;
      throw error;
    }
  }

  async decide(allow: boolean) {
    if (this.reloginPending) return;
    const summary = this.querySummary?.data;
    const selected = summary && this._effectiveOption(summary);
    if (allow && !selected) return;
    try {
      const result = await this.$$modelAuthorization.decision(
        this.$query.request,
        allow,
        allow ? selected?.scope : undefined,
      );
      window.location.assign(result.redirectUrl);
    } catch (error: any) {
      if (error.code !== 401) throw error;
      await this.requireRelogin();
    }
  }

  private _reason(option: ScopeOption) {
    switch (option.reason) {
      case 'outside_requested_scope':
        return this.scope.locale.McpScopeOutsideRequested();
      case 'outside_client_scope':
        return this.scope.locale.McpScopeOutsideClient();
      case 'tools_unavailable':
        return this.scope.locale.McpScopeUnavailable();
      default:
        return this.scope.locale.McpScopeNotAllowed();
    }
  }

  private _renderOption(option: ScopeOption) {
    return (
      <VCard
        key={option.scope}
        data-mcp-scope-option={option.scope}
        variant="outlined"
        class="mb-3"
      >
        <VCardText>
          <VRadio
            label={option.name}
            value={option.scope}
            disabled={!option.allowed}
            aria-label={option.name}
          />
          <div class="text-caption font-mono ml-8">{option.scope}</div>
          <p class="text-body-2 text-medium-emphasis ml-8 mt-1">{option.description}</p>
          {!option.allowed && <p class="text-body-2 text-warning ml-8">{this._reason(option)}</p>}
          <details class="mt-3 ml-8">
            <summary class="cursor-pointer text-body-2">
              {this.scope.locale.McpScopeSelectedTools(option.tools.length)}
            </summary>
            <ul class="mt-3 pl-4">
              {option.tools.map(tool => (
                <li key={toolIdentityKey(tool)} class="mb-3">
                  <div class="d-flex flex-wrap align-center ga-2">
                    <span class="font-mono text-body-2">{tool.name}</span>
                    <VChip size="x-small" color={!tool.available ? 'warning' : undefined}>
                      {!tool.available
                        ? this.scope.locale.McpToolMissing()
                        : tool.readOnly
                          ? this.scope.locale.McpToolReadOnly()
                          : this.scope.locale.McpToolWrites()}
                    </VChip>
                  </div>
                  <p class="font-mono text-caption text-medium-emphasis">
                    {tool.controller} / {tool.action}
                  </p>
                  {tool.description && (
                    <p class="text-body-2 text-medium-emphasis">{tool.description}</p>
                  )}
                </li>
              ))}
            </ul>
            {option.tools.length === 0 && (
              <p class="mt-2 text-medium-emphasis">{this.scope.locale.McpScopeNoTools()}</p>
            )}
          </details>
        </VCardText>
      </VCard>
    );
  }

  protected render() {
    const query = this.querySummary;
    this._querySummary = query;
    const summary = query?.data;
    const scopes = summary?.scope.split(' ').filter(Boolean) ?? [];
    const selected = summary && this._effectiveOption(summary);
    const scopesPath = this.$router.getPagePath('/cabloy/mcp/scopes');
    return (
      <ZPage>
        <VContainer class="d-flex align-center justify-center py-10" style={{ minHeight: '100vh' }}>
          <VCard style={{ width: '100%', maxWidth: '720px' }}>
            <VCardTitle class="text-h5">{this.scope.locale.AuthorizeMcpAccess()}</VCardTitle>
            <VCardText>
              {!this.clientReady ||
              this.reloginPending ||
              query?.isPending ||
              query?.error?.code === 401 ? (
                <p role="status" class="text-medium-emphasis">
                  {this.scope.locale.LoadingAuthorizationRequest()}
                </p>
              ) : query?.error || !summary ? (
                <VAlert role="alert" type="error">
                  {this.scope.locale.AuthorizationRequestUnavailable()}
                </VAlert>
              ) : (
                <>
                  <dl class="mb-6">
                    <dt class="text-caption">{this.scope.locale.Application()}</dt>
                    <dd class="text-body-1 font-weight-medium mb-4">{summary.clientName}</dd>
                    <dt class="text-caption">{this.scope.locale.RequestedScopes()}</dt>
                    <dd class="d-flex flex-wrap ga-2 mt-1" data-mcp-requested-scope>
                      {scopes.map(scope => (
                        <VChip key={scope} size="small" variant="outlined">
                          {scope}
                        </VChip>
                      ))}
                    </dd>
                  </dl>
                  <fieldset>
                    <legend class="text-body-1 font-weight-medium mb-2">
                      {this.scope.locale.McpEffectiveScope()}
                    </legend>
                    <div class="d-flex flex-wrap align-center justify-space-between ga-2 mb-3">
                      <p class="text-body-2 text-medium-emphasis">
                        {this.scope.locale.McpEffectiveScopeHelp()}
                      </p>
                      {scopesPath && (
                        <a
                          class="text-primary text-body-2"
                          href={scopesPath}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {this.scope.locale.McpManageScopes()}
                        </a>
                      )}
                    </div>
                    <VRadioGroup
                      modelValue={selected?.scope}
                      onUpdate:modelValue={value => {
                        this.selectedScope = value as string;
                      }}
                    >
                      {summary.options.map(option => this._renderOption(option))}
                    </VRadioGroup>
                    {!selected && (
                      <p role="alert" class="text-body-2 text-warning">
                        {this.scope.locale.McpScopeNoAllowedOption()}
                      </p>
                    )}
                  </fieldset>
                  <div class="d-flex justify-end ga-3 mt-6">
                    <ZButton variant="outlined" onPerform={() => this.decide(false)}>
                      {this.scope.locale.Deny()}
                    </ZButton>
                    <ZButton
                      color="primary"
                      disabled={!selected}
                      onPerform={() => this.decide(true)}
                    >
                      {this.scope.locale.Approve()}
                    </ZButton>
                  </div>
                </>
              )}
            </VCardText>
          </VCard>
        </VContainer>
      </ZPage>
    );
  }
}
