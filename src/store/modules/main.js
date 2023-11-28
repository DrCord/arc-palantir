import errors from '@/lib/errors'
import utility from '@/store/utility'

import locationsRequests from '@/lib/requests/locations'

import {
  GPS_LOCATION_ADDRESS_GET,
  LOCATION_CREATE,
  LOCATION_DELETE,
  LOCATION_SUMMON,
  LOCATION_UPDATE,
  LOCATIONS_ADDRESS_TYPES_SUMMON,
  LOCATIONS_COUNTRIES_SUMMON,
  LOCATIONS_LOCATION_CODE_CREATE,
  LOCATIONS_LOCATION_CODE_DELETE,
  LOCATIONS_LOCATION_CODE_SET,
  LOCATIONS_LOCATION_CODES_SUMMON,
  LOCATIONS_SUMMON
} from '@/store/action-types'

import {
  APP_LOCAL,
  ENVIRONMENT,
  ENVIRONMENT_VIN_PREFIX,
  LOADING,
  LOCATION,
  GPS_LOCATION_ADDRESS,
  LOCATIONS,
  LOCATIONS_ADDRESS_TYPES,
  LOCATIONS_ADDRESS_TYPES_SUMMONED,
  LOCATIONS_COUNTRIES,
  LOCATIONS_COUNTRIES_SUMMONED,
  LOCATIONS_LOCATION_CODES,
  LOCATIONS_LOCATION_CODES_SUMMONED,
  LOCATIONS_SUMMONED,
  PACKAGE_VERSION,
  S3_BASE_URL
} from '@/store/getter-types'

import {
  GPS_LOCATION_ADDRESS_SET,
  LOADING_END,
  LOADING_START,
  LOCATION_CITY_SET,
  LOCATION_INSTANTIATE,
  LOCATION_NAME_SET,
  LOCATION_REMOVE,
  LOCATION_SET,
  LOCATION_STATE_SET,
  LOCATIONS_SET,
  LOCATIONS_ADDRESS_TYPES_SET,
  LOCATIONS_ADDRESS_TYPES_SUMMONED_SET,
  LOCATIONS_COUNTRIES_SET,
  LOCATIONS_COUNTRIES_SUMMONED_SET,
  LOCATIONS_LOCATION_CODE_INSTANTIATE,
  LOCATIONS_LOCATION_CODE_REMOVE,
  LOCATIONS_LOCATION_CODES_SET,
  LOCATIONS_LOCATION_CODES_SUMMONED_SET,
  LOCATIONS_SUMMONED_SET
} from '@/store/mutation-types'

