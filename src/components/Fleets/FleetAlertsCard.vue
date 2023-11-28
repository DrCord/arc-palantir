<template>
  <v-card
    class="fleet-statistics-card rounded fleet-count-card"
    :height="`${cardHeight}px`"
    ripple
    :color="alertsActive?'active-item':''"
    @click="toggleAlertsActive"
  >
    <v-card-title>
      <v-tooltip bottom>
        <template #activator="{ on }">
          <h5 v-on='on'>Fleet<br>Alerts</h5>
          <v-icon v-on='on'>mdi-information</v-icon>
        </template>
        <span>Vehicles Not Sending Telemetry</span>
        <span v-if="alertsActive"> (Click to Unfilter)</span>
        <span v-else> (Click to Filter)</span>
      </v-tooltip>
    </v-card-title>
    <v-card-text>
      <div
        v-if="fleetVehiclesTelemetryPointsLoading"
        class="telemetry-data-loading-container"
      >
        <v-progress-circular
          indeterminate
          :size="!telemetryLoaded.length ? 50 : 20"
          :width="!telemetryLoaded.length ? 5 : 2"
        ></v-progress-circular>
      </div>
      <h6 v-if="telemetryLoaded.length"><span class="count">{{ fleetVehiclesInAlert }}</span>Vehicles
          <v-icon
            v-if="alertsActive"
            x-large
          >mdi-filter-off-outline</v-icon>
          <v-icon
            v-else
            x-large
          >mdi-filter-outline</v-icon>
      </h6>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  LOADING,
  OPERATOR_FLEET_VEHICLES,
  OPERATOR_FLEET_VEHICLES_TELEMETRY_POINTS_LOADING,
  VEHICLE_TELEMETRY_POINTS,
  VEHICLE_TELEMETRY_POINTS_LOADED,
  VEHICLE_TELEMETRY_POINTS_LOADING
} from '@/store/getter-types'

export default {
  name: 'FleetAlertsCard',
  props: {
    cardHeight: {
      default: 100,
      type: Number
    },
    fleetId: {
      default: null,
      type: Number
    },
    telemetryLoaded: {
      default: () => [],
      type: Array
    }
  },
  data () {
    return {
      alertedVins: [],
      alertsActive: false
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      operatorFleetVehiclesGet: OPERATOR_FLEET_VEHICLES,
      operatorFleetVehiclesTelemetryPointsLoadingGet: OPERATOR_FLEET_VEHICLES_TELEMETRY_POINTS_LOADING,
      vehicleTelemetryPointsGet: VEHICLE_TELEMETRY_POINTS,
      vehicleTelemetryPointsLoadedGet: VEHICLE_TELEMETRY_POINTS_LOADED,
      vehicleTelemetryPointsLoadingGet: VEHICLE_TELEMETRY_POINTS_LOADING
    }),
    fleetVehicles () {
      return this.fleetId ? this.operatorFleetVehiclesGet(this.fleetId) : []
    },
    fleetVehiclesCount () {
      return this.fleetVehicles.length ? this.fleetVehicles.length : null
    },
    fleetVehiclesInAlert () {
      const { vehicleTelemetryPoints, vehicleTelemetryPointsLoaded, vehicleTelemetryPointsLoading } = this
      this.resetAlertedVins()
      let alertCount = 0
      this.fleetVehicles.forEach(vin => {
        const telemetryLoaded = vehicleTelemetryPointsLoaded(vin)
        const telemetryLoading = vehicleTelemetryPointsLoading(vin)
        if (telemetryLoaded && !telemetryLoading) {
          const telemetryPoints = vehicleTelemetryPoints(vin)
          const vehicleHasTelemetryData = Object.values(telemetryPoints).some(telemetryPointData => {
            return telemetryPointData[0].point !== null
          })
          if (!vehicleHasTelemetryData) {
            this.addVinToAlertedVins(vin)
            alertCount++
          }
        }
      })
      return alertCount
    },
    fleetVehiclesTelemetryPointsLoading () {
      return this.fleetId ? this.operatorFleetVehiclesTelemetryPointsLoadingGet(this.fleetId) : true
    }
  },
  methods: {
    addVinToAlertedVins (vin) {
      this.alertedVins.push(vin)
    },
    resetAlertedVins () {
      this.alertedVins = []
    },
    toggleAlertsActive () {
      this.alertsActive = !this.alertsActive
      if (this.alertsActive) {
        this.$emit('alert:telemetry', this.alertedVins)
      } else {
        this.$emit('alert:telemetry', [])
      }
    },
    vehicleTelemetryPoints (vin) {
      return this.vehicleTelemetryPointsGet(vin)
    },
    vehicleTelemetryPointsLoaded (vin) {
      return this.vehicleTelemetryPointsLoadedGet(vin)
    },
    vehicleTelemetryPointsLoading (vin) {
      return this.vehicleTelemetryPointsLoadingGet(vin)
    }
  }
}
</script>
