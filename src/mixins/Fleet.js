import { mapActions, mapGetters } from 'vuex'
import { GPS_LOCATION_ADDRESS_GET } from '@/store/action-types'
import {
  ACCESS_VEHICLES,
  ENVIRONMENT,
  GPS_LOCATION_ADDRESS,
  LOADING,
  VEHICLE_LOCATION_GPS,
  VEHICLE_MODEL,
  VEHICLE_ODOMETER_MILES,
  VEHICLE_SOC,
  VEHICLE_TELEMETRY_ODOMETER,
  VEHICLE_TELEMETRY_POINTS_LOADING
} from '@/store/getter-types'
import dateUtility from '../lib/dateUtility'

export default {
  props: {
    show: {
      default: true,
      type: Boolean
    },
    telemetryLoaded: {
      default: () => [],
      type: Array
    },
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      locationAddressLookupData: null
    }
  },
  computed: {
    ...mapGetters({
      environment: ENVIRONMENT,
      gpsLocationAddressGet: GPS_LOCATION_ADDRESS,
      loading: LOADING,
      operatorCanAccessVehicles: ACCESS_VEHICLES,
      vehicleModelGet: VEHICLE_MODEL,
      vehicleOdometerMilesGet: VEHICLE_ODOMETER_MILES,
      vehicleSocGet: VEHICLE_SOC,
      vehicleLocationGpsGet: VEHICLE_LOCATION_GPS,
      vehicleTelemetryOdometer: VEHICLE_TELEMETRY_ODOMETER,
      vehicleTelemetryPointsLoadingGet: VEHICLE_TELEMETRY_POINTS_LOADING
    }),
    dataAvailable () {
      return this.vin && !this.loading
    },
    dates () {
      var dates = {}
      dates.soc = dateUtility.formatTsDateTimeTelemetry(this.vehicleSoc.time)

      const odometerData = [...this.vehicleTelemetryOdometerAll].shift()
      var odometerTS = null
      if (odometerData && odometerData.time) {
        odometerTS = odometerData.time
      }
      dates.odometer = dateUtility.formatTsDateTimeTelemetry(odometerTS)
      const location = this.vehicleLocationGpsGet(this.vin)
      var locationTS = null
      if (location && location.time) {
        locationTS = location.time
      }
      dates.location = dateUtility.formatTsDateTimeTelemetry(locationTS)
      return dates
    },
    gpsLocationAddress () {
      const { locationLatitude, locationLongitude } = this
      if (!locationLatitude || !locationLongitude) { return null }
      return this.gpsLocationAddressGet(locationLatitude, locationLongitude)
    },
    lastUpdated () {
      const { vehicleSoc } = this
      if (vehicleSoc && vehicleSoc.time !== null) {
        return dateUtility.formatTsFromNowTelemetry(vehicleSoc.time)
      }
      return null
    },
    locationAddress () {
      const { gpsLocationAddress } = this
      return gpsLocationAddress ? gpsLocationAddress.results[0] : null
    },
    locationAddressDisplay () {
      const { locationAddress } = this
      if (!locationAddress) {
        return null
      }
      return locationAddress.formattedAddress
    },
    locationAddressDisplayLine1 () {
      const { addressComponentFind, locationAddress } = this
      if (!locationAddress || !locationAddress.addressComponents) {
        return null
      }
      const streetNumber = addressComponentFind('street_number')
      const route = addressComponentFind('route')
      if (!streetNumber || !route) {
        return null
      }
      return `${addressComponentFind('street_number')} ${addressComponentFind('route')}`
    },
    locationAddressDisplayLine2 () {
      const { addressComponentFind, locationAddress, locationAddressDisplayLine1 } = this
      if (!locationAddress || !locationAddress.addressComponents) {
        return null
      }
      if (!locationAddressDisplayLine1) {
        return null
      }
      return `${addressComponentFind('locality')}, ${addressComponentFind('administrative_area_level_1')} ${addressComponentFind('postal_code')}`
    },
    locationGpsDisplay () {
      const { locationLatitude, locationLongitude } = this
      return locationLatitude && locationLongitude ? `${locationLatitude}, ${locationLongitude}` : 'Unknown'
    },
    locationLatitude () {
      const { vehicleTelemetryGps } = this
      return vehicleTelemetryGps && vehicleTelemetryGps.lat ? vehicleTelemetryGps.lat : null
    },
    locationLongitude () {
      const { vehicleTelemetryGps } = this
      return vehicleTelemetryGps && vehicleTelemetryGps.long ? vehicleTelemetryGps.long : null
    },
    odometerDisplay () {
      const { vehicleOdometerMiles } = this
      if (vehicleOdometerMiles !== null) {
        return `${parseInt(vehicleOdometerMiles, 10)
                 .toString()
                 .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Miles`
      }
      return 'Unknown'
    },
    socDisplay () {
      const { vehicleSoc } = this
      if (vehicleSoc && vehicleSoc.point !== null) {
        return `${parseInt(vehicleSoc.point, 10)}%`
      }
      return 'Unknown'
    },
    vehicleModel () {
      return this.vin ? this.vehicleModelGet(this.vin) : null
    },
    vehicleOdometerMiles () {
      return this.dataAvailable ? this.vehicleOdometerMilesGet(this.vin) : null
    },
    vehicleTelemetryOdometerAll () {
      return this.dataAvailable ? this.vehicleTelemetryOdometer(this.vin) : null
    },
    vehicleSoc () {
      return this.dataAvailable ? this.vehicleSocGet(this.vin) : null
    },
    vehicleTelemetryGps () {
      return this.dataAvailable ? this.vehicleLocationGpsGet(this.vin) : null
    },
    vinUnprefixed () {
      const { vin } = this
      // if '-' does not occur return string otherwise return string after '-'
      return vin.split('-').pop()
    }
  },
  watch: {
    locationLatitude: {
      handler (newVal, oldVal) {
        const { locationLatitude, locationLongitude } = this
        if (locationLatitude !== undefined &&
            locationLatitude !== null &&
            locationLongitude !== undefined &&
            locationLongitude !== null) {
          if (!this.gpsLocationAddress) {
            this.locationAddressGet({ lat: locationLatitude, long: locationLongitude })
          }
        }
      }
    }
  },
  methods: {
    ...mapActions({
      locationAddressGetAction: GPS_LOCATION_ADDRESS_GET
    }),
    addressComponentFind (componentType) {
      const { locationAddress } = this
      if (!locationAddress) { return null }
      const addressComponent = locationAddress.addressComponents.find(item => {
        return item.types.includes(componentType)
      })
      return addressComponent ? addressComponent.shortName : null
    },
    async locationAddressGet (payload) {
      await this.locationAddressGetAction({ payload })
    }
  }
}
