<template>
  <v-card
    class="mx-auto vehicle-card vehicle-governor-card"
    height="206"
    max-width="206"
  >
    <v-card-title>
        <h3>Governor</h3>
    </v-card-title>
    <v-card-text
      :class="[vehicleGovernorStatus]"
    >
      <div class="text-container">
        <h4
          v-if="vehicleGovernorEnabled"
        >{{ vehicleGovernorMilesDisplay }}</h4>
        <h4
          v-else-if="!vehicleGovernorEnabled && vehicleGovernorAllowedDisplay"
          class="governor-allowed"
        >{{ vehicleGovernorAllowedDisplay }}</h4>
        <h4 v-else>&nbsp;</h4>
      </div>
      <div v-if="vehicleGovernorStatus === 'enabled'" class="text-container">
        <v-icon>mdi-check-circle-outline</v-icon>
      </div>
      <div v-if="vehicleGovernorStatus === 'disabled'" class="text-container">
        <v-icon>mdi-close-circle-outline</v-icon>
      </div>
      <div v-if="vehicleGovernorStatus === 'unknown'" class="text-container">
        <v-icon>mdi-help-circle-outline</v-icon>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  LOADING,
  VEHICLE_GOVERNOR,
  VEHICLE_GOVERNOR_ALLOWED,
  VEHICLE_LOADED
} from '@/store/getter-types'

export default {
  name: 'VehicleGovernorCard',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      vehicleGovernor: null
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      vehicleGovernorGet: VEHICLE_GOVERNOR,
      vehicleGovernorAllowedGet: VEHICLE_GOVERNOR_ALLOWED,
      vehicleLoadedGet: VEHICLE_LOADED
    }),
    vehicleGovernorAllowed () {
      return this.vin && this.vehicleLoaded ? this.vehicleGovernorAllowedGet(this.vin) : null
    },
    vehicleGovernorAllowedDisplay () {
      const { vehicleGovernorAllowed } = this
      if (vehicleGovernorAllowed === null) { return null }
      if (!vehicleGovernorAllowed) {
        return '[Incompatible]'
      }
      return '[Compatible]'
    },
    vehicleGovernorEnabled () {
      if (this.vehicleGovernor === null) {
        return null
      }
      return !!this.vehicleGovernor
    },
    vehicleGovernorKilometers () {
      return this.vin ? this.vehicleGovernor : null
    },
    vehicleGovernorMiles () {
      return this.vehicleGovernorKilometers ? Math.round(this.vehicleGovernorKilometers * 0.621371) : null
    },
    vehicleGovernorMilesDisplay () {
      return this.vehicleGovernorMiles ? `${this.vehicleGovernorMiles} mph` : ''
    },
    vehicleGovernorStatus () {
      if (this.vehicleGovernorEnabled) {
        return 'enabled'
      } else if (this.vehicleGovernorEnabled === null) {
        return 'unknown'
      } else {
        return 'disabled'
      }
    },
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : null
    }
  },
  watch: {
    vehicleLoaded: {
      handler (newVal) {
        if (newVal) {
          this.vehicleGovernor = this.vehicleGovernorGet(this.vin)
        }
      },
      immediate: true
    },
    loading: {
      handler (newVal) {
        if (newVal === false) {
          this.vehicleGovernor = this.vehicleGovernorGet(this.vin)
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
#app {
  .vehicle-governor-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 206px;
    .v-card__title {
      display: flex;
      justify-content: center;
    }
    h3 {
      margin-bottom: 0;
      margin-top: 0;
    }
    h4 {
      color: rgba(0, 0, 0, 0.87);
      font-size: 1.4rem;
      line-height: 1.9rem;
      margin-top: 10px;
    }
    .text-container {
      display: flex;
      justify-content: center;
      i {
        font-size: 5rem
      }
    }
    i {
      text-shadow: 1px 1px 1px #000;
    }
    .enabled {
      i {
        color: #159c2e;
      }
    }
    .disabled {
      i {
        color: red;
      }
      .governor-allowed {
        color: rgba(0, 0, 0, 0.87);
        font-size: 1.1rem;
      }
    }
    .unknown {
      i {
        color: orange;
      }
    }
  }
  &.theme--dark {
    h4 {
      color: #fff
    }
    .disabled {
      .governor-allowed {
        color: #fff
      }
    }
  }
}
</style>
