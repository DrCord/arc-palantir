<template>
  <div class="vehicle-locations">
    <h3>GPS Location</h3>
    <telemetry-map
      v-if="vehicleTelemetryPointsLoaded && operatorControlsVehicle && hasLocation"
      clickable-icon
      :vins="allowedVins"
      :vehicles-telemetry-points="vehiclesTelemetryPoints"
    />
    <div v-else>
      <h4>Location not available</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLES_TELEMETRY_RETRIEVE } from '@/store/action-types'
import {
  OPERATOR_VINS,
  VEHICLE_TELEMETRY_POINTS_LOADED
} from '@/store/getter-types'

import TelemetryMap from '@/components/TelemetryMap.vue'

export default {
  name: 'VehicleLocations',
  components: {
    TelemetryMap
  },
  props: {
    vins: {
      default: () => [],
      type: Array
    }
  },
  data () {
    return {
      vehiclesTelemetryPoints: {},
      vehicleTelemetryPointsLoaded: null,
      telemetryRefreshCounter: null,
      telemetryRefreshTimeout: null,
      showVehicleUpdatedToast: true
    }
  },
  computed: {
    ...mapGetters({
      operatorVins: OPERATOR_VINS,
      vehicleTelemetryPointsLoadedGet: VEHICLE_TELEMETRY_POINTS_LOADED
    }),
    hasLocation () {
      const { vehicleTelemetryPointsLoaded, vehiclesTelemetryPoints } = this
      if (!vehicleTelemetryPointsLoaded || !vehiclesTelemetryPoints) {
        return null
      }
      const hasLocation = Object.values(vehiclesTelemetryPoints).some((data) => {
        return data.gpsLatitude.point && data.gpsLongitude.point
      })
      return hasLocation
    },
    vehicles () {
      const vehicles = []
      if (this.allowedVins.length && this.vehiclesTelemetryPoints) {
        this.allowedVins.forEach(vin => {
          const vehicle = {
            vin,
            telemetryPoints: {}
          }
          if (this.vehiclesTelemetryPoints[vin]) {
            for (const telemetryPoint in this.vehiclesTelemetryPoints[vin]) {
              vehicle.telemetryPoints[telemetryPoint] = this.vehiclesTelemetryPoints[vin][telemetryPoint]
            }
          }
          vehicles.push(vehicle)
        })
      }
      return vehicles
    },
    allowedVins () {
      return this.vins.filter(vin => this.operatorVins.includes(vin))
    }
  },
  watch: {
    telemetryRefreshCounter: {
      handler (value) {
        if (value > 1) {
          clearTimeout(this.telemetryRefreshTimeout)
          this.telemetryRefreshTimeout = setTimeout(() => {
            this.telemetryRefreshCounter--
          }, 1000)
        } else {
          this.handleVehiclesTelemetryGetRequest()
        }
      }
    },
    allowedVins (newVal, oldVal) {
      if (newVal.length && newVal !== oldVal) {
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
      if (this.allowedVins.length) {
        this.handleVehiclesTelemetryGetRequest()
      }
    },
    handleVehiclesTelemetryGetRequest () {
      // TODO?: add in gps_altitude data
      const vins = this.allowedVins
      const payload = {
        vins,
        telemetryPoints: [
          'gps_latitude',
          'gps_longitude'
        ],
        idToken: '',
        componentSelf: this,
        requestType: 'location'
      }
      this.vehiclesTelemetryRetrieveAction(payload)
        .then((vehiclesTelemetryPoints) => {
          this.vehiclesTelemetryPoints = vehiclesTelemetryPoints
          this.vehicleTelemetryPointsLoaded = true
          this.setTelemetryRefreshed()
        })
    },
    operatorControlsVehicle (vin) {
      return this.operatorVins.includes(vin)
    },
    setTelemetryRefreshed () {
      this.telemetryRefreshCounter = 61
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle-locations {
    margin: 20px 0;
    .map-container {
      background-color: #aaa;
      border-radius: 5px;
      padding: 8px;
    }
    .vin {
      color: #333;
      font-weight: bold;
    }
  }
}
</style>
