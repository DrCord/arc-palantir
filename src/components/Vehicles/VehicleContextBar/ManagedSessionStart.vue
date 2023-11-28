<template>
  <div class="vehicle-managed-session-start-container">
    <h3>Start Managed Session</h3>
    <vue-form :state="formstate">
      <div class="pin-container">
      <validate tag="div" class="form-field">
        <label for="pin" class="optional">Custom Pin (optional)</label>
        <v-text-field
          id="pin"
          v-model="model.pin"
            name="pin"
            type="text"
            outlined
            :error-messages="pinErrorMessages"
        >
        <v-icon
            v-if="pinErrorMessages && !formstate.$pristine"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-text-field>
      </validate>

      <div class="btn-container">
        <v-btn
          class="save"
          color="success"
          type="button"
          :disabled="formstate.$invalid || (pinErrorMessages !== null)"
          @click="managedSessionStart"
        >Start Session
        </v-btn>
      </div>
    </div>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  MANAGED_SESSION_START
} from '@/store/action-types'
import {
  LOADING
} from '@/store/getter-types'
import { isNull } from 'url/util'

export default {
  name: 'ManagedSessionStart',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      formstate: {},
      model: {
        pin: null
      }
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING
    }),
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    },
    pinErrorMessages () {
      if (this.formstateUntouched) {
        return null
      }
      if (!this.pinCorrectFormat) {
        return 'PIN must be empty or 6 digits'
      }
      return null
    },
    pinCorrectFormat () {
      return ((/^\d{6}$/.test(this.model.pin)) || this.model.pin === '' || isNull(this.model.pin))
    },
    pinErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { pin } = formstate
      if (!pin || pin.$untouched) {
        return null
      }
      if (pin.$invalid && pin.$error.required) {
        return true
      }
      return null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      managedSessionStartAction: MANAGED_SESSION_START
    }),
    init () {
    },
    async managedSessionStart () {
      const componentSelf = this
      const { vin } = this
      const payload = {
        vin: vin,
        body: {
          pin: this.model.pin
        }
      }

      await this.managedSessionStartAction({ componentSelf, payload })
      this.$emit('managed-session-start-complete')
    }
  }
}
</script>

<style lang="scss">
#app {
  .vehicle-managed-session-start-container {
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
    .pin {
    width: 150px;
    }
    .btn-container {
      margin-top: 0px;
      margin-bottom: 50px;
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
}
</style>
