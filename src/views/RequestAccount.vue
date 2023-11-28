<template>
  <div class="request">
    <template >
      <div class="request-container">
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
          <div class="request-form">
            <h2>Request Account</h2>
            <vue-form
              ref="request"
              :state="formstate"
            >
            <div class="form-container">
              <validate tag="div" class="email">
                <v-text-field
                  id="email"
                  v-model="model.email"
                  label="Email"
                  name="email"
                  type="email"
                  required
                  dense
                  outlined
                  :error-messages="emailErrorMessages"
                  clearable
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

             <validate tag="div" class="display-name">
                <v-text-field
                  id="display-name"
                  v-model="model.displayname"
                  label="Name"
                  required
                  dense
                  name="displayname"
                  type="text"
                  outlined
                  :error-messages="displayNameErrorMessages"
                  clearable
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

             <validate tag="div" class="department">
                <v-text-field
                  id="department"
                  v-model="model.department"
                  label="Department"
                  required
                  dense
                  name="department"
                  type="text"
                  outlined
                  :error-messages="departmentErrorMessages"
                  clearable
                >
                  <v-icon
                    v-if="departmentErrorMessages"
                    slot="append"
                    class="field-error-icon"
                    large
                    color="red"
                  >mdi-alert</v-icon>
                </v-text-field>
              </validate>

             <validate tag="div" class="manager">
                <v-text-field
                  id="manager"
                  v-model="model.manager"
                  label="Manager"
                  required
                  dense
                  name="manager"
                  type="text"
                  :error-messages="managerErrorMessages"
                  outlined
                  clearable
                >
                  <v-icon
                    v-if="managerErrorMessages"
                    slot="append"
                    class="field-error-icon"
                    large
                    color="red"
                  >mdi-alert</v-icon>
                </v-text-field>
              </validate>

            <validate
              tag="div"
              class="phone"
              :class="{ valid: phoneValid }"
              :custom="{
                phoneValidCheck: phoneValid
              }"
            >
              <vue-tel-input
                v-model="model.phone"
                name="phone"
                dense
                v-bind="telInputOptions"
                class="form-control"
                clearable
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
                  color="red"
                >mdi-alert</v-icon>
                {{ phoneErrorMessages }}
              </div>
            </validate>

            <validate tag="div" class="notes">
              <v-textarea
                id="notes"
                v-model="model.notes"
                label="Notes"
                dense
                name="notes"
                type="text"
                outlined
                rows="2"
                clearable
              >
              </v-textarea>
            </validate>

            <div class="button-container">
              <v-btn
                color=success
                type="button"
                :href="`mailto:${email}`"
                target="_blank"
                :disabled="submitDisabled"
              >Review and Send Email</v-btn>
              <a href="#" @click="goToLogin()">Return to Login</a>
            </div>
            </div>
            </vue-form>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ENVIRONMENT,
  S3_BASE_URL
} from '@/store/getter-types'
import {
  LOADING_END,
  LOADING_START
} from '@/store/mutation-types'

