<template>
  <v-card
    class="fleet-statistics-card rounded fleet-mileage-card"
    :height="`${cardHeight}px`"
  >
    <v-card-title>
      <h5>Fleet<br>Mileage</h5>
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
      <h6 v-if="telemetryLoaded.length"><span class="count">{{ mileageDisplay }}</span>Mi</h6>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLES_TELEMETRY_RETRIEVE } from '@/store/action-types'
import {
  LOADING,
  OPERATOR_FLEET_VEHICLES,
  OPERATOR_FLEET_VEHICLES_TELEMETRY_POINTS_LOADING,
  VEHICLES_TELEMETRY_MILEGAGE_TOTAL
} from '@/store/getter-types'

export default {
  name: 'FleetMileageCard',
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
      vehiclesTelemetryMileageTotal: null
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      operatorFleetVehiclesGet: OPERATOR_FLEET_VEHICLES,
      operatorFleetVehiclesTelemetryPointsLoadingGet: OPERATOR_FLEET_VEHICLES_TELEMETRY_POINTS_LOADING,
      vehiclesTelemetryMileageTotalGet: VEHICLES_TELEMETRY_MILEGAGE_TOTAL
    }),
    dataAvailable () {
      return this.fleetVehicles.length && this.telemetryLoaded && !this.fleetVehiclesTelemetryPointsLoading
    },
    fleetVehicles () {
      return this.fleetId ? this.operatorFleetVehiclesGet(this.fleetId) : []
    },
    fleetVehiclesTelemetryPointsLoading () {
      return this.fleetId ? this.operatorFleetVehiclesTelemetryPointsLoadingGet(this.fleetId) : true
    },
    mileageDisplay () {
      const { vehiclesTelemetryMileageTotal } = this
      if (vehiclesTelemetryMileageTotal === null) {
        return null
      }
      return parseInt(vehiclesTelemetryMileageTotal, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  watch: {
    telemetryLoaded: {
      handler (newVal) {
        if (newVal) {
          this.vehiclesTelemetryMileageTotal = this.vehiclesTelemetryMileageTotalGet(this.fleetVehicles)
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      vehiclesTelemetryRetrieveAction: VEHICLES_TELEMETRY_RETRIEVE
    })
  }
}
</script>
