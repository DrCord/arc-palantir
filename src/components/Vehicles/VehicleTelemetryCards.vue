<template>
  <v-row class="vehicle-telemetry-cards">
    <v-col cols="12" lg="3" md="4" sm="6">
      <vehicle-gps-record-card :vin="vin"/>
    </v-col>
    <v-col cols="12" lg="3" md="4" sm="6">
      <vehicle-updated-card :vin="vin"/>
    </v-col>
    <v-col cols="12" lg="3" md="4" sm="6">
      <vehicle-state-of-charge
        v-if="operatorControlsVehicle"
        :vin="vin"
      />
    </v-col>
    <v-col cols="12" lg="3" md="4" sm="6">
      <vehicle-odometer
        v-if="operatorControlsVehicle"
        :vin="vin"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { OPERATOR_CONTROLS_VEHICLE } from '@/store/getter-types'

import VehicleGpsRecordCard from '@/components/Vehicles/VehicleGpsRecordCard.vue'
import VehicleOdometer from '@/components/Vehicles/VehicleOdometer.vue'
import VehicleStateOfCharge from './VehicleSOC.vue'
import VehicleUpdatedCard from '@/components/Vehicles/VehicleUpdatedCard.vue'

export default {
  name: 'VehicleTelemetryCards',
  components: {
    VehicleGpsRecordCard,
    VehicleOdometer,
    VehicleStateOfCharge,
    VehicleUpdatedCard
  },
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      operatorControlsVehicleGet: OPERATOR_CONTROLS_VEHICLE
    }),
    operatorControlsVehicle () {
      return this.vin ? this.operatorControlsVehicleGet(this.vin) : null
    }
  }
}
</script>

<style lang="scss">
#app {
  .vehicle-telemetry-cards {
    margin: 0px auto 20px;
    width: 100%;
    justify-content: center;
  }
  &.mobile {
    .vehicle-telemetry-cards {
      .vehicle-card {
        margin: 0 auto;
      }
    }
  }
}
</style>