const main = {
  state: {
    addressTypes: [],
    addressTypesSummoned: false,
    appLocal: process.env.VUE_APP_CONNECTION_TYPE === 'localhostproxy',
    countries: [],
    countriesSummoned: false,
    environment: process.env.VUE_APP_ENVIRONMENT
      ? process.env.VUE_APP_ENVIRONMENT
      : 'dev',
    loading: false,
    loadingInitiators: [],
    locationAddresses: [],
    locations: [],
    locationsSummoned: false,
    locationCodes: [],
    locationsCodesSummoned: false,
    packageVersion: process.env.PACKAGE_VERSION || '0',
    versionIsLatest: true,
    s3: 'https://arcimoto-palantir.s3-us-west-2.amazonaws.com'
  },
  actions: {
    async [GPS_LOCATION_ADDRESS_GET] ({ commit, rootState }, { componentSelf, payload }) {
      const { lat, long } = payload
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.lat = lat
      requestData.long = long
      /* eslint-disable prefer-const */
      // intentionally silently fails without a catch
      let response = await locationsRequests.locationLookupAddress(requestData)
      if (response && response.status === 200) {
        if (response.data.status === 'OK') {
          commit(GPS_LOCATION_ADDRESS_SET, { lat, long, results: response.data.results })
        } else {
          commit(GPS_LOCATION_ADDRESS_SET, { lat, long, results: [] })
        }
      }
    },
    async [LOCATION_CREATE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await locationsRequests.locationCreate(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Location Create Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const locationId = response.data.id
        const locationName = payload.body.location_name
        const city = payload.body.city
        const governingDistrict = payload.body.governing_district

        commit(LOCATION_INSTANTIATE, locationId)
        commit(LOCATION_NAME_SET, { locationName, locationId })
        commit(LOCATION_CITY_SET, { city, locationId })
        commit(LOCATION_STATE_SET, { governingDistrict, locationId })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Location Created')
        return Promise.resolve(locationId)
      }
      return Promise.resolve(false)
    },
    async [LOCATION_DELETE] ({ commit, getters, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const locationId = payload.locationId
      requestData.id = locationId
      requestData.body = payload.body
      let response = await locationsRequests.locationDelete(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Location Delete Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Location Deleted')
        commit(LOCATION_REMOVE, locationId)
      } else {
        errors.handleAxiosRequestError(componentSelf, 'Location Delete Request Failed')
      }
    },
    async [LOCATION_SUMMON] ({ commit, getters, rootState }, { componentSelf, payload }) {
      const { force, locationId } = payload
      if (force || !getters[LOCATION]) {
        utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        requestData.locationId = locationId
        /* eslint-disable prefer-const */
        let response = await locationsRequests.locationGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Location Get Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          const location = response.data
          commit(LOCATION_SET, { location })
          utility.setLoadingAndToast(componentSelf.$parent, false, 'Location')
        }
      }
    },
    async [LOCATION_UPDATE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const locationId = payload.locationId
      requestData.id = locationId
      requestData.body = payload.body

      /* eslint-disable prefer-const */
      let response = await locationsRequests.locationUpdate(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Location Update Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        /* update does not contain linked data fields so add back code here */
        response.data.locationCode = payload.body.location_code
        const location = response.data
        commit(LOCATION_SET, { location })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Location Updated')
      }
    },
    async [LOCATIONS_ADDRESS_TYPES_SUMMON] ({ commit, getters, rootState }, { componentSelf, force }) {
      if (force || !getters[LOCATIONS_ADDRESS_TYPES_SUMMONED]) {
        utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        /* eslint-disable prefer-const */
        let response = await locationsRequests.addressTypesGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Address Types List Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          utility.setLoadingAndToast(componentSelf.$parent, false, 'Address Types')
          const addressTypes = response.data.addressTypes
          commit(LOCATIONS_ADDRESS_TYPES_SET, { addressTypes })
          commit(LOCATIONS_ADDRESS_TYPES_SUMMONED_SET, { summoned: true })
        }
      }
    },
    async [LOCATIONS_COUNTRIES_SUMMON] ({ commit, getters, rootState }, { componentSelf, force }) {
      if (force || !getters[LOCATIONS_COUNTRIES_SUMMONED]) {
        utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        /* eslint-disable prefer-const */
        let response = await locationsRequests.countriesGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Countries List Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          utility.setLoadingAndToast(componentSelf.$parent, false, 'Countries')
          const countries = response.data.countries
          commit(LOCATIONS_COUNTRIES_SET, { countries })
          commit(LOCATIONS_COUNTRIES_SUMMONED_SET, { summoned: true })
        }
      }
    },
    async [LOCATIONS_LOCATION_CODE_CREATE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await locationsRequests.locationCodeCreate(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Location Code Create Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const locationCodeId = response.data.id
        commit(LOCATIONS_LOCATION_CODE_INSTANTIATE, locationCodeId)
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Location Code Created')
      }
    },
    async [LOCATIONS_LOCATION_CODE_DELETE] ({ commit, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const locationCodeId = payload.id
      requestData.id = locationCodeId
      requestData.body = payload.body
      let response = await locationsRequests.locationCodeDelete(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Location Code Delete Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        commit(LOCATIONS_LOCATION_CODE_REMOVE, locationCodeId)
        payload.force = true
        commit(LOCATIONS_SUMMONED_SET, { summoned: false })
        await dispatch(LOCATIONS_SUMMON, { componentSelf, payload })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Location Code Deleted')
      } else {
        errors.handleAxiosRequestError(componentSelf, 'Location Code Delete Request Failed')
      }
    },
    async [LOCATIONS_LOCATION_CODE_SET] ({ dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const locationId = payload.locationId
      requestData.locationId = locationId
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await locationsRequests.locationCodeSet(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Location Code Update Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        payload.force = true
        await dispatch(LOCATION_SUMMON, { componentSelf, payload })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Location Code Updated')
      }
    },
    async [LOCATIONS_LOCATION_CODES_SUMMON] ({ commit, getters, rootState }, { componentSelf, force = false }) {
      if (force || !getters[LOCATIONS_LOCATION_CODES_SUMMONED]) {
        utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        /* eslint-disable prefer-const */
        let response = await locationsRequests.locationCodesList(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Location Codes List Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          utility.setLoadingAndToast(componentSelf.$parent, false, 'Location Codes')
          const locationCodes = response.data.accountingLocationCodes
          commit(LOCATIONS_LOCATION_CODES_SET, { locationCodes })
          commit(LOCATIONS_LOCATION_CODES_SUMMONED_SET, { summoned: true })
        }
      }
    },
    async [LOCATIONS_SUMMON] ({ commit, getters, rootState }, { componentSelf, force = false }) {
      if (force || !getters[LOCATIONS_SUMMONED]) {
        utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        /* eslint-disable prefer-const */
        let response = await locationsRequests.locationsGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Locations List Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          utility.setLoadingAndToast(componentSelf.$parent, false, 'Locations')
          const locations = response.data.locations
          commit(LOCATIONS_SET, { locations })
          commit(LOCATIONS_SUMMONED_SET, { summoned: true })
        }
      }
    }
  },
  getters: {
    [APP_LOCAL]: (state) => {
      return state.appLocal
    },
    [ENVIRONMENT]: (state) => {
      return state.environment
    },
    [ENVIRONMENT_VIN_PREFIX]: (state) => {
      return state.environment === 'prod' ? '' : (state.environment === 'staging' ? 'STAGE-' : 'DEV-')
    },
    [GPS_LOCATION_ADDRESS]: (state) => (lat, long) => {
      return state.locationAddresses.find(locationAddress => {
        return locationAddress.lat === lat && locationAddress.long === long
      })
    },
    [LOADING]: (state) => {
      return state.loading
    },
    [LOCATION]: (state) => locationId => {
      return state.locations.find(location => {
        return location.id === locationId
      })
    },
    [LOCATIONS]: (state) => {
      return state.locations
    },
    [LOCATIONS_ADDRESS_TYPES]: (state) => {
      return state.addressTypes
    },
    [LOCATIONS_ADDRESS_TYPES_SUMMONED]: (state) => {
      return state.addressTypesSummoned
    },
    [LOCATIONS_COUNTRIES]: (state) => {
      return state.countries
    },
    [LOCATIONS_COUNTRIES_SUMMONED]: (state) => {
      return state.countriesSummoned
    },
    [LOCATIONS_LOCATION_CODES]: (state) => {
      return state.locationCodes
    },
    [LOCATIONS_LOCATION_CODES_SUMMONED]: (state) => {
      return state.locationCodesSummoned
    },
    [LOCATIONS_SUMMONED]: (state) => {
      return state.locationsSummoned
    },
    [PACKAGE_VERSION]: (state) => {
      return state.packageVersion
    },
    [S3_BASE_URL]: (state) => {
      const { s3, environment } = state
      return `${s3}/${environment}`
    }
  },
  mutations: {
    [GPS_LOCATION_ADDRESS_SET] (state, val) {
      state.locationAddresses.push(val)
    },
    [LOADING_END] (state, val = {}) {
      const { force = false, initiator = '*' } = val
      if (force) {
        state.loading = false
        state.loadingInitiators = []
      } else {
        const itemIndex = state.loadingInitiators.findIndex(item => {
          return item === initiator
        })
        if (itemIndex !== -1) {
          state.loadingInitiators.splice(itemIndex, 1)
          if (!state.loadingInitiators.length) {
            state.loading = false
          }
        }
      }
    },
    [LOADING_START] (state, initiator = '*') {
      state.loading = true
      state.loadingInitiators.push(initiator)
    },
    [LOCATION_CITY_SET] (state, val) {
      const location = state.locations.find(location => { return location.id === val.locationId })
      location.city = val.city
    },
    [LOCATION_INSTANTIATE] (state, locationId) {
      state.locations.push({ id: locationId })
    },
    [LOCATION_NAME_SET] (state, val) {
      const location = state.locations.find(location => { return location.id === val.locationId })
      location.locationName = val.locationName
    },
    [LOCATION_REMOVE] (state, locationId) {
      const locationIndex = state.locations.findIndex(location => { return location.id === locationId })
      state.locations.splice(locationIndex, 1)
    },
    [LOCATION_SET] (state, val) {
      const location = val.location
      const locationStoreIndex = state.locations.findIndex(item => {
        return item.id === location.id
      })
      if (locationStoreIndex !== -1) {
        const locationCreatedByStore = state.locations[locationStoreIndex].createdBy
        const locationCreatedByNew = location.createdBy
        if (locationCreatedByStore || locationCreatedByNew) {
          location.createdBy = locationCreatedByStore || locationCreatedByNew
        }
        state.locations.splice(locationStoreIndex, 1, location)
      } else {
        state.locations.push(location)
      }
    },
    [LOCATION_STATE_SET] (state, val) {
      const location = state.locations.find(location => { return location.id === val.locationId })
      location.governingDistrict = val.governingDistrict
    },
    [LOCATIONS_SET] (state, val) {
      state.locations = val.locations
    },
    [LOCATIONS_ADDRESS_TYPES_SET] (state, val) {
      state.addressTypes = val.addressTypes
    },
    [LOCATIONS_ADDRESS_TYPES_SUMMONED_SET] (state, val) {
      state.addressTypesSummoned = val.summoned
    },
    [LOCATIONS_COUNTRIES_SET] (state, val) {
      state.countries = val.countries
    },
    [LOCATIONS_COUNTRIES_SUMMONED_SET] (state, val) {
      state.countriesSummoned = val.summoned
    },
    [LOCATIONS_LOCATION_CODE_INSTANTIATE] (state, locationCodeId) {
      state.locationCodes.push({ id: locationCodeId })
    },
    [LOCATIONS_LOCATION_CODE_REMOVE] (state, locationCodeId) {
      const locationCode = state.locationCodes.findIndex(locationCode => { return locationCode.id === locationCodeId })
      state.locationCodes.splice(locationCode, 1)
    },
    [LOCATIONS_LOCATION_CODES_SET] (state, val) {
      state.locationCodes = val.locationCodes
    },
    [LOCATIONS_LOCATION_CODES_SUMMONED_SET] (state, val) {
      state.locationsCodesSummoned = val.summoned
    },
    [LOCATIONS_SUMMONED_SET] (state, val) {
      state.locationsSummoned = val.summoned
    }
  }
}

export default main
