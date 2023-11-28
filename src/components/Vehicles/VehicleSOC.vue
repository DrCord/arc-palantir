<template>
  <div class="vehicle-soc-container">
    <v-card
      v-masonry-tile
      max-width="206"
      class="vehicle vehicle-card soc-card"
      :class="[singleItem ? 'single' : 'multiple']"
      v-on="!singleItem ? { click: () => navigateToVehicle(vin) } : {}"
      @mouseenter="vehicleShowLastUpdated(vin)"
      @mouseout="showVehicleUpdatedToast = true"
    >
      <v-card-title
        :class="{
          'fleet-id--text': darkModeEnabled,
          'gray-blue--text': !darkModeEnabled,
        }"
        class="justify-center"
      >
      <span v-if="!singleItem">{{ vin }}</span>
      <span v-if="singleItem">Battery Charge</span>
      </v-card-title>
      <StateOfCharge :percentage="vehicleSocPoint ? Math.round(vehicleSocPoint) : 0" />
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLES_TELEMETRY_RETRIEVE } from '@/store/action-types'
import {
  OPERATOR_CONTROLS_VEHICLE,
  OPERATOR_VINS,
  VEHICLE_SOC,
  VEHICLE_TELEMETRY_POINTS_LOADED,
  VEHICLE_TELEMETRY_UPDATED
} from '@/store/getter-types'

import StateOfCharge from '@/components/StateOfCharge/StateOfCharge.vue'
import dateUtility from '@/lib/dateUtility'

export default {
  name: 'VehicleSOC',
  components: {
    StateOfCharge
  },
  props: {
    itemWidth: {
      default: '160px',
      type: String
    },
    refreshPeriod: {
      default: 60,
      type: Number
    },
    singleItem: {
      default: true,
      type: Boolean
    },
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      vehicleSoc: null,
      vehicleTelemetryPointsLoaded: null,
      vehicleTelemetryUpdated: null,
      telemetryRefreshCounter: null,
      telemetryRefreshTimeout: null,
      showVehicleUpdatedToast: true
    }
  },
  computed: {
    ...mapGetters({
      operatorControlsVehicleGet: OPERATOR_CONTROLS_VEHICLE,
      operatorVins: OPERATOR_VINS,
      vehicleSocGet: VEHICLE_SOC,
      vehicleTelemetryPointsLoadedGet: VEHICLE_TELEMETRY_POINTS_LOADED,
      vehicleTelemetryUpdatedGet: VEHICLE_TELEMETRY_UPDATED
    }),
    darkModeEnabled () {
      return this.$vuetify.theme.dark
    },
    vehicleSocPoint () {
      return this.vehicleSoc ? this.vehicleSoc.point : null
    }
  },
  watch: {
    telemetryRefreshCounter: {
      handler (value) {
        if (this.refreshPeriod !== 0) {
          if (value > 1) {
            clearTimeout(this.telemetryRefreshTimeout)
            this.telemetryRefreshTimeout = setTimeout(() => {
              this.telemetryRefreshCounter--
            }, 1000)
          } else {
            this.handleVehiclesTelemetryGetRequest()
          }
        }
      }
    },
    vehicleTelemetryPointsLoaded: {
      handler (newVal) {
        if (newVal) {
          this.vehicleTelemetryUpdatedSet()
        }
      },
      immediate: true
    },
    vehicleTelemetryUpdated: {
      handler (newVal) {
        if (newVal) {
          this.vehicleSocSet()
        }
      },
      immediate: true
    },
    vin: {
      handler (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.handleVehiclesTelemetryGetRequest()
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      vehiclesTelemetryRetrieveAction: VEHICLES_TELEMETRY_RETRIEVE
    }),
    init () {
      this.vehicleTelemetryPointsLoadedSet()
      this.vehicleSocSet()
    },
    async handleVehiclesTelemetryGetRequest () {
      if (this.singleItem) {
        const vins = [this.vin]
        const payload = {
          vins,
          telemetryPoints: ['bms_pack_soc'],
          idToken: '',
          componentSelf: this,
          requestType: 'soc'
        }
        await this.vehiclesTelemetryRetrieveAction(payload)
        this.vehicleTelemetryPointsLoadedSet()
        this.vehicleSocSet()
        this.setTelemetryRefreshed()
      }
    },
    navigateToVehicle (vin) {
      this.$router.push({
        name: 'vehicle',
        params: { vin }
      })
    },
    operatorControlsVehicle () {
      return this.vin ? this.operatorControlsVehicleGet(this.vin) : null
    },
    setTelemetryRefreshed () {
      this.telemetryRefreshCounter = this.refreshPeriod + 1
    },
    vehicleSocSet () {
      this.vehicleSoc = this.vehicleSocGet(this.vin)
    },
    vehicleShowLastUpdated (vin) {
      if (this.showVehicleUpdatedToast) {
        this.showVehicleUpdatedToast = false
        const vehicleTelemetryUpdated = this.vehicleTelemetryUpdatedGet(vin)
        if (vehicleTelemetryUpdated) {
          const lastUpdated = dateUtility.formatTsFromNowTelemetry(vehicleTelemetryUpdated)
          const toastPayload = {
            msg: `${vin} last updated ${lastUpdated}`,
            icon: 'history'
          }
          this.$emit('toast', toastPayload)
        }
      }
    },
    vehicleTelemetryUpdatedSet () {
      this.vehicleTelemetryUpdated = this.vehicleTelemetryUpdatedGet(this.vin)
    },
    vehicleTelemetryPointsLoadedSet () {
      this.vehicleTelemetryPointsLoaded = this.vehicleTelemetryPointsLoadedGet(this.vin)
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle-soc-container {
    .vehicle-card-content {
      color: #333;
    }
    .vehicle {
      cursor: pointer;
      height: 230px;
      h5 {
        font-size: 0.9rem;
        text-align: center;
        overflow-wrap: break-word;
      }
      .v-card__title {
        text-align: center;
        span {
          color: rgba(0, 0, 0, 0.87);
          word-break: break-word;
        }
      }
      .single-chart {
        display: flex;
        justify-content: center;
      }
      &.multiple {
        .v-card__title {
          span {
            line-height: 1.4rem;
          }
        }
      }
      &.theme--dark {
        .v-card__title {
          span {
            color: white
          }
        }
      }
    }
  }
}
</style>
