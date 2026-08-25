import type {
  ApiApiHomeUserAccountchangePasswordRequestBody,
  ApiApiHomeUserAccountcurrentResponseBody,
  ApiApiHomeUserAccountissuePasswordSetLinkRequestBody,
} from 'zova-module-home-api';

import { SchemaObject } from 'openapi3-ts/oas31';
import {
  VAlert,
  VBtn,
  VCard,
  VCardText,
  VCardTitle,
  VCol,
  VContainer,
  VRow,
  VTextField,
} from 'vuetify/components';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { TypeFormOnSubmitData, ZForm, ZFormField, ZFormFieldPreset } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';
import { resolveImagePreviewUrl, ZImageUploader } from 'zova-module-start-image';

import type { AccountProfileUpdateCommand } from '../../model/account.js';

import { ModelAccount } from '../../model/account.js';

const homeUserAvatarScene = 'home-user:homeUserAvatar';

type AccountCurrent = ApiApiHomeUserAccountcurrentResponseBody;
type ProfileDraft = AccountProfileUpdateCommand;
type PasswordDraft = ApiApiHomeUserAccountchangePasswordRequestBody;
type PasswordSetIssueDraft = Omit<
  ApiApiHomeUserAccountissuePasswordSetLinkRequestBody,
  'consumerUrl'
>;

@Controller()
export class ControllerPageAccount extends BeanControllerPageBase {
  @Use()
  $$modelAccount: ModelAccount;

  profileDraft?: ProfileDraft;
  avatarPreview?: string;
  schemaProfileUpdate?: SchemaObject;
  schemaPasswordChange?: SchemaObject;
  passwordDraft: PasswordDraft = {
    currentPassword: '',
    newPassword: '',
    passwordConfirm: '',
  };

  passwordSetIssueDraft: PasswordSetIssueDraft = { email: '' };

  passwordSetLinkSubmitting = false;
  profileMessage?: string;
  profileError?: string;
  passwordSetLinkMessage?: string;
  passwordSetLinkError?: string;
  timezonePlaceholder?: string;

  get apiSchemasProfileUpdate() {
    return this.$apiSchema.homeUserAccount.updateProfile();
  }

  get apiSchemasPasswordChange() {
    return this.$apiSchema.homeUserAccount.changePassword();
  }

  protected async __init__() {
    await Promise.all([
      $QueryEnsureLoaded(() => this.queryCurrent),
      $QueryEnsureLoaded(() => this.apiSchemasProfileUpdate.sdk),
      $QueryEnsureLoaded(() => this.apiSchemasPasswordChange.sdk),
    ]);
    this.schemaProfileUpdate = this.$computed(() => this.apiSchemasProfileUpdate.requestBody);
    this.schemaPasswordChange = this.$computed(() => this.apiSchemasPasswordChange.requestBody);
    this._resetProfileDraft();
    this.$ssr.handleDirectOrOnHydrated(() => {
      this.timezonePlaceholder = Intl.DateTimeFormat().resolvedOptions().timeZone;
    });
  }

  get queryCurrent() {
    return this.$$modelAccount.current();
  }

  async submitProfile(data: TypeFormOnSubmitData<ProfileDraft>) {
    const current = await this.$$modelAccount.updateProfile().mutateAsync(data.value);
    this._resetProfileDraft(current);
    this.profileMessage = this.scope.locale.AccountProfileSaved();
  }

  handleAvatarUploadError() {
    this.profileMessage = this.scope.locale.AccountAvatarUploadFailed();
  }

  async submitPasswordChange(data: TypeFormOnSubmitData<PasswordDraft>) {
    const result = await this.$$modelAccount.changePassword().mutateAsync(data.value);
    if (result.requiresRelogin) await this.$passport.requireRelogin();
  }

