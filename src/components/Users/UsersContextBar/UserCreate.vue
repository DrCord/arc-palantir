<template>
  <div class="user-create-container">
    <h3>Create User</h3>
    <vue-form :state="formstate" @submit.prevent>

      <validate tag="div" class="displayName form-field">
        <label for="displayName" class="required">Name</label>
        <v-text-field
          id="displayName"
          v-model="model.displayName"
          name="displayName"
          type="text"
          required
          outlined
          :error-messages="displayNameErrorMessages"
        >
          <v-icon
            v-if="displayNameErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-text-field>
      </validate>

      <validate tag="div" class="email form-field">
        <label for="email" class="required">Email</label>
        <v-text-field
          id="email"
          v-model="model.email"
          name="email"
          type="email"
          required
          outlined
          :error-messages="emailErrorMessages"
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

      <validate
        tag="div"
        class="phone form-field"
        :class="{ valid: phoneValid }"
        :custom="{
          phoneValidCheck: phoneValid
        }"
      >
        <label for="telephone" class="required">Phone</label>
        <vue-tel-input
          v-model="model.phone"
          name="phone"
          v-bind="telInputOptions"
          class="form-control"
          outlined
          required
          @validate="phoneInputValidateChange"
        ></vue-tel-input>
        <div
          class="phoneError"
          :error-messages="phoneErrorMessages"
        >
          <v-icon
            v-if="phoneErrorMessages"
            class="phone-error-icon"
            size="25"
            color="red"
          >mdi-alert</v-icon>
          {{ phoneErrorMessages }}
        </div>
      </validate>

      <div class="enableMFA form-field">
        <div class="label-container">
          <label for="enableMFA">
            Enable MFA
          </label>
          <v-tooltip bottom>
            <template #activator="{ on }">
                <v-icon v-on='on' >mdi-information</v-icon>
            </template>
            <span>Multi-Factor Authentication</span>
          </v-tooltip>
        </div>
        <v-switch
          id="enableMFA"
          v-model="model.enableMFA"
          name="enableMFA"
        />
      </div>
      <entity-navigation-control
        entity-name="user"
        @go-to-entity="navUpdate"
      />
    </vue-form>

    <div class="btn-container">
      <v-btn
        class="cancel"
        color="error"
        dark
        @click="userCreateCancel"
      >Cancel<v-icon>mdi-close-circle</v-icon>
      </v-btn>
      <v-btn
        class="save"
        color="success"
        type="button"
        :disabled="formstate.$pristine || formstate.$invalid || !phoneE164"
        @click="userCreateSave"
      >Create<v-icon>mdi-account-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { USER_CREATE } from '@/store/action-types'

import EntityNavigationControl from '@/components/EntityNavigationControl.vue'

export default {
  name: 'UserCreate',
  components: {
    EntityNavigationControl
  },
  data () {
    return {
      formstate: {},
      model: {
        email: null,
        phone: null,
        displayName: null,
        enableMFA: false
      },
      phoneE164: null,
      telInputOptions: {
        inputOptions: {
          placeholder: 'Input phone number',
          required: true
        },
        preferredCountries: ['USA'],
        validCharactersOnly: true
      },
      goToUser: true
    }
  },
  computed: {
    displayNameErrorMessages () {
      if (this.displayNameErrorStateInvalidChars) {
        return 'Alphanumeric and dash characters only'
      }
      if (this.displayNameErrorStateMinLength) {
        return 'Minimum length is 6 characters'
      }
      if (this.displayNameErrorStateRequired) {
        return 'Name is required'
      }
      return null
    },
    displayNameErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { displayName } = formstate
      if (!displayName || displayName.$untouched) {
        return null
      }
      if (displayName.$invalid && displayName.$error.required) {
        return true
      }
      return null
    },
    emailErrorMessages () {
      if (this.emailErrorStateFormat) {
        return 'Invalid Email format'
      }
      if (this.emailErrorStateRequired) {
        return 'Email is required'
      }
      return null
    },
    emailErrorStateFormat () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
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
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
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
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    },
    phoneErrorMessages () {
      if (this.phoneErrorStateFormat) {
        return 'Invalid Phone Number format'
      }
      if (this.phoneErrorStateRequired) {
        return 'Phone is required'
      }
      return null
    },
    phoneErrorStateFormat () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { phone } = formstate
      if (!phone || phone.$untouched) {
        return null
      }
      if (phone.$invalid && phone.$error.phoneValidCheck) {
        return true
      }
      return null
    },
    phoneErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { phone } = formstate
      if (!phone || phone.$untouched) {
        return null
      }
      if (phone.$invalid && phone.$error.required) {
        return true
      }
      return null
    },
    phoneValid () {
      return !!this.phoneE164
    }
  },
  methods: {
    ...mapActions({
      userCreateAction: USER_CREATE
    }),
    navUpdate (event) {
      this.goToUser = event.value
    },
    phoneInputValidateChange (payload) {
      if (payload.valid) {
        this.phoneE164 = typeof payload.number === 'object' ? payload.number.e164 : payload.number
      } else {
        this.phoneE164 = null
      }
    },
    userCreateCancel () {
      this.$emit('user-create-cancel')
    },
    userCreateSave () {
      const componentSelf = this
      const email = this.model.email
      const phone = this.phoneE164
      const payload = {
        body: {
          display_name: this.model.displayName,
          email,
          phone,
          enable_mfa: this.model.enableMFA
        }
      }
      this.userCreateAction({ componentSelf, payload })
        .then((username) => {
          const event = { username: username, navigate: this.goToUser }
          this.$emit('user-create-complete', event)
        })
    }
  }
}
</script>

<style lang="scss">
#app {
  .user-create-container {
    form {
      .v-icon {
        &.field-error-icon {
          top: -5px;
        }
      }
    }
    h3 {
      margin-bottom: 0px;
    }
    .phone {
      margin-bottom: 30px;
      .form-control {
        color: rgb(122, 11, 11);
      }
      .phoneError {
        bottom: 0px;
        color: red;
        font-size: 12px;
      }
    }
    .enableMFA {
      display: flex;
      .label-container {
        label {
          margin-right: 3px;
        }
      }
      .v-input--switch {
        margin-left: auto;
        margin-top: 0;
      }
    }
    .btn-container {
      margin-top: 0px;
      display: flex;
      justify-content: flex-end;
      button {
        margin-left: 20px;
        &:first-of-type {
          margin-left: 0;
        }
      }
    }
  }
  &.theme--dark {
    .phone {
      .form-control {
        background-color: #363636;
        input {
          color: white;
        }
      }
    }
  }
}
</style>
