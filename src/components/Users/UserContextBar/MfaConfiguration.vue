<template>
  <div class="user-mfa-configuration-container">
    <h3>MFA Configuration</h3>
    <h4 class="mfa-status">
      MFA {{ mfaEnabled ? 'Enabled' : 'Disabled' }}
      <v-icon v-if="mfaEnabled">mdi-lock</v-icon>
      <v-icon v-else>mdi-lock-off</v-icon>
    </h4>
    <h4 class="preferred-mfa-settting">Preferred: {{ preferredMfaSetting }}</h4>
    <div class="controls">
      <div class="sms">
        <h5>SMS (Text Message)</h5>
        <div v-if="isProductionEnvironment" class="prod">
          <v-switch
            v-model="mfaSmsEnabledLocal"
            label="SMS MFA Enabled"
            readonly
            hint="SMS MFA Always Enabled In Production"
            persistent-hint
          />
        </div>
        <div v-else class="not-prod">
          <v-switch
            v-model="mfaSmsEnabledLocal"
            label="SMS MFA Enabled"
          />
        </div>
      </div>
      <div class="totp">
        <h5>TOTP (Software Token)</h5>
        <div v-if="operatorIsUser">
          <v-tooltip bottom>
            <template #activator="{ on }">
              <div class="form-item-container">
                <v-switch
                  v-if="!enableTotpProcessing"
                  v-model="mfaTotpEnabled"
                  label="TOTP MFA Enabled"
                  name="totp-enabled"
                  :readonly="totpTokenProcessing"
                />
                <v-switch
                  v-else
                  v-model="enableTotpProcessing"
                  label="TOTP MFA Enabled"
                  name="totp-enabled"
                  readonly
                  loading
                />
                <v-icon v-on='on'>mdi-information</v-icon>
              </div>
            </template>
            <span>To enable TOTP MFA you must have created,<br>
            associated and verified a software token with<br>
            a Multi-Factor Authentication app on your<br>
            personal device, like <a target="_blank" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US&gl=US">Google Authenticator</a>
            </span>
          </v-tooltip>
          <div v-if="enableTotpProcessing" class="verify-existing">
            <h6>Re-Enable by Verifying Existing Token</h6>
            <p><span>Important</span>To setup a new software token or replace your existing software token cancel and then use the button to start the new TOTP token process.</p>
            <vue-form :state="formstateVerifyExisting">
              <validate
                tag="div"
                class="user-code"
                :custom="{
                  excludedCharactersValidator: function (value, attrValue, vnode) {
                    // only allows numbers
                    return (/[0-9]/.test(value))
                  }
                }"
              >
                <v-text-field
                  v-model="model.userCode"
                  required
                  minlength="6"
                  maxlength="6"
                  name="totpTokenVerifyUserCode"
                  label="User Code"
                  dense
                  hide-details
                />
                <field-messages name="totpTokenVerifyUserCode" class="validation-msgs-container">
                  <div
                    v-show="formstateVerifyExisting.totpTokenVerifyUserCode && formstateVerifyExisting.totpTokenVerifyUserCode.$dirty"
                    slot="required"
                  >Required field
                  </div>
                  <div
                    v-show="formstateVerifyExisting.totpTokenVerifyUserCode && formstateVerifyExisting.totpTokenVerifyUserCode.$dirty"
                    slot="minlength"
                  >Must be exactly 6 numbers
                  </div>
                  <div
                    v-show="formstateVerifyExisting.totpTokenVerifyUserCode && formstateVerifyExisting.totpTokenVerifyUserCode.$dirty"
                    slot="excludedCharactersValidator"
                  >Can only include numbers
                  </div>
                </field-messages>
              </validate>
              <validate tag="div" class="friendly-device-name">
                <v-text-field
                  v-model="model.friendlyDeviceName"
                  required
                  name="totpTokenVerifyFriendlyDeviceName"
                  label="Friendly Device Name"
                  maxlength="25"
                  dense
                  hide-details
                />
                <field-messages name="totpTokenVerifyFriendlyDeviceName" class="validation-msgs-container">
                  <div
                    v-show="formstateVerifyExisting.totpTokenVerifyFriendlyDeviceName && formstateVerifyExisting.totpTokenVerifyFriendlyDeviceName.$dirty"
                    slot="required"
                  >Required field
                  </div>
                </field-messages>
              </validate>
            </vue-form>
            <v-btn
              color="red"
              @click="totpTokenVerifyExistingCancel"
            ><v-icon>mdi-cancel</v-icon></v-btn>
            <v-btn
              :disabled="formstateVerifyExisting.$invalid"
              color="success"
              @click="userMfaTotpTokenVerifyExisting"
            >Verify Token</v-btn>
          </div>
        </div>
        <div v-else>
          <v-switch
            v-model="mfaTotpEnabled"
            label="TOTP MFA Enabled"
            name="totp-enabled"
            :readonly="!operatorIsUser && !mfaTotpEnabledLocal"
            hint="A user must enable TOTP MFA for themselves"
            :persistent-hint="!operatorIsUser && !mfaTotpEnabledLocal"
          />
        </div>
        <div v-if="operatorIsUser" class="token">
          <v-btn
            v-if="!totpTokenProcessing && !enableTotpProcessing"
            color="info"
            @click="totpTokenProcessing = true"
          >Start TOTP New Token Process
          </v-btn>
          <div v-if="totpTokenProcessing" class="associate">
            <h5>TOTP MFA Setup
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <span>
                    <v-icon color="red" v-on='on'>mdi-alert</v-icon>
                  </span>
                </template>
                <span>Creating a new TOTP token invalidates<br>any previous TOTP tokens,<br>be sure to complete the entire process.<br>Typically, this is done only once per friendly device.</span>
              </v-tooltip>
            </h5>
            <h5>Instructions</h5>
            <ol class="instructions">
              <li>Download an authenticator app onto your personal device. We recommend <a target="_blank" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US&gl=US">Google Authenticator</a>.</li>
              <li>Click "Setup New Token" to generate a QR code with your software token secret code.</li>
              <li>Open the authenticator app on your personal device and add a new entry via scanning the QR code.</li>
              <li>In the Verify Token form:
                <ul class="sub">
                  <li>Input a time-based (lasts 1 minute) 6 digit "user code" from the authenticator app.</li>
                  <li>Input a "friendly device name" which can be any sensible string that describes the personal device you associated the token with. Examples: "PersonalPhone", "WorkPhone" or "JamiesPhone"</li>
                </ul>
              </li>
              <li>Click "Verify Token &amp; Enable".</li>
            </ol>
            <v-btn
              v-if="!totpTokenQrCode"
              color="red"
              @click="totpTokenProcessing = false"
            ><v-icon>mdi-cancel</v-icon></v-btn>
            <v-btn
              v-if="!totpTokenQrCode"
              color="info"
              hint="This creates and associates a new TOTP software token, replacing any existing TOTP tokens."
              @click="userMfaTotpTokenAssociate"
            >Setup New Token</v-btn>
            <div v-if="totpTokenQrCode" class="qr-code">
              <p>Scan this QR Code with an authenticator app on your personal device to setup the software token association, then verify the token below.</p>
              <img :src="totpTokenQrCode" />
            </div>
          </div>
          <div v-if="totpTokenQrCode" class="verify">
            <h5>Verify Token</h5>
            <vue-form :state="formstateVerifyNew">
              <validate
                tag="div"
                class="user-code"
                :custom="{
                  excludedCharactersValidator: function (value, attrValue, vnode) {
                    // only allows uppercase/lowercase letters, numbers, space and dash
                    return (/[0-9]/.test(value))
                  }
                }"
              >
                <v-text-field
                  v-model="model.userCode"
                  required
                  minlength="6"
                  maxlength="6"
                  name="totpTokenVerifyUserCode"
                  label="User Code"
                  dense
                  hide-details
                />
                <field-messages name="totpTokenVerifyUserCode" class="validation-msgs-container">
                  <div
                    v-show="formstateVerifyNew.totpTokenVerifyUserCode && formstateVerifyNew.totpTokenVerifyUserCode.$dirty"
                    slot="required"
                  >Required field
                  </div>
                  <div
                    v-show="formstateVerifyNew.totpTokenVerifyUserCode && formstateVerifyNew.totpTokenVerifyUserCode.$dirty"
                    slot="minlength"
                  >Must be exactly 6 numbers
                  </div>
                  <div
                    v-show="formstateVerifyNew.totpTokenVerifyUserCode && formstateVerifyNew.totpTokenVerifyUserCode.$dirty"
                    slot="excludedCharactersValidator"
                  >Can only include numbers
                  </div>
                </field-messages>
              </validate>
              <validate tag="div" class="friendly-device-name">
                <v-text-field
                  v-model="model.friendlyDeviceName"
                  required
                  name="totpTokenVerifyFriendlyDeviceName"
                  label="Friendly Device Name"
                  maxlength="25"
                  dense
                  hide-details
                />
                <field-messages name="totpTokenVerifyFriendlyDeviceName" class="validation-msgs-container">
                  <div
                    v-show="formstateVerifyNew.totpTokenVerifyFriendlyDeviceName && formstateVerifyNew.totpTokenVerifyFriendlyDeviceName.$dirty"
                    slot="required"
                  >Required field
                  </div>
                </field-messages>
              </validate>
            </vue-form>
            <v-btn
              :disabled="formstateVerifyNew.$invalid"
              color="success"
              @click="userMfaTotpTokenVerifyNew"
            >Verify Token &amp; Enable</v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  USER_MFA_SMS_DISABLE,
  USER_MFA_SMS_ENABLE,
  USER_MFA_TOTP_DISABLE,
  USER_MFA_TOTP_ENABLE,
  USER_MFA_TOTP_TOKEN_ASSOCIATE,
  USER_MFA_TOTP_TOKEN_VERIFY
} from '@/store/action-types'
import {
  ENVIRONMENT,
  OPERATOR_IS_USER,
  SESSION_ACCESS_TOKEN,
  SESSION_TOTP_TOKEN_SECRET_CODE,
  USER_EMAIL,
  USER_MFA,
  USER_MFA_ENABLED
} from '@/store/getter-types'