export default {
  name: 'RequestAccount',
  data () {
    return {
      errors: [],
      formstate: {},
      model: {
        email: '',
        department: '',
        phone: '',
        displayname: '',
        notes: ''
      },
      emailTarget: 'it@arcimoto.com',
      phoneE164: null,
      telInputOptions: {
        inputOptions: {
          placeholder: 'Phone Number',
          required: true
        },
        preferredCountries: ['USA'],
        validCharactersOnly: true
      }
    }
  },
  computed: {
    ...mapGetters({
      environment: ENVIRONMENT,
      s3BaseUrl: S3_BASE_URL
    }),
    departmentErrorMessages () {
      if (this.departmentErrorStateRequired) {
        return 'Department Name is required'
      }
      return null
    },
    departmentErrorStateRequired () {
      const { formstate } = this
      if (formstate.$untouched) {
        return null
      }
      const { department } = formstate
      if (!department || department.$untouched) {
        return null
      }
      if (department.$error.required) {
        return true
      }
      return null
    },
    displayNameErrorMessages () {
      if (this.displayNameErrorStateRequired) {
        return 'Display Name is required'
      }
      return null
    },
    displayNameErrorStateRequired () {
      const { formstate } = this
      if (formstate.$untouched) {
        return null
      }
      const { displayname } = formstate
      if (!displayname || displayname.$untouched) {
        return null
      }
      if (displayname.$error.required) {
        return true
      }
      return null
    },
    email () {
      return this.emailTarget + this.emailSubject + this.emailBody
    },
    emailBody () {
      const nl = '%0D%0A'
      const sp = '%20'
      let body = '&body='
      body += ('Name:' + sp + encodeURIComponent(this.model.displayname) + nl)
      body += ('Email:' + sp + this.model.email + nl)
      body += ('Department:' + sp + encodeURIComponent(this.model.department) + nl)
      body += ('Manager:' + sp + encodeURIComponent(this.model.manager) + nl)
      body += ('Phone:' + sp + this.model.phone + nl)
      body += ('Notes:' + sp + encodeURIComponent(this.model.notes) + nl)

      return body
    },
    emailSubject () {
      let subject = '?subject='
      subject += encodeURIComponent('New Palantir Account Request for ' + this.model.displayname)

      return subject
    },
    emailErrorMessages () {
      if (this.emailErrorStateInvalid) {
        return 'Email is invalid'
      }
      if (this.emailErrorStateRequired) {
        return 'Email is required'
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
    managerErrorMessages () {
      if (this.managerErrorStateRequired) {
        return 'Manager Name is required'
      }
      return null
    },
    managerErrorStateRequired () {
      const { formstate } = this
      if (formstate.$untouched) {
        return null
      }
      const { manager } = formstate
      if (!manager || manager.$untouched) {
        return null
      }
      if (manager.$error.required) {
        return true
      }
      return null
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
    },
    submitDisabled () {
      return this.formstate.$invalid || this.formstate.$pristine
    }
  },
  watch: {
    appMsg (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('toast', newVal)
      }
    }
  },
  methods: {
    phoneInputValidateChange (payload) {
      if (payload.valid) {
        this.phoneE164 = typeof payload.number === 'object' ? payload.number.e164 : payload.number
      } else {
        this.phoneE164 = null
      }
    },
    clear () {
      this.$refs.request.reset()
      this.phoneE164 = null
      this.model = {
        email: '',
        department: '',
        phone: '',
        displayname: '',
        notes: ''
      }
    },
    goToLogin () {
      this.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
#app {
  .request-container {
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
      padding: 20px 10px 0;
      margin-left: 2rem;
      .header-container {
        margin-left: .5rem;
        margin-top: 3.1rem;
        display: flex;
        position: relative;
        .logo {
          height: auto;
          width: 90px;
        }
        h1 {
          color: var(--v-arcimoto-blue-base);
          font-family: "Roboto", Helvetica, Arial, sans-serif;
          font-size: 1.2rem;
          line-height: 1.5rem;
          margin: 0;
          padding-left: 6px;
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
  .request-form {
    padding: 20px 5px 0;
    h2 {
      color: #666;
      font-size: 1rem;
      margin-left: 15px;
      text-align: left;
      text-transform: uppercase;
    }
    form {
      margin: 1rem;
      padding: 0;
      width: 100%;
      .v-icon {
        &.field-error-icon {
          top: -5px;
        }
      }
      .v-btn {
        margin: 0;
      }
    }
  }
}

@media only screen and (min-width: 332px) and (max-width: 383px) {
  #app {
    .request-container {
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
    .request-container {
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
    .request-container {
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
    .request-container {
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
    .request-container {
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
    .request-container {
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
    }
  }
}

@media only screen and (min-width: 700px) {
  #app {
    .request-container {
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
            width: 120px;
          }
          h1 {
            top: 5px;
          }
          .environment-indicator {
            top: 7px;
          }
        }
        .request-form {
          h2 {
            margin-bottom: 0;
            margin-top: 0;
          }
          form {
            margin-top: 5px;
            width: 100%;
          }
        }
      }
    }
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  #app {
    .request-container {
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
    .request-container {
      .image-container {
        .image {
          background-size: 604px 426px;
          height: 426px;
          width: 426px;
        }
      }
      .contents-container {
        padding-left: 4rem;;
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
        .request-form {
          h2 {
            margin-bottom: 5px;
            margin-top: 10px;
          }
          form {
            margin-top: 1rem;
            width: 100%;
          }
        }
      }
    }
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  #app {
    .request-container {
      .image-container {
        .image {
          background-size: 1008px 710px;
          height: 710px;
          width: 650px;
        }
      }
      .contents-container {
        padding-top: 0rem;
      }
    }
  }
}
</style>
<style scoped lang="scss">
form {
  width: 100%;
}
.form-container {
  margin-top: 1rem;
  display: flexbox;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
}
.phone {
  margin-bottom: 1.5rem;
}
.contents-container {
  width:100%;
}
.button-container {
  display:flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-evenly;
}
</style>
