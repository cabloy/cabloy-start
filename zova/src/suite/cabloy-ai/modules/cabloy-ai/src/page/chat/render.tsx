import MarkdownRender from 'markstream-vue';
import 'markstream-vue/index.css';
import {
  VAlert,
  VCard,
  VCardText,
  VCardTitle,
  VChip,
  VCol,
  VContainer,
  VList,
  VListItem,
  VRow,
  VTextarea,
} from 'vuetify/components';
import { BeanRenderBase } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';
import { ZButton } from 'zova-module-start-button';
import { ZRowOperations } from 'zova-module-start-table';

@Render()
export class RenderPageChat extends BeanRenderBase {
  render() {
    const model = this.$$modelChat;
    const conversations = model.conversations();
    const history = model.history();
    const conversation = history?.data?.conversation;
    const messages = model.messages(history?.data?.messages);
    const busy =
      model.creating || model.streaming || model.unsettled || !!conversation?.activeRunId;
    const pinnedConversations = conversations.data?.filter(item => item.pinned) ?? [];
    const otherConversations = conversations.data?.filter(item => !item.pinned) ?? [];
    const renderConversations = (items: typeof pinnedConversations) =>
      items.map(item => {
        const itemBusy = model.mutating || item.activeRunId !== null;
        return (
          <VListItem key={item.id}>
            <div
              class="d-flex align-center ga-1"
              data-testid="ai-chat-conversation"
              data-conversation-id={item.id}
            >
              <ZButton
                class="flex-grow-1 justify-start text-left text-truncate"
                variant={item.id === model.selectedId ? 'tonal' : 'text'}
                color={item.id === model.selectedId ? 'primary' : undefined}
                disabled={model.mutating}
                aria-pressed={item.id === model.selectedId}
                onPerform={() => this.selectConversation(item.id)}
              >
                <span
                  class="text-truncate"
                  title={item.title || this.scope.locale.NewConversation()}
                >
                  {item.pinned && <span aria-hidden="true">📌 </span>}
                  {item.title || this.scope.locale.NewConversation()}
                </span>
              </ZButton>
              <ZRowOperations
                compact
                slotDefault={() => (
                  <>
                    <ZButton
                      variant="text"
                      size="small"
                      data-testid="ai-chat-pin"
                      data-conversation-id={item.id}
                      aria-label={
                        item.pinned
                          ? this.scope.locale.UnpinConversation()
                          : this.scope.locale.PinConversation()
                      }
                      title={
                        item.pinned
                          ? this.scope.locale.UnpinConversation()
                          : this.scope.locale.PinConversation()
                      }
                      disabled={itemBusy}
                      onPerform={() => model.setPinned(item.id, !item.pinned)}
                    >
                      {item.pinned ? '📌' : '☆'}
                      <span class="d-none d-sm-inline">
                        {item.pinned
                          ? this.scope.locale.UnpinConversation()
                          : this.scope.locale.PinConversation()}
                      </span>
                    </ZButton>
                    <ZButton
                      variant="text"
                      size="small"
                      data-testid="ai-chat-rename"
                      data-conversation-id={item.id}
                      aria-label={this.scope.locale.RenameConversation()}
                      title={this.scope.locale.RenameConversation()}
                      disabled={itemBusy}
                      onPerform={() => this._rename(item)}
                    >
                      ✎
                      <span class="d-none d-sm-inline">
                        {this.scope.locale.RenameConversation()}
                      </span>
                    </ZButton>
                    <ZButton
                      variant="text"
                      color="error"
                      size="small"
                      data-testid="ai-chat-delete"
                      data-conversation-id={item.id}
                      aria-label={this.scope.locale.DeleteConversation()}
                      title={this.scope.locale.DeleteConversation()}
                      disabled={itemBusy}
                      onPerform={() => this._delete(item)}
                    >
                      ×
                      <span class="d-none d-sm-inline">
                        {this.scope.locale.DeleteConversation()}
                      </span>
                    </ZButton>
                  </>
                )}
              />
            </div>
          </VListItem>
        );
      });

    return (
      <ZPage>
        <VContainer data-testid="ai-chat" class="py-6" style={{ maxWidth: '1200px' }}>
          <header class="d-flex flex-wrap align-center ga-2 mb-5">
            <ZButton
              color="primary"
              variant="outlined"
              data-testid="ai-chat-new"
              disabled={model.creating}
              onPerform={async () => {
                await model.create();
              }}
            >
              {this.scope.locale.NewConversation()}
            </ZButton>
            <ZButton
              color="primary"
              variant="outlined"
              class="d-md-none"
              data-testid="ai-chat-conversations-toggle"
              aria-expanded={this.mobileConversationsOpen}
              aria-controls="ai-chat-conversations"
              onPerform={() => {
                this.mobileConversationsOpen = !this.mobileConversationsOpen;
              }}
            >
              {this.scope.locale.Conversations()}
            </ZButton>
          </header>
          <VRow>
            <VCol
              cols="12"
              md="4"
              lg="3"
              class={this.mobileConversationsOpen ? undefined : 'd-none d-md-block'}
            >
              <VCard>
                <VCardText>
                  <nav
                    id="ai-chat-conversations"
                    aria-label={this.scope.locale.Conversations()}
                    class="overflow-y-auto"
                    style={{ maxHeight: '480px' }}
                  >
                    {pinnedConversations.length > 0 && (
                      <section>
                        <div class="text-caption text-medium-emphasis px-3 py-2">
                          {this.scope.locale.PinnedConversations()}
                        </div>
                        <VList density="compact" class="pa-0">
                          {renderConversations(pinnedConversations)}
                        </VList>
                      </section>
                    )}
                    {otherConversations.length > 0 && (
                      <section class={pinnedConversations.length > 0 ? 'mt-3' : undefined}>
                        <div class="text-caption text-medium-emphasis px-3 py-2">
                          {this.scope.locale.Recent()}
                        </div>
                        <VList density="compact" class="pa-0">
                          {renderConversations(otherConversations)}
                        </VList>
                      </section>
                    )}
                    {conversations.data?.length === 0 && (
                      <p class="text-body-2 text-medium-emphasis px-3 py-2">
                        {this.scope.locale.NoSavedConversations()}
                      </p>
                    )}
                  </nav>
                </VCardText>
              </VCard>
            </VCol>
            <VCol cols="12" md="8" lg="9">
              <VCard class="d-flex flex-column">
                <VCardTitle class="d-flex align-center justify-space-between ga-2 text-wrap">
                  <span class="text-truncate">
                    {conversation
                      ? conversation.title || this.scope.locale.NewConversation()
                      : this.scope.locale.StartConversation()}
                  </span>
                  {conversation?.pinned && <VChip size="small">📌</VChip>}
                </VCardTitle>
                <VCardText class="d-flex flex-column">
                  <div
                    class="overflow-y-auto"
                    style={{ minHeight: '256px', maxHeight: '55vh' }}
                    aria-label={this.scope.locale.Messages()}
                    data-testid="ai-chat-messages"
                    onScroll={() => this._handleMessagesScroll()}
                    ref={element => {
                      if (!this.ctx.disposed)
                        this.setMessagesElement?.((element as HTMLDivElement | null) ?? undefined);
                    }}
                  >
                    <div
                      class="d-flex flex-column ga-4"
                      ref={element => {
                        if (!this.ctx.disposed)
                          this.setMessagesContent?.(
                            (element as HTMLDivElement | null) ?? undefined,
                          );
                      }}
                    >
                      {messages.map(message => (
                        <div
                          key={message.key}
                          class={[
                            'd-flex flex-column',
                            message.role === 'user' ? 'align-end' : 'align-start',
                          ]}
                          data-testid={
                            message.role === 'assistant' && message.pending
                              ? 'ai-chat-stream'
                              : undefined
                          }
                        >
                          <div class="text-caption text-medium-emphasis mb-1">
                            {message.role === 'user'
                              ? message.pending
                                ? this.scope.locale.ChatYouPending()
                                : this.scope.locale.ChatYou()
                              : message.pending
                                ? this.scope.locale.ChatAssistantLive()
                                : this.scope.locale.ChatAssistant()}
                          </div>
                          <VCard
                            variant="tonal"
                            class={[
                              'px-4 py-3 text-body-1 text-wrap overflow-x-auto',
                              message.role === 'user' ? 'bg-primary text-white' : undefined,
                            ]}
                            style={{ maxWidth: '100%' }}
                          >
                            {message.role === 'user' ? (
                              <span style={{ whiteSpace: 'pre-wrap' }}>{message.text}</span>
                            ) : (
                              <div class={this.cMarkdown}>
                                <MarkdownRender
                                  mode="chat"
                                  content={message.text}
                                  final={!message.pending || !model.streaming}
                                  htmlPolicy="safe"
                                  isDark={this.$theme.dark}
                                />
                              </div>
                            )}
                          </VCard>
                        </div>
                      ))}
                      {model.selectedId === undefined && (
                        <p class="text-body-2 text-medium-emphasis">
                          {this.scope.locale.CreateConversationHint()}
                        </p>
                      )}
                    </div>
                  </div>
                  <p
                    class="text-body-2 text-medium-emphasis mt-3 mb-0"
                    role="status"
                    data-testid="ai-chat-status"
                  >
                    {model.streaming
                      ? this.scope.locale.ReceivingResponse()
                      : model.unsettled || conversation?.activeRunId
                        ? this.scope.locale.WaitingForSavedRequestState()
                        : this.scope.locale.ChatReady()}
                  </p>
                  {(model.error ||
                    model.mutationError ||
                    conversations.error ||
                    history?.error) && (
                    <VAlert
                      type="warning"
                      density="compact"
                      role="alert"
                      class="mt-3"
                      data-testid="ai-chat-error"
                    >
                      {model.error ||
                        model.mutationError ||
                        this.scope.locale.ConversationHistoryLoadFailed()}
                    </VAlert>
                  )}
                  <div onKeydown={event => this._handleInputKeydown(event as KeyboardEvent)}>
                    <VTextarea
                      class="mt-3"
                      data-testid="ai-chat-input"
                      label={this.scope.locale.ChatMessage()}
                      placeholder={this.scope.locale.TypeMessage()}
                      variant="outlined"
                      rows={4}
                      counter={32000}
                      disabled={busy}
                      modelValue={this.draft}
                      onUpdate:modelValue={value => {
                        this.draft = String(value ?? '');
                      }}
                    />
                  </div>
                  <div class="d-flex flex-wrap justify-end ga-2 mt-2">
                    {model.unsettled && !model.streaming && (
                      <ZButton variant="outlined" onPerform={() => this.retry()}>
                        {this.scope.locale.RetrySameRequest()}
                      </ZButton>
                    )}
                    {model.streaming && (
                      <ZButton
                        variant="outlined"
                        data-testid="ai-chat-stop"
                        onPerform={() => model.stop()}
                      >
                        {this.scope.locale.ChatStop()}
                      </ZButton>
                    )}
                    <ZButton
                      color="primary"
                      data-testid="ai-chat-send"
                      disabled={busy || !this.draft.trim()}
                      onPerform={() => this.send()}
                    >
                      {this.scope.locale.ChatSend()}
                    </ZButton>
                  </div>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VContainer>
      </ZPage>
    );
  }
}
