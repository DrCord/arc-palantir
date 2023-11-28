<template>
  <div class="vehicle-telemetry-config-set-container">
    <h3>Telemetry Config Points Set</h3>
    <div>
      <div v-if="vehicleHasPreDiscoboard">
          <v-alert
            color="info"
            dark
          >
            <v-icon
            class="field-error-icon"
            large
            color="warning"
          >mdi-information</v-icon>
            <br>{{vin}}
            <br>Has a Pre-Discoboard
            <br>Only 10 Telemetry Points may be selected.
          </v-alert>
        </div>
      <v-select
        v-model="selectedTelemetryPointsConfig"
        :items="vehiclesDataNormalized"
        item-text="display"
        item-value="camel"
        chips
        clearable
        deletable-chips
        label="Telemetry Points Config"
        :counter="maxSelected"
        multiple
        outlined
        :menu-props="menuProps"
        @input="adjustOptions"
      ></v-select>
    </div>
    <div class="btn-container">
      <v-btn
        class="cancel"
        color="error"
        dark
        @click="telemetryConfigCancel"
      >Cancel<v-icon>mdi-close-circle</v-icon>
      </v-btn>
      <v-btn
        class="save"
        color="success"
        type="button"
        :disabled="exceededSelectionLimit"
        @click="vehicleTelemetryPointsConfigSet"
      >Configure<v-icon>mdi-cog-sync</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  VEHICLE_TELEMETRY_CONFIG_SAVE,
  VEHICLES_TELEMETRY_METRICS_VERSION_SUMMON
} from '@/store/action-types'
import {
  VEHICLE_HAS_PRE_DISCOBOARD,
  VEHICLE_LOADED,
  VEHICLE_TELEMETRY_CONFIG,
  VEHICLE_TELEMETRY_SETTINGS_VERSION,
  VEHICLES_TELEMETRY_METRICS_VERSION_KEYS
} from '@/store/getter-types'

