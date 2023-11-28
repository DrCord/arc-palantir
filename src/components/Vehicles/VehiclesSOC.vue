<template>
  <div
    v-if="vehicleTelemetryPointsLoaded"
    class="vehicles-soc-container"
  >
    <h3 v-if="!singleItem">State of Charge</h3>
    <div
      v-masonry
      class="vehicles-container"
      transition-duration="0.3s"
      item-selector=".vehicle"
      gutter="20"
      :fit-width="true"
    >
      <div
        v-for="vehicle in vehicles"
        :key="vehicle.vin"
      >
        <vehicle-state-of-charge
          :vin="vehicle.vin"
          :single-item="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLES_TELEMETRY_RETRIEVE } from '@/store/action-types'
import {
  OPERATOR_CONTROLS_VEHICLE,
  OPERATOR_VINS,
  VEHICLE_TELEMETRY_UPDATED
} from '@/store/getter-types'

import VehicleStateOfCharge from '@/components/Vehicles/VehicleSOC.vue'
import dateUtility from '@/lib/dateUtility'

export default {
  name: 'VehiclesSOC',
  components: {
    VehicleStateOfCharge
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
    vins: {
      default: () => [],
      type: Array
    }
  },
  data () {
    return {
      vehiclesTelemetryPoints: {},
      vehicleTelemetryPointsLoaded: null,
      telemetryRefreshCounter: null,
      telemetryRefreshTimeout: null,
      showVehicleUpdatedToast: true
    }
  },
  computed: {
    ...mapGetters({
      operatorControlsVehicleGet: OPERATOR_CONTROLS_VEHICLE,
      operatorVins: OPERATOR_VINS,
      vehicleTelemetryUpdatedGet: VEHICLE_TELEMETRY_UPDATED
    }),
    allowedVins () {
      return this.vins.filter(vin => this.operatorVins.includes(vin))
    },
    vehicles () {
      const vehicles = []
      if (this.allowedVins && this.vehiclesTelemetryPoints) {
        this.allowedVins.forEach((vin) => {
          const vehicle = {
            vin,
            telemetryPoints: {}
          }
          if (this.vehiclesTelemetryPoints[vin]) {
            for (const telemetryPoint in this.vehiclesTelemetryPoints[vin]) {
              const vehicleTelemetryPoints = this.vehiclesTelemetryPoints[vin]
              vehicle.telemetryPoints[telemetryPoint] = vehicleTelemetryPoints[telemetryPoint]
            }
          }
          vehicles.push(vehicle)
        })
      }
      return vehicles
    },
    darkModeEnabled () {
      return this.$vuetify.theme.dark
    },
    singleItem () {
      return this.allowedVins.length <= 1
    },
    vehicleTelemetryUpdated () {
      return this.vin
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
    allowedVins (newVal, oldVal) {
      if (newVal.length && newVal !== oldVal) {
        this.handleVehiclesTelemetryGetRequest()
      }
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
      if (this.allowedVins.length) {
        this.handleVehiclesTelemetryGetRequest()
      }
    },
    async handleVehiclesTelemetryGetRequest () {
      const vins = this.allowedVins
      const payload = {
        vins,
        telemetryPoints: ['bms_pack_soc'],
        idToken: '',
        componentSelf: this,
        requestType: 'soc'
      }
      await this.vehiclesTelemetryRetrieveAction(payload)
      this.vehicleTelemetryPointsLoaded = true
      this.setTelemetryRefreshed()
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
    vehicleShowLastUpdated (vehicle) {
      if (this.showVehicleUpdatedToast) {
        this.showVehicleUpdatedToast = false
        const vehicleTelemetryUpdated = this.vehicleTelemetryUpdatedGet(vehicle.vin)
        if (vehicleTelemetryUpdated) {
          const lastUpdated = dateUtility.formatTsFromNowTelemetry(vehicleTelemetryUpdated)
          const toastPayload = {
            msg: `${vehicle.vin} last updated ${lastUpdated}`,
            icon: 'history'
          }
          this.$emit('toast', toastPayload)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.vehicles-soc-container {
  width: 100%;
  .vehicle {
    border-radius: 7px;
    cursor: pointer;
    height: 230px;
    margin-bottom: 20px;
    padding: 8px 10px 2px;
    h5 {
      font-size: 0.9rem;
      text-align: center;
      overflow-wrap: break-word;
    }
    .v-card__title {
      text-align: center;
      span {
        word-break: break-word;
      }
    }
  }
}
#app {
  .vehicle-card-content {
    color: #333;
  }
}
</style>
