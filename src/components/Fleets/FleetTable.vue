<template>
  <div class="fleet-table-container">

    <div class="search-container">
      <v-text-field
        id="vehicles-search"
        v-model="vehiclesFilter"
        dense
        outlined
        placeholder="Filter Vehicles"
      />
    </div>
    <v-data-table
      :footer-props="dataTableDefaultFooterProps"
      :headers="headers"
      :items="decoratedFleet"
      :items-per-page="20"
      :sort-by="['vin']"
      :search="vehiclesFilter"
      dense
    >
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_VEHICLES,
  ENVIRONMENT,
  LOADING,
  VEHICLE_MODEL,
  VEHICLE_ODOMETER_MILES,
  VEHICLE_SOC,
  VEHICLE_TELEMETRY_POINTS_LOADING
} from '@/store/getter-types'

import utility from '@/lib/utility'
import DateUtility from '@/lib/dateUtility'

export default {
  name: 'FleetTable',
  props: {
    fleetVehicles: {
      default: null,
      type: Array
    },
    fleetId: {
      default: null,
      type: Number
    },
    filteredVins: {
      default: null,
      type: Array
    },
    telemetryLoaded: {
      default: () => [],
      type: Array
    }
  },
  data: () => ({
    headers: [
      {
        text: 'Vin',
        value: 'vin',
        sortable: true
      },
      {
        text: 'Model',
        value: 'vehicleModel',
        sortable: true
      },
      {
        text: 'Battery',
        value: 'soc',
        sortable: true
      },
      {
        text: 'Odometer (Miles)',
        value: 'odometer',
        sortable: true
      },
      {
        text: 'Last Updated',
        value: 'updated',
        sortable: true
      }
    ],
    vehiclesFilter: ''

  }),
  computed: {
    ...mapGetters({
      environment: ENVIRONMENT,
      loading: LOADING,
      operatorCanAccessVehicles: ACCESS_VEHICLES,
      vehicleModelGet: VEHICLE_MODEL,
      vehicleOdometerMilesGet: VEHICLE_ODOMETER_MILES,
      vehicleSocGet: VEHICLE_SOC,
      vehicleTelemetryPointsLoadingGet: VEHICLE_TELEMETRY_POINTS_LOADING
    }),
    dataTableDefaultFooterProps () {
      return utility.dataTableDefaultFooterProps()
    },
    decoratedFleet () {
      var decoratedFleet = []
      for (const vin of this.filteredVins) {
        var vehicle = {
          vin: this.vinUnprefixed(vin),
          vehicleModel: this.vehicleModel(vin),
          soc: this.socDisplay(vin),
          odometer: this.odometerDisplay(vin),
          updated: this.updatedDisplay(vin)
        }
        decoratedFleet.push(vehicle)
      }
      return decoratedFleet
    }

  },
  methods: {
    filterName (value) {
      if (!this.nameFilterValue) {
        return true
      }
      // Check if the current loop value partially contains the searched word
      return value.toLowerCase().includes(this.nameFilterValue.toLowerCase())
    },
    odometerDisplay (vin) {
      // commas remove sorting sanity
      const vehicleOdometerMiles = this.vehicleOdometerMiles(vin)
      if (vehicleOdometerMiles !== null) {
        return `${parseInt(vehicleOdometerMiles, 10)}`
      }
      return 'Unknown'
    },
    socDisplay (vin) {
      const vehicleSoc = this.vehicleSoc(vin)
      if (vehicleSoc && vehicleSoc.point !== null) {
        return `${parseInt(vehicleSoc.point, 10)}%`
      }
      return 'Unknown'
    },
    updatedDisplay (vin) {
      const vehicleSoc = this.vehicleSoc(vin)
      if (vehicleSoc && vehicleSoc.time !== null) {
        return DateUtility.formatTsDateTimeTelemetry(vehicleSoc.time)
      }
      return null
    },
    vehicleModel (vin) {
      return this.vehicleModelGet(vin)
    },
    vehicleOdometerMiles (vin) {
      return this.telemetryLoaded.length && vin ? this.vehicleOdometerMilesGet(vin) : null
    },
    vehicleSoc (vin) {
      return this.telemetryLoaded.length && vin ? this.vehicleSocGet(vin) : null
    },
    vinUnprefixed (vin) {
      // if '-' does not occur return string otherwise return string after '-'
      return vin.split('-').pop()
    }
  }
}
</script>
<style scoped lang="scss">
  .fleet-table-container {
    padding: 1.25rem;
    margin: 1rem;
    border: 1px solid rgb(207, 211, 230);
    border-radius: 5px;
  }
  .search-container {
    max-width: 350px;
  }

</style>
