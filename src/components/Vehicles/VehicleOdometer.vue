<template>
  <div class="vehicle-odometer">
    <odometer :odometer="odometer" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLES_TELEMETRY_RETRIEVE } from '@/store/action-types'
import { VEHICLE_ODOMETER } from '@/store/getter-types'
import Odometer from '@/components/Odometer/Odometer.vue'

export default {
  name: 'VehicleOdometer',
  components: {
    Odometer
  },
  props: {
    refreshPeriod: {
      default: 60,
      type: Number
    },
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      vehicleOdometer: null,
      telemetryRefreshCounter: null,
      telemetryRefreshTimeout: null,
      showVehicleUpdatedToast: true
    }
  },
  computed: {
    ...mapGetters({
      vehicleOdometerGet: VEHICLE_ODOMETER
    }),
    odometer () {
      const odometerObj = {
        miles: this.odometerMiles,
        kilometers: this.odometerKilometers
      }
      return odometerObj
    },
    odometerKilometers () {
      if (!this.vehicleOdometerPoint) {
        return null
      }
      return Math.round(this.vehicleOdometerPoint * 100) / 100
    },
    odometerMiles () {
      if (!this.odometerKilometers) {
        return null
      }
      return Math.round((this.odometerKilometers * 0.621371) * 100) / 100
    },
    vehicleOdometerPoint () {
      return this.vehicleOdometer ? this.vehicleOdometer.point : null
    }
  },
  watch: {
    telemetryRefreshCounter: {
      handler (value) {
        if (this.refreshPeriod !== 0) {
          if (value > 1) {
            clearTimeout(this.telemetryRefreshTimeout)
            this.telemetryRefreshTimeout = setTimeout(() => {
              this.telemetryRefreshCounter--
            }, 1000)
          } else {
            this.handleVehiclesTelemetryGetRequest()
          }
        }
      }
    },
    vin (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.handleVehiclesTelemetryGetRequest()
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      vehiclesTelemetryRetrieveAction: VEHICLES_TELEMETRY_RETRIEVE
    }),
    init () {
      if (this.vin) {
        this.handleVehiclesTelemetryGetRequest()
      }
    },
    async handleVehiclesTelemetryGetRequest () {
      const payload = {
        vins: [this.vin],
        telemetryPoints: [
          'odometer'
        ],
        idToken: '',
        componentSelf: this,
        requestType: 'odometer'
      }
      await this.vehiclesTelemetryRetrieveAction(payload)
      this.vehicleOdometerSet()
      this.setTelemetryRefreshed()
    },
    setTelemetryRefreshed () {
      this.telemetryRefreshCounter = this.refreshPeriod + 1
    },
    vehicleOdometerSet () {
      this.vehicleOdometer = this.vehicleOdometerGet(this.vin)
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle-odometer {
    max-width: 206px;
    .odometer-container {
      background-color: #aaa;
    }
    .vin {
      color: #333;
      font-weight: bold;
    }
  }
}
</style>
