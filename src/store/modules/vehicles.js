import errors from '@/lib/errors'
import utility from '@/store/utility'
import utilityLib from '@/lib/utility'

import authoritiesRequests from '@/lib/requests/authorities'
import managedSessionsRequests from '@/lib/requests/managedSessions'
import vehiclesRequests from '@/lib/requests/vehicles'
import vehicleRequests from '@/lib/requests/vehicle'

import {
  MANAGED_SESSION_END,
  MANAGED_SESSION_START,
  MANAGED_SESSION_SUMMON,
  MANAGED_SESSION_TELEMETRY_SUMMON,
  MANAGED_SESSIONS_SUMMON,
  MANAGED_SESSIONS_VEHICLE_SUMMON,
  OPERATOR_FLEETS_SUMMON,
  VEHICLE_CONFIGURATION_GOVERNOR_SAVE,
  VEHICLE_FIRMWARE_VERSION_SAVE,
  VEHICLE_FLEET_ADD,
  VEHICLE_FLEET_REMOVE,
  VEHICLE_GPS_RECORD_SAVE,
  VEHICLE_MODEL_RELEASE_SAVE,
  VEHICLE_NOTE_CREATE,
  VEHICLE_NOTES_SUMMON,
  VEHICLE_PART_SAVE,
  VEHICLE_PROVISION,
  VEHICLE_SHADOW_SYNCRONIZED,
  VEHICLE_SIGN_TOKEN,
  VEHICLE_SUMMON,
  VEHICLE_TELEMETRY_BACKFILL_PRESIGN_UPLOAD,
  VEHICLE_TELEMETRY_BACKFILL_PROCESS,
  VEHICLE_TELEMETRY_CONFIG_SAVE,
  VEHICLE_TELEMETRY_RETRIEVE,
  VEHICLES_FIRMWARE_COMPONENTS_SUMMON,
  VEHICLES_FIRMWARE_VERSIONS_SUMMON,
  VEHICLES_MODEL_RELEASE_CREATE,
  VEHICLES_MODEL_RELEASE_PART_SAVE,
  VEHICLES_MODEL_RELEASES_SUMMON,
  VEHICLES_MODELS_SUMMON,
  VEHICLES_SUMMON,
  VEHICLES_TELEMETRY_METRICS_VERSION_SUMMON,
  VEHICLES_TELEMETRY_RETRIEVE
} from '@/store/action-types'

import {
  FLEET_LOCATION_ID,
  OPERATOR_DISPLAY_NAME,
  OPERATOR_USERNAME,
  VEHICLE,
  VEHICLE_ALARMS,
  VEHICLE_AUTHORITIES,
  VEHICLE_BOARD_ID,
  VEHICLE_FIRMWARE,
  VEHICLE_FIRMWARE_COMPONENTS_OUTDATED,
  VEHICLE_FIRMWARE_COMPONENTS_UP_TO_DATE,
  VEHICLE_FIRMWARE_UP_TO_DATE,
  VEHICLE_FLEETS,
  VEHICLE_FLEETS_LOCATIONS,
  VEHICLE_GPS_RECORD,
  VEHICLE_GOVERNOR,
  VEHICLE_GOVERNOR_ALLOWED,
  VEHICLE_HAS_PRE_DISCOBOARD,
  VEHICLE_LOADED,
  VEHICLE_LOCATION_GPS,
  VEHICLE_MANAGED_SESSION_ACTIVE,
  VEHICLE_MANAGED_SESSION_MODE,
  VEHICLE_MANAGED_SESSIONS,
  VEHICLE_MODEL,
  VEHICLE_MODEL_RELEASE,
  VEHICLE_NOTES,
  VEHICLE_ODOMETER,
  VEHICLE_ODOMETER_KILOMETERS,
  VEHICLE_ODOMETER_MILES,
  VEHICLE_OPTIONS,
  VEHICLE_PART_KERS_SENSOR,
  VEHICLE_PARTS,
  VEHICLE_PIN,
  VEHICLE_PRIVACY,
  VEHICLE_RECALLS,
  VEHICLE_REGISTRATION,
  VEHICLE_SOC,
  VEHICLE_SYNCHRONIZED,
  VEHICLE_TELEMETRY_CONFIG,
  VEHICLE_TELEMETRY_GPS,
  VEHICLE_TELEMETRY_ODOMETER,
  VEHICLE_TELEMETRY_POINTS,
  VEHICLE_TELEMETRY_POINTS_LOADED,
  VEHICLE_TELEMETRY_POINTS_LOADING,
  VEHICLE_TELEMETRY_SETTINGS_VERSION,
  VEHICLE_TELEMETRY_SOC,
  VEHICLE_TELEMETRY_UPDATED,
  VEHICLE_YEAR,
  VEHICLES,
  VEHICLES_FIRMWARE_COMPONENTS,
  VEHICLES_FIRMWARE_VERSIONS,
  VEHICLES_MANAGED_SESSION,
  VEHICLES_MANAGED_SESSION_TELEMETRY,
  VEHICLES_MANAGED_SESSIONS,
  VEHICLES_MODELS,
  VEHICLES_MODEL_RELEASE_PARTS,
  VEHICLES_MODEL_RELEASES,
  VEHICLES_MODEL_RELEASES_MODEL,
  VEHICLES_SUMMONED,
  VEHICLES_TELEMETRY_METRICS_VERSION_KEYS,
  VEHICLES_TELEMETRY_MILEGAGE_TOTAL,
  VEHICLES_TELEMETRY_UPDATED,
  VINS
} from '@/store/getter-types'

import {
  VEHICLE_ALARMS_SET,
  VEHICLE_AUTHORITIES_SET,
  VEHICLE_CONFIGURATION_SET,
  VEHICLE_FIRMWARE_SET,
  VEHICLE_FLEETS_ADD_FLEET,
  VEHICLE_FLEETS_REMOVE_FLEET,
  VEHICLE_FLEETS_SET,
  VEHICLE_GPS_RECORD_SET,
  VEHICLE_GOVERNOR_ALLOWED_SET,
  VEHICLE_GOVERNOR_SET,
  VEHICLE_INSTANTIATE,
  VEHICLE_LOADED_SET,
  VEHICLE_MODEL_SET,
  VEHICLE_MODEL_RELEASE_SET,
  VEHICLE_NOTE_ADD,
  VEHICLE_NOTES_SET,
  VEHICLE_OPTIONS_SET,
  VEHICLE_PART_SET,
  VEHICLE_PARTS_SET,
  VEHICLE_PIN_SET,
  VEHICLE_PRIVACY_SET,
  VEHICLE_RECALLS_SET,
  VEHICLE_REGISTRATION_SET,
  VEHICLE_SYNCHRONIZED_SET,
  VEHICLE_SYNCHRONIZED_INSTANTIATE,
  VEHICLE_TELEMETRY_CONFIG_SET,
  VEHICLE_TELEMETRY_POINTS_LOADED_SET,
  VEHICLE_TELEMETRY_POINTS_LOADING_SET,
  VEHICLE_TELEMETRY_VALUES_SET,
  VEHICLE_TELEMETRY_SETTINGS_SET,
  VEHICLE_REMOVE,
  VEHICLE_MANAGED_SESSION_MODE_SET,
  VEHICLE_MANAGED_SESSIONS_SET,
  VEHICLES_FIRMWARE_COMPONENTS_SET,
  VEHICLES_FIRMWARE_VERSIONS_SET,
  VEHICLES_MANAGED_SESSION_SET,
  VEHICLES_MANAGED_SESSIONS_RESET,
  VEHICLES_MANAGED_SESSION_TELEMETRY_SET,
  VEHICLES_MANAGED_SESSIONS_SET,
  VEHICLES_MODEL_RELEASE_PART_SET,
  VEHICLES_MODEL_RELEASES_SET,
  VEHICLES_MODEL_RELEASES_RESET,
  VEHICLES_MODELS_RESET,
  VEHICLES_MODELS_SET,
  VEHICLES_RESET,
  VEHICLES_SUMMONED_SET,
  VEHICLES_TELEMETRY_METRICS_VERSION_SET
} from '@/store/mutation-types'

import {
  VEHICLES_LIST,
  VEHICLES_WITH_AUTHORITIES_LIST
} from '@/lib/constants'
import vinYearCodes from '@/lib/vinYearCodes'

