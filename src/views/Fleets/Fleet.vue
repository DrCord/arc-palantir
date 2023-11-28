<template>
  <div v-if="!fleetIsArcimoto" class="fleet">
    <page-header
      :title="fleet ? fleet.name : null"
      title-loading="Fleet Information"
      :right-bottom="telemetryLastUpdatedDisplay"
      :subtitle="fleet && fleet.id ? `Fleet ID: ${fleet.id}` : null"
      :quick-links="quickLinksLocal"
      @quick-link-event="handleQuickLink"
    />
    <div class="fleet-container content-container">
      <div
        class="view-container"
      >
        <fleet-locations
          :active-item="vehicleInfoPanelVin"
          :fleet-id="fleetId"
          :filtered-vins="filteredVins"
          :telemetry-loaded="telemetryLoaded"
          @marker-active="vehicleInfoOpen"
        />
        <vehicle-details-panel
          :telemetry-loaded="telemetryLoaded"
          :vin="vehicleInfoPanelVin"
          @close="vehicleInfoClose"
        />
        <fleet-statistics
          :fleet-id="fleetId"
          :telemetry-loaded="telemetryLoaded"
          @alert:telemetry="telemetryAlert"
        />
       <a id="vehicles"></a>
        <v-card
          v-if="fleetVehicles.length"
          class="filters"
        >
          <v-container fluid class="filter">
            <v-row class="filter-fields">
              <v-col :cols="4">
                  <v-row class="pa-3">
                    <v-text-field
                      v-model="vinFilterValue"
                      append-icon="search"
                      clearable
                      dense
                      hide-details
                      outlined
                      placeholder="Filter by text match"
                      aria-label="Filter by text match"
                      class="text-filter vin-filter"
                    />
                  </v-row>
              </v-col>
              <v-col :cols="4">
                  <v-row class="pa-3">
                    <v-select
                      v-model="modelFilterValue"
                      :items="vehicleModelNames"
                      label="Model"
                      clearable
                      dense
                      hide-details
                      outlined
                      class="model-names"
                    />
                  </v-row>
              </v-col>
              <v-col :cols="4">
                  <v-row class="pa-3">
                    <v-select
                      v-model="yearFilterValue"
                      :items="vehiclesYears"
                      label="Year"
                      clearable
                      dense
                      hide-details
                      outlined
                      class="vehicles-years"
                    />
                  </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <div class="fleet-tile-view-toggle-container">
         <v-btn
            :aria-label="fleetTileViewText"
            :disabled="loading"
            ripple
            @click="fleetTileViewToggle"
          >{{ fleetTileViewText }}
          </v-btn>
        </div>
        <div
          v-if=fleetTileView
          v-masonry
          class="fleet-vehicle-cards-container"
          gutter="10"
        >
          <fleet-vehicle-card
            v-for="vin in fleetVehicles"
            :key="vin"
            :show="filteredVins.includes(vin)"
            :telemetry-loaded="telemetryLoaded"
            :vin="vin"
          />
        </div>
        <div
          v-if=!fleetTileView
          class="view-container"
        >
          <fleet-table
            :fleet-vehicles = fleetVehicles
            :fleet-id="fleetId"
            :filtered-vins="filteredVins"
            :telemetry-loaded="telemetryLoaded"
          >
          </fleet-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  OPERATOR_FLEETS_SUMMON,
  VEHICLE_TELEMETRY_RETRIEVE
} from '@/store/action-types'
import {
  FLEET_VEHICLES,
  OPERATOR_FLEET_VEHICLES_TELEMETRY_POINTS_LOADING,
  LOADING,
  OPERATOR,
  OPERATOR_FLEETS,
  OPERATOR_LOADED,
  VEHICLE_MODEL,
  VEHICLE_YEAR,
  VEHICLES_MODELS,
  VEHICLES_TELEMETRY_UPDATED
} from '@/store/getter-types'

import FleetLocations from '@/components/Fleets/FleetLocations.vue'
import FleetStatistics from '@/components/Fleets/FleetStatistics.vue'
import FleetVehicleCard from '@/components/Fleets/FleetVehicleCard.vue'
import PageHeader from '@/components/PageHeader.vue'
import VehicleDetailsPanel from '@/components/Fleets/VehicleDetailsPanel.vue'
import FleetTable from '@/components/Fleets/FleetTable.vue'

import DateUtility from '@/lib/dateUtility'
import utility from '@/lib/utility'

