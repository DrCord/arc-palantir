<template>
  <v-card
    class="fleet-statistics-card rounded fleet-count-card"
    :height="`${cardHeight}px`"
  >
    <v-card-title>
      <h5>Fleet<br>Count</h5>
    </v-card-title>
    <v-card-text>
      <div
        v-if="loading && fleetVehiclesCount === null"
        class="telemetry-data-loading-container"
      >
        <v-progress-circular
          indeterminate
          size="50"
          width="5"
        ></v-progress-circular>
      </div>
      <h6 v-if="fleetVehiclesCount !== null"><span class="count">{{ fleetVehiclesCount }}</span>Vehicles</h6>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  LOADING,
  OPERATOR_FLEET_VEHICLES
} from '@/store/getter-types'

export default {
  name: 'FleetVehiclesCountCard',
  props: {
    cardHeight: {
      default: 100,
      type: Number
    },
    fleetId: {
      default: null,
      type: Number
    }
  },
  computed: {
    ...mapGetters({
      operatorFleetVehiclesGet: OPERATOR_FLEET_VEHICLES,
      loading: LOADING
    }),
    fleetVehicles () {
      return this.fleetId ? this.operatorFleetVehiclesGet(this.fleetId) : []
    },
    fleetVehiclesCount () {
      return this.fleetVehicles.length ? this.fleetVehicles.length : null
    }
  }
}
</script>
