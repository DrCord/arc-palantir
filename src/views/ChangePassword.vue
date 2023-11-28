<template>
  <div class="change-password">
    <page-header title="Change Password" />
    <div class="form-container content-container">
      <vue-form :state="formstate" @submit.prevent="onSubmit">
        <input
          :value="operatorUsername"
          type="text"
          hidden
          readonly
          class="form-control"
          autocomplete="username"
        />

        <validate tag="div" class="old-password form-field">
          <label for="old-password" class="required">Old Password</label>
          <input
            id="old-password"
            v-model="model.oldPassword"
            required
            name="old-password"
            type="password"
            class="form-control"
            autocomplete="current-password"
          />

          <field-messages
            name="old-password"
            class="validation-msgs-container"
            show="$dirty && $touched"
          >
            <div slot="required">Old Password is a required field</div>
          </field-messages>
        </validate>

        <validate tag="div" class="new-password form-field">
          <label for="new-password" class="required">New Password</label>
          <input
            id="new-password"
            v-model="model.newPassword"
            required
            name="new-password"
            type="password"
            class="form-control"
            autocomplete="new-password"
          />

          <field-messages
            name="new-password"
            class="validation-msgs-container"
            show="$dirty && $touched"
          >
            <div slot="required">New Password is a required field</div>
          </field-messages>
        </validate>

        <validate tag="div" class="new-password-confirm form-field">
          <label for="new-password-confirm" class="required">Confirm New Password</label>
          <input
            id="new-password-confirm"
            v-model="model.newPasswordConfirm"
            required
            name="new-password-confirm"
            type="password"
            class="form-control"
            autocomplete="new-password"
          />

          <field-messages
            name="new-password-confirm"
            class="validation-msgs-container"
            show="$dirty && $touched"
          >
            <div slot="required">Confirm New Password is a required field</div>
          </field-messages>
        </validate>

        <FormSubmitButton
          :formstate-invalid="formstate.$invalid || model.newPassword !== model.newPasswordConfirm"
          button-text="Change Password"
        />
      </vue-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  COGNITO_USER,
  OPERATOR_USERNAME
} from '@/store/getter-types'
import {
  LOADING_END,
  LOADING_START
} from '@/store/mutation-types'

import FormSubmitButton from '@/components/FormSubmitButton.vue'
import PageHeader from '@/components/PageHeader.vue'

import errors from '@/lib/errors'

export default {
  name: 'ChangePassword',
  components: {
    FormSubmitButton,
    PageHeader
  },
  data () {
    return {
      formstate: {},
      model: {
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      cognitoUser: COGNITO_USER,
      operatorUsername: OPERATOR_USERNAME
    }),
    loading: {
      get () { return this.$store.state.main.loading },
      set (val) {
        if (val) {
          this.$store.commit(LOADING_START)
        } else {
          this.$store.commit(LOADING_END)
        }
      }
    }
  },
  methods: {
    onSubmit () {
      const { changePassword, formstate } = this

      if (!formstate.$invalid) {
        const componentSelf = this
        changePassword(componentSelf)
      }
    },
    changePassword (self) {
      const { model, resetFormState } = self
      const { oldPassword, newPassword } = model
      const { handleError } = errors

      self.loading = true
      self.cognitoUser.changePassword(
        oldPassword,
        newPassword,
        function (err, result) {
          if (err) {
            const errorOutput = err.message || JSON.stringify(err)
            handleError(self, errorOutput)
            self.loading = false
            return
          }
          self.$emit('toast', { msg: `Change Password  ${result}`, icon: 'check' })
          resetFormState()
          self.loading = false
        })
    },
    resetFormState () {
      const { formstate } = this

      this.model.oldPassword = ''
      this.model.newPassword = ''
      this.model.newPasswordConfirm = ''
      formstate._reset()
    }
  }
}
</script>

<style scoped lang="scss">
h2 {
  margin-bottom: 40px;
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
.form-container {
  margin: 0 auto;
  max-width: 350px;
}
</style>
