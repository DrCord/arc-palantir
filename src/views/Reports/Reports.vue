<template>
  <div class="reports">
    <page-header title="Reports" />
    <div class="reports-container content-container">
      <v-card>
        <v-card-title>Report Generation</v-card-title>
        <v-card-subtitle>To generate reports select VINs to include and the reports generate automatically. View and export the reports from the "Available Reports" section below.</v-card-subtitle>
        <v-card class="vehicles-selection">
          <v-card-title>Vehicles Selection</v-card-title>
        <v-card-text>
            <p>Add VINs individually or use the green buttons to add all the VINs in a fleet at once.</p>
          <div class="fleet-selection-buttons">
            <v-btn
              v-for="fleet in operatorFleets"
              :key="fleet.id"
                color="success"
              small
              @click="selectFleetVins(fleet.vins)"
            >{{ fleet.name }}</v-btn>
          </div>
          <vue-form :state="formstate" @submit.prevent>
            <vins-select-form-field
              :vins-selected="model.vinsSelected"
              @vins-updated="vinsUpdated"
            />
          </vue-form>
        </v-card-text>
      </v-card>
        <v-card class="available-reports">
          <v-card-title>Available Reports ({{ availableReportsCount }})</v-card-title>
        <v-card-text>
          <v-expansion-panels
            v-if="vehiclesSelected.length"
            v-model="availableReportsOpen"
            :disabled="loading"
            focusable
          >
            <v-expansion-panel
              v-if="operatorCanViewFirmware"
              @click="firmwareDataSummon"
            >
              <v-expansion-panel-header>Firmware Status Report</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  id="vehicles-managed-session-mode-status-report-table"
                  :footer-props="dataTableDefaultFooterProps"
                  :headers="reports.firmwareStatus.tableHeaders"
                  :items="reports.firmwareStatus.data"
                  no-data-text="Select VINs above to generate the report"
                  :sort-by="['vin']"
                  :items-per-page="defaultTableRows"
                  @update:items-per-page="capturePagination"
                >
                </v-data-table>
                <vue-json-to-csv
                  :csv-title="'VehiclesFirmwareStatusReport_' + $moment()"
                  :json-data="reports.firmwareStatus.data"
                >
                  <v-btn :disabled="loading || !vehiclesSelected.length">Export Report</v-btn>
                </vue-json-to-csv>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel
              v-if="operatorCanViewFleets"
              @click="fleetLocationDataSummon"
            >
              <v-expansion-panel-header>Fleet Location Report</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  id="vehicles-fleet-location-report-table"
                  :footer-props="dataTableDefaultFooterProps"
                  :headers="reports.fleetLocation.tableHeaders"
                  :items="reports.fleetLocation.data"
                  no-data-text="Select VINs above to generate the report"
                  :sort-by="['vin']"
                  :items-per-page="defaultTableRows"
                  @update:items-per-page="capturePagination"
                >
                </v-data-table>
                <vue-json-to-csv
                  :csv-title="'VehiclesFleetLocationReport_' + $moment()"
                  :json-data="reports.fleetLocation.data"
                >
                  <v-btn :disabled="loading || !vehiclesSelected.length">Export Report</v-btn>
                </vue-json-to-csv>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Managed Session Mode Status Report</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  id="vehicles-managed-session-mode-status-report-table"
                  :footer-props="dataTableDefaultFooterProps"
                  :headers="reports.managedSessionMode.tableHeaders"
                  :items="reports.managedSessionMode.data"
                  no-data-text="Select VINs above to generate the report"
                  :sort-by="['vin']"
                  :items-per-page="defaultTableRows"
                  @update:items-per-page="capturePagination"
                >
                </v-data-table>
                <vue-json-to-csv
                  :csv-title="'VehiclesManagedSessionModeReport_' + $moment()"
                  :json-data="reports.managedSessionMode.data"
                >
                  <v-btn :disabled="loading || !vehiclesSelected.length">Export Report</v-btn>
                </vue-json-to-csv>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-card-subtitle v-else>No reports available, select VINs.</v-card-subtitle>
        </v-card-text>
      </v-card>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEET_SUMMON,
  FLEETS_SUMMON,
  LOCATIONS_SUMMON,
  OPERATOR_FLEETS_SUMMON,
  VEHICLES_FIRMWARE_COMPONENTS_SUMMON,
  VEHICLES_FIRMWARE_VERSIONS_SUMMON,
  VEHICLE_SUMMON
} from '@/store/action-types'
import {
  ACCESS_FIRMWARE_READ,
  ACCESS_FLEETS_GROUPS,
  FLEET,
  FLEETS,
  LOADING,
  LOCATIONS,
  OPERATOR,
  OPERATOR_FLEETS,
  OPERATOR_LOADED,
  VEHICLE_FIRMWARE,
  VEHICLE_FIRMWARE_COMPONENTS_OUTDATED,
  VEHICLE_FIRMWARE_UP_TO_DATE,
  VEHICLES
} from '@/store/getter-types'

import utility from '@/lib/utility'
import VueJsonToCsv from 'vue-json-to-csv'

