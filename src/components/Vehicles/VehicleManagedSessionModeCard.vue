<template>
  <v-card
    class="mx-auto vehicle-card vehicle-manged-session-mode-card"
    height="206"
    max-width="206"
  >
    <v-card-title>
      <h3>Managed Session Mode</h3>
    </v-card-title>
    <v-card-text
      :class="[vehicleManagedSessionModeStatus]"
    >
      <div v-if="vehicleManagedSessionModeStatus === 'enabled'" class="text-container">
        <v-icon>mdi-check-circle-outline</v-icon>
      </div>
      <div v-if="vehicleManagedSessionModeStatus === 'disabled'" class="text-container">
        <v-icon>mdi-close-circle-outline</v-icon>
      </div>
      <div v-if="vehicleManagedSessionModeStatus === 'unknown'" class="text-container">
        <v-icon>mdi-help-circle-outline</v-icon>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  LOADING,
  VEHICLE_MANAGED_SESSION_MODE,
  VEHICLE_LOADED
} from '@/store/getter-types'

export default {
  name: 'VehicleMangedSessionModeCard',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      vehicleMangedSessionMode: null
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      vehicleMangedSessionModeGet: VEHICLE_MANAGED_SESSION_MODE,
      vehicleLoadedGet: VEHICLE_LOADED
    }),
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : null
    },
    vehicleManagedSessionModeStatus () {
      if (this.vehicleMangedSessionMode) {
        return 'enabled'
      } else if (this.vehicleMangedSessionMode === null) {
        return 'unknown'
      } else {
        return 'disabled'
      }
    }
  },
  watch: {
    vehicleLoaded: {
      handler (newVal) {
        if (newVal) {
          this.vehicleMangedSessionMode = this.vehicleMangedSessionModeGet(this.vin)
        }
      },
      immediate: true
    },
    loading: {
      handler (newVal) {
        if (newVal === false) {
          this.vehicleMangedSessionMode = this.vehicleMangedSessionModeGet(this.vin)
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
#app {
  .vehicle-manged-session-mode-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 206px;
    .v-card__title {
      display: flex;
      justify-content: center;
      word-break: break-word;
    }
    h3 {
      line-height: 1.1;
      margin-bottom: 0;
      margin-top: 0;
    }
    h4 {
      font-size: 1.4rem;
      margin-top: 10px;
    }
    .text-container {
      display: flex;
      justify-content: center;
      i {
        font-size: 5rem
      }
    }
    h4, i {
        text-shadow: 1px 1px 1px #000;
      }
    .enabled {
      h4, i {
        color: #159c2e;
      }
    }
    .disabled {
      h4, i {
        color: red;
      }
    }
    .unknown {
      h4, i {
        color: orange;
      }
    }
  }
}
</style>
