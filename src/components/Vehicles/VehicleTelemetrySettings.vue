<template>
  <div class="telemetry-settings-container">
    <h3>Telemetry Version</h3>
    <h4>{{ telemetrySettings ? telemetrySettings : 'Unknown' }}</h4>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  VEHICLE_LOADED,
  VEHICLE_TELEMETRY_SETTINGS_VERSION
} from '@/store/getter-types'

export default {
  name: 'VehicleTelemetrySettings',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      vehicleLoadedGet: VEHICLE_LOADED,
      vehicleTelemetrySettingsGet: VEHICLE_TELEMETRY_SETTINGS_VERSION
    }),
    telemetrySettings () {
      return this.vin && this.vehicleLoaded ? this.vehicleTelemetrySettingsGet(this.vin) : null
    },
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : null
    }
  }
}
</script>

<style lang="scss">
#app {
  .telemetry-settings-container {
    h3 {
      text-align: left;
    }
    h4 {
      text-align: left;
      font-size: 1rem;
      font-weight: normal;
      padding-left: 20px;
    }
    margin-bottom: 25px;
  }
}

</style>