import PageHeader from '@/components/PageHeader.vue'
import VinsSelectFormField from '@/components/Vehicles/VinsSelectFormField.vue'
import TableRowsDefault from '@/mixins/TableRowsDefault.js'

export default {
  name: 'VehiclesReportsView',
  components: {
    PageHeader,
    VinsSelectFormField,
    VueJsonToCsv
  },
  mixins: [TableRowsDefault],
  data () {
    return {
      availableReportsOpen: null,
      formstate: {},
      model: {
        vinsSelected: []
      },
      reports: {
        firmwareStatus: {
          data: [],
          tableHeaders: [
            {
              text: 'VIN',
              value: 'vin',
              sortable: true
            },
            {
              text: 'Firmware Status',
              value: 'firmwareStatus',
              sortable: true
            },
            {
              text: 'Outdated Firmware',
              value: 'outdatedFirmware',
              sortable: false
            }
          ],
          title: 'FirmwareStatusReport'
        },
        fleetLocation: {
          data: [],
          tableHeaders: [
            {
              text: 'VIN',
              value: 'vin',
              sortable: true
            },
            {
              text: 'Model',
              value: 'model',
              sortable: true
            },
            {
              text: 'Fleet Ids',
              value: 'fleets',
              sortable: true
            },
            {
              text: 'Location Ids',
              value: 'locations',
              sortable: true
            },
            {
              text: 'Multiple Locations Error',
              value: 'multipleLocations',
              sortable: true
            },
            {
              text: 'No Locations Warning',
              value: 'noLocations',
              sortable: true
            },
            {
              text: 'Location Fleet Name',
              value: 'locationFleetName',
              sortable: true
            },
            {
              text: 'Location Name',
              value: 'locationName',
              sortable: true
            },
            {
              text: 'Location Code',
              value: 'locationCode',
              sortable: true
            },
            {
              text: 'Acct Dept Code',
              value: 'acctDeptCode',
              sortable: true
            }
          ],
          title: 'FleetLocationReport'
        },
        managedSessionMode: {
          data: [],
          tableHeaders: [
            {
              text: 'VIN',
              value: 'vin',
              sortable: true
            },
            {
              text: 'Managed Session Mode',
              value: 'managedSessionMode',
              sortable: true
            }
          ],
          title: 'ManagedSessionModeReport'
        }
      },
      selectedVehiclesFleets: []
    }
  },
  computed: {
    ...mapGetters({
      fleetGet: FLEET,
      fleets: FLEETS,
      loading: LOADING,
      locations: LOCATIONS,
      operatorCanViewFirmware: ACCESS_FIRMWARE_READ,
      operatorCanViewFleets: ACCESS_FLEETS_GROUPS,
      operator: OPERATOR,
      operatorFleets: OPERATOR_FLEETS,
      operatorLoaded: OPERATOR_LOADED,
      vehicleFirmwareGet: VEHICLE_FIRMWARE,
      vehicleFirmwareOutdatedGet: VEHICLE_FIRMWARE_COMPONENTS_OUTDATED,
      vehicleFirmwareUpToDateGet: VEHICLE_FIRMWARE_UP_TO_DATE,
      vehicles: VEHICLES
    }),
    availableReportsCount () {
      let count = 0
      if (this.vehiclesSelected.length) {
        // managed session mode report
        count++
        // fleet location report
        if (this.operatorCanViewFleets) {
          count++
        }
        // firmware status report
        if (this.operatorCanViewFirmware) {
          count++
        }
      }
      return count
    },
    dataTableDefaultFooterProps () {
      return utility.dataTableDefaultFooterProps()
    },
    vehiclesSelected () {
      if (this.model.vinsSelected) {
        const vehiclesSelected = this.vehicles.filter(vehicle => {
          return this.model.vinsSelected.includes(vehicle.vin)
        })
        return vehiclesSelected || []
      }
      return []
    }
  },
  watch: {
    loading: {
      handler (newVal) {
        if (!newVal && this.vehiclesSelected.length) {
          this.reportsGenerate()
        }
      },
      immediate: true
    },
    operatorLoaded: {
      handler (newVal) {
        if (newVal) {
          this.operatorFleetsSummon()
        }
      },
      immediate: true
    },
    vehiclesSelected: {
      handler (newVal) {
        this.availableReportsOpen = null
        this.selectedVehiclesFleetsSet()
      },
      deep: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      fleetSummonAction: FLEET_SUMMON,
      fleetsSummonAction: FLEETS_SUMMON,
      locationsSummonAction: LOCATIONS_SUMMON,
      operatorFleetsSummonAction: OPERATOR_FLEETS_SUMMON,
      vehiclesFirmwareComponentsSummonAction: VEHICLES_FIRMWARE_COMPONENTS_SUMMON,
      vehiclesFirmwareVersionsSummonAction: VEHICLES_FIRMWARE_VERSIONS_SUMMON,
      vehicleSummonAction: VEHICLE_SUMMON
    }),
    firmwareDataSummon () {
      this.vehiclesFirmwareComponentsSummon()
      this.vehiclesFirmwareVersionsSummon()
    },
    fleetLocationDataSummon () {
      this.fleetsSummon()
      this.locationsSummon()
      // summon each fleet in report
      this.selectedVehiclesFleets.forEach(fleetId => {
        this.fleetSummon(fleetId)
      })
    },
    async fleetSummon (fleetId) {
      const componentSelf = this
      return await this.fleetSummonAction({ componentSelf, payload: { fleetId } })
    },
    async fleetsSummon () {
      const componentSelf = this
      await this.fleetsSummonAction({ componentSelf })
    },
    init () {
      this.operatorFleetsSummon()
    },
    async locationsSummon () {
      const componentSelf = this
      const force = false
      this.locationsSummonAction({ componentSelf, force })
    },
    async operatorFleetsSummon () {
      const componentSelf = this
      const { operator } = this
      await this.operatorFleetsSummonAction({ componentSelf, operator })
    },
    reportGenerateFirmwareStatus () {
      this.reports.firmwareStatus.data = this.vehiclesSelected.map(
        vehicle => {
          return {
            vin: vehicle.vin,
            firmwareStatus: this.vehicleFirmwareUpToDateGet(vehicle.vin) ? 'Up to date' : 'Outdated',
            outdatedFirmware: this.vehicleFirmwareOutdatedGet(vehicle.vin).map(item => item.name).join(', ')
          }
        }
      )
    },
    reportGenerateFleetLocation () {
      this.reports.fleetLocation.data = this.vehiclesSelected.map(
        vehicle => {
          const vehicleFleetIds = [...vehicle.fleets].filter(e => e !== 1)
          let fleetsLocations = []
          let locationFleetName = null
          let acctDeptCode = null
          vehicleFleetIds.forEach(id => {
            const fleet = this.fleets.find(e => e.id === id)
            if (fleet && fleet.locationId) {
              fleetsLocations = [...new Set([...fleetsLocations, fleet.locationId])]
              locationFleetName = fleet.name
              acctDeptCode = fleet.code
            }
          })
          const noLocations = fleetsLocations.length === 0 ? 'WARNING' : null
          const multipleLocations = fleetsLocations.length > 1 ? 'ERROR' : null
          let locationName = null
          let locationCode = null
          if (multipleLocations) {
            // this data is ambiguous if vehicle in multiple location error state
            locationFleetName = null
          } else {
            const location = this.locations.find(e => e.id === fleetsLocations[0])
            locationName = location ? location.locationName : null
            locationCode = location ? location.locationCode : null
          }
          return {
            vin: vehicle.vin,
            model: vehicle.model,
            fleets: vehicleFleetIds.join(', '),
            locations: fleetsLocations.join(', '),
            multipleLocations,
            noLocations,
            locationFleetName,
            locationName,
            locationCode,
            acctDeptCode
          }
        }
      )
    },
    reportGenerateManagedSessionMode () {
      this.reports.managedSessionMode.data = this.vehiclesSelected.map(
        vehicle => {
          return {
            vin: vehicle.vin,
            managedSessionMode: vehicle.managedSessionMode
          }
        }
      )
    },
    reportsGenerate () {
      this.reportGenerateFirmwareStatus()
      this.reportGenerateFleetLocation()
      this.reportGenerateManagedSessionMode()
    },
    selectedVehiclesFleetsSet () {
      let selectedVehiclesFleets = []
      this.vehiclesSelected.forEach(vehicle => {
        if (vehicle.fleets) {
          selectedVehiclesFleets = [...new Set([...selectedVehiclesFleets, ...vehicle.fleets])]
        }
      })
      this.selectedVehiclesFleets = selectedVehiclesFleets
    },
    selectFleetVins (vins) {
      this.mergeSelectedVins(vins)
    },
    mergeSelectedVins (vins) {
      if (vins) {
        this.model.vinsSelected = [...new Set([...this.model.vinsSelected, ...vins])]
        this.vehiclesDataGet()
      }
    },
    setSelectedVins (vins) {
      this.model.vinsSelected = vins
      this.vehiclesDataGet()
    },
    vehiclesDataGet () {
      this.vehiclesSelected.forEach(vehicle => {
        if (!vehicle.loaded) {
          this.vehicleSummon(vehicle.vin)
        }
      })
    },
    async vehicleSummon (vin) {
      const componentSelf = this
      await this.vehicleSummonAction({ componentSelf, vin, getTypes: ['vehicle'] })
    },
    async vehiclesFirmwareComponentsSummon () {
      const componentSelf = this
      await this.vehiclesFirmwareComponentsSummonAction({ componentSelf })
    },
    async vehiclesFirmwareVersionsSummon () {
      const componentSelf = this
      await this.vehiclesFirmwareVersionsSummonAction({ componentSelf })
    },
    vinsUpdated (vins) {
      this.setSelectedVins(vins)
      if (!this.loading && vins.length) {
        this.reportsGenerate()
      }
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .reports {
  form {
    max-width: 100%;
  }
  .fleet-selection-buttons {
    .v-btn {
      margin-bottom: 10px;
      margin-right: 10px;
      }
    }
    .available-reports {
      margin-bottom: 5px;
      margin-top: 5px;
    }
  }
}

</style>
