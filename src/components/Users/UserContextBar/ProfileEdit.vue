<template>
  <div class="profile-edit-container">
    <h3>Edit User Profile</h3>
    <vue-form :state="formstate" @submit.prevent="onSubmit">

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

      <div class="btn-container">
      <v-btn
        class="cancel"
        color="error"
        dark
        @click="profileEditCancel"
      >Cancel
        <v-icon
        >mdi-close-circle</v-icon>
      </v-btn>
      <v-btn
        class="save"
        color="success"
        :disabled="formstate.$pristine || formstate.$invalid"
        @click="profileEditSave"
      >Update<v-icon>mdi-update</v-icon>
      </v-btn>
      </div>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { USER_PROFILE_EDIT } from '@/store/action-types'
import {
  USER_DISPLAY_NAME,
  USER_EMAIL,
  USER_PHONE
} from '@/store/getter-types'
import {
  USER_DISPLAY_NAME_SET,
  USER_EMAIL_SET,
  USER_PHONE_SET
} from '@/store/mutation-types'

export default {
  name: 'ProfileEdit',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      formstate: {},
      model: {
        email: this.username ? this.userEmail : null,
        phone: this.username ? this.userPhone : null,
        displayName: this.username ? this.userDisplayName : null
      },
      phoneE164: null,
      telInputOptions: {
        onlyCountries: [
          'us'
        ],
        inputOptions: {
          placeholder: 'Input phone number',
          required: true
        },
        preferredCountries: ['USA'],
        validCharactersOnly: true
      }
    }
  },
  computed: {
    ...mapGetters({
      userDisplayNameGet: USER_DISPLAY_NAME,
      userEmailGet: USER_EMAIL,
      userPhoneGet: USER_PHONE
    }),
    darkModeEnabled () {
      return this.$vuetify.theme.dark
    },
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
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { displayName } = formstate
      if (!displayName || displayName.$pristine) {
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
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { email } = formstate
      if (!email || email.$pristine) {
        return null
      }
      if (email.$invalid && email.$error.email) {
        return true
      }
      return null
    },
    emailErrorStateRequired () {
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { email } = formstate
      if (!email || email.$pristine) {
        return null
      }
      if (email.$invalid && email.$error.required) {
        return true
      }
      return null
    },
    formstatePristine () {
      if (this.formstate.$pristine) {
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
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { phone } = formstate
      if (!phone || phone.$pristine) {
        return null
      }
      if (phone.$invalid && phone.$error.phoneValidCheck) {
        return true
      }
      return null
    },
    phoneErrorStateRequired () {
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { phone } = formstate
      if (!phone || phone.$pristine) {
        return null
      }
      if (phone.$invalid && phone.$error.required) {
        return true
      }
      return null
    },
    phoneValid () {
      return !!this.phoneE164
    },
    userDisplayName () {
      return this.username ? this.userDisplayNameGet(this.username) : null
    },
    userEmail () {
      return this.username ? this.userEmailGet(this.username) : null
    },
    userPhone () {
      return this.username ? this.userPhoneGet(this.username) : null
    }
  },
  watch: {
    userDisplayName: {
      handler (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.model.displayName = this.userDisplayName
        }
      },
      immediate: true
    },
    userEmail: {
      handler (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.model.email = this.userEmail
        }
      },
      immediate: true
    },
    userPhoneGet: {
      handler (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.model.phone = this.userPhone
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      userProfileEditAction: USER_PROFILE_EDIT
    }),
    phoneInputValidateChange (payload) {
      if (payload.valid) {
        this.phoneE164 = typeof payload.number === 'object' ? payload.number.e164 : payload.number
      } else {
        this.phoneE164 = null
      }
    },
    profileEditCancel () {
      this.$emit('profile-edit-cancel')
    },
    profileEditSave () {
      const username = this.username
      const data = {
        username
      }
      const payload = {
        username,
        body: {}
      }
      let displayName = null
      if (this.userDisplayName !== this.model.displayName) {
        displayName = this.model.displayName
        data.displayName = displayName
        payload.body.display_name = displayName
      }
      let email = null
      if (this.userEmail !== this.model.email) {
        email = this.model.email
        data.email = email
        payload.body.email = email
      }
      let phone = null
      if (this.userPhone !== this.phoneE164) {
        phone = this.phoneE164
        data.phone = phone
        payload.body.phone = phone
      }
      if (displayName || email || phone) {
        const componentSelf = this
        this.userProfileEditAction({ componentSelf, payload })
          .then(() => {
            if (displayName) {
              this.$store.commit(USER_DISPLAY_NAME_SET, data)
            }
            if (email) {
              this.$store.commit(USER_EMAIL_SET, data)
            }
            if (phone) {
              this.$store.commit(USER_PHONE_SET, data)
            }
            this.$emit('profile-edit-complete', this.username)
          })
      } else {
        this.$emit('profile-edit-cancel')
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  .profile-edit-container {
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