import QRCode from 'qrcode'

export default {
  name: 'MfaConfiguration',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      enableTotpProcessing: false,
      formstateVerifyExisting: {},
      formstateVerifyNew: {},
      model: {
        userCode: null,
        friendlyDeviceName: null
      },
      mfaSmsEnabledLocal: null,
      mfaTotpEnabledLocal: null,
      tokenVerified: null,
      totpTokenProcessing: false,
      totpTokenQrCode: null,
      userEmail: null,
      userMfa: {}
    }
  },
  computed: {
    ...mapGetters({
      environment: ENVIRONMENT,
      operatorIsUserGet: OPERATOR_IS_USER,
      sessionAccessToken: SESSION_ACCESS_TOKEN,
      sessionTotpTokenSecretCode: SESSION_TOTP_TOKEN_SECRET_CODE,
      userEmailGet: USER_EMAIL,
      userMfaEnabledGet: USER_MFA_ENABLED,
      userMfaGet: USER_MFA
    }),
    mfaEnabled () {
      return this.username ? this.userMfaEnabledGet(this.username) : null
    },
    mfaSmsEnabled: {
      get () {
        return (this.mfaOptions.length !== 0 || this.userMfaSettingList.includes('SMS_MFA'))
      },
      set (val) {
        this.mfaSmsEnabledLocal = val
      }
    },
    mfaTotpEnabled: {
      get () {
        return this.userMfaSettingList.includes('SOFTWARE_TOKEN_MFA')
      },
      set (val) {
        if (val) {
          this.enableTotpProcessing = true
        } else {
          this.mfaTotpEnabledLocal = val
        }
      }
    },
    mfaOptions () {
      // deprecated property that can only control SMS MFA
      if (!this.userMfa || this.userMfa.mfaOptions === null || this.userMfa.mfaOptions === undefined) {
        return []
      }
      return this.userMfa.mfaOptions
    },
    preferredMfaSetting () {
      if (!this.userMfa || this.userMfa.preferredMfaSetting === null) {
        return 'None'
      }
      if (this.userMfa.preferredMfaSetting === 'SMS_MFA') {
        return 'SMS'
      }
      if (this.userMfa.preferredMfaSetting === 'SOFTWARE_TOKEN_MFA') {
        return 'TOTP'
      }
      return this.userMfa.preferredMfaSetting
    },
    userMfaSettingList () {
      if (!this.userMfa ||
          !this.userMfa.userMfaSettingList ||
          !this.userMfa.userMfaSettingList.length) {
        return []
      }
      return this.userMfa.userMfaSettingList
    },
    isProductionEnvironment () {
      return this.environment === 'prod'
    },
    operatorIsUser () {
      return this.username ? this.operatorIsUserGet(this.username) : null
    }
  },
  watch: {
    mfaSmsEnabledLocal (newVal, oldVal) {
      if (newVal !== this.mfaSmsEnabled && newVal !== oldVal) {
        if (!newVal) {
          this.userMfaSmsDisable()
        } else {
          this.userMfaSmsEnable()
        }
      }
    },
    mfaTotpEnabledLocal (newVal, oldVal) {
      if (newVal !== this.mfaTotpEnabled && newVal !== oldVal) {
        if (!newVal) {
          this.userMfaTotpDisable()
        } else {
          this.userMfaTotpEnable()
        }
      }
    },
    sessionTotpTokenSecretCode (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        QRCode.toDataURL(this.generateUri(newVal))
          .then(url => {
            this.totpTokenQrCode = url
          })
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      userMfaSmsDisableAction: USER_MFA_SMS_DISABLE,
      userMfaSmsEnableAction: USER_MFA_SMS_ENABLE,
      userMfaTotpTokenAssociateAction: USER_MFA_TOTP_TOKEN_ASSOCIATE,
      userMfaTotpDisableAction: USER_MFA_TOTP_DISABLE,
      userMfaTotpEnableAction: USER_MFA_TOTP_ENABLE,
      userMfaTotpTokenVerifyAction: USER_MFA_TOTP_TOKEN_VERIFY
    }),
    init () {
      this.userMfaSet()
      this.userEmail = this.userEmailGet(this.username)
      this.mfaSmsEnabledLocal = this.mfaSmsEnabled
      this.mfaTotpEnabledLocal = this.mfaTotpEnabled
    },
    generateUri (secret) {
      const { userEmail } = this
      const type = 'totp'
      const label = userEmail
      const issuer = 'Arcimoto'
      let uri = `otpauth://${type}/${encodeURIComponent(label)}?secret=${secret}`
      if (issuer !== '') {
        uri += `&issuer=${encodeURIComponent(issuer)}`
      }
      return uri
    },
    async userMfaSmsDisable () {
      const componentSelf = this
      const { username, userMfaSmsDisableAction } = this
      const payload = {
        username,
        body: {}
      }
      await userMfaSmsDisableAction({ componentSelf, payload })
      this.userMfaSet()
      this.$emit('user-mfa-sms-disable-complete')
    },
    async userMfaSmsEnable () {
      const componentSelf = this
      const { username, userMfaSmsEnableAction } = this
      const payload = {
        username,
        body: {}
      }
      await userMfaSmsEnableAction({ componentSelf, payload })
      this.userMfaSet()
      this.$emit('user-mfa-sms-enable-complete')
    },
    async userMfaTotpDisable () {
      const componentSelf = this
      const { username, userMfaTotpDisableAction } = this
      const payload = {
        username,
        body: {}
      }
      await userMfaTotpDisableAction({ componentSelf, payload })
      this.userMfaSet()
      this.$emit('user-mfa-totp-disable-complete')
    },
    async userMfaTotpEnable () {
      const componentSelf = this
      const { username, userMfaTotpEnableAction } = this
      const payload = {
        username,
        body: {}
      }
      await userMfaTotpEnableAction({ componentSelf, payload })
      this.userMfaSet()
      this.$emit('user-mfa-totp-enable-complete')
    },
    async userMfaTotpTokenAssociate () {
      const componentSelf = this
      const { sessionAccessToken, username, userMfaTotpTokenAssociateAction } = this
      const payload = {
        username,
        body: {
          access_token: sessionAccessToken
        }
      }
      await userMfaTotpTokenAssociateAction({ componentSelf, payload })
      this.userMfaSet()
      this.$emit('user-mfa-totp-token-associate-complete')
    },
    userMfaTotpTokenVerifyExisting () {
      this.userMfaTotpTokenVerify(true)
    },
    userMfaTotpTokenVerifyNew () {
      this.userMfaTotpTokenVerify(false)
    },
    async userMfaTotpTokenVerify (tokenExists) {
      const componentSelf = this
      const { model, sessionAccessToken, username, userMfaTotpTokenVerifyAction } = this
      const payload = {
        username,
        body: {
          access_token: sessionAccessToken,
          user_code: model.userCode,
          friendly_device_name: model.friendlyDeviceName
        }
      }
      await userMfaTotpTokenVerifyAction({ componentSelf, payload })
      this.userMfaSet()
      if (this.tokenVerified) {
        if (tokenExists) {
          this.totpTokenExistingProcessReset()
          this.enableTotpProcessing = false
        } else {
          this.totpTokenNewProcessReset()
          this.totpTokenProcessing = false
        }
        this.mfaTotpEnabledLocal = true
        this.$emit('user-mfa-totp-token-verify-complete')
      } else {
        this.$emit('user-mfa-totp-token-verify-failed')
      }
    },
    totpTokenExistingProcessReset () {
      this.model.userCode = null
      this.model.friendlyDeviceName = null
      this.formstateVerifyExisting._reset()
    },
    totpTokenNewProcessReset () {
      this.model.userCode = null
      this.model.friendlyDeviceName = null
      this.totpTokenQrCode = null
      this.formstateVerifyNew._reset()
    },
    totpTokenVerifyExistingCancel () {
      this.enableTotpProcessing = false
      this.mfaTotpEnabled = false
      this.model.userCode = null
      this.model.friendlyDeviceName = null
      this.formstateVerifyExisting._reset()
    },
    userMfaSet () {
      this.userMfa = this.userMfaGet(this.username)
    }
  }
}
</script>