  async issuePasswordSetLink() {
    if (this.passwordSetLinkSubmitting) return;
    this.passwordSetLinkSubmitting = true;
    this.passwordSetLinkMessage = undefined;
    this.passwordSetLinkError = undefined;
    try {
      const consumerUrl = this.$router.getPagePath('/home/user/password-set', undefined, true);
      if (!consumerUrl) throw new Error('password-set consumer route is unavailable');
      await this.$$modelAccount.issuePasswordSetLink().mutateAsync({
        ...this.passwordSetIssueDraft,
        consumerUrl,
      });
      this.passwordSetIssueDraft = { email: '' };
      this.passwordSetLinkMessage = this.scope.locale.AccountPasswordSetLinkSent();
    } catch {
      this.passwordSetLinkError = this.scope.locale.AccountPasswordSetLinkFailed();
    } finally {
      this.passwordSetLinkSubmitting = false;
    }
  }

  private _resetProfileDraft(current = this.queryCurrent?.data) {
    if (!current) return;
    this.profileDraft = {
      name: current.name,
      avatar: current.avatar ?? undefined,
      locale: typeof current.locale === 'string' ? current.locale : undefined,
      tz: current.tz ?? undefined,
    };
    this.avatarPreview = current.avatar || this.$scopeBase.config.avatar.empty;
  }

  protected render() {
    const query = this.queryCurrent;
    const current = query?.data;
    if (!current) {
      return (
        <ZPage>
          <VContainer class="py-6">
            {query?.error && <VAlert type="error">{this.scope.locale.AccountLoadFailed()}</VAlert>}
          </VContainer>
        </ZPage>
      );
    }
    return (
      <ZPage>
        <VContainer class="py-6" style={{ maxWidth: '1100px' }}>
          <h1 class="text-h4 mb-6">{this.scope.locale.AccountSettings()}</h1>
          <VRow>
            <VCol cols={12} md={6}>
              {this._renderProfileCard()}
            </VCol>
            <VCol cols={12} md={6}>
              {this._renderSecurityCard(current)}
            </VCol>
          </VRow>
          {query?.error && (
            <VAlert class="mt-6" type="error">
              {this.scope.locale.AccountLoadFailed()}
            </VAlert>
          )}
        </VContainer>
      </ZPage>
    );
  }

  private _renderProfileCard() {
    return (
      <VCard>
        <VCardTitle>{this.scope.locale.AccountProfile()}</VCardTitle>
        <VCardText>{this._renderProfileForm()}</VCardText>
      </VCard>
    );
  }

  private _renderProfileForm() {
    return (
      <ZForm
        data={this.profileDraft!}
        schema={this.schemaProfileUpdate}
        onSubmitData={data => this.submitProfile(data)}
        onShowError={async ({ error }) => {
          this.profileError = error.message || this.scope.locale.AccountProfileSaveFailed();
        }}
        slotFooter={$$form => (
          <div class="d-flex flex-column ga-3 mt-4">
            {this.profileMessage && (
              <VAlert density="compact" type="success">
                {this.profileMessage}
              </VAlert>
            )}
            {this.profileError && (
              <VAlert density="compact" type="error">
                {this.profileError}
              </VAlert>
            )}
            <VBtn disabled={$$form.formState.isSubmitting} type="submit" color="primary">
              {this.scope.locale.AccountSaveProfile()}
            </VBtn>
          </div>
        )}
      >
        <ZFormField
          name="avatar"
          slotDefault={({ propsBucket }, $$formField) => {
            const avatarValue =
              typeof propsBucket.value === 'string' ? propsBucket.value : this.avatarPreview;
            const avatar =
              resolveImagePreviewUrl(avatarValue, this.sys.config.api.baseURL) ||
              this.$scopeBase.config.avatar.empty;
            return (
              <ZImageUploader
                previewUrl={avatar}
                emptyPreviewUrl={this.$scopeBase.config.avatar.empty}
                previewAlt={this.scope.locale.AccountChooseAvatar()}
                imageScene={homeUserAvatarScene}
                chooseText={this.scope.locale.AccountChooseAvatar()}
                clearText={this.scope.locale.AccountClearAvatar()}
                crop={{
                  labels: {
                    title: this.scope.locale.AccountAvatarCropImage(),
                    adjust: this.scope.locale.AccountAvatarAdjustImage(),
                    cancel: this.scope.locale.AccountAvatarCancelCrop(),
                    apply: this.scope.locale.AccountAvatarApplyCrop(),
                  },
                  aspectRatio: 1,
                  shape: 'round',
                }}
                resize={{ width: 512, height: 512, fit: 'cover', format: 'jpeg', quality: 90 }}
                onUploaded={uploaded => {
                  if (!uploaded.url) return this.handleAvatarUploadError();
                  $$formField.setValue(uploaded.url, propsBucket.disableNotifyChanged);
                  $$formField.handleBlur();
                  this.avatarPreview = uploaded.url;
                  this.profileMessage = this.scope.locale.AccountAvatarReady();
                }}
                onCleared={() => {
                  $$formField.setValue(null, propsBucket.disableNotifyChanged);
                  $$formField.handleBlur();
                  this.avatarPreview = this.$scopeBase.config.avatar.empty;
                }}
                onError={() => this.handleAvatarUploadError()}
              />
            );
          }}
        />
        <ZFormFieldPreset
          class="mt-4"
          name="name"
          render="start-input:formFieldInput"
          options={{ type: 'text' }}
        />
        <ZFormFieldPreset
          name="locale"
          render="start-input:formFieldInput"
          options={{ type: 'text', placeholder: 'en-us' }}
        />
        <ZFormFieldPreset
          name="tz"
          render="start-input:formFieldInput"
          options={{ type: 'text', placeholder: this.timezonePlaceholder }}
        />
      </ZForm>
    );
  }

