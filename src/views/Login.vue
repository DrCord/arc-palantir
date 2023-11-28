<template>
  <div class="login">
    <template v-if="sessionValid">
      <page-header title="Authenticating" />
      <div class="footer">
        <div v-if="loading" class="authMsg">
          <h4>{{ authMsg }}</h4>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="login-container">
        <div class="image-container">
          <div class="image"></div>
        </div>
        <div class="contents-container">
          <div class="header-container">
            <v-img
              class="logo"
              :src="logoUrl"
              alt="Arcimoto"
              contain
            />
            <h1>Palantir</h1>
            <div
              v-if="environment !== 'prod'"
              class="environment-indicator"
            >
              <span>{{ environment }}</span>
            </div>
          </div>
          <div class="login-form">
            <h2>Welcome Back</h2>
            <h3>Sign in to your account</h3>
            <vue-form
              v-show="!sessionValid"
              :state="formstate"
              @submit.prevent="onSubmit"
            >
              <validate tag="div" class="email">
                <v-text-field
                  id="email"
                  v-model="model.email"
                  label="Email"
                  name="email"
                  type="email"
                  required
                  outlined
                  autocomplete="username"
                  :error-messages="emailErrorMessages"
                  @change="checkEmailForEnvironment"
                >
                  <v-icon
                    v-if="emailErrorMessages"
                    slot="append"
                    class="field-error-icon"
                    large
                    color="red"
                  >mdi-alert</v-icon>
                </v-text-field>
              </validate>

              <validate tag="div" class="password">
                <v-text-field
                  id="password"
                  v-model="model.password"
                  label="Password"
                  required
                  name="password"
                  type="password"
                  outlined
                  :error-messages="passwordErrorMessages"
                  autocomplete="current-password"
                >
                  <v-icon
                    v-if="passwordErrorMessages"
                    slot="append"
                    class="field-error-icon"
                    large
                    color="red"
                  >mdi-alert</v-icon>
                </v-text-field>
              </validate>

              <v-btn
                block
                color="info"
                large
                type="submit"
                :disabled="formstate.$invalid || loading || emailEnvironmentMismatch"
              >Login</v-btn>
            </vue-form>
            <div class="forgot-password">
              <router-link to="forgot-password">Forgot Password?</router-link>
            </div>
            <div class="request-account">
              <div class="request-account-text">Don't have an account?</div>
              <div class="request-account-link">
                <router-link to="request-account">Request one</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <Modal v-if="newPassword.isModalVisible" id="finishAccountSetup" @close="closeModal">
      <div slot="header">
        <button type="button" class="btn-close" aria-label="Close modal" @click="closeModal">x</button>
        <h3>Complete Account Setup</h3>
      </div>
      <div slot="body">
        <div class="form-group">
          <label for="accountName">Name</label>
          <input
            id="accountName"
            v-model="newPassword.accountName"
            type="text"
            class="form-control"
          />
        </div>
        <div class="form-group new-password">
          <label for="newPassword">New Password</label>
          <v-text-field
            id="newPassword"
            v-model="newPassword.newPassword"
            dense
            hint="Requirements: Minimum length 8 characters; upper and lower case letter, number and special character."
            persistent-hint
            type="password"
            class="form-control"
            autocomplete="new-password"
          />
        </div>
        <div class="form-group confirm-new-password">
          <label for="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            v-model="newPassword.confirmPassword"
            type="password"
            class="form-control"
            autocomplete="new-password"
          />
        </div>
      </div>
      <div slot="footer">
        <button
          :disabled="!enableModalSubmit()"
          type="button"
          class="btn btn-success"
          aria-label="Submit"
          @click="submitNewPasswordModal"
        >Submit</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  LOCAL_STORAGE_APPLICATION,
  LOCAL_STORAGE_NAMESPACE
} from '@/lib/constants'
import { mapGetters } from 'vuex'
import {
  COGNITO_USER_POOL,
  ENVIRONMENT,
  OPERATOR_USERNAME,
  SESSION,
  S3_BASE_URL
} from '@/store/getter-types'
import {
  COGNITO_CREDENTIALS_SET,
  OPERATOR_USERNAME_SET,
  LOADING_END,
  LOADING_START,
  SESSION_ID_TOKEN_SET,
  SESSION_ACCESS_TOKEN_SET,
  SESSION_REFRESH_TOKEN_SET,
  SESSION_CREATION_SET,
  SESSION_CURRENT_EXPIRATION_SET,
  SESSION_MAX_EXPIRATION_SET,
  COGNITO_USER_SET
} from '@/store/mutation-types'