<style lang="scss">
#app {
  .user-mfa-configuration-container {
    padding-bottom: 50px;
    h5 {
      font-size: 1.1rem;
      margin-top: 20px;
    }
    ul {
      list-style-type: none;
      padding-left: 0;
      &.sub {
        padding-left: 10px;
      }
      li {
        font-weight: normal;
        .heading {
          display: inline-block;
          font-weight: bold;
          &::after {
            content: ":";
            padding-right: 5px;
          }
        }
        &.mfa-sms-options {
          margin-top: 10px;
        }
      }
    }
    .v-input--switch {
      label {
        top: 4px;
      }
    }
    .qr-code {
      margin-bottom: 20px;
      margin-top: 20px;
    }
    .form-item-container {
      display: flex;
    }
    .user-code {
      padding-top: 7px;
    }
    .mfa-status {
      margin-bottom: 5px;
      i {
        vertical-align: baseline;
      }
    }
    .preferred-mfa-settting {
      font-size: 1rem;
      margin-bottom: 0;
    }
    .instructions {
      font-weight: normal;
      ul {
        list-style-type: disc;
      }
    }
    .v-icon.mdi-information {
      margin-left: 3px;
      margin-top: -2px;
    }
    button + button {
      margin-left: 20px;
    }
    .verify-existing {
      p {
        font-weight: normal;
        span {
          color: red;
          font-weight: bold;
          text-transform: uppercase;
          &:after {
            content: ":";
            padding-right: 3px;
          }
        }
      }
    }
  }
}
</style>
