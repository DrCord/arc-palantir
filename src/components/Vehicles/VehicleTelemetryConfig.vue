<template>
  <div class="telemetry-config-container">
    <h3>Telemetry Report Config</h3>
    <div class="items">
      <v-list-item v-for="item in telemetryConfigDisplay" :key="item.camel">
        <v-list-item-content>
          <v-list-item-title>{{ item.display }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  VEHICLE_LOADED,
  VEHICLE_TELEMETRY_CONFIG
} from '@/store/getter-types'

export default {
  name: 'VehicleTelemetryConfig',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      vehicleLoadedGet: VEHICLE_LOADED,
      vehicleTelemetryConfigGet: VEHICLE_TELEMETRY_CONFIG
    }),
    telemetryConfig () {
      return this.vin && this.vehicleLoaded ? this.vehicleTelemetryConfigGet(this.vin) : []
    },
    telemetryConfigDisplay () {
      if (this.telemetryConfig) {
        return this.vehicleTelemetryConfigGet(this.vin).map(item => {
          const output = {
            camel: item,
            display: this.capitalizeFirstLetter(item.replace(/([a-z])([A-Z])/g, '$1 $2'))
          }
          return output
        }).sort((a, b) => (a.display > b.display) ? 1 : ((b.display > a.display) ? -1 : 0))
      }
      return []
    },
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : {}
    }
  },
  methods: {
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle {
    .telemetry-config-container {
      .items {
        columns: auto;
        @media screen and (max-width: 992px) {
          columns: 1;
        }
        @media screen and (min-width: 992px) {
          columns: 2;
        }
      }
      h3 {
        text-align: left;
      }
      margin-bottom: 20px;
    }
  }
}

</style>