import Modal from '@/components/Modal.vue'
import PageHeader from '@/components/PageHeader.vue'

import ls from 'local-storage'
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
// fetch must be included for amazon-cognito-identity-js library to work outside the browser
global.fetch = require('node-fetch')

export default {
  name: 'Login',
  components: {
    Modal,
    PageHeader
  },
  props: {
    sessionValid: {
      default: false,
      type: Boolean
    },
    now: {
      default: null,
      type: Date
    },
    appMessages: {
      default: () => ({}),
      type: Object
    },
    nextUrl: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      emailEnvironmentMismatch: null,
      errors: [],
      formstate: {},
      model: {
        email: '',
        password: ''
      },
      messageType: 'info',
      msg: this.authMsg !== '' ? '' : 'Enter your username (email) and password to login.',
      newPassword: {
        isModalVisible: false,
        newPassword: '',
        confirmPassword: '',
        accountName: '',
        self: ''
      },
      authMsg: (typeof this.$route.params.authMsg !== 'undefined' && this.$route.params.authMsg !== '') ? this.$route.params.authMsg : ''
    }
  },
  computed: {
    ...mapGetters({
      environment: ENVIRONMENT,
      operatorUsername: OPERATOR_USERNAME,
      s3BaseUrl: S3_BASE_URL,
      session: SESSION,
      userPool: COGNITO_USER_POOL
    }),
    accessToken: {
      get () { return this.session.accessToken },
      set (val) { this.$store.commit(SESSION_ACCESS_TOKEN_SET, val) }
    },
    appAuthMsg () {
      return this.appMessages.authMsg
    },
    appMsg () {
      return this.appMessages.msg
    },
    cognitoUser: {
      get () { return this.$store.state.cognito.user },
      set (val) { this.$store.commit(COGNITO_USER_SET, val) }
    },
    credentials: {
      get () { return this.$store.state.cognito.credentials },
      set (val) { this.$store.commit(COGNITO_CREDENTIALS_SET, val) }
    },
    emailErrorMessages () {
      if (this.emailErrorStateInvalid) {
        return 'Email is invalid'
      }
      if (this.emailErrorStateRequired) {
        return 'Email is required'
      }
      if (this.emailEnvironmentMismatch) {
        return 'Email for a different ENV'
      }
      return null
    },
    emailErrorStateInvalid () {
      const { formstate } = this
      if (formstate.$untouched) {
        return null
      }
      const { email } = formstate
      if (!email || email.$untouched) {
        return null
      }
      if (email.$invalid && email.$error.email) {
        return true
      }
      return null
    },
    emailErrorStateRequired () {
      const { formstate } = this
      if (formstate.$untouched) {
        return null
      }
      const { email } = formstate
      if (!email || email.$untouched) {
        return null
      }
      if (email.$invalid && email.$error.required) {
        return true
      }
      return null
    },
    idToken: {
      get () { return this.session.idToken },
      set (val) { this.$store.commit(SESSION_ID_TOKEN_SET, val) }
    },
    isMobile () {
      return this.$isMobile()
    },
    loading: {
      get () { return this.$store.state.main.loading },
      set (val) {
        if (val) {
          this.$store.commit(LOADING_START)
        } else {
          this.$store.commit(LOADING_END)
        }
      }
    },
    logoUrl () {
      return `${this.s3BaseUrl}/images/arcimotoLogo.png`
    },
    isSessionTokenValid () {
      return this.session.isTokenValid
    },
    passwordErrorMessages () {
      if (this.passwordErrorStateRequired) {
        return 'Password is required'
      }
      return null
    },
    passwordErrorStateRequired () {
      const { formstate } = this
      if (formstate.$untouched) {
        return null
      }
      const { password } = formstate
      if (!password || password.$untouched) {
        return null
      }
      if (password.$invalid && password.$error.required) {
        return true
      }
      return null
    },
    refreshToken: {
      get () { return this.session.refreshToken },
      set (val) { this.$store.commit(SESSION_REFRESH_TOKEN_SET, val) }
    },
    sessionCreation: {
      get () { return this.session.creation },
      set (val) { this.$store.commit(SESSION_CREATION_SET, val) }
    },
    sessionCurrentExpiration: {
      get () { return this.session.currentExpiration },
      set (val) { this.$store.commit(SESSION_CURRENT_EXPIRATION_SET, val) }
    },
    sessionMaxExpiration: {
      get () { return this.session.maxExpiration },
      set (val) { this.$store.commit(SESSION_MAX_EXPIRATION_SET, val) }
    },
    sessionTokenValidityLength () {
      return this.session.validityLength
    },
    username: {
      get () { return this.operatorUsername },
      set (val) { this.$store.commit(OPERATOR_USERNAME_SET, val) }
    }
  },
  watch: {
    appMsg (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('toast', newVal)
      }
    },
    appAuthMsg (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.authMsg = newVal
        if (newVal === 'Session invalidated, user logged out successfully.') {
          this.formstate._reset()
          this.loading = false
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.idToken !== '') {
        this.setAuthMsgSuccess()
      }
    },
    checkEmailForEnvironment (email) {
      const { environment } = this
      const emailMatchesDev = email.match(/\+dev/)
      const emailMatchesStaging = email.match(/\+staging/)
      if (environment === 'prod') {
        if (emailMatchesDev || emailMatchesStaging) {
          this.emailEnvironmentMismatch = true
        } else {
          this.emailEnvironmentMismatch = false
        }
      } else if (environment === 'dev') {
        if (!emailMatchesDev || emailMatchesStaging) {
          this.emailEnvironmentMismatch = true
        } else {
          this.emailEnvironmentMismatch = false
        }
      } else if (environment === 'staging') {
        if (emailMatchesDev || !emailMatchesStaging) {
          this.emailEnvironmentMismatch = true
        } else {
          this.emailEnvironmentMismatch = false
        }
      }
    },
    showModal () {
      this.newPassword.isModalVisible = true
    },
    closeModal () {
      this.newPassword.isModalVisible = false
    },
    enableModalSubmit () {
      if (
        this.newPassword.accountName === '' ||
        this.newPassword.newPassword === '' ||
        this.newPassword.confirmPassword === ''
      ) {
        return false
      }
      if (this.newPassword.newPassword !== this.newPassword.confirmPassword) {
        return false
      }
      return true
    },
    submitNewPasswordModal () {
      this.closeModal()
      this.completeNewPasswordChallenge()
    },
    onSubmit () {
      const { formstate } = this
      if (!formstate.$invalid) {
        this.loading = true
        this.authMsg = ''
        const { login, model } = this
        const { password } = model
        const username = model.email
        this.credentials = { username, password }
        login(this)
      }
    },
    login (self) {
      const userData = {
        Username: this.credentials.username,
        Pool: this.userPool
      }
      // initialize cognito user object with AWS user pool
      this.cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

      const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: this.credentials.username,
        Password: this.credentials.password
      })

      this.cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess (result) {
          self.idToken = result.getIdToken().getJwtToken()
          self.accessToken = result.getAccessToken().getJwtToken()
          self.refreshToken = result.getRefreshToken().getToken()
          const date = new Date()
          self.sessionCreation = date.getTime()
          self.sessionCurrentExpiration = date.getTime() + self.sessionTokenValidityLength
          self.sessionMaxExpiration = date.getTime() + 1000 * 60 * 60 // 1 hour is AWS hard limit
          // save session data to localStorage so it is accessible during navigation when state is not
          ls.set(`${LOCAL_STORAGE_NAMESPACE}.${LOCAL_STORAGE_APPLICATION}.session`, {
            idToken: self.idToken,
            accessToken: self.accessToken,
            refreshToken: self.refreshToken,
            creation: self.sessionCreation,
            currentExpiration: self.sessionCurrentExpiration,
            maxExpiration: self.sessionMaxExpiration
          })
          const awsUsername = result.getAccessToken().payload.username
          ls.set(`${LOCAL_STORAGE_NAMESPACE}.${LOCAL_STORAGE_APPLICATION}.username`, awsUsername)
          // remove user credentials from state for safety now that the jwt is available in session
          self.removeUserCredentials()
          self.setAuthMsgSuccess()
          // setting username triggers the Application to fetch the remaining user data needed
          self.username = awsUsername
          self.loading = false
        },
        onFailure (err) {
          const config = {
            msg: '',
            icon: 'error',
            duration: null,
            className: 'toasted-error'
          }
          if (err.code === 'PasswordResetRequiredException') {
            config.msg = `${err.message}. Redirecting to forgot password page.`
            self.$emit('toast', config)
            self.$router.push({
              name: 'forgot-password',
              params: {
                incomingUserEmail: self.model.email
              }
            })
          } else {
            config.msg = err.message
            self.$emit('toast', config)
            self.loading = false
          }
        },
        newPasswordRequired (userAttributes, requiredAttributes) {
          // User was signed up by an admin and must provide new password and required attributes, if any, to complete authentication.

          // userAttributes: object, which is the user's current profile. It will list all attributes that are associated with the user.
          // Required attributes according to schema, which don’t have any values yet, will have blank values.
          // requiredAttributes: list of attributes that must be set by the user along with new password to complete the sign-in.

          // Get these details and call
          // newPassword: password that user has given
          // attributesData: object with key as attribute name and value that the user has given.
          // this.cognitoUser.completeNewPasswordChallenge(newPassword, attributesData, this)

          // save instance of 'this' to use to call cognitoUser.completeNewPasswordChallenge after user gives info via modal
          self.newPassword.self = this
          self.showModal()
        },
        mfaSetup (challengeName, challengeParameters) {
          self.cognitoUser.associateSoftwareToken(this)
        },
        associateSecretCode (secretCode) {
          const challengeAnswer = prompt('Please input the TOTP code.', '')
          self.cognitoUser.verifySoftwareToken(challengeAnswer, 'My TOTP device', this)
        },
        selectMFAType (challengeName, challengeParameters) {
          // valid values for mfaType is "SMS_MFA", "SOFTWARE_TOKEN_MFA"
          const mfaType = prompt('Please select the MFA method.', '')
          self.cognitoUser.sendMFASelectionAnswer(mfaType, this)
        },
        totpRequired (secretCode) {
          const challengeAnswer = prompt('Please input the TOTP code.', '')
          self.cognitoUser.sendMFACode(challengeAnswer, this, 'SOFTWARE_TOKEN_MFA')
        },
        mfaRequired (codeDeliveryDetails) {
          const verificationCode = prompt('Please input verification code', '')
          self.cognitoUser.sendMFACode(verificationCode, this)
        }
      })
    },
    completeNewPasswordChallenge () {
      const attributesData = {
        name: this.newPassword.accountName
      }
      this.cognitoUser.completeNewPasswordChallenge(this.newPassword.newPassword, attributesData, this.newPassword.self)
      this.loading = false
    },
    setAuthMsgSuccess () {
      this.authMsg = 'Authenticating and loading data...'
    },
    removeUserCredentials () {
      this.credentials = { username: '', password: '' }
    }
  }
}
</script>

