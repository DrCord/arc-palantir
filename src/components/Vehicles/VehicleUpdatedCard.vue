<template>
  <div class="vehicle-telemetry-last-updated-container">
    <v-card
      max-width="206"
      class="vehicle-card telemetry-last-updated-card"
      color="card"
    >
      <v-card-title class="justify-center">Last Updated</v-card-title>
      <v-card-text>
        <v-container
          :class="[lastUpdatedDisplay ? 'enabled' : 'unknown']"
          class="content"
        >
          <v-row class="h5">{{ lastUpdatedDisplay ? lastUpdatedDisplay : 'Unknown' }}</v-row>
          <v-row><v-icon>mdi-update</v-icon></v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  VEHICLE_TELEMETRY_POINTS_LOADED,
  VEHICLE_TELEMETRY_UPDATED
} from '@/store/getter-types'
import dateUtility from '@/lib/dateUtility'

export default {
  name: 'VehicleTelemetryLastUpdatedCard',
  props: {
    itemWidth: {
      default: '160px',
      type: String
    },
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      vehicleTelemetryPoints: null,
      vehicleTelemetryUpdated: null
    }
  },
  computed: {
    ...mapGetters({
      vehicleTelemetryPointsLoadedGet: VEHICLE_TELEMETRY_POINTS_LOADED,
      vehicleTelemetryUpdatedGet: VEHICLE_TELEMETRY_UPDATED
    }),
    lastUpdatedDisplay () {
      const { vehicleTelemetryUpdated } = this
      if (!vehicleTelemetryUpdated) { return null }
      return dateUtility.formatTsFromNowTelemetry(vehicleTelemetryUpdated)
    },
    vehicleTelemetryPointsLoaded () {
      return this.vin ? this.vehicleTelemetryPointsLoadedGet(this.vin) : null
    }
  },
  watch: {
    vehicleTelemetryPointsLoaded: {
      handler (newVal) {
        if (newVal) {
          this.vehicleTelemetryUpdatedSet()
        }
      },
      immediate: true
    }
  },
  methods: {
    vehicleTelemetryUpdatedSet () {
      this.vehicleTelemetryUpdated = this.vehicleTelemetryUpdatedGet(this.vin)
    }
  }
}
</script>

<style lang="scss">
#app {
  .vehicle-telemetry-last-updated-container {
    .telemetry-last-updated-card {
      height: 230px;
      .content {
        display: flex;
        flex-direction: column;
      }
      h5 {
        font-size: 0.8rem;
        text-align: center;
        overflow-wrap: break-word;
      }
      .row {
        display: flex;
        justify-content: center;
        &.h5 {
          font-size: 1.2rem;
        }
      }
      .disabled,
      .unknown {
        i {
          color: red;
          text-shadow: 1px 1px 1px #000;
        }
      }
      .enabled {
        i {
          color: #159c2e;
          text-shadow: 1px 1px 1px #000;
        }
      }
      i {
        font-size: 6rem;
      }
      .v-card__title {
        padding-left: 0;
        padding-right: 0;
        text-align: center;
        span {
          word-break: break-word;
        }
      }
    }
  }
}
</style>
