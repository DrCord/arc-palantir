<template>
  <div class="fleet-update-container">
    <h3>Set Fleet Name</h3>
    <vue-form :state="formstate"  >
      <div class="structure-name form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="fleet-name">
              <label for="fleetName" class="required">Fleet Name</label>
              <v-text-field
                id="fleetName"
                v-model="model.fleetName"
                name="fleetName"
                type="text"
                required
                outlined
                :error-messages="fleetNameErrorMessages"
              >
               <v-icon
                v-if="fleetNameErrorMessages"
                  slot="append"
                  class="field-error-icon"
                  large
                  color="red"
                >mdi-alert</v-icon>
              </v-text-field>
            </validate>
          </div>
        </div>
      </div>
      <v-btn
        class="save"
        color="success"
        type="button"
        :disabled="isDisabled"
        @click="fleetUpdate"
      >Update Fleet</v-btn>

    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEET_UPDATE
} from '@/store/action-types'
import {
  FLEET,
  FLEETS
} from '@/store/getter-types'

export default {
  name: 'FleetUpdate',
  props: {
    fleetId: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      formstate: {},
      model: {
        fleetName: null
      }
    }
  },
  computed: {
    ...mapGetters({
      fleetGet: FLEET,
      fleets: FLEETS
    }),
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    },
    fleet () {
      return this.fleetId ? this.fleetGet(this.fleetId) : null
    },
    fleetName () {
      return this.fleet ? this.fleet.name : null
    },
    fleetNameErrorMessages () {
      if (this.fleet.name === this.model.fleetName) {
        return null
      }
      if (this.fleetNameErrorStateRequired) {
        return 'Group Name is required'
      }
      if (this.fleetNameFound) {
        return 'Group Name must be Unique'
      }
      if (!this.fleetNameLenTest) {
        return 'Group Name must be between 5 and 128 characters'
      }
      if (!this.fleetNameSpaces) {
        return 'Group Name can\'t begin or end with a space'
      }

      return null
    },
    fleetNameFound () {
      return this.fleets.some(el => el.name === this.model.fleetName)
    },
    fleetNameLenTest () {
      var len = 0
      if (this.model.fleetName) {
        len = this.model.fleetName.length
      }
      return len < 129 && len > 4
    },
    fleetNameSpaces () {
      return (/^\S.*[^.\s]$/.test(this.model.fleetName))
    },
    isDisabled () {
      return this.formstate.$pristine || this.fleetNameErrorMessages !== null
    },
    fleetNameErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { fleetName } = formstate
      if (!fleetName || fleetName.$untouched) {
        return null
      }
      if (fleetName.$invalid && fleetName.$error.required) {
        return true
      }
      return null
    }

  },
  watch: {
    fleet: {
      handler (newVal) {
        if (newVal && newVal.name) {
          this.model.fleetName = newVal.name
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      fleetUpdateSaveAction: FLEET_UPDATE
    }),
    init () {
      this.model.fleetName = this.fleetName
    },
    async fleetUpdate () {
      const componentSelf = this

      const payload = {
        id: this.fleetId,
        body: { fleet_name: this.model.fleetName }
      }
      await this.fleetUpdateSaveAction({ componentSelf, payload })
      this.$emit('fleet-update-complete')
    }

  }
}
</script>

<style scoped lang="scss">
</style>