<style lang="scss">
#app {
  .login-container {
    padding: 0;
    .image-container {
      .image {
        background-position: right;
        background-size: 331px 233px;
        background-image: url('https://cdn.arcimoto.com/images/fuv_hawaii.jpg');
        height: 120px;
        width: 100%;
      }
    }
    .contents-container {
      padding: 10px 10px 0;
      .header-container {
        display: flex;
        position: relative;
        .logo {
          height: auto;
          max-width: 90px;
          width: 90px;
        }
        h1 {
          color: var(--v-arcimoto-blue-base);
          font-family: "Roboto", Helvetica, Arial, sans-serif;
          font-size: 1.2rem;
          line-height: 1.5rem;
          margin: 0;
          padding-left: 10px;
          position: relative;
          top: 1px;
          text-align: left;
          text-shadow: 1px 1px 1px #333;
          text-transform: uppercase;
        }
        .environment-indicator {
          margin: 0;
          padding-left: 20px;
          position: relative;
          top: 3px;
          span {
            font-family: "Roboto", Helvetica, Arial, sans-serif;
            font-size: 1.0rem;
            font-weight: bold;
            line-height: 1.5rem;
            text-align: left;
            text-transform: uppercase;
          }
        }
      }
    }
  }
  .request-account {
  text-align: center;
  margin-top: 2rem;
  .request-account-text{
    color: #3f3f41;
  }
  }
  .login-form {
    margin: 0 auto;
    padding: 20px 5px 0;
    width: 300px;
    h2 {
      color: #666;
      font-size: 0.9rem;
      margin: 10px 0 5px;
      text-align: left;
      text-transform: uppercase;
    }
    h3 {
      text-align: left;
      font-size: 1.8rem;
      line-height: 2.0rem;
      margin: 10px 0 0;
    }
    form {
      margin: 15px 0 0;
      max-width: initial;
      overflow: hidden;
      padding: 0;
      width: 100%;
      .v-icon {
        &.field-error-icon {
          top: -5px;
        }
      }
      .email,
      .password {
        margin-top: 5px;
      }
      .v-btn {
        margin: 0;
      }
    }
    .forgot-password {
      clear: both;
      font-size: 1.0rem;
      margin-top: 10px;
      padding-left: 10px;
    }
  }
}