  private _renderSecurityCard(current: AccountCurrent) {
    return (
      <VCard>
        <VCardTitle>{this.scope.locale.AccountSecurity()}</VCardTitle>
        <VCardText>
          {current.hasSimpleAuth ? this._renderChangePassword() : this._renderSetPassword(current)}
        </VCardText>
      </VCard>
    );
  }

  private _renderChangePassword() {
    return (
      <div class="d-flex flex-column ga-4">
        <p>{this.scope.locale.AccountChangePasswordHelp()}</p>
        <ZForm
          data={this.passwordDraft}
          schema={this.schemaPasswordChange}
          onSubmitData={data => this.submitPasswordChange(data)}
          onShowError={async () => {
            await this.$performCommand('start-commands:alert', {
              type: 'error',
              text: this.scope.locale.AccountPasswordChangeFailed(),
            });
          }}
          slotFooter={$$form => (
            <div class="d-flex justify-center">
              <VBtn disabled={$$form.formState.isSubmitting} type="submit" color="primary">
                {this.scope.locale.AccountChangePassword()}
              </VBtn>
            </div>
          )}
        />
      </div>
    );
  }

  private _renderSetPassword(current: AccountCurrent) {
    return (
      <form class="d-flex flex-column ga-4" onSubmit={event => event.preventDefault()}>
        <p>{this.scope.locale.AccountSetPasswordHelp()}</p>
        {current.eligibleEmailMasked && (
          <p>{this.scope.locale.AccountSetPasswordRecipient(current.eligibleEmailMasked)}</p>
        )}
        <VTextField
          label={this.scope.locale.AccountSetPasswordEmail()}
          type="email"
          autocomplete="email"
          v-model={this.passwordSetIssueDraft.email}
        />
        {this.passwordSetLinkMessage && (
          <VAlert density="compact" type="success">
            {this.passwordSetLinkMessage}
          </VAlert>
        )}
        {this.passwordSetLinkError && (
          <VAlert density="compact" type="error">
            {this.passwordSetLinkError}
          </VAlert>
        )}
        <VBtn
          disabled={this.passwordSetLinkSubmitting}
          type="submit"
          color="primary"
          nativeOnClick={() => void this.issuePasswordSetLink()}
        >
          {this.scope.locale.AccountSendPasswordSetLink()}
        </VBtn>
      </form>
    );
  }
}
