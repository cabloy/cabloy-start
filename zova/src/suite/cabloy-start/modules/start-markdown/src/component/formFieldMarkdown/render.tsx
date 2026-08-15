import { EditorContent } from '@tiptap/vue-3';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';

@Render()
export class RenderFormFieldMarkdown extends BeanRenderBase {
  public render() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          this.bindFormField(propsBucket, $$formField);
          return (
            <div class={props.class}>
              <div
                class={[
                  this.cContainer,
                  !$$formField.field.state.meta.isValid && this.cContainerError,
                ]}
                onClick={() => {
                  if (!this.readonly) {
                    this.editor?.commands.focus();
                  }
                }}
              >
                <ClientOnly
                  v-slots={{
                    default: () => <EditorContent editor={this.editor} class={this.cMarkdown} />,
                    placeholder: () => <div class="min-h-96 p-4" aria-hidden="true"></div>,
                  }}
                ></ClientOnly>
              </div>
            </div>
          );
        }}
      ></ZFormField>
    );
  }
}