@media only screen and (min-width: 332px) and (max-width: 383px) {
  #app {
    .login-container {
      .image-container {
        .image {
          background-size: 383px 270px;
        }
      }
    }
  }
}

@media only screen and (min-width: 383px) and (max-width: 414px) {
  #app {
    .login-container {
      .image-container {
        .image {
          background-size: 414px 292px;
        }
      }
    }
  }
}

@media only screen and (min-width: 414px) and (max-width: 504px) {
  #app {
    .login-container {
      .image-container {
        .image {
          background-size: 504px 355px;
        }
      }
    }
  }
}

@media only screen and (min-width: 505px) and (max-width: 554px) {
  #app {
    .login-container {
      .image-container {
        .image {
          background-size: 554px 391px;
        }
      }
    }
  }
}

@media only screen and (min-width: 555px) and (max-width: 605px) {
  #app {
    .login-container {
      .image-container {
        .image {
          background-size: 605px 426px;
        }
      }
    }
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  #app {
    .login-container {
      display: flex;
      padding: 20px;
      .image-container {
        .image {
          border-radius: 10px;
          background-size: 454px 320px;
          height: 320px;
          width: 300px;
        }
      }
      .contents-container {
        padding: 0 0 0 20px;
        .login-form {
          width: 280px;
          h2 {
            margin-bottom: 0;
            margin-top: 0;
          }
          h3 {
            font-size: 1.5rem;
            margin-top: 5px;
          }
          form {
            margin-top: 5px;
            .password {
              margin-top: 0;
            }
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 700px) {
  #app {
    .login-container {
      .image-container {
        .image {
          background-size: 504px 355px;
          height: 355px;
          width: 350px;
        }
      }
      .contents-container {
        .header-container {
          .logo {
            max-width: 120px;
            width: 120px;
          }
          h1 {
            top: 5px;
          }
          .environment-indicator {
            top: 7px;
          }
        }
        .login-form {
          width: 320px;
          h2 {
            margin-bottom: 0;
            margin-top: 0;
          }
          h3 {
            font-size: 1.5rem;
            margin-top: 5px;
          }
          form {
            margin-top: 5px;
            .v-text-field {
              .v-messages {
                min-height: 19px;
                &.error--text {
                  font-size: 1.2rem;
                  .v-messages__message {
                    line-height: 1.2rem;
                  }
                }
              }
            }
            .email {
              margin-top: 10px;
            }
            .password {
              margin-top: 5px;
            }
          }
        }
      }
    }
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  #app {
    .login-container {
      .image-container {
        .image {
          background-size: 604px 426px;
          width: 390px;
        }
      }
    }
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  #app {
    .login-container {
      .image-container {
        .image {
          background-size: 604px 426px;
          height: 426px;
          width: 426px;
        }
      }
      .contents-container {
        padding-left: 100px;
        padding-top: 10px;
        .header-container {
          .logo {
            max-width: 160px;
            width: 160px;
          }
          h1 {
            font-size: 1.5rem;
            top: 13px;
          }
          .environment-indicator {
            top: 13px;
            span {
              font-size: 1.3rem;
            }
          }
        }
        .login-form {
          width: 350px;
          h2 {
            margin-bottom: 5px;
            margin-top: 10px;
          }
          h3 {
            font-size: 1.9rem;
            margin-top: 15px;
          }
          form {
            margin-top: 15px;
            label {
              font-size: 1.5rem;
            }
            input {
              font-size: 1.3rem;
            }
            .password {
              margin-bottom: 15px;
            }
            .v-text-field {
              .v-messages {
                min-height: 22px;
                &.error--text {
                  font-size: 1.4rem;
                  .v-messages__message {
                    line-height: 1.4rem;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  #app {
    .login-container {
      .image-container {
        .image {
          background-size: 1008px 710px;
          height: 710px;
          width: 650px;
        }
      }
      .contents-container {
        padding-top: 50px;
        .login-form {
          h3 {
            font-size: 2.2rem;
            line-height: 2.4rem;
            width: 300px;
          }
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
.form-field {
  margin: 10px 0;
}
.form-field label {
  margin-right: 10px;
}
#app textarea {
  font-size: 12px;
  height: 290px;
  width: 650px;
}
@media (max-width: 768px) {
  #app textarea {
    height: 380px;
    width: 450px;
  }
}
#app .msg {
  margin: 40px auto;
  text-align: center;
}
#password_prompt {
  position: fixed;
  border: 1px solid #333;
  padding: 16px;
  background: white;
  z-index: 99999;
}
.login-form {
  .forgot-password {
    margin-top: 5px;
  }
  button {
    float: right;
  }
}
.container {
  margin: 20px auto;
  text-align: center;
}
</style>

<style lang="scss">
#app {
  #finishAccountSetup {
    .modal-header {
      padding-bottom: 0;
      h3 {
        margin-bottom: 0;
        padding-bottom: 0;
        padding-top: 10px;
      }
    }
    .modal-footer {
      padding-top: 0;
    }
    .new-password {
      margin-bottom: 70px;
    }
    .confirm-new-password {
      margin-bottom: 0;
    }
    .v-text-field__details {
      .v-messages {
        font-size: 0.9rem;
        div {
          line-height: 1rem;
          hyphens: none;
        }
      }
      margin-top: 20px;
      max-width: 250px;
    }
  }
}
</style>
