<template>
  <div class="forgot-password">
    <page-header title="Forgot Password" />
    <div class="content-container">
      <h3 v-if="!forgotPasswordInit">Enter your email to begin the process to reset your password</h3>
      <h3 v-if="forgotPasswordInit">Retrieve and input the verification code that was just sent to you</h3>
      <h3 v-if="forgotPasswordInit">Input and confirm a new password below</h3>
      <h3 v-if="forgotPasswordInit">Submit the form to reset your password</h3>

      <div class="start-process-container">
        <v-form @submit.prevent="forgotPassword">
          <v-text-field
            id="email"
            v-model="email"
            label="Email"
            type="email"
            required
            outlined
            hide-details
            autocomplete="username"
          />
          <v-btn
            v-show="!forgotPasswordInit"
            id="startForgotPassword"
            type="submit"
            color="info"
            large
          >Start Forgot Password Process</v-btn>
        </v-form>
      </div>
      <vue-form v-show="forgotPasswordInit" :state="formstate" @submit.prevent="onSubmit">
        <input
          :value="username"
          type="text"
          hidden
          readonly
          class="form-control"
          autocomplete="username"
        />

        <validate tag="div" class="verification-code form-field">
          <v-text-field
            id="verification-code"
            v-model="model.verificationCode"
            label="Verification Code"
            required
            name="verification-code"
            type="text"
            hide-details
            outlined
          />

          <field-messages name="verification-code" show="$dirty && $touched">
            <div slot="required">Verification Code is a required field</div>
          </field-messages>
        </validate>

        <validate tag="div" class="new-password form-field">
          <v-text-field
            id="new-password"
            v-model="model.newPassword"
            label="New Password"
            required
            name="new-password"
            type="password"
            autocomplete="new-password"
            outlined
            hide-details
          />

          <field-messages name="new-password" show="$dirty && $touched">
            <div slot="required">New Password is a required field</div>
          </field-messages>
        </validate>

        <validate tag="div" class="new-password-confirm form-field">
          <v-text-field
            id="new-password-confirm"
            v-model="model.newPasswordConfirm"
            label="Confirm New Password"
            required
            name="new-password-confirm"
            type="password"
            autocomplete="new-password"
            hide-details
            outlined
          />

          <field-messages name="new-password" show="$dirty && $touched">
            <div slot="required">Confirm New Password is a required field</div>
          </field-messages>
        </validate>

        <v-btn
          :disabled="formstate.$invalid || model.newPassword !== model.newPasswordConfirm"
          type="submit"
          large
          color="success"
        >Reset Password</v-btn>
      </vue-form>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import {
  COGNITO_USER_POOL
} from '@/store/getter-types'
import {
  COGNITO_CREDENTIALS_USERNAME_SET,
  COGNITO_USER_SET
} from '@/store/mutation-types'

import PageHeader from '@/components/PageHeader.vue'

const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
// fetch is needed for amazon-cognito-identity-js library to work
global.fetch = require('node-fetch')

export default {
  name: 'ForgotPassword',
  components: {
    PageHeader
  },
  props: {
    incomingUserEmail: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      email: '',
      formstate: {},
      model: {
        verificationCode: '',
        newPassword: '',
        newPasswordConfirm: ''
      },
      forgotPasswordInit: false
    }
  },
  computed: {
    ...mapGetters({
      userPool: COGNITO_USER_POOL
    }),
    cognitoUser: {
      get () { return this.$store.state.cognito.user },
      set (val) { this.$store.commit(COGNITO_USER_SET, val) }
    },
    username: {
      get () { return this.$store.state.cognito.credentials.username },
      set (val) { this.$store.commit(COGNITO_CREDENTIALS_USERNAME_SET, val) }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.incomingUserEmail) {
        this.email = this.incomingUserEmail
        this.forgotPassword()
      }
    },
    onSubmit () {
      if (!this.formstate.$invalid) {
        this.inputVerificationCodeSubmit()
      }
    },
    forgotPassword () {
      const self = this
      var userData = {
        Username: this.email,
        Pool: this.userPool
      }

      self.cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
      self.cognitoUser.forgotPassword({
        onSuccess (data) {
          // successfully initiated reset password request
          const msg = 'CodeDeliveryData from forgotPassword: ' + data
          this.$emit('toast', { msg, icon: 'check' })
        },
        onFailure (err) {
          alert(err.message || JSON.stringify(err))
          const msg = 'Error: ' + (err.message || JSON.stringify(err))
          self.$emit('toast', { msg, icon: 'error' })
        },
        // Optional automatic callback
        inputVerificationCode (data) {
          const deliveryMediumCapitalized = data.CodeDeliveryDetails.DeliveryMedium.charAt(0).toUpperCase() + data.CodeDeliveryDetails.DeliveryMedium.slice(1)
          const msg = `Code sent via ${deliveryMediumCapitalized} to ${data.CodeDeliveryDetails.Destination}`
          self.$emit('toast', { msg, icon: 'warning' })
          self.forgotPasswordInit = true
        }
      })
    },
    inputVerificationCodeSubmit () {
      const self = this
      this.cognitoUser.confirmPassword(this.model.verificationCode, this.model.newPassword, {
        onSuccess () {
          const msg = 'Password Reset Confirmed! Please login with your new password.'
          self.$emit('toast', { msg, icon: 'check' })
          self.redirectToLogin(msg)
        },
        onFailure (err) {
          const msg = 'Password not Confirmed! Error: ' + (err.message || JSON.stringify(err))
          self.$emit('toast', { msg, icon: 'error' })
        }
      })
    },
    redirect (routeName = this.defaultRouteName, params = {}) {
      this.$router
        .push({
          name: routeName,
          params
        })
        .catch((err) => {
          throw new Error(
            `Redirect to ${routeName} with params.authMsg ${params.authMsg} error: ${err}.`
          )
        })
    },
    redirectToLogin (msg) {
      this.redirect('login', { authMsg: msg })
    }
  }
}
</script>

<style lang="scss">
#app {
  &.forgot-password {
    .v-breadcrumbs {
      margin-left: 0;
    }
    form {
      .v-input {
        padding-top: 7px;
      }
      button {
        float: right;
        margin-top: 10px;
      }
    }
    .start-process-container {
      button {
        float: right;
        margin-top: 10px;
      }
    }
  }
}
h2 {
  margin: 40px 0 10px;
}
h3 {
  margin: 10px 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
.form-field {
  margin: 10px 0;
}
.form-field label {
  margin-right: 10px;
}
.msg {
  margin: 20px 0;
}
#email-field {
  margin-bottom: 20px;
  label {
    padding-right: 10px;
  }
}
</style>