export default {
  name: 'VehicleTelemetryPointsConfigSet',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      maxSelected: null,
      selectedTelemetryPointsConfig: [],
      telemetryPointsConfig: [],
      vehiclesDataNormalized: [],
      vehiclesTelemetryMetricsVersionKeys: [],
      vehiclesTelemetryMetricsVersionLoaded: null,
      menuProps: {
        disabled: false,
        disableKeys: true
      }
    }
  },
  computed: {
    ...mapGetters({
      vehicleHasPreDiscoboardGet: VEHICLE_HAS_PRE_DISCOBOARD,
      vehicleLoadedGet: VEHICLE_LOADED,
      vehicleTelemetryConfigGet: VEHICLE_TELEMETRY_CONFIG,
      vehicleTelemetrySettingsGet: VEHICLE_TELEMETRY_SETTINGS_VERSION,
      vehiclesTelemetryMetricsVersionKeysGet: VEHICLES_TELEMETRY_METRICS_VERSION_KEYS
    }),
    computedCounterValue () {
      let totalCount = 0
      if (this.selectedTelemetryPointsConfig && this.selectedTelemetryPointsConfig.length > 0) {
        const selectedItems = this.selectedTelemetryPointsConfig.map((id) => {
          return this.vehiclesDataNormalized.find((element) => element.id === id)
        })
        totalCount = selectedItems.reduce(function (prev, cur) {
          return prev + 1
        }, 0)
      }
      return totalCount
    },
    vehicleHasPreDiscoboard () {
      return this.vin ? this.vehicleHasPreDiscoboardGet(this.vin) : null
    },
    maxSelectedValue () {
      return this.vehicleHasPreDiscoboard ? 10 : this.vehiclesDataNormalized.length
    },
    menuPropDisabled () {
      return this.computedCounterValue >= this.maxSelectedValue
    },
    exceededSelectionLimit () {
      return this.computedCounterValue > this.maxSelectedValue
    },
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : {}
    },
    vehicleTelemetryConfig () {
      return this.vin ? this.vehicleTelemetryConfigGet(this.vin) : []
    },
    vehicleTelemetrySettings () {
      return this.vin ? this.vehicleTelemetrySettingsGet(this.vin) : null
    }
  },
  watch: {
    maxSelectedValue: {
      handler (newVal, oldVal) {
        if (newVal) {
          this.maxSelected = this.maxSelectedValue
        }
      },
      immediate: true
    },
    menuPropDisabled: {
      handler (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.menuProps.disabled = this.menuPropDisabled
        }
      },
      immediate: true
    },
    vehicleTelemetrySettings: {
      handler (newVal, oldVal) {
        if (newVal) {
          this.vehiclesTelemetryMetricsVersionSummon()
        }
      },
      immediate: true
    },
    vehicleTelemetryConfig: {
      handler (newVal) {
        if (newVal && newVal.length) {
          this.selectedTelemetryPointsConfig = newVal
        }
      },
      immediate: true
    },
    vehiclesTelemetryMetricsVersionLoaded: {
      handler (newVal) {
        if (newVal) {
          this.vehiclesTelemetryMetricsVersionKeysSet()
          this.normalizeVehiclesData()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      vehicleTelemetryPointsSaveAction: VEHICLE_TELEMETRY_CONFIG_SAVE,
      vehiclesTelemetryMetricsVersionSummonAction: VEHICLES_TELEMETRY_METRICS_VERSION_SUMMON
    }),
    adjustOptions: function (selectedIds) {
      if (this.computedCounterValue >= this.maxSelected) {
        this.menuProps.disabled = true
      } else {
        this.menuProps.disabled = false
      }
    },
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    telemetryConfigCancel () {
      this.$emit('config-set-cancel')
    },
    async vehiclesTelemetryMetricsVersionSummon () {
      const componentSelf = this
      const payload = {
        versionId: this.vehicleTelemetrySettings
      }
      this.vehiclesTelemetryMetricsVersionLoaded = await this.vehiclesTelemetryMetricsVersionSummonAction({ componentSelf, payload })
    },
    async vehicleTelemetryPointsConfigSet () {
      const componentSelf = this
      const { selectedTelemetryPointsConfig, vehiclesDataNormalized, vin } = this
      const data = {}
      const commitData = {}
      selectedTelemetryPointsConfig.forEach(selectedCamelCaseProp => {
        const normalizedItem = vehiclesDataNormalized.find(item => item.camel === selectedCamelCaseProp)
        data[normalizedItem.snake] = {}
        commitData[normalizedItem.camel] = {}
      })
      const payload = {
        vin,
        selectedTelemetryPointsConfig: commitData,
        body: {
          ...data
        }
      }
      await this.vehicleTelemetryPointsSaveAction({ componentSelf, payload })
      this.$emit('vehicle-telemetry-points-config-complete')
    },
    normalizeVehiclesData () {
      this.vehiclesDataNormalized = this.vehiclesTelemetryMetricsVersionKeys.map(item => {
        const camel = item.replace(/_(.)/g, g => g[1].toUpperCase())
        const display = this.capitalizeFirstLetter(item.replace(/_(.)/g, g => ` ${g[1].toUpperCase()}`))
        return {
          snake: item,
          camel,
          display
        }
      }).sort((a, b) => (a.display > b.display) ? 1 : ((b.display > a.display) ? -1 : 0))
    },
    vehiclesTelemetryMetricsVersionKeysSet () {
      const data = this.vehiclesTelemetryMetricsVersionKeysGet(this.vehicleTelemetrySettings)
      this.vehiclesTelemetryMetricsVersionKeys = data ? data.telemetryConfig : []
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle-telemetry-config-set-container {
    h3 {
      margin-bottom: 20px;
    }
    button {
      float: right;
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
    .v-alert {
      text-align: center;
      i {
        font-size: 2rem;
      }
    }
  }
}
</style>
