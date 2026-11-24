import type { ZovaConfigEnv } from 'zova';

import { VCard, VCardText, VCardTitle, VContainer } from 'vuetify/components';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';
import { ZButton } from 'zova-module-start-button';

import { getMcpResource } from '../../lib/mcpResource.ts';

const skillsUrl = 'https://github.com/cabloy/cabloy/tree/main/repo-client-governance/skills/';

function normalizeToken(value: string | undefined, fallback: string) {
  const normalized = (value ?? '')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return normalized || fallback;
}

function getConnectionName(env: ZovaConfigEnv) {
  return [
    normalizeToken(env.APP_NAME, 'cabloy'),
    normalizeToken(env.SITE_ID, 'default'),
    normalizeToken(env.META_MODE, 'development'),
  ].join('_');
}

@Controller()
export class ControllerPageQuickStart extends BeanControllerPageBase {
  private async _copy(text: string) {
    await this.$performCommand('start-commands:copy', { text });
  }

  protected render() {
    const connectionName = getConnectionName(this.sys.env);
    const resource = getMcpResource(this.sys.env);
    const firstPrompt = this.scope.locale.McpQuickStartPrompt1(skillsUrl, connectionName, resource);
    const thirdPrompt = this.scope.locale.McpQuickStartPrompt3(connectionName);

    return (
      <ZPage>
        <VContainer data-testid="mcp-quick-start" class="py-6" style={{ maxWidth: '960px' }}>
          <div class="mb-6">
            <h1 class="text-h4">{this.scope.locale.McpQuickStart()}</h1>
            <p class="text-medium-emphasis mt-2">{this.scope.locale.McpQuickStartIntro()}</p>
          </div>
          <div class="d-flex flex-column ga-4">
            <VCard data-testid="mcp-quick-start-card-1">
              <VCardTitle>1. {this.scope.locale.McpQuickStartCard1()}</VCardTitle>
              <VCardText>
                <div class="d-flex flex-column ga-4">
                  <p>{this.scope.locale.McpQuickStartPromptHelp()}</p>
                  <pre
                    data-testid="mcp-quick-start-prompt-1"
                    data-connection-name={connectionName}
                    data-mcp-resource={resource}
                    class="text-body-2 text-wrap pa-4 bg-surface-variant rounded"
                    style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                  >
                    <code>{firstPrompt}</code>
                  </pre>
                  <p class="text-body-2 text-medium-emphasis">
                    {this.scope.locale.McpQuickStartNameHelp()}
                  </p>
                  <div>
                    <ZButton
                      data-testid="mcp-quick-start-copy-prompt-1"
                      variant="outlined"
                      size="small"
                      onPerform={() => this._copy(firstPrompt)}
                    >
                      {this.scope.locale.McpQuickStartCopy()}
                    </ZButton>
                  </div>
                </div>
              </VCardText>
            </VCard>
            <VCard data-testid="mcp-quick-start-card-2">
              <VCardTitle>2. {this.scope.locale.McpQuickStartCard2()}</VCardTitle>
              <VCardText>{this.scope.locale.McpQuickStartAuthorize()}</VCardText>
            </VCard>
            <VCard data-testid="mcp-quick-start-card-3">
              <VCardTitle>3. {this.scope.locale.McpQuickStartCard3()}</VCardTitle>
              <VCardText>
                <div class="d-flex flex-column align-start ga-4">
                  <pre
                    data-testid="mcp-quick-start-prompt-3"
                    class="text-body-2 text-wrap pa-4 bg-surface-variant rounded"
                    style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', width: '100%' }}
                  >
                    <code>{thirdPrompt}</code>
                  </pre>
                  <ZButton
                    data-testid="mcp-quick-start-copy-prompt-3"
                    variant="outlined"
                    size="small"
                    onPerform={() => this._copy(thirdPrompt)}
                  >
                    {this.scope.locale.McpQuickStartCopy()}
                  </ZButton>
                </div>
              </VCardText>
            </VCard>
          </div>
        </VContainer>
      </ZPage>
    );
  }
}
