<template>
  <div class="fleet-locations">
    <telemetry-map
      clickable-icon
      :height=500
      :active-item="activeItem"
      :show-messages="false"
      :show-popups="false"
      :vins="filteredVins"
      :vehicles-telemetry-points="vehiclesTelemetryPoints"
      @marker-active="markerActive"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  FLEET_VEHICLES,
  VEHICLE_LOCATION_GPS
} from '@/store/getter-types'

import TelemetryMap from '@/components/TelemetryMap.vue'

export default {
  name: 'FleetLocations',
  components: {
    TelemetryMap
  },
  props: {
    fleetId: {
      default: null,
      type: Number
    },
    filteredVins: {
      default: () => [],
      type: Array
    },
    activeItem: {
      default: null,
      type: String
    },
    telemetryLoaded: {
      default: () => [],
      type: Array
    }
  },
  data () {
    return {
      vehiclesTelemetryPoints: {}
    }
  },
  computed: {
    ...mapGetters({
      fleetVehiclesGet: FLEET_VEHICLES,
      vehicleLocationGpsGet: VEHICLE_LOCATION_GPS
    }),
    dataAvailable () {
      return !!this.telemetryLoaded.length
    }
  },
  watch: {
    filteredVins: {
      handler (newVal, oldVal) {
        if (newVal && this.telemetryLoaded.length) {
          this.vehiclesTelemetryPointsSet()
        }
      }
    },
    telemetryLoaded: {
      handler (newVal, oldVal) {
        if (newVal && newVal.length) {
          this.vehiclesTelemetryPointsSet()
        }
      }
    }
  },
  methods: {
    markerActive (event) {
      this.$emit('marker-active', event)
    },
    vehicleTelemetryGps (vin) {
      return this.vehicleLocationGpsGet(vin)
    },
    vehiclesTelemetryPointsSet () {
      this.vehiclesTelemetryPoints = {}
      this.filteredVins.forEach(vin => {
        const telemetryGpsData = this.vehicleTelemetryGps(vin)
        if (telemetryGpsData) {
          this.vehiclesTelemetryPoints[vin] = {
            gpsLatitude: {},
            gpsLongitude: {}
          }
          this.vehiclesTelemetryPoints[vin].gpsLatitude = {
            point: telemetryGpsData.lat,
            time: telemetryGpsData.time
          }
          this.vehiclesTelemetryPoints[vin].gpsLongitude = {
            point: telemetryGpsData.long,
            time: telemetryGpsData.time
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .fleet-locations {
    margin: 0;
    .vin {
      color: #333;
      font-weight: bold;
    }
  }
}
</style>
