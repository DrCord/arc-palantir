<template>
  <div class="vehicle-governor-save-container">
    <h3>Vehicle Governor Set</h3>
    <h4>Sets maximum speed</h4>
    <vue-form :state="formstate" @submit.prevent="vehicleConfigurationGovernorSave">
      <div id="governor-container">
        <div class="governor-enable">
          <label for="enable-mFA">
            Enable Governor
          </label>
          <v-switch
            id="governorEnable"
            v-model="model.governorEnable"
            name="governor-enable"
            type="checkbox"
            @change="governorEnableToggled"
          />
        </div>
        <validate
          class="option-governor-max-speed form-field"
          tag="div"
        >
          <div class="form-elements-container">
            <div class="field">
              <div class="label">
                <label>Max Speed (mph)
                  <v-tooltip bottom>
                    <template #activator="{ on }">
                        <v-icon v-on='on'>mdi-information</v-icon>
                    </template>
                    <span>Miles per Hour, between 5 and 70 mph</span>
                  </v-tooltip>
                </label>
              <v-text-field
                id="option-governor-max-speed"
                v-model="model.optionGovernorMaxSpeed"
                name="option-governor-max-speed"
                type="number"
                :min=5
                :max=70
                outlined
                hide-details="auto"
                :disabled="!model.governorEnable"
                :placeholder="!model.governorEnable ? 'DISABLED' : 'mph'"
              />
            </div>
            </div>
          </div>
          <field-messages name="option-governor-max-speed" class="validation-msgs-container">
            <div slot="min">{{ invalidGovernorMsg }}</div>
            <div slot="max">{{ invalidGovernorMsg }}</div>
          </field-messages>
      </validate>
      </div>
        <v-btn
          class="vehicle-governor-save"
          color="success"
          type="submit"
          :disabled="formstate.$invalid"
        >Set Governor<v-icon>mdi-plus</v-icon>
        </v-btn>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLE_CONFIGURATION_GOVERNOR_SAVE } from '@/store/action-types'
import { VEHICLE_GOVERNOR } from '@/store/getter-types'

export default {
  name: 'VehicleGovernorSet',
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
        governorEnable: false,
        optionGovernorMaxSpeed: null
      },
      invalidGovernorMsg: 'Value must be between 5 and 70'
    }
  },
  computed: {
    ...mapGetters({
      vehicleGovernorGet: VEHICLE_GOVERNOR
    }),
    vehicleGovernor () {
      return this.vin ? this.vehicleGovernorGet(this.vin) : {}
    },
    vehicleGovernorKilometers () {
      return this.vin ? this.vehicleGovernor : null
    },
    vehicleGovernorMiles () {
      return this.vehicleGovernorKilometers ? Math.round(this.vehicleGovernorKilometers * 0.621371) : null
    },
    vehicleGovernorKilometersOutput () {
      return this.model.optionGovernorMaxSpeed ? Math.round(this.model.optionGovernorMaxSpeed * 1.609344) : 0
    }
  },
  watch: {
    vehicleGovernor: {
      handler (newVal, oldVal) {
        if (newVal) {
          const governorValue = this.vehicleGovernorMiles
          if (governorValue) {
            this.model.governorEnable = true
            this.model.optionGovernorMaxSpeed = governorValue
          } else {
            this.model.governorEnable = false
            this.model.optionGovernorMaxSpeed = null
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      vehicleConfigurationGovernorSaveAction: VEHICLE_CONFIGURATION_GOVERNOR_SAVE
    }),
    governorEnableToggled: function (toggleEvent) {
      if (!toggleEvent) {
        this.model.optionGovernorMaxSpeed = null
      }
    },
    async vehicleConfigurationGovernorSave () {
      const componentSelf = this
      const payload = {
        vin: this.vin,
        body: {
          configuration: {
            option_governor_max_speed: this.vehicleGovernorKilometersOutput.toString()
          }
        }
      }
      if (!this.model.governorEnable) {
        payload.body.configuration.option_governor_max_speed = '0'
      }
      await this.vehicleConfigurationGovernorSaveAction({ componentSelf, payload })
      this.$emit('vehicle-configuration-governor-save-complete')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .governor-enable {
    .v-input--switch {
      margin-top: 0;
    }
  }
}
</style>
