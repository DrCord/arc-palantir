<template>
  <v-row class="vehicle-status-cards">
    <v-col cols="12" lg="3" md="6" sm="12">
      <vehicle-control-card :vin="vin" />
    </v-col>
    <v-col cols="12" lg="3" md="6" sm="12">
      <vehicle-governor-card :vin="vin" />
    </v-col>
    <v-col cols="12" lg="3" md="6" sm="12">
      <vehicle-managed-session-mode-card :vin="vin" />
    </v-col>
    <v-col cols="12" lg="3" md="6" sm="12">
      <vehicle-sync-card :vin="vin" />
    </v-col>
  </v-row>
</template>

<script>
import VehicleControlCard from '@/components/Vehicles/VehicleControlCard.vue'
import VehicleGovernorCard from '@/components/Vehicles/VehicleGovernorCard.vue'
import VehicleManagedSessionModeCard from '@/components/Vehicles/VehicleManagedSessionModeCard.vue'
import VehicleSyncCard from '@/components/Vehicles/VehicleSyncCard.vue'

export default {
  name: 'VehicleStatusCards',
  components: {
    VehicleControlCard,
    VehicleGovernorCard,
    VehicleManagedSessionModeCard,
    VehicleSyncCard
  },
  props: {
    vin: {
      default: null,
      type: String
    }
  }
}
</script>

<style lang="scss">
#app {
  .vehicle-status-cards {
    margin: 0px auto 5px;
    width: 100%;
    justify-content: right;
  }
}
</style>
