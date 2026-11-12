import type { TypeFormOnSubmitData } from 'zova-module-a-form';

import {
  VAlert,
  VCard,
  VCardText,
  VCardTitle,
  VCheckbox,
  VChip,
  VContainer,
  VTextField,
} from 'vuetify/components';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZForm, ZFormField, ZFormFieldPreset } from 'zova-module-a-form';
import { $QueriesEnsureLoaded, $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';
import { ZButton } from 'zova-module-start-button';

import type {
  CatalogTool,
  PersonalScope,
  PersonalScopeDraft,
  ToolIdentity,
} from '../../model/personalScopes.ts';

import { ModelPersonalScopes, toolIdentityKey } from '../../model/personalScopes.ts';

@Controller()
export class ControllerPageScopes extends BeanControllerPageBase {
  @Use()
  $$modelPersonalScopes: ModelPersonalScopes;

  toolSearch = '';

  protected async __init__() {
    await $QueriesEnsureLoaded(
      () => this.queryScopes,
      () => this.queryCatalog,
    );
  }

  get queryScopes() {
    return this.$$modelPersonalScopes.mine();
  }

  get queryCatalog() {
    return this.$$modelPersonalScopes.catalog();
  }

  private _apiSchemas(editing: boolean) {
    return editing
      ? this.scope.apiSchema.mcpAuthCustomScope.updateMine()
      : this.scope.apiSchema.mcpAuthCustomScope.createMine();
  }

  async openEditor(item?: PersonalScope) {
    await $QueryEnsureLoaded(() => this._apiSchemas(!!item).sdk);
    const queryCatalog = this.queryCatalog;
    if (!queryCatalog) return;
    await queryCatalog.refetch({ throwOnError: true });
    const catalog = queryCatalog.data;
    if (!catalog) return;
    const available = new Set(catalog.map(toolIdentityKey));
    this.toolSearch = '';
    const draft: PersonalScopeDraft = item
      ? {
          name: item.name,
          description: item.description,
          tools: item.tools
            .filter(tool => available.has(toolIdentityKey(tool)))
            .map(tool => ({ ...tool })),
        }
      : { name: '', description: '', tools: [] };
    this.$appModal.dialog(
      {
        title: item ? this.scope.locale.McpScopeEdit() : this.scope.locale.McpScopeCreate(),
        slotDefault: dialog => (
          <ZForm
            data={draft}
            schema={this._apiSchemas(!!item).requestBody}
            localePresentationRefresh={{ identity: `mcp-scope:${item?.id ?? 'create'}` }}
            onSubmitData={data => this._save(data, item, dialog.close)}
            onShowError={async ({ error }) => {
              await this.$performCommand('start-commands:alert', {
                type: 'error',
                text: error.message,
              });
            }}
            slotFooter={form => (
              <div class="d-flex justify-end ga-2">
                <ZButton
                  variant="text"
                  disabled={form.formState.isSubmitting}
                  onPerform={() => dialog.close()}
                >
                  {this.scope.locale.Cancel()}
                </ZButton>
                <ZButton
                  color="primary"
                  disabled={form.formState.isSubmitting}
                  onPerform={async () => {
                    await form.submit();
                  }}
                >
                  {this.scope.locale.Save()}
                </ZButton>
              </div>
            )}
          >
            <ZFormFieldPreset
              name="name"
              render="start-input:formFieldInput"
              options={{ type: 'text' }}
            />
            <p class="text-body-2 text-medium-emphasis">{this.scope.locale.McpScopeNameHelp()}</p>
            <ZFormFieldPreset
              name="description"
              render="start-input:formFieldInput"
              options={{ type: 'text' }}
            />
            <ZFormField
              name="tools"
              slotDefault={({ propsBucket }, field) => {
                const selected = (propsBucket.value ?? []) as ToolIdentity[];
                return this._renderToolPicker(selected, tools => {
                  field.setValue(tools, propsBucket.disableNotifyChanged);
                  field.handleBlur();
                });
              }}
            />
            {item && (
              <p class="text-body-2 text-warning">
                {this.scope.locale.McpScopeAccessChangeWarning()}
              </p>
            )}
          </ZForm>
        ),
      },
      { closeOnBackdrop: false, closeOnEscape: false, maxWidth: 760, showCloseButton: true },
    );
  }

  private async _save(
    data: TypeFormOnSubmitData<PersonalScopeDraft>,
    item: PersonalScope | undefined,
    close: () => void,
  ) {
    if (item) {
      const before = item.tools.map(toolIdentityKey).sort();
      const after = data.value.tools.map(toolIdentityKey).sort();
      if (
        item.name.trim() !== data.value.name.trim() ||
        JSON.stringify(before) !== JSON.stringify(after)
      ) {
        const confirmed = await this.$performCommand('start-commands:confirm', {
          text: this.scope.locale.McpScopeAccessChangeConfirm(),
        });
        if (!confirmed) return;
      }
    }
    await this.$$modelPersonalScopes.save(item?.id).mutateAsync(data.value);
    close();
  }

  async delete(item: PersonalScope) {
    const confirmed = await this.$performCommand('start-commands:confirm', {
      text: this.scope.locale.McpScopeDeleteConfirm(),
    });
    if (!confirmed) return;
    await this.$$modelPersonalScopes.deleteMine(item.id).mutateAsync();
  }

  private _renderToolIdentity(tool: ToolIdentity, details?: CatalogTool) {
    return (
      <div class="min-w-0">
        <div class="d-flex flex-wrap align-center ga-2">
          <span class="text-body-2 text-wrap">{details?.summary?.trim() || tool.name}</span>
          <VChip size="x-small" color={!details ? 'warning' : undefined}>
            {!details
              ? this.scope.locale.McpToolMissing()
              : details.readOnly
                ? this.scope.locale.McpToolReadOnly()
                : this.scope.locale.McpToolWrites()}
          </VChip>
        </div>
        <p class="text-caption font-mono text-medium-emphasis">
          {tool.controller} / {tool.action}
        </p>
        {details?.description && (
          <p class="text-body-2 text-medium-emphasis">{details.description}</p>
        )}
      </div>
    );
  }

  private _renderToolPicker(selected: ToolIdentity[], change: (tools: ToolIdentity[]) => void) {
    const catalog = this.queryCatalog?.data ?? [];
    const keys = new Set(selected.map(toolIdentityKey));
    const available = new Set(catalog.map(toolIdentityKey));
    const missing = selected.filter(tool => !available.has(toolIdentityKey(tool)));
    const summaries = new Map(catalog.map(tool => [tool.controller, tool.controllerSummary]));
    const search = this.toolSearch.trim().toLowerCase();
    const tools = [...missing, ...catalog].filter(
      tool =>
        !search ||
        [
          tool.name,
          'summary' in tool ? tool.summary : '',
          tool.controller,
          summaries.get(tool.controller),
          tool.action,
          'description' in tool ? tool.description : '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(search),
    );
    const groups = new Map<string, typeof tools>();
    for (const tool of tools) {
      const group = groups.get(tool.controller);
      if (group) group.push(tool);
      else groups.set(tool.controller, [tool]);
    }
    return (
      <div data-mcp-tool-picker>
        <p class="text-body-2 text-medium-emphasis">{this.scope.locale.McpScopeToolsHelp()}</p>
        <VTextField
          label={this.scope.locale.McpScopeToolSearch()}
          variant="outlined"
          type="search"
          modelValue={this.toolSearch}
          onUpdate:modelValue={value => {
            this.toolSearch = value;
          }}
        />
        <p class="text-body-2">{this.scope.locale.McpScopeSelectedTools(selected.length)}</p>
        {missing.length > 0 && (
          <VAlert type="warning" density="compact" class="mb-3">
            {this.scope.locale.McpScopeMissingToolsHelp()}
          </VAlert>
        )}
        <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
          {Array.from(groups, ([controller, group]) => (
            <fieldset key={controller} class="mb-4">
              <legend class="text-body-2 font-weight-medium mb-2">
                {summaries.get(controller)?.trim() || this.scope.locale.McpScopeOtherTools()}
              </legend>
              {group.map(tool => {
                const key = toolIdentityKey(tool);
                const details = catalog.find(entry => toolIdentityKey(entry) === key);
                return (
                  <VCheckbox
                    key={key}
                    label={details?.summary?.trim() || tool.name}
                    modelValue={keys.has(key)}
                    density="comfortable"
                    data-tool-name={tool.name}
                    data-tool-controller={tool.controller}
                    data-tool-action={tool.action}
                    onUpdate:modelValue={checked => {
                      change(
                        checked
                          ? [
                              ...selected.filter(entry => toolIdentityKey(entry) !== key),
                              {
                                name: tool.name,
                                controller: tool.controller,
                                action: tool.action,
                              },
                            ]
                          : selected.filter(entry => toolIdentityKey(entry) !== key),
                      );
                    }}
                  >
                    <template v-slot:label>{this._renderToolIdentity(tool, details)}</template>
                  </VCheckbox>
                );
              })}
            </fieldset>
          ))}
          {tools.length === 0 && (
            <p class="text-body-2 text-medium-emphasis">{this.scope.locale.McpScopeNoTools()}</p>
          )}
        </div>
      </div>
    );
  }

  private _renderScope(item: PersonalScope) {
    const catalog = this.queryCatalog?.data;
    return (
      <VCard key={item.id} data-mcp-scope={item.scope} class="mb-4">
        <VCardTitle class="d-flex flex-wrap align-center justify-space-between ga-3">
          <span class="text-wrap">{item.name}</span>
          <div class="d-flex ga-2">
            <ZButton variant="outlined" size="small" onPerform={() => this.openEditor(item)}>
              {this.scope.locale.Edit()}
            </ZButton>
            <ZButton
              color="error"
              variant="outlined"
              size="small"
              onPerform={() => this.delete(item)}
            >
              {this.scope.locale.Delete()}
            </ZButton>
          </div>
        </VCardTitle>
        <VCardText>
          <p class="text-body-1 text-wrap">{item.description}</p>
          <p class="text-caption font-mono text-medium-emphasis text-break">{item.scope}</p>
          <details class="mt-3">
            <summary class="cursor-pointer text-body-2">
              {this.scope.locale.McpScopeSelectedTools(item.tools.length)}
            </summary>
            <ul class="mt-3 pl-4">
              {item.tools.map(tool => (
                <li key={toolIdentityKey(tool)} class="mb-3">
                  {catalog ? (
                    this._renderToolIdentity(
                      tool,
                      catalog.find(entry => toolIdentityKey(entry) === toolIdentityKey(tool)),
                    )
                  ) : (
                    <p class="font-mono text-body-2">
                      {tool.name} ({tool.controller} / {tool.action})
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </details>
        </VCardText>
      </VCard>
    );
  }

  protected render() {
    const query = this.queryScopes;
    const list = query?.data?.list;
    return (
      <ZPage>
        <VContainer class="py-6" style={{ maxWidth: '960px' }}>
          <div class="d-flex flex-wrap align-start justify-space-between ga-4 mb-6">
            <div>
              <h1 class="text-h4">{this.scope.locale.McpPersonalScopes()}</h1>
              <p class="text-medium-emphasis mt-2">{this.scope.locale.McpPersonalScopesHelp()}</p>
            </div>
            <ZButton color="primary" onPerform={() => this.openEditor()}>
              {this.scope.locale.McpScopeCreate()}
            </ZButton>
          </div>
          {(!query || query.isPending) && (
            <p role="status">{this.scope.locale.McpScopesLoading()}</p>
          )}
          {(query?.error || this.queryCatalog?.error) && (
            <VAlert role="alert" type="error" class="mb-4">
              {this.scope.locale.McpScopesLoadFailed()}
              <template v-slot:append>
                <ZButton
                  size="small"
                  variant="text"
                  onPerform={async () => {
                    await this.queryScopes?.refetch({ throwOnError: true });
                    await this.queryCatalog?.refetch({ throwOnError: true });
                  }}
                >
                  {this.scope.locale.Retry()}
                </ZButton>
              </template>
            </VAlert>
          )}
          {list?.length === 0 && <p>{this.scope.locale.McpScopesEmpty()}</p>}
          {list?.map(item => this._renderScope(item))}
        </VContainer>
      </ZPage>
    );
  }
}
