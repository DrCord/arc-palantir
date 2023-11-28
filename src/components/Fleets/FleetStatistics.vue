<template>
  <v-row class="fleet-statistics">
    <v-col cols="12" xl="4" lg="6" md="12" sm="12">
      <fleet-vehicles-count-card :fleet-id="fleetId" />
    </v-col>
    <v-col cols="12" xl="5" lg="6" md="12" sm="12">
      <fleet-mileage-card
        :fleet-id="fleetId"
        :telemetry-loaded="telemetryLoaded"
      />
    </v-col>
    <v-col cols="12" xl="3" lg="6" md="12" sm="12">
      <fleet-alerts-card
        :fleet-id="fleetId"
        :telemetry-loaded="telemetryLoaded"
        @alert:telemetry="telemetryAlert"
      />
    </v-col>
  </v-row>
</template>

<script>
import FleetAlertsCard from '@/components/Fleets/FleetAlertsCard.vue'
import FleetMileageCard from '@/components/Fleets/FleetMileageCard.vue'
import FleetVehiclesCountCard from '@/components/Fleets/FleetVehiclesCountCard.vue'

export default {
  name: 'FleetStatistics',
  components: {
    FleetMileageCard,
    FleetAlertsCard,
    FleetVehiclesCountCard
  },
  props: {
    fleetId: {
      default: null,
      type: Number
    },
    telemetryLoaded: {
      default: () => [],
      type: Array
    }
  },
  methods: {
    telemetryAlert (event) {
      this.$emit('alert:telemetry', event)
    }
  }
}
</script>

<style lang="scss">
#app {
  .fleet-statistics {
    margin: 10px auto 0;
    width: 100%;
    .fleet-statistics-card {
      display: flex;
      margin-bottom: 10px;
      .telemetry-data-loading-container {
        position: absolute;
        top: 10px;
        right: 10px;
      }
      .v-card__title {
        align-items: flex-start;
        padding-right: 0;
        padding-left: 10px;
        padding-top: 25px;
        min-width: 75px;
        width: 20%;
        h5 {
          font-size: 0.8rem;
          margin: 0;
        }
      }
      .v-card__text {
        padding-left: 0;
        padding-top: 16px;
        width: 80%;
        h6 {
          font-size: 1.2rem;
          padding-right: 5px;
          text-align: right;
          .count {
            font-size: 3.3rem;
            padding-right: 5px;
          }
        }
      }
    }
  }
}
#app {
  &.theme--dark {
    .fleet-statistics {
      .fleet-statistics-card {
        .v-card__title {
          h5 {
          color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
  }
}
</style>