export default {
  name: 'FleetView',
  components: {
    FleetLocations,
    FleetStatistics,
    FleetVehicleCard,
    PageHeader,
    VehicleDetailsPanel,
    FleetTable
  },
  data () {
    return {
      alertedVins: [],
      currentYear: new Date().getFullYear(),
      view: 'overview',
      fleetId: null,
      locationRefreshFrequency: 60 * 5, // 5 mins
      modelFilterValue: '',
      refreshFrequency: 60 * 5, // 5 mins
      startYear: 2019,
      telemetryRefreshCounter: null,
      telemetryRefreshTimeout: null,
      telemetryLoaded: [],
      vehicleInfoPanelVin: null,
      vehicleInfoPanelVisible: false,
      vehiclesTelemetryUpdated: null,
      vinFilterValue: '',
      yearFilterValue: '',
      fleetTileView: true
    }
  },
  computed: {
    ...mapGetters({
      fleetVehiclesGet: FLEET_VEHICLES,
      loading: LOADING,
      operator: OPERATOR,
      operatorFleets: OPERATOR_FLEETS,
      operatorFleetVehiclesTelemetryPointsLoadingGet: OPERATOR_FLEET_VEHICLES_TELEMETRY_POINTS_LOADING,
      operatorLoaded: OPERATOR_LOADED,
      vehiclesModels: VEHICLES_MODELS,
      vehicleModelGet: VEHICLE_MODEL,
      vehicleYearGet: VEHICLE_YEAR,
      vehiclesTelemetryUpdatedGet: VEHICLES_TELEMETRY_UPDATED
    }),
    dataAvailable () {
      return this.fleetId && !this.loading
    },
    filteredVins () {
      const { filterAlert, filterModel, filterVin, filterYear, vehicleModelGet, vehicleYearGet } = this
      return this.fleetVehicles.filter(vin => {
        return filterAlert(vin) &&
               filterModel(vehicleModelGet(vin)) &&
               filterYear(vehicleYearGet(vin)) &&
               filterVin(vin)
      })
    },
    fleet () {
      const { fleetId, operatorFleets } = this
      const fleetDefault = {
        id: null,
        name: null,
        users: [],
        vehicles: []
      }
      if (!fleetId) {
        return fleetDefault
      }
      fleetDefault.id = fleetId
      if (!operatorFleets || !operatorFleets.length) {
        return fleetDefault
      }
      const operatorFleet = this.operatorFleets.find(item => item.id === this.fleetId)
      if (operatorFleet) {
        return operatorFleet
      }
      return fleetDefault
    },
    fleetIsArcimoto () {
      return parseInt(this.$route.params.fleetId, 10) === 1
    },
    fleetTileViewText () {
      return this.fleetTileView ? 'View List' : 'View Tiles'
    },
    fleetVehicles () {
      return this.fleet && this.fleet.vins ? this.fleet.vins : []
    },
    fleetVehiclesTelemetryPointsLoading () {
      return this.fleet.id ? this.operatorFleetVehiclesTelemetryPointsLoadingGet(this.fleetId) : null
    },
    quickLinksLocal () {
      const links = [
        { text: 'Vehicles', href: '#vehicles', icon: 'none' }
      ]
      return links
    },
    telemetryLastUpdatedDisplay () {
      const { fleetVehiclesTelemetryPointsLoading, vehiclesTelemetryUpdated } = this
      if (!fleetVehiclesTelemetryPointsLoading && vehiclesTelemetryUpdated) {
        return `Last Update: ${this.formatDateAndTime(vehiclesTelemetryUpdated)}`
      }
      return null
    },
    vehicleModelNames () {
      const modelNames = []
      if (typeof this.vehiclesModels !== 'undefined') {
        this.vehiclesModels.forEach(model => {
          modelNames.push(model.modelName)
        })
      }
      return modelNames.sort()
    },
    vehiclesYears () {
      // Sequence generator function (commonly referred to as "range", e.g. Clojure, PHP etc)
      const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))

      const years = range(this.startYear, this.currentYear, 1)
      return years
    }
  },
  watch: {
    fleetVehicles (newVal, oldVal) {
      if (newVal.length && newVal !== oldVal) {
        this.showToastTelemetry(true)
        this.fleetVehicles.forEach(vin => {
          this.handleVehiclesTelemetryGetRequest(vin)
        })
      }
    },
    operatorLoaded: {
      handler (newVal) {
        if (newVal) {
          this.getData()
        }
      },
      immediate: true
    },
    telemetryLoaded: {
      handler (newVal) {
        if (newVal && newVal.length) {
          this.vehiclesTelemetryUpdated = this.vehiclesTelemetryUpdatedGet(this.fleetVehicles)
        }
      },
      immediate: true
    },
    telemetryRefreshCounter: {
      handler (value) {
        if (value > 1) {
          clearTimeout(this.telemetryRefreshTimeout)
          this.telemetryRefreshTimeout = setTimeout(() => {
            this.telemetryRefreshCounter--
          }, 1000)
        } else {
          this.showToastTelemetry(true)
          this.fleetVehicles.forEach(vin => {
            this.handleVehiclesTelemetryGetRequest(vin)
          })
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      operatorFleetsSummonAction: OPERATOR_FLEETS_SUMMON,
      vehicleTelemetryRetrieveAction: VEHICLE_TELEMETRY_RETRIEVE
    }),
    init () {
      const { fleetIsArcimoto } = this
      // TODO - needs to check if operator is in fleet and redirect if not
      if (!this.$route.params.fleetId || fleetIsArcimoto) {
        if (fleetIsArcimoto) {
          this.showToastFleetIsArcimotoRedirect()
        }
        this.redirectToFleets()
      }
    },
    filterAlert (value) {
      if (!this.alertedVins || this.alertedVins.length === 0) {
        return true
      }
      return this.alertedVins.includes(value)
    },
    filterModel (value) {
      if (!this.modelFilterValue) {
        return true
      }
      // Check if the current loop value equals to the selected value at the <v-select>.
      return value === this.modelFilterValue
    },
    filterVin (value) {
      if (!this.vinFilterValue) {
        return true
      }
      // Check if the current loop value partially contains the searched word.
      return value.toLowerCase().includes(this.vinFilterValue.toLowerCase())
    },
    filterYear (value) {
      if (!this.yearFilterValue) {
        return true
      }
      // Check if the current loop value equals to the selected value at the <v-select>.
      return value === this.yearFilterValue
    },
    fleetTileViewToggle () {
      this.fleetTileView = !this.fleetTileView
    },
    formatDateAndTime (datetime) {
      return DateUtility.formatDateAndTime(datetime)
    },
    async getData () {
      const { operator } = this
      const componentSelf = this
      const fleetId = parseInt(this.$route.params.fleetId, 10)
      await this.operatorFleetsSummonAction({ componentSelf, operator })
      this.fleetId = fleetId
    },
    handleQuickLink (quick) {
      if (quick === 'fleet-vehicles') {
        this.view = 'vehicles'
      } else {
        this.view = 'overview'
      }
    },
    redirectToFleets () {
      utility.redirect(this, 'fleets')
    },
    telemetryAlert (vins) {
      this.alertedVins = vins
    },
    async handleVehiclesTelemetryGetRequest (vin) {
      if (this.fleetVehicles.length) {
        const payload = {
          vin,
          telemetryPoints: [
            'bms_pack_soc',
            'gps_latitude',
            'gps_longitude',
            'odometer'
          ],
          idToken: '',
          componentSelf: this,
          requestType: 'multiple'
        }
        /* eslint-disable prefer-const */
        let response = await this.vehicleTelemetryRetrieveAction(payload)
        if (response) {
          this.telemetryLoaded.push(vin)
          this.setTelemetryRefreshed()
        }
      }
    },
    setTelemetryRefreshed () {
      this.telemetryRefreshCounter = this.refreshFrequency + 1
    },
    showToastFleetIsArcimotoRedirect () {
      const config = {
        msg: 'Arcimoto Fleet Not Available in This View',
        icon: 'warning',
        duration: 6000,
        className: 'toasted-warning'
      }
      utility.messageSet(this, config.msg, config.icon, config.duration, config.className)
    },
    showToastTelemetry (state) {
      const config = {
        msg: `Telemetry Load${state ? 'ing' : 'ed'}`,
        icon: state ? 'hourglass_empty' : 'check',
        duration: 5000,
        className: 'toasted-info'
      }
      utility.messageSet(this, config.msg, config.icon, config.duration, config.className)
    },
    vehicleInfoClose () {
      this.vehicleInfoPanelVin = null
    },
    vehicleInfoOpen (vin) {
      this.vehicleInfoPanelVin = vin
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .fleet-container {
    position: relative;
    h3 {
      text-align: left;
      margin-bottom: 10px;
    }
    .fleet-name {
      font-variant: small-caps;
      font-style: italic;
      font-weight: bold;
    }
    .vehicles-container {
      margin: 0 auto;
      min-height: 165px;
      .vehicle {
        background: #aaa;
        border-radius: 7px;
        cursor: pointer;
        margin-bottom: 20px;
        padding: 8px 10px 2px;
        width: 100px;
        h5 {
          font-size: 0.9rem;
          text-align: center;
          overflow-wrap: break-word;
        }
      }
    }
    .fleet-tile-view-toggle-container {
      margin: 1.25rem
    }
    .fleet-vehicle-cards-container {
      margin-left: 20px;
    }
    .vehicle-info-panel {
      position: absolute;
      right: 10px;
      top: 10px;
    }
    .filters {
       margin: 0 16px 20px;
       padding: 10px 10px 0 10px;
    }
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  #app {
    .fleet {
      .fleet-container {
        margin: 0;
        padding: 0;
      }
    }
  }
}
</style>