const vehicles = {
  state: {
    firmwareComponents: [],
    firmwareVersions: {},
    managedSessions: [],
    modelReleases: [],
    models: [],
    parts: {},
    platforms: [ // hard-coded until we get more platforms and a lookup lambda
      {
        id: 1,
        platformName: 'FUV 1.0',
        description: 'Original manufactured platform'
      }
    ],
    telemetryPointsConfig: [],
    vehicles: [],
    vehiclesSummoned: false
  },
  actions: {
    async [MANAGED_SESSION_END] ({ dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { vin } = payload
      requestData.vin = vin
      /* eslint-disable prefer-const */
      let response = await managedSessionsRequests.vehicleManagedSessionEnd(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `${vin}: Managed Session End Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        await dispatch(MANAGED_SESSIONS_VEHICLE_SUMMON, { componentSelf, payload: { vin } })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, `${vin}: Managed Session Ended`)
      }
    },
    async [MANAGED_SESSION_START] ({ dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const vin = payload.vin
      requestData.vin = vin
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await managedSessionsRequests.vehicleManagedSessionStart(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `${vin}: Managed Session Start  Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        await dispatch(MANAGED_SESSIONS_VEHICLE_SUMMON, { componentSelf, payload: { vin } })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, `${vin}: Managed Session Started`)
      }
    },
    async [MANAGED_SESSION_SUMMON] ({ commit, getters, rootState }, { componentSelf, id }) {
      if (!getters[VEHICLES_MANAGED_SESSION](id)) {
        const requestData = utility.requestDataInstantiate(rootState)
        requestData.id = id
        utility.setLoadingAndToast(componentSelf, true, null, false)
        /* eslint-disable prefer-const */
        let response = await managedSessionsRequests.managedSessionGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Managed Session Get Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          const managedSession = response.data.managedSessions[0]
          commit(VEHICLES_MANAGED_SESSION_SET, managedSession)
          utility.setLoadingAndToast(componentSelf, false, 'Managed Session')
        }
      }
    },
    async [MANAGED_SESSION_TELEMETRY_SUMMON] ({ commit, getters, rootState }, { componentSelf, id }) {
      if (!getters[VEHICLES_MANAGED_SESSION_TELEMETRY](id)) {
        const requestData = utility.requestDataInstantiate(rootState)
        requestData.id = id
        utility.setLoadingAndToast(componentSelf, true, null, false)
        /* eslint-disable prefer-const */
        let response = await managedSessionsRequests.managedSessionTelemetryGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Managed Session - Telemetry Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          const telemetryData = response.data
          commit(VEHICLES_MANAGED_SESSION_TELEMETRY_SET, { telemetryData, id })
          utility.setLoadingAndToast(componentSelf, false, 'Managed Session - Telemetry Data')
        }
      }
    },
    async [MANAGED_SESSIONS_SUMMON] ({ commit, rootState }, { componentSelf }) {
      // Always retrieve a new list, in case there had been a new session started
      // reset the state before requesting new list
      commit(VEHICLES_MANAGED_SESSIONS_RESET)
      const requestData = utility.requestDataInstantiate(rootState)
      utility.setLoadingAndToast(componentSelf, true, null, false)
      /* eslint-disable prefer-const */
      let response = await managedSessionsRequests.managedSessionsGet(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Managed Sessions List Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        commit(VEHICLES_MANAGED_SESSIONS_SET, response.data)
        utility.setLoadingAndToast(componentSelf, false, 'Managed Sessions')
      }
    },
    async [MANAGED_SESSIONS_VEHICLE_SUMMON] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { vin } = payload
      requestData.vin = vin
      /* eslint-disable prefer-const */
      let response = await managedSessionsRequests.vehicleManagedSessionsGet(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Vehicle Managed Sessions List Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const { managedSessions } = response.data
        commit(VEHICLE_LOADED_SET, { vin, loaded: false })
        commit(VEHICLE_MANAGED_SESSIONS_SET, { vin, managedSessions })
        commit(VEHICLE_LOADED_SET, { vin, loaded: true })
        utility.setLoadingAndToast(componentSelf, false, 'Vehicle Managed Sessions')
      }
    },
    async [VEHICLE_CONFIGURATION_GOVERNOR_SAVE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.vin = payload.vin
      requestData.body = payload.body
      const response = await vehicleRequests.configurationSet(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Vehicle Configuration Save Failed: ${e.message}`)
        })
      if (response &&
          response.status === 200 &&
          response.data.configuration &&
          response.data.configuration.optionGovernorMaxSpeed
      ) {
        const configuration = {
          vin: payload.vin,
          optionGovernorMaxSpeed: response.data.configuration.optionGovernorMaxSpeed
        }
        commit(VEHICLE_GOVERNOR_SET, configuration)
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle Configuration Set')
      }
    },
    async [VEHICLE_FIRMWARE_VERSION_SAVE] ({ commit, getters, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { body, vin } = payload
      requestData.vin = vin
      requestData.body = body
      /* eslint-disable prefer-const */
      let response = await vehicleRequests.firmwareVersionSet(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Firmware Version Set Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const responseData = response.data.firmwareModules
        const vehicleFirmwareVersions = [...getters[VEHICLE_FIRMWARE](vin)]
        Object.keys(responseData).forEach(firmwareComponentName => {
          const index = vehicleFirmwareVersions.findIndex(item => item.name === firmwareComponentName)
          const updatedItem = {
            name: firmwareComponentName,
            fullHash: responseData[firmwareComponentName]
          }
          if (firmwareComponentName === 'Inverter Profile - Left') {
            const vehiclesFirmwareVersions = getters[VEHICLES_FIRMWARE_VERSIONS]
            const vehicleKersSensorPartNumber = getters[VEHICLE_PART_KERS_SENSOR](vin)
            updatedItem.fullHash = vehiclesFirmwareVersions[`${vehicleKersSensorPartNumber} Inverter Profile Left`]
          }
          vehicleFirmwareVersions.splice(index, 1, updatedItem)
        })
        commit(VEHICLE_LOADED_SET, { vin, loaded: false })
        commit(VEHICLE_FIRMWARE_SET, { vin, firmware: vehicleFirmwareVersions })
        commit(VEHICLE_LOADED_SET, { vin, loaded: true })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Firmware Component Version Updated')
        // create note
        const operatorDisplayName = getters[OPERATOR_DISPLAY_NAME]
        const operatorUsername = getters[OPERATOR_USERNAME]
        Object.keys(responseData).forEach(firmwareComponentName => {
          const dateOutput = componentSelf.$moment()
          const content = `Firmware Package "${firmwareComponentName}" was serviced by ${operatorDisplayName} [${operatorUsername}] on ${dateOutput}`
          const body = {
            content,
            tags: ['firmware']
          }
          dispatch(VEHICLE_NOTE_CREATE, { componentSelf, payload: { vin, body } })
        })
      }
    },
    async [VEHICLE_FLEET_ADD] ({ commit, getters, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { id, vin } = payload
      requestData.vin = vin
      requestData.id = id
      requestData.body = payload.body
      let response = await vehicleRequests.fleetAdd(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Vehicle Fleet Add Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const force = true
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle Added to Fleet')
        await dispatch(VEHICLE_SUMMON, { componentSelf, vin, getTypes: ['vehicle'], force })
      }
    },
    async [VEHICLE_FLEET_REMOVE] ({ commit, getters, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { id, vin } = payload
      requestData.vin = vin
      requestData.id = id
      requestData.body = payload.body
      let response = await vehicleRequests.fleetRemove(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Vehicle Fleet Remove Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const force = true
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle Removed from Fleet')
        await dispatch(VEHICLE_SUMMON, { componentSelf, vin, getTypes: ['vehicle'], force })
      }
    },
    async [VEHICLE_GPS_RECORD_SAVE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.vin = payload.vin
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await vehicleRequests.gpsRecordSet(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Vehicle GPS Record Set Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const configuration = {
          vin: payload.vin,
          gpsRecord: payload.body.record_gps
        }
        commit(VEHICLE_GPS_RECORD_SET, configuration)
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle GPS Record Set')
      }
    },
    async [VEHICLE_MODEL_RELEASE_SAVE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { modelReleaseId, vin } = payload
      requestData.vin = vin
      requestData.modelReleaseId = modelReleaseId
      /* eslint-disable prefer-const */
      let response = await vehicleRequests.modelReleaseSet(requestData)
        .catch(e => {
          // errors.handleAxiosRequestError(componentSelf, `Vehicle Model Release Set Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        commit(VEHICLE_LOADED_SET, { vin, loaded: false })
        commit(VEHICLE_MODEL_RELEASE_SET, { vin, modelReleaseId })
        commit(VEHICLE_LOADED_SET, { vin, loaded: true })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle Model Release Set')
      }
    },
    async [VEHICLE_NOTE_CREATE] ({ dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { body, vin } = payload
      requestData.vin = vin
      requestData.body = body
      /* eslint-disable prefer-const */
      let response = await vehicleRequests.noteCreate(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Vehicle Note Create Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle Note Created')
        dispatch(VEHICLE_NOTES_SUMMON, { componentSelf, payload: { vin, force: true } })
      }
    },
    async [VEHICLE_NOTES_SUMMON] ({ commit, getters, rootState }, { componentSelf, payload }) {
      const { force = false, vin } = payload
      if (force || !getters[VEHICLE_NOTES](vin).length) {
        const requestData = utility.requestDataInstantiate(rootState)
        utility.setLoadingAndToast(componentSelf, true, null, false)
        /* eslint-disable prefer-const */
        let response = await vehicleRequests.vehicleGet(requestData, 'notes')
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Vehicle Notes List Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          commit(VEHICLE_NOTES_SET, { vin, notes: response.data })
          utility.setLoadingAndToast(componentSelf, false, 'Vehicle Notes')
        }
      }
    },
    async [VEHICLE_PART_SAVE]  ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { vin } = payload
      requestData.vin = vin
      requestData.body = payload.body
      const makeRequest = async () => {
        try {
          return await vehicleRequests.partSet(requestData)
        } catch (e) {
          errors.handleAxiosRequestError(componentSelf, `Vehicle Part Save Request Fail: ${e.message}`)
        }
      }
      /* eslint-disable prefer-const */
      let response = await makeRequest()
      if (response && response.status === 200) {
        const commitPayload = {
          vin,
          partNumber: payload.body.part_number,
          partType: payload.body.part_type,
          installed: response.data.installed
        }
        commit(VEHICLE_LOADED_SET, { vin, loaded: false })
        commit(VEHICLE_PART_SET, commitPayload)
        commit(VEHICLE_LOADED_SET, { vin, loaded: true })
        utility.setLoadingAndToast(componentSelf, false, null, 'Vehicle Part Set')
      }
    },
    async [VEHICLE_PROVISION]  ({ dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const vin = payload.vin
      requestData.vin = vin
      requestData.body = payload.body
      let retries = 3
      const makeRequest = async () => {
        try {
          return await authoritiesRequests.authoritiesVehicleProvision(requestData)
        } catch (e) {
          if (retries) {
            retries--
            utilityLib.messageSet(componentSelf, 'Request Timeout: Retrying', 'warning', 6000, 'toasted-warning')
            return makeRequest()
          } else {
            errors.handleAxiosRequestError(componentSelf, `Vehicle Provision Request Fail: ${e.message}`)
          }
        }
      }
      const response = await makeRequest()
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf, false, null, 'Vehicle Provisioned')
        dispatch(VEHICLE_SUMMON, { componentSelf, vin, getTypes: ['vehicle'] })
        const {
          certificate,
          options,
          managedSessionMode,
          modelReleaseId,
          pin,
          privateKey
        } = response.data
        const identity = {
          vin,
          options: {
            heated_seats: options.heatedSeats,
            heated_grips: options.heatedGrips,
            stereo_enabled: options.stereoEnabled
          },
          managed_session_mode: managedSessionMode,
          model_release_id: modelReleaseId,
          pin,
          aws_endpoint: 'a3pzb3h0tgvmya.iot.us-west-2.amazonaws.com',
          aws_cert: '-----BEGIN CERTIFICATE-----\nMIIB8jCCAXigAwIBAgITBmyf18G7EEwpQ+Vxe3ssyBrBDjAKBggqhkjOPQQDAzA5\nMQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6b24g\nUm9vdCBDQSA0MB4XDTE1MDUyNjAwMDAwMFoXDTQwMDUyNjAwMDAwMFowOTELMAkG\nA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJvb3Qg\nQ0EgNDB2MBAGByqGSM49AgEGBSuBBAAiA2IABNKrijdPo1MN/sGKe0uoe0ZLY7Bi\n9i0b2whxIdIA6GO9mif78DluXeo9pcmBqqNbIJhFXRbb/egQbeOc4OO9X4Ri83Bk\nM6DLJC9wuoihKqB1+IGuYgbEgds5bimwHvouXKNCMEAwDwYDVR0TAQH/BAUwAwEB\n/zAOBgNVHQ8BAf8EBAMCAYYwHQYDVR0OBBYEFNPsxzplbszh2naaVvuc84ZtV+WB\nMAoGCCqGSM49BAMDA2gAMGUCMDqLIfG9fhGt0O9Yli/W651+kI0rz2ZVwyzjKKlw\nCkcO8DdZEv8tmZQoTipPNU0zWgIxAOp1AE47xDqUEpHJWEadIRNyp4iciuRMStuW\n1KyLa2tJElMzrdfkviT8tQp21KW8EA==\n-----END CERTIFICATE-----\n',
          client_cert: certificate,
          client_key: privateKey
        }
        return identity
      }
      return null
    },
    async [VEHICLE_SHADOW_SYNCRONIZED] ({ commit, getters, rootState }, { componentSelf, vin }) {
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.vin = vin
      if (Object.keys(getters[VEHICLE_SYNCHRONIZED](vin)).length === 0) {
        commit(VEHICLE_SYNCHRONIZED_INSTANTIATE, { vin })
      }
      /* eslint-disable prefer-const */
      let response = await vehicleRequests.shadowSynchronized(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, e)
          const msg = 'Vehicle Shadow Synchronized Request Failed:'
          utility.messageSet(componentSelf, `${msg} ${e.message}`, 'error', null, 'toasted-error')
        })
      if (response && response.status === 200) {
        commit(VEHICLE_SYNCHRONIZED_SET, { vin, data: response.data })
      }
    },
    async [VEHICLE_SIGN_TOKEN] ({ rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.vin = payload.vin
      requestData.body = payload.body
      let response = await vehicleRequests.signToken(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Vehicle Sign Token Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle Token Signed')
        return response.data.token
      }
      return false
    },
    async [VEHICLE_SUMMON] ({ commit, getters, rootState }, { componentSelf, vin, getTypes, force = false }) {
      const vehicleInStore = (vin) => getters[VINS].includes(vin)

      if (force && vehicleInStore(vin)) {
        commit(VEHICLE_LOADED_SET, { vin, loaded: false })
      }

      if (!vehicleInStore(vin)) {
        commit(VEHICLE_INSTANTIATE, vin)
      }
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.vin = vin
      const promises = []

      if (getTypes.includes('vehicle')) {
        promises.push(vehicleRequests.vehicleGet(requestData, 'vehicle'))
      }
      if (getTypes.includes('authorities')) {
        promises.push(vehicleRequests.vehicleGet(requestData, 'authorities'))
      }
      if (getTypes.includes('gps')) {
        promises.push(vehicleRequests.vehicleGet(requestData, 'gps'))
      }
      if (getTypes.includes('managed-sessions')) {
        promises.push(managedSessionsRequests.vehicleManagedSessionsGet(requestData))
      }
      if (getTypes.includes('vehicle') || getTypes.includes('authorities')) {
        promises.push(vehicleRequests.vehicleGet(requestData, 'notes'))
      }
      if (getTypes.includes('recalls')) {
        promises.push(vehicleRequests.vehicleGet(requestData, 'recalls'))
      }
      if (promises.length) {
        utility.setLoadingAndToast(componentSelf, true, null)
      }
      Promise.all(promises)
        .then((responses) => {
          // merge all responses
          const vehicle = {}
          responses.map((response) => {
            // fix notes being an array
            if (Array.isArray(response.data)) {
              const notes = { notes: response.data }
              Object.assign(vehicle, notes)
            } else {
              Object.assign(vehicle, response.data)
            }
          })
          return vehicle
        })
        .then((vehicle) => {
          // remap properties
          // telemetry => telemetryConfig
          vehicle.telemetryConfig = {}
          Object.assign(vehicle.telemetryConfig, vehicle.telemetry)
          delete vehicle.telemetry
          // groups => fleets
          vehicle.fleets = []
          Object.values(vehicle.groups).map((value, key) => {
            vehicle.fleets.push({ id: value })
          })
          delete vehicle.groups
          // firmwareVersions => firmware
          vehicle.firmware = []
          Object.entries(vehicle.firmwareVersions).map(([name, fullHash]) => {
            vehicle.firmware.push({ name, fullHash })
          })
          delete vehicle.firmwareVersions
          // vehicleRecalls => recalls mapped below, won't work here for some reason?

          return vehicle
        })
        .then((vehicle) => {
          if ('alarms' in vehicle) {
            commit(VEHICLE_ALARMS_SET, vehicle)
          }
          if ('allowsGovernor' in vehicle) {
            commit(VEHICLE_GOVERNOR_ALLOWED_SET, vehicle)
          }
          if ('authorities' in vehicle) {
            commit(VEHICLE_AUTHORITIES_SET, vehicle)
          }
          if ('configuration' in vehicle) {
            if (vehicle.configuration.optionGovernorMaxSpeed) {
              const payload = {
                vin: vehicle.vin,
                optionGovernorMaxSpeed: vehicle.configuration.optionGovernorMaxSpeed
              }
              commit(VEHICLE_GOVERNOR_SET, payload)
            }
          }
          if ('firmware' in vehicle) {
            commit(VEHICLE_FIRMWARE_SET, vehicle)
          }
          if ('fleets' in vehicle) {
            commit(VEHICLE_FLEETS_SET, vehicle)
          }
          if ('managedSession' in vehicle) {
            commit(VEHICLE_MANAGED_SESSION_MODE_SET, vehicle)
          }
          if ('managedSessions' in vehicle) {
            commit(VEHICLE_MANAGED_SESSIONS_SET, vehicle)
          }
          if ('model' in vehicle) {
            commit(VEHICLE_MODEL_SET, vehicle)
          }
          if ('modelReleaseId' in vehicle) {
            commit(VEHICLE_MODEL_RELEASE_SET, vehicle)
          }
          if ('notes' in vehicle) {
            commit(VEHICLE_NOTES_SET, vehicle)
          }
          if ('options' in vehicle) {
            commit(VEHICLE_OPTIONS_SET, vehicle)
          }
          if ('parts' in vehicle) {
            commit(VEHICLE_PARTS_SET, vehicle)
          }
          if ('pin' in vehicle) {
            commit(VEHICLE_PIN_SET, vehicle)
          }
          if ('privacy' in vehicle) {
            if (vehicle.privacy.recordGps) {
              const payload = {
                vin: vehicle.vin,
                gpsRecord: vehicle.privacy.recordGps
              }
              commit(VEHICLE_GPS_RECORD_SET, payload)
            }
          }
          if ('registration' in vehicle) {
            commit(VEHICLE_REGISTRATION_SET, vehicle)
          }
          if ('telemetryConfig' in vehicle) {
            commit(VEHICLE_TELEMETRY_CONFIG_SET, vehicle)
          }
          if ('telemetrySettings' in vehicle) {
            commit(VEHICLE_TELEMETRY_SETTINGS_SET, vehicle)
          }
          if ('vehicleRecalls' in vehicle) {
            vehicle.recalls = vehicle.vehicleRecalls
            delete vehicle.vehicleRecalls
            commit(VEHICLE_RECALLS_SET, vehicle)
          }
          commit(VEHICLE_LOADED_SET, { vin: vehicle.vin, loaded: true })
        })
        .catch(e => {
          const msg = 'Vehicle Data Request Failed:'
          errors.handleAxiosRequestError(componentSelf, `${msg} ${e.message}`)
        })
        .finally(() => {
          if (promises.length) {
            utility.setLoadingAndToast(componentSelf, false, vin)
          }
        })
    },
    async [VEHICLE_TELEMETRY_BACKFILL_PRESIGN_UPLOAD] ({ rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.vin = payload.vin
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await vehicleRequests.telemetryBackfillPresignUpload(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Backfill Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Backfill Allowed: Uploading Data')
        return response.data ? response.data.presignedUrl : null
      }
      return null
    },
    async [VEHICLE_TELEMETRY_BACKFILL_PROCESS] ({ rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.vin = payload.vin
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await vehicleRequests.telemetryBackfillProcess(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Backfill Process Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Backfill Processing Started')
      }
    },
    async [VEHICLE_TELEMETRY_CONFIG_SAVE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { selectedTelemetryPointsConfig, vin } = payload
      requestData.vin = vin
      requestData.body = payload.body
      const makeRequest = async () => {
        try {
          return await vehicleRequests.telemetrySetPoints(requestData)
        } catch (e) {
          errors.handleAxiosRequestError(componentSelf, `Vehicle Telemetry Points Config Request Failed: ${e.message}`)
        }
      }
      /* eslint-disable prefer-const */
      let response = await makeRequest()
      if (response && response.status === 200) {
        const commitPayload = {
          vin,
          telemetryConfig: selectedTelemetryPointsConfig
        }
        commit(VEHICLE_LOADED_SET, { vin, loaded: false })
        commit(VEHICLE_TELEMETRY_CONFIG_SET, commitPayload)
        commit(VEHICLE_LOADED_SET, { vin, loaded: true })
        utility.setLoadingAndToast(componentSelf, false, null, 'Vehicle Telemetry Points Config Set')
      }
    },
    async [VEHICLE_TELEMETRY_RETRIEVE] ({ commit, getters, rootState }, { componentSelf, vin, telemetryPoints, requestType }) {
      const requestData = utility.requestDataInstantiate(rootState)
      const makeRequest = async () => {
        try {
          return await vehiclesRequests.vehiclesTelemetryGet([vin], telemetryPoints, requestData)
        } catch (e) {
          errors.handleAxiosRequestError(componentSelf, `Telemetry Request Fail: ${e.message}`)
        }
      }
      commit(VEHICLE_TELEMETRY_POINTS_LOADING_SET, { vin, telemetryPointsLoading: true })
      /* eslint-disable prefer-const */
      let response = await makeRequest()
      if (response && response.status === 200) {
        // commit data to store for each vehicle
        for (const [vin, telemetryPoints] of Object.entries(response.data.vehiclesTelemetryPoints)) {
          if (!getters[VINS].includes(vin)) {
            commit(VEHICLE_INSTANTIATE, vin)
          }
          if (getters[VINS].includes(vin)) {
            commit(VEHICLE_TELEMETRY_VALUES_SET, { vin, telemetryPoints })
            commit(VEHICLE_TELEMETRY_POINTS_LOADED_SET, { vin, telemetryPointsLoaded: true })
          }
        }
        commit(VEHICLE_TELEMETRY_POINTS_LOADING_SET, { vin, telemetryPointsLoading: false })
        return response.data.vehiclesTelemetryPoints
      }
      return null
    },
    async [VEHICLES_FIRMWARE_COMPONENTS_SUMMON] ({ commit, getters, rootState }, { componentSelf, force = false }) {
      if (force || !getters[VEHICLES_FIRMWARE_COMPONENTS].length) {
        utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        let response = await vehiclesRequests.firmwareComponentsGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Firmware Components Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          commit(VEHICLES_FIRMWARE_COMPONENTS_SET, response.data.firmwareComponents)
          utility.setLoadingAndToast(componentSelf.$parent, false, 'Firmware Components')
        }
      }
    },
    async [VEHICLES_FIRMWARE_VERSIONS_SUMMON] ({ commit, getters, rootState }, { componentSelf, force = false }) {
      if (force || !Object.keys(getters[VEHICLES_FIRMWARE_VERSIONS]).length) {
        utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        let response = await vehiclesRequests.firmwareVersionsGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Firmware Versions Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          commit(VEHICLES_FIRMWARE_VERSIONS_SET, response.data.firmware)
          utility.setLoadingAndToast(componentSelf.$parent, false, 'Firmware Versions')
        }
      }
    },
    async [VEHICLES_MODEL_RELEASE_CREATE]  ({ dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { modelId, description, parts } = payload
      requestData.id = payload.modelReleaseId
      requestData.body = {
        model_id: modelId,
        description,
        parts
      }
      const makeRequest = async () => {
        try {
          return await vehiclesRequests.modelReleaseCreate(requestData)
        } catch (e) {
          errors.handleAxiosRequestError(componentSelf, `Model Release Create Request Fail: ${e.message}`)
        }
      }
      const response = await makeRequest()
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf, false, null, 'Model Release Created')
        dispatch(VEHICLES_MODEL_RELEASES_SUMMON, { componentSelf, force: true })
        return response.data
      }
      return false
    },
    async [VEHICLES_MODEL_RELEASE_PART_SAVE]  ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.id = payload.modelReleaseId
      requestData.body = {
        part_type: payload.partType,
        part_number: payload.partNumber
      }
      const makeRequest = async () => {
        try {
          return await vehiclesRequests.modelReleasePartSet(requestData)
        } catch (e) {
          errors.handleAxiosRequestError(componentSelf, `Model Release Part Request Failed: ${e.message}`)
        }
      }
      const response = await makeRequest()
      if (response && response.status === 200) {
        commit(VEHICLES_MODEL_RELEASE_PART_SET, payload)
        utility.setLoadingAndToast(componentSelf, false, null, 'Model Release Part Set')
        return response.data
      }
      return null
    },
    async [VEHICLES_MODEL_RELEASES_SUMMON] ({ commit, getters, rootState }, { componentSelf, force }) {
      if (force || !getters[VEHICLES_MODEL_RELEASES].length) {
        const requestData = utility.requestDataInstantiate(rootState)
        utility.setLoadingAndToast(componentSelf, true, null, false)
        /* eslint-disable prefer-const */
        let response = await vehiclesRequests.modelReleasesGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Model Releases List Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          commit(VEHICLES_MODEL_RELEASES_SET, response.data)
          utility.setLoadingAndToast(componentSelf, false, 'Model Releases')
        }
      }
    },
    async [VEHICLES_MODELS_SUMMON] ({ commit, getters, rootState }, { componentSelf, force }) {
      if (force || !getters[VEHICLES_MODELS].length) {
        const requestData = utility.requestDataInstantiate(rootState)
        utility.setLoadingAndToast(componentSelf, true, null, false)
        /* eslint-disable prefer-const */
        let response = await vehiclesRequests.modelsGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Vehicle Models List Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          commit(VEHICLES_MODELS_SET, response.data)
          utility.setLoadingAndToast(componentSelf, false, 'Vehicle Models')
        }
      }
    },
    async [VEHICLES_SUMMON] ({ commit, dispatch, getters, rootState }, { componentSelf, listType, force = false }) {
      const vehicleInStore = (vin) => getters[VINS].includes(vin)

      if (force) {
        commit(VEHICLES_RESET)
      }
      if (force || !getters[VEHICLES_SUMMONED]) {
        utility.setLoadingAndToast(componentSelf, true, null, false)
        if (listType === VEHICLES_WITH_AUTHORITIES_LIST) {
          const requestData = utility.requestDataInstantiate(rootState)
          const response = await vehiclesRequests.vehiclesWithAuthoritiesGet(requestData)
            .catch(e => {
              errors.handleAxiosRequestError(componentSelf, `Vehicles List Request Failed: ${e.message}`)
            })
          if (response && response.status === 200) {
            const vehicles = response.data
            vehicles.sort(utilityLib.sortByVIN)
            // instantiate each vehicle in store if needed
            for (let i = 0; i < vehicles.length; i++) {
              // translate array of id to objects with id prop
              const vehicle = {
                vin: vehicles[i].vin,
                authorities: vehicles[i].authorities.map((id) => { return { id } })
              }
              vehicle.authorities.sort(utilityLib.sortById)
              if (!vehicleInStore(vehicles[i].vin)) {
                commit(VEHICLE_INSTANTIATE, vehicle.vin)
              }
              commit(VEHICLE_AUTHORITIES_SET, vehicle)
            }
            commit(VEHICLES_SUMMONED_SET, true)
            utility.setLoadingAndToast(componentSelf, false, 'Vehicles')
          }
        } else if (listType === VEHICLES_LIST) {
          const requestData = utility.requestDataInstantiate(rootState)
          const response = await vehiclesRequests.vehiclesGet(requestData)
            .catch(e => {
              errors.handleAxiosRequestError(componentSelf, `Vehicles List Request Failed: ${e.message}`)
            })
          if (response && response.status === 200) {
            const vehicles = response.data.vehicles
            vehicles.sort(utilityLib.sortByVIN)
            // instantiate each vehicle in store if needed
            for (let i = 0; i < vehicles.length; i++) {
              if (!vehicleInStore(vehicles[i].vin)) {
                commit(VEHICLE_INSTANTIATE, vehicles[i].vin)
              }
            }
            commit(VEHICLES_SUMMONED_SET, true)
            utility.setLoadingAndToast(componentSelf, false, 'Vehicles')
          }
        } else {
          commit(VEHICLES_SUMMONED_SET, true)
          dispatch(OPERATOR_FLEETS_SUMMON, { componentSelf, operator: componentSelf.operator })
        }
      }
    },
    async [VEHICLES_TELEMETRY_RETRIEVE] ({ commit, getters, rootState }, { componentSelf, vins, telemetryPoints, requestType }) {
      const requestData = utility.requestDataInstantiate(rootState)
      let msg = null
      if (requestType) {
        if (requestType === 'location') {
          msg = 'Vehicle Locations'
        } else if (requestType === 'soc') {
          msg = 'Vehicle(s) SOC'
        } else if (requestType === 'odometer') {
          msg = 'Vehicle Odometer'
        } else {
          msg = 'Vehicles Telemetry'
        }
      }
      const makeRequest = async () => {
        try {
          return await vehiclesRequests.vehiclesTelemetryGet(vins, telemetryPoints, requestData)
        } catch (e) {
          if (e.message === 'Request failed with status code 401') {
            errors.handleAxiosRequestError(componentSelf, `${msg} Request Failed: Unauthorized`)
          } else if (e) {
            errors.handleAxiosRequestError(componentSelf, `${msg} Request Failed: ${e.message}`)
          } else {
            errors.handleAxiosRequestError(componentSelf, `${msg} Request Failed`)
          }
        }
      }
      vins.forEach(vin => {
        commit(VEHICLE_TELEMETRY_POINTS_LOADING_SET, { vin, telemetryPointsLoading: true })
      })
      utility.setLoadingAndToast(componentSelf, true, msg)
      /* eslint-disable prefer-const */
      let response = await makeRequest()
      if (response && response.status === 200) {
        // commit data to store for each vehicle
        for (const [vin, telemetryPoints] of Object.entries(response.data.vehiclesTelemetryPoints)) {
          if (!getters[VINS].includes(vin)) {
            commit(VEHICLE_INSTANTIATE, vin)
          }
          if (getters[VINS].includes(vin)) {
            commit(VEHICLE_TELEMETRY_VALUES_SET, { vin, telemetryPoints })
            commit(VEHICLE_TELEMETRY_POINTS_LOADED_SET, { vin, telemetryPointsLoaded: true })
          }
        }
        vins.forEach(vin => {
          commit(VEHICLE_TELEMETRY_POINTS_LOADING_SET, { vin, telemetryPointsLoading: false })
        })
        utility.setLoadingAndToast(componentSelf, false, msg)
        return response.data.vehiclesTelemetryPoints
      }
      return null
    },
    async [VEHICLES_TELEMETRY_METRICS_VERSION_SUMMON] ({ commit, getters, rootState }, { componentSelf, payload }) {
      const { versionId } = payload
      const msg = 'Vehicles Telemetry Metrics Version'
      const makeRequest = async (requestData) => {
        try {
          return await vehiclesRequests.telemetryMetricsVersionGet(requestData)
        } catch (e) {
          errors.handleAxiosRequestError(componentSelf, `${msg} Request Fail: ${e.message}`)
        }
      }
      const vehiclesTelemetryMetricsVersion = getters[VEHICLES_TELEMETRY_METRICS_VERSION_KEYS](versionId)
      if (!vehiclesTelemetryMetricsVersion.length) {
        utility.setLoadingAndToast(componentSelf, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        requestData.versionId = versionId
        /* eslint-disable prefer-const */
        let response = await makeRequest(requestData)
        if (response && response.status === 200) {
          if (response.data.telemetryPoints) {
            const telemetryConfig = response.data.telemetryPoints
            commit(VEHICLES_TELEMETRY_METRICS_VERSION_SET, { versionId, telemetryConfig })
            utility.setLoadingAndToast(componentSelf, false, msg)
          } else {
            utility.setLoadingAndToast(componentSelf, false, null, `${msg} Data Unavailable`)
          }
          return true
        }
      }
      return null
    }
  },
  getters: {
    [VEHICLE]: (state) => (vin) => {
      const vehicle = state.vehicles.find(vehicle => vehicle.vin === vin)
      if (vehicle) {
        if ('authorities' in vehicle) {
          vehicle.authorities.sort(utilityLib.sortById)
        }
      }
      return vehicle
    },
    [VEHICLE_ALARMS]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle && vehicle.alarms ? vehicle.alarms : {}
    },
    [VEHICLE_AUTHORITIES]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      if (vehicle && vehicle.authorities) {
        const vehicleAuthorities = [...vehicle.authorities]
        vehicleAuthorities.sort(utilityLib.sortById)
        return vehicleAuthorities
      }
      return []
    },
    [VEHICLE_BOARD_ID]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle && vehicle.registration ? vehicle.registration.board : null
    },
    [VEHICLE_FIRMWARE]: (state, getters) => (vin) => {
      const vehiclesFirmwareComponents = getters[VEHICLES_FIRMWARE_COMPONENTS]
      const vehiclesFirmwareVersions = getters[VEHICLES_FIRMWARE_VERSIONS]
      const vehicle = getters[VEHICLE](vin)
      const vehicleHasPreDiscoboard = getters[VEHICLE_HAS_PRE_DISCOBOARD](vin)
      const vehicleFirmware = []

      if (!vehicle || !vehicle.firmware) {
        return vehicleFirmware
      }

      const partTypeGet = (firmwareComponentName) => {
        const vehiclesFirmwareComponent = vehiclesFirmwareComponents.find(item => item.firmwareComponent === firmwareComponentName)
        return vehiclesFirmwareComponent ? vehiclesFirmwareComponent.partType : null
      }

      const componentHasLatestFirmware = (firmwareComponent) => {
        let firmwareComponentVersion = null
        // handle non-exceptions
        firmwareComponentVersion = Object.entries(vehiclesFirmwareVersions)
          .find(([firmwareComponentName, version]) => {
            return firmwareComponentName === firmwareComponent.name
          })
        // only handle these exceptions if data is available for a comparison
        if (firmwareComponentVersion !== undefined) {
          // handle Discoboard exceptions for Comm [Bootloader and Firmware]
          if (['Comm Bootloader', 'Comm Firmware'].includes(firmwareComponent.name)) {
            if (!vehicleHasPreDiscoboard) {
              firmwareComponentVersion = [
                firmwareComponent.name,
                vehiclesFirmwareVersions[`004280 ${firmwareComponent.name}`]
              ]
            }
          }
          // use vehicle KERS Sensor part number to get correct `Inverter Profile - Left` entry
          if (firmwareComponent.name === 'Inverter Profile - Left') {
            const vehicleKersSensorPartNumber = getters[VEHICLE_PART_KERS_SENSOR](vin)
            firmwareComponentVersion = [
              firmwareComponent.name,
              vehiclesFirmwareVersions[`${vehicleKersSensorPartNumber} Inverter Profile Left`]
            ]
          }
        }
        return firmwareComponentVersion ? firmwareComponent.fullHash === firmwareComponentVersion[1] : null
      }

      vehicle.firmware.forEach(vehicleFirmwareItem => {
        const name = vehicleFirmwareItem.name
        const fullHash = vehicleFirmwareItem.fullHash
        const hash = vehicleFirmwareItem.fullHash.slice(0, 7)
        const item = {
          name,
          fullHash,
          hash,
          partType: null,
          hasLatestFirmware: null
        }
        if (vehiclesFirmwareComponents.length) {
          item.partType = partTypeGet(name)
        }
        if (!vehiclesFirmwareVersions.length) {
          item.hasLatestFirmware = componentHasLatestFirmware({ name, fullHash })
        }
        vehicleFirmware.push(item)
      })
      return vehicleFirmware
    },
    [VEHICLE_FIRMWARE_COMPONENTS_OUTDATED]: (state, getters) => (vin) => {
      const vehicleFirmware = getters[VEHICLE_FIRMWARE](vin)
      return vehicleFirmware.filter(item => item.hasLatestFirmware !== true)
    },
    [VEHICLE_FIRMWARE_COMPONENTS_UP_TO_DATE]: (state, getters) => (vin) => {
      const vehicleFirmware = getters[VEHICLE_FIRMWARE](vin)
      return vehicleFirmware.filter(item => item.hasLatestFirmware === true)
    },
    [VEHICLE_FIRMWARE_UP_TO_DATE]: (state, getters) => (vin) => {
      const vehicleFirmware = getters[VEHICLE_FIRMWARE](vin)
      if (!vehicleFirmware.length) {
        return null
      }
      const unknownItems = vehicleFirmware.some(item => item.hasLatestFirmware === null)
      const allUnknown = vehicleFirmware.every(item => item.hasLatestFirmware === null)
      const allLatest = vehicleFirmware.every(item => item.hasLatestFirmware === true)
      if (allLatest) {
        if (unknownItems) {
          return null
        } else {
          return true
        }
      }
      if (allUnknown) {
        return null
      }
      return false
    },
    [VEHICLE_FLEETS]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)

      if (!vehicle || !vehicle.fleets) {
        return []
      }
      return vehicle.fleets.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0))
    },
    [VEHICLE_FLEETS_LOCATIONS]: (state, getters) => (vin) => {
      const vehicleFleetsLocations = []
      const vehicle = getters[VEHICLE](vin)

      if (!vehicle || !vehicle.fleets) {
        return vehicleFleetsLocations
      }
      const vehicleFleets = [...vehicle.fleets].filter(e => e !== 1)
      vehicleFleets.forEach(fleetId => {
        const fleetLocation = getters[FLEET_LOCATION_ID](fleetId)
        if (fleetLocation) {
          vehicleFleetsLocations.push(fleetLocation)
        }
      })

      return vehicleFleetsLocations
    },
    [VEHICLE_GPS_RECORD]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle ? vehicle.gpsRecord : null
    },
    [VEHICLE_GOVERNOR]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle ? vehicle.optionGovernorMaxSpeed : null
    },
    [VEHICLE_GOVERNOR_ALLOWED]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle ? vehicle.allowsGovernor : null
    },
    [VEHICLE_HAS_PRE_DISCOBOARD]: (state, getters) => (vin) => {
      const vehicleBoardId = getters[VEHICLE_BOARD_ID](vin)
      return vehicleBoardId ? vehicleBoardId === '1043' : null
    },
    [VEHICLE_LOADED]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle ? vehicle.loaded : null
    },
    [VEHICLE_LOCATION_GPS]: (state, getters) => (vin) => {
      const vehicleTelemetryPointsGps = getters[VEHICLE_TELEMETRY_GPS](vin)
      if (!vehicleTelemetryPointsGps) {
        return null
      }
      const latData = vehicleTelemetryPointsGps.gpsLatitude.at(-1)
      const longData = vehicleTelemetryPointsGps.gpsLongitude.at(-1)
      if (!latData || !longData) {
        return null
      }
      const lat = latData.point
      const long = longData.point
      const time = vehicleTelemetryPointsGps.gpsLatitude.at(-1).time
      const vehicleGpsPosition = {
        lat,
        long,
        time
      }
      return vehicleGpsPosition
    },
    [VEHICLE_MANAGED_SESSION_ACTIVE]: (state, getters) => (vin) => {
      const vehicleManagedSessions = getters[VEHICLE_MANAGED_SESSIONS](vin)
      if (!vehicleManagedSessions) {
        return null
      }
      const activeSession = vehicleManagedSessions.some(session => session.completion === 'active')
      return activeSession
    },
    [VEHICLE_MANAGED_SESSION_MODE]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle ? vehicle.managedSessionMode : null
    },
    [VEHICLE_MANAGED_SESSIONS]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle && vehicle.managedSessions ? vehicle.managedSessions : []
    },
    [VEHICLE_MODEL]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle ? vehicle.model : null
    },
    [VEHICLE_MODEL_RELEASE]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      if (!vehicle || !vehicle.modelReleaseId) {
        return null
      }
      const vehiclesModelReleases = getters[VEHICLES_MODEL_RELEASES]
      if (vehiclesModelReleases.length) {
        return vehiclesModelReleases.filter(vehiclesModelRelease =>
          vehiclesModelRelease.modelReleaseId === vehicle.modelReleaseId
        )[0]
      }
      return { modelReleaseId: vehicle.modelReleaseId }
    },
    [VEHICLE_NOTES]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle && vehicle.notes ? vehicle.notes : []
    },
    [VEHICLE_ODOMETER]: (state, getters) => (vin) => {
      const vehicleTelemetryPointsOdometer = getters[VEHICLE_TELEMETRY_ODOMETER](vin)
      return vehicleTelemetryPointsOdometer.length ? vehicleTelemetryPointsOdometer.at(-1) : null
    },
    [VEHICLE_ODOMETER_KILOMETERS]: (state, getters) => (vin) => {
      const vehicleOdometer = getters[VEHICLE_ODOMETER](vin)
      if (vehicleOdometer && vehicleOdometer.point) {
        return vehicleOdometer !== null ? Math.round(vehicleOdometer.point * 100) / 100 : null
      }
      return null
    },
    [VEHICLE_ODOMETER_MILES]: (state, getters) => (vin) => {
      const vehicleOdometerKilometers = getters[VEHICLE_ODOMETER_KILOMETERS](vin)
      return vehicleOdometerKilometers !== null ? Math.round((vehicleOdometerKilometers * 0.621371) * 100) / 100 : null
    },
    [VEHICLE_OPTIONS]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle && vehicle.options ? vehicle.options : []
    },
    [VEHICLE_PART_KERS_SENSOR]: (state, getters) => (vin) => {
      const vehicleParts = getters[VEHICLE_PARTS](vin)
      if (!vehicleParts) { return null }
      const part = vehicleParts.find(part => part.partType === 'KERS Sensor')
      return part ? part.partNumber : null
    },
    [VEHICLE_PARTS]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle && vehicle.parts ? vehicle.parts : []
    },
    [VEHICLE_PIN]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle && vehicle.pin ? vehicle.pin : {}
    },
    [VEHICLE_PRIVACY]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle && vehicle.privacy ? vehicle.privacy : {}
    },
    [VEHICLE_RECALLS]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle && vehicle.recalls ? vehicle.recalls : []
    },
    [VEHICLE_REGISTRATION]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle && vehicle.registration ? vehicle.registration : {}
    },
    [VEHICLE_SOC]: (state, getters) => (vin) => {
      const vehicleTelemetryPointsSoc = getters[VEHICLE_TELEMETRY_SOC](vin)
      return vehicleTelemetryPointsSoc.length ? vehicleTelemetryPointsSoc.at(-1) : null
    },
    [VEHICLE_SYNCHRONIZED]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle && vehicle.synchronized ? vehicle.synchronized : {}
    },
    [VEHICLE_TELEMETRY_CONFIG]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle && vehicle.telemetryConfig ? vehicle.telemetryConfig : []
    },
    [VEHICLE_TELEMETRY_GPS]: (state, getters) => (vin) => {
      const vehicleTelemetryPoints = getters[VEHICLE_TELEMETRY_POINTS](vin)
      const vehicleGpsData = {
        gpsLatitude: [],
        gpsLongitude: []
      }
      if (vehicleTelemetryPoints.gpsLatitude && vehicleTelemetryPoints.gpsLongitude) {
        vehicleGpsData.gpsLatitude = [...vehicleTelemetryPoints.gpsLatitude]
        vehicleGpsData.gpsLongitude = [...vehicleTelemetryPoints.gpsLongitude]
      }
      return vehicleGpsData
    },
    [VEHICLE_TELEMETRY_ODOMETER]: (state, getters) => (vin) => {
      const vehicleTelemetryPoints = getters[VEHICLE_TELEMETRY_POINTS](vin)
      return vehicleTelemetryPoints.odometer ? vehicleTelemetryPoints.odometer : []
    },
    [VEHICLE_TELEMETRY_POINTS]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle && vehicle.telemetryPoints ? vehicle.telemetryPoints : {}
    },
    [VEHICLE_TELEMETRY_POINTS_LOADED]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle ? vehicle.telemetryPointsLoaded : null
    },
    [VEHICLE_TELEMETRY_POINTS_LOADING]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle ? vehicle.telemetryPointsLoading : null
    },
    [VEHICLE_TELEMETRY_SOC]: (state, getters) => (vin) => {
      const vehicleTelemetryPoints = getters[VEHICLE_TELEMETRY_POINTS](vin)
      return vehicleTelemetryPoints.bmsPackSoc ? vehicleTelemetryPoints.bmsPackSoc : []
    },
    [VEHICLE_TELEMETRY_UPDATED]: (state, getters) => (vin) => {
      // find most recently updated timestamp in all telemetry points
      const vehicleTelemetryPoints = getters[VEHICLE_TELEMETRY_POINTS](vin)
      let latestTimestamp = null
      Object.keys(vehicleTelemetryPoints).forEach(telemetryPoint => {
        vehicleTelemetryPoints[telemetryPoint].forEach(dataPoint => {
          if (!latestTimestamp) {
            latestTimestamp = dataPoint.time
          } else {
            const latestCompare = new Date(latestTimestamp)
            const newCompare = new Date(dataPoint.time)
            if (newCompare > latestCompare) {
              latestTimestamp = dataPoint.time
            }
          }
        })
      })
      return latestTimestamp
    },
    [VEHICLE_TELEMETRY_SETTINGS_VERSION]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle && vehicle.telemetrySettings ? vehicle.telemetrySettings.version : null
    },
    [VEHICLE_YEAR]: (state, getters) => (vin) => {
      const vehicle = getters[VEHICLE](vin)
      return vehicle ? vehicle.year : null
    },
    [VEHICLES]: (state) => {
      const vehicles = [...state.vehicles]
      for (let i = 0; i < vehicles.length; i++) {
        const vehicle = vehicles[i]
        if ('authorities' in vehicle) {
          vehicle.authorities.sort(utilityLib.sortById)
        }
      }
      return vehicles.sort(utilityLib.sortByVIN)
    },
    [VEHICLES_FIRMWARE_COMPONENTS]: state => {
      return state.firmwareComponents
    },
    [VEHICLES_FIRMWARE_VERSIONS]: state => {
      return state.firmwareVersions
    },
    [VEHICLES_MANAGED_SESSION]: state => id => {
      return state.managedSessions.find(session => {
        return session.id === id
      })
    },
    [VEHICLES_MANAGED_SESSION_TELEMETRY]: state => id => {
      const session = state.managedSessions.find(session => {
        return session.id === id && session.telemetryData
      })
      if (session) {
        return session.telemetryData
      }
      return false
    },
    [VEHICLES_MANAGED_SESSIONS]: state => {
      return state.managedSessions
    },
    [VEHICLES_MODEL_RELEASE_PARTS]: state => modelReleaseId => {
      const modelRelease = state.modelReleases.find(modelRelease => {
        return modelRelease.modelReleaseId === modelReleaseId
      })
      return modelRelease && modelRelease.parts ? modelRelease.parts : []
    },
    [VEHICLES_MODEL_RELEASES]: state => {
      return state.modelReleases
    },
    [VEHICLES_MODEL_RELEASES_MODEL]: state => modelName => {
      return state.modelReleases.find(modelRelease => {
        return modelRelease.modelName === modelName
      })
    },
    [VEHICLES_MODELS]: state => {
      return state.models
    },
    [VEHICLES_SUMMONED]: state => {
      return state.vehiclesSummoned
    },
    [VEHICLES_TELEMETRY_METRICS_VERSION_KEYS]: state => versionId => {
      if (!state.telemetryPointsConfig.length) { return [] }
      let requestedItemIndex = null
      for (let i = 0; i < state.telemetryPointsConfig.length; i++) {
        const item = state.telemetryPointsConfig[i]
        if (item.versionId === versionId) {
          requestedItemIndex = i
          break
        }
      }
      if (requestedItemIndex === null) {
        return []
      }
      return state.telemetryPointsConfig[requestedItemIndex]
    },
    [VEHICLES_TELEMETRY_MILEGAGE_TOTAL]: (state, getters) => (vins) => {
      let odometersTotal = 0
      vins.forEach(vin => {
        const vehicleOdometer = getters[VEHICLE_TELEMETRY_ODOMETER](vin)
        if (vehicleOdometer.length) {
          odometersTotal += vehicleOdometer.at(-1).point
        }
      })
      const odometersTotalMiles = odometersTotal * 0.621371
      return odometersTotalMiles
    },
    [VEHICLES_TELEMETRY_UPDATED]: (state, getters) => (vins) => {
      // find most recently updated timestamp in all telemetry points
      let latestTimestamp = null
      vins.forEach(vin => {
        const vehicleTelemetryUpdated = getters[VEHICLE_TELEMETRY_UPDATED](vin)
        if (!latestTimestamp) {
          latestTimestamp = vehicleTelemetryUpdated
        } else {
          const latestCompare = new Date(latestTimestamp)
          const newCompare = new Date(vehicleTelemetryUpdated)
          if (newCompare > latestCompare) {
            latestTimestamp = vehicleTelemetryUpdated
          }
        }
      })
      return latestTimestamp
    },
    [VINS]: state => {
      const vins = []
      const vehicles = [...state.vehicles]
      if (vehicles.length) {
        vehicles.sort(utilityLib.sortByVIN)
        for (let i = 0; i < vehicles.length; i++) {
          vins.push(vehicles[i].vin)
        }
      }
      return vins
    }
  },
  mutations: {
    [VEHICLE_ALARMS_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.alarms = val.alarms
    },
    [VEHICLE_AUTHORITIES_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.authorities = val.authorities
    },
    [VEHICLE_CONFIGURATION_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.configuration = val.configuration
    },
    [VEHICLE_FIRMWARE_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.firmware = val.firmware
    },
    [VEHICLE_FLEETS_ADD_FLEET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.fleets = [...vehicle.fleets, val.id]
    },
    [VEHICLE_FLEETS_REMOVE_FLEET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      const fleetIndex = state.vehicles.findIndex((fleet) => {
        return fleet.id === val.id
      })
      vehicle.fleets.splice(fleetIndex, 1, val.id)
    },
    [VEHICLE_FLEETS_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.fleets = val.fleets.map(item => item.id).sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0))
    },
    [VEHICLE_GOVERNOR_ALLOWED_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.allowsGovernor = val.allowsGovernor
    },
    [VEHICLE_GOVERNOR_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.optionGovernorMaxSpeed = parseFloat(val.optionGovernorMaxSpeed)
    },
    [VEHICLE_GPS_RECORD_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.gpsRecord = val.gpsRecord
    },
    [VEHICLE_INSTANTIATE] (state, vin) {
      // check if vehicle in VINS before using this
      let envPrefix = ''
      const devRegex = /DEV-/g
      const stagingRegex = /STAGE-/g
      if (vin.match(devRegex)) {
        envPrefix = 'DEV-'
      }
      if (vin.match(stagingRegex)) {
        envPrefix = 'STAGE-'
      }
      const vehicleModel = state.models.filter(model => {
        return model.letterCode === vin.charAt(envPrefix.length + 4)
      })
      // The first group of three numbers and letters in a VIN make up the world manufacturer identifier (WMI)
      const arcimotoWMIs = [
        /7F7/ // AMP
      ]
      const vehicleYear = arcimotoWMIs.some(rx => rx.test(vin)) ? vinYearCodes[vin.charAt(envPrefix.length + 9)] : null
      const vehicle = {
        vin,
        loaded: false,
        telemetryPointsLoaded: false,
        telemetryPointsLoading: false,
        model: vehicleModel.length ? vehicleModel[0].modelName : null,
        year: vehicleYear
      }
      state.vehicles.push(vehicle)
    },
    [VEHICLE_LOADED_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.loaded = val.loaded
    },
    [VEHICLE_MANAGED_SESSION_MODE_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.managedSessionMode = typeof val.managedSession.enabled !== 'undefined' ? val.managedSession.enabled : false
    },
    [VEHICLE_MANAGED_SESSIONS_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.managedSessions = val.managedSessions
    },
    [VEHICLE_MODEL_RELEASE_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.modelReleaseId = val.modelReleaseId
    },
    [VEHICLE_MODEL_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.model = val.model
    },
    [VEHICLE_NOTE_ADD] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.notes.push(val.note)
    },
    [VEHICLE_NOTES_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.notes = val.notes
    },
    [VEHICLE_OPTIONS_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.options = val.options
    },
    [VEHICLE_PART_SET] (state, val) {
      const { installed, partNumber, partType, vin } = val
      const vehicle = utility.stateFindVehicle(state, vin)
      const partIndex = vehicle.parts.findIndex((part) => {
        return part.partType === partType
      })
      vehicle.parts.splice(partIndex, 1, { installed, partType, partNumber })
    },
    [VEHICLE_PARTS_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.parts = val.parts
    },
    [VEHICLE_PIN_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.pin = val.pin
    },
    [VEHICLE_PRIVACY_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.privacy = val.privacy
    },
    [VEHICLE_RECALLS_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.recalls = val.recalls
    },
    [VEHICLE_REGISTRATION_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.registration = val.registration
    },
    [VEHICLE_REMOVE] (state, vin) {
      const vehicleIndex = state.vehicles.findIndex((vehicle) => {
        return vehicle.vin === vin
      })
      state.vehicles.splice(vehicleIndex, 1)
    },
    [VEHICLE_TELEMETRY_CONFIG_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      if (vehicle) {
        // ignore frequency
        vehicle.telemetryConfig = Object.keys(val.telemetryConfig).sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0))
      }
    },
    [VEHICLE_TELEMETRY_POINTS_LOADED_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.telemetryPointsLoaded = val.telemetryPointsLoaded
    },
    [VEHICLE_TELEMETRY_POINTS_LOADING_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.telemetryPointsLoading = val.telemetryPointsLoading
    },
    [VEHICLE_TELEMETRY_SETTINGS_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.telemetrySettings = val.telemetrySettings
    },
    [VEHICLE_SYNCHRONIZED_INSTANTIATE] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      vehicle.synchronized = {}
    },
    [VEHICLE_SYNCHRONIZED_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      if (vehicle) {
        vehicle.synchronized = val.data
      }
    },
    [VEHICLE_TELEMETRY_VALUES_SET] (state, val) {
      const vehicle = utility.stateFindVehicle(state, val.vin)
      if (!vehicle.telemetryPoints) {
        vehicle.telemetryPoints = {}
      }
      for (const [name, data] of Object.entries(val.telemetryPoints)) {
        if (!vehicle.telemetryPoints[name]) {
          vehicle.telemetryPoints[name] = []
        }
        // check timestamps of data and append points that aren't in store
        const pointInData = vehicle.telemetryPoints[name].some(item => item.time === data.time)
        if (!pointInData) {
          vehicle.telemetryPoints[name].push(data)
        }
      }
    },
    [VEHICLES_FIRMWARE_COMPONENTS_SET] (state, val) {
      state.firmwareComponents = val
    },
    [VEHICLES_FIRMWARE_VERSIONS_SET] (state, val) {
      state.firmwareVersions = val
    },
    [VEHICLES_MANAGED_SESSION_SET] (state, val) {
      state.managedSessions.push(val)
    },
    [VEHICLES_MANAGED_SESSION_TELEMETRY_SET] (state, val) {
      const managedSession = state.managedSessions.find(session => {
        return session.id === val.id
      })
      managedSession.telemetryData = val.telemetryData
    },
    [VEHICLES_MANAGED_SESSIONS_RESET] (state) {
      state.managedSessions = []
    },
    [VEHICLES_MANAGED_SESSIONS_SET] (state, val) {
      state.managedSessions = val.managedSessions
    },
    [VEHICLES_MODEL_RELEASE_PART_SET] (state, val) {
      const { modelReleaseId, partType, partNumber } = val
      const modelRelease = utility.stateFindModelRelease(state, modelReleaseId)
      const partIndex = modelRelease.parts.findIndex(part => part.partType === partType)
      if (partIndex !== -1) {
        modelRelease.parts.splice(partIndex, 1, { partType, partNumber })
      }
    },
    [VEHICLES_MODEL_RELEASES_RESET] (state) {
      state.modelReleases = []
    },
    [VEHICLES_MODEL_RELEASES_SET] (state, val) {
      state.modelReleases = [...val.modelReleases]
    },
    [VEHICLES_MODELS_RESET] (state) {
      state.models = []
    },
    [VEHICLES_MODELS_SET] (state, val) {
      state.models = [...val.models]
    },
    [VEHICLES_RESET] (state) {
      state.vehicles = []
    },
    [VEHICLES_SUMMONED_SET] (state, val) {
      state.vehiclesSummoned = val
    },
    [VEHICLES_TELEMETRY_METRICS_VERSION_SET] (state, val) {
      const { telemetryConfig, versionId } = val
      const requestedVersion = state.telemetryPointsConfig.find(item => {
        return item.versionId === versionId
      })
      if (!requestedVersion) {
        state.telemetryPointsConfig.push({ telemetryConfig, versionId })
      }
    }
  }
}

export default vehicles
