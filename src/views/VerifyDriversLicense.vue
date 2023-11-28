<template>
  <div class="verify-drivers-license">
    <page-header title="Verify Drivers License" />
    <div class="verify-drivers-license-container">
      <v-card class="verify-drivers-license-form">
        <v-card-text>
          <vue-form
            :state="formstate"
            @submit.prevent="verifyDL"
          >
            <validate>
              <v-text-field
                v-model="model.firstName"
                label="First Name"
                name="firstName"
                outlined
                placeholder="First Name"
                required
                :error-messages="firstNameErrors"
              >
                <v-icon
                  v-if="firstNameErrors"
                  slot="append"
                  class="field-error-icon"
                  large
                  color="red"
                >mdi-alert</v-icon>
                <v-icon
                  slot="append-outer"
                  color="red"
                >mdi-asterisk</v-icon>
              </v-text-field>
            </validate>
            <validate>
              <v-text-field
                v-model="model.lastName"
                label="Last Name"
                name="lastName"
                outlined
                placeholder="Last Name"
                required
                :error-messages="lastNameErrors"
              >
                <v-icon
                  v-if="lastNameErrors"
                  slot="append"
                  class="field-error-icon"
                  large
                  color="red"
                >mdi-alert</v-icon>
                <v-icon
                  slot="append-outer"
                  color="red"
                >mdi-asterisk</v-icon>
              </v-text-field>
            </validate>
            <validate>
              <v-text-field
                v-model="model.email"
                type="email"
                name="email"
                label="Email"
                outlined
                placeholder="Email"
                required
                :error-messages="emailErrors"
              >
                <v-icon
                  v-if="emailErrors"
                  slot="append"
                  class="field-error-icon"
                  large
                  color="red"
                >mdi-alert</v-icon>
                <v-icon
                  slot="append-outer"
                  color="red"
                >mdi-asterisk</v-icon>
              </v-text-field>
            </validate>
            <validate>
              <v-select
                v-model="model.state"
                :items="states"
                label="State"
                outlined
                name="state"
                item-text="state"
                item-value="code"
                placeholder="State"
                required
                :error-messages="stateErrors"
                @change="formstate.driversLicenseNumber._validate()"
              >
                <v-icon
                  v-if="stateErrors"
                  slot="append"
                  class="field-error-icon"
                  large
                  color="red"
                >mdi-alert</v-icon>
                <v-icon
                  slot="append-outer"
                  color="red"
                >mdi-asterisk</v-icon>
              </v-select>
            </validate>
            <validate
              :custom="{
                driversLicenseNumberByState: function (value, attrValue, vnode) {
                  return $validators.driversLicenseNumberValidate(value, model.state)
                }
              }">
              <v-text-field
                v-model="model.driversLicenseNumber"
                :disabled="!model.state"
                :label="!model.state ? 'Select a State to Enter DL Number' : 'Drivers License Number'"
                name="driversLicenseNumber"
                outlined
                :placeholder="!model.state ? 'Select a State to Enter DL Number' : 'Drivers License Number'"
                required
                :error-messages="driversLicenseNumberErrors"
              >
                <v-icon
                  v-if="driversLicenseNumberErrors"
                  slot="append"
                  class="field-error-icon"
                  large
                  color="red"
                >mdi-alert</v-icon>
                <v-icon
                  slot="append-outer"
                  color="red"
                >mdi-asterisk</v-icon>
              </v-text-field>
            </validate>
            <v-btn
              color="success"
              :disabled="formstate.$invalid"
              type="submit"
            >Verify Drivers License</v-btn>
          </vue-form>
        </v-card-text>
      </v-card>
    </div>
    <v-dialog
      v-if="verification"
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title>Drivers License Number Verification Status</v-card-title>
        <v-card-text>
          <div
            v-if="verification.verified"
            class="verified"
          >
          <h4><i>{{ payload.body.first_name}} {{ payload.body.last_name}}</i> Verified
            <v-icon
              x-large
              color="green"
            >mdi-check-circle-outline</v-icon>
          </h4>
          <p>Verification Code: {{ verification.verificationId }}</p>
          </div>
          <div
            v-else
            class="not-verified"
          >
            <h4>
              <i>{{ payload.body.first_name}} {{ payload.body.last_name}}</i> Not Verified
              <v-icon
                large
                color="red">mdi-close-circle</v-icon>
            </h4>
            <p>Check for errors and try again. If the issue persists contact management.</p>
            <v-list>
              <v-list-item>
                <v-list-item-title>First Name</v-list-item-title>
                <v-list-item-subtitle>{{ payload.body.first_name }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Last Name</v-list-item-title>
                <v-list-item-subtitle>{{ payload.body.last_name }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Email</v-list-item-title>
                <v-list-item-subtitle>{{ payload.body.email }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>State</v-list-item-title>
                <v-list-item-subtitle>{{ payload.body.state }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Drivers License Number</v-list-item-title>
                <v-list-item-subtitle>{{ payload.body.drivers_license_number }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div
            v-if="verification.verified"
            class="verified"
          >
            <v-btn
              color="success"
              @click="closeDialog"
            >Close</v-btn>
          </div>
          <div
            v-else
            class="not-verified"
          >
            <v-btn
              color="warning"
              @click="closeDialog"
            >Acknowledge &amp; Close</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { USERS_VERIFY_DL } from '@/store/action-types'

import PageHeader from '@/components/PageHeader.vue'
import states from '@/lib/states'

export default {
  name: 'VerifyDriversLicenseView',
  components: {
    PageHeader
  },
  data () {
    return {
      dialog: false,
      formstate: {},
      model: {
        driversLicenseNumber: null,
        email: null,
        firstName: null,
        lastName: null,
        state: null
      },
      payload: {
        body: {}
      },
      states,
      verification: null
    }
  },
  computed: {
    driversLicenseNumberErrors () {
      const { formValidationShow } = this
      const { driversLicenseNumber } = this.formstate
      if (driversLicenseNumber) {
        const invalidMsg = 'Invalid Drivers License Number for Selected State'
        const requiredMsg = 'Drivers License Number is Required'
        const formFieldInError = formValidationShow && driversLicenseNumber.$dirty && driversLicenseNumber.$invalid
        if (!formFieldInError) {
          if (driversLicenseNumber.$touched && !driversLicenseNumber.$dirty && !driversLicenseNumber.$focused) {
            return requiredMsg
          }
          return null
        }
        if (driversLicenseNumber.$error.required) {
          return requiredMsg
        }
        if (driversLicenseNumber.$error.driversLicenseNumberByState) {
          return invalidMsg
        }
        return 'Drivers License Number Field in Error State'
      }
      return null
    },
    emailErrors () {
      const { formValidationShow } = this
      const { email } = this.formstate
      if (email) {
        const requiredMsg = 'Email is Required'
        if (email.$touched && !email.$focused && email.$invalid && !email.$error.email) {
          return requiredMsg
        }
        const formFieldInError = formValidationShow && email.$dirty && email.$invalid
        if (!formFieldInError) {
          return null
        }
        if (email.$error.required) {
          return requiredMsg
        }
        if (email.$error.email) {
          return 'Invalid Email Format'
        }
        return 'Email Field in Error State'
      }
      return null
    },
    firstNameErrors () {
      const { formValidationShow } = this
      const { firstName } = this.formstate
      if (firstName) {
        const requiredMsg = 'First Name is Required'
        if (firstName.$touched && firstName.$invalid && !firstName.$focused) {
          return requiredMsg
        }
        const formFieldInError = formValidationShow && firstName.$dirty && firstName.$invalid
        if (!formFieldInError) {
          return null
        }
        if (firstName.$error.required) {
          return requiredMsg
        }
        return 'First Name Field in Error State'
      }
      return null
    },
    formValidationShow: function () {
      return this.formstate.$touched && this.formstate.$dirty
    },
    lastNameErrors () {
      const { formValidationShow } = this
      const { lastName } = this.formstate
      if (lastName) {
        const requiredMsg = 'Last Name is Required'
        if (lastName.$touched && lastName.$invalid && !lastName.$focused) {
          return requiredMsg
        }
        const formFieldInError = formValidationShow && lastName.$dirty && lastName.$invalid
        if (!formFieldInError) {
          return null
        }
        if (lastName.$error.required) {
          return requiredMsg
        }
        return 'Last Name Field in Error State'
      }
      return null
    },
    stateErrors () {
      const { formValidationShow } = this
      const { state } = this.formstate
      if (state) {
        const requiredMsg = 'State is Required'
        if (state.$touched && state.$invalid && !state.$focused) {
          return requiredMsg
        }
        const formFieldInError = formValidationShow && state.$dirty && state.$invalid
        if (!formFieldInError) {
          return null
        }
        if (state.$error.required) {
          return requiredMsg
        }
        return 'State Field in Error State'
      }
      return null
    }
  },
  methods: {
    ...mapActions({
      verifyDriversLicenseAction: USERS_VERIFY_DL
    }),
    closeDialog () {
      this.formstate._reset()
      this.model = {
        driversLicenseNumber: null,
        email: null,
        firstName: null,
        lastName: null,
        state: null
      }
      this.payload = { body: {} }
      this.verification = null
    },
    async verifyDL () {
      const componentSelf = this
      const { model } = this
      this.payload = {
        body: {
          drivers_license_number: model.driversLicenseNumber,
          email: model.email,
          first_name: model.firstName,
          last_name: model.lastName,
          state: model.state
        }
      }
      const { payload } = this
      const responseData = await this.verifyDriversLicenseAction({ componentSelf, payload })
      if (responseData) {
        this.verification = responseData
        this.dialog = true
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  .verify-drivers-license {
    .verify-drivers-license-form {
      margin: 0;
      padding: 40px 40px 20px;
      form {
        margin: 0 auto;
        max-width: 400px;
        overflow: hidden;
        padding-left: 25px;
        width: 100%;
        .v-icon {
          &.field-error-icon {
            top: -5px;
          }
        }
        .v-btn {
          margin-right: 25px;
        }
      }
    }
  }
  .verified,
  .not-verified {
    h4 {
      text-align: left;
    }
    button {
      margin-bottom: 10px;
    }
  }
}
</style>
