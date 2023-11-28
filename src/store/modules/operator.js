import errors from '@/lib/errors'
import ls from 'local-storage'
import requests from '@/lib/requests/user'
import utility from '@/store/utility'

import {
  ABILITIES_READ,
  ABILITY_CREATE,
  ABILITY_DELETE,
  ABILITY_EDIT,
  AUTHORITIES_LIST,
  AUTHORITY_ADMIN,
  AUTHORITY_CREATE,
  FIRMWARE_ADMIN,
  FIRMWARE_READ,
  FLEET_SUPERVISOR,
  FLEETS_ADMIN,
  FLEETS_GROUP_READ,
  FLEETS_MANAGER,
  LOCATIONS_ADMIN,
  MANAGED_SESSION_ADMIN,
  PERMISSION_ADMIN,
  PERMISSION_GROUP_CREATE_ENTITY,
  PERMISSION_GROUP_PERMISSIONS_ADD,
  PERMISSION_GROUP_PERMISSIONS_REMOVE,
  PERMISSION_GROUP_WRITE,
  PERMISSIONS_READ,
  RECALL_ADMIN,
  RECALL_CREATE,
  RECALLS_READ,
  SUPER_ADMIN,
  USER_CREATE,
  USER_ENABLED_WRITE,
  USER_GRANT_ABILITY,
  USER_PERMISSION_GROUPS_READ,
  USER_PROFILE_WRITE,
  USER_READ,
  VEHICLE_AUTHORITIES_READ,
  VEHICLE_BACKFILL_TELEMETRY,
  VEHICLE_DELIVER,
  VEHICLE_FIRMWARE_READ,
  VEHICLE_FIRMWARE_WRITE,
  VEHICLE_MAIN_ADMIN,
  VEHICLE_READ,
  VEHICLE_GPS_RECORD_READ,
  VEHICLE_GPS_RECORD_WRITE,
  VEHICLE_MANUFACTURING_CONFIG_WRITE,
  VEHICLE_OPTIONS_WRITE,
  VEHICLE_PROVISION,
  VEHICLE_QUALITY,
  VEHICLE_SERVICE,
  VEHICLE_TELMETRY_CONFIG_WRITE,
  VEHICLE_TOKEN_SIGN
} from '@/lib/ability-types'

import {
  OPERATOR_FLEETS_SUMMON,
  OPERATOR_SUMMON
} from '@/store/action-types'

import {
  LOCAL_STORAGE_APPLICATION,
  LOCAL_STORAGE_NAMESPACE
} from '@/lib/constants'

import {
  ACCESS_ABILITIES,
  ACCESS_ABILITY_CREATE,
  ACCESS_ABILITY_DELETE,
  ACCESS_ABILITY_EDIT,
  ACCESS_AUTHORITIES,
  ACCESS_AUTHORITIES_ADMIN,
  ACCESS_AUTHORITY_CREATE,
  ACCESS_FIRMWARE_ADMIN,
  ACCESS_FIRMWARE_READ,
  ACCESS_FIRMWARE_VEHICLE_READ,
  ACCESS_FIRMWARE_VEHICLE_WRITE,
  ACCESS_FLEET_SUPERVISOR,
  ACCESS_FLEETS_ADMIN,
  ACCESS_FLEETS_GROUPS,
  ACCESS_FLEETS_MANAGER,
  ACCESS_FLEETS_TOGGLE_MEMBERSHIP,
  ACCESS_MANAGED_SESSIONS_ADMIN,
  ACCESS_LOCATIONS_ADMIN,
  ACCESS_PERMISSION_GROUP_ADD_PERMISSION,
  ACCESS_PERMISSION_GROUP_CREATE,
  ACCESS_PERMISSION_GROUP_DELETE,
  ACCESS_PERMISSION_GROUP_REMOVE_PERMISSION,
  ACCESS_PERMISSION_GROUP_TOGGLE_MEMBERSHIP,
  ACCESS_PERMISSION_GROUPS,
  ACCESS_PERMISSIONS,
  ACCESS_USER_EDIT_PROFILE,
  ACCESS_RECALL_ADMIN,
  ACCESS_RECALL_CREATE,
  ACCESS_RECALLS,
  ACCESS_SUPER_ADMIN,
  ACCESS_USER_CREATE,
  ACCESS_USER_GRANT_ABILITY,
  ACCESS_USER_RESEND_INVITE,
  ACCESS_USER_TOGGLE_ENABLED,
  ACCESS_USERS,
  ACCESS_VEHICLE_DELIVER,
  ACCESS_VEHICLE_GROUPS,
  ACCESS_VEHICLE_MANUFACTURING_CONFIGURATION,
  ACCESS_VEHICLE_OPTIONS,
  ACCESS_VEHICLE_PROVISION,
  ACCESS_VEHICLE_QUALITY,
  ACCESS_VEHICLE_SERVICE,
  ACCESS_VEHICLE_TELEMETRY_BACKFILL,
  ACCESS_VEHICLE_TELEMETRY_CONFIGURATION,
  ACCESS_VEHICLE_TOKEN_SIGN,
  ACCESS_VEHICLES,
  ACCESS_VEHICLES_ADMIN,
  ACCESS_VEHICLES_GPS_RECORD,
  ACCESS_VEHICLES_GPS_RECORD_SET,
  ACCESS_VEHICLES_WITH_AUTHORITIES,
  OPERATOR,
  OPERATOR_ABILITIES,
  OPERATOR_CONTROLS_VEHICLE,
  OPERATOR_DISPLAY_NAME,
  OPERATOR_FLEET,
  OPERATOR_FLEET_VEHICLES,
  OPERATOR_FLEET_VEHICLES_TELEMETRY_POINTS_LOADING,
  OPERATOR_FLEETS,
  OPERATOR_IS_USER,
  OPERATOR_HAS_ABILITIES,
  OPERATOR_IN_FLEET,
  OPERATOR_LOADED,
  OPERATOR_PREFERENCE,
  OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE,
  OPERATOR_PREFERENCE_DARK_MODE,
  OPERATOR_PREFERENCES,
  OPERATOR_USERNAME,
  OPERATOR_VINS,
  USERNAMES,
  VEHICLE_TELEMETRY_POINTS_LOADING,
  VINS
} from '@/store/getter-types'

import {
  AUTHORITIES_RESET,
  FLEETS_RESET,
  OPERATOR_ABILITIES_RESET,
  OPERATOR_ABILITIES_SET,
  OPERATOR_AVATAR_RESET,
  OPERATOR_AVATAR_SET,
  OPERATOR_AVATAR_FILE_TYPE_SET,
  OPERATOR_DISPLAY_NAME_RESET,
  OPERATOR_DISPLAY_NAME_SET,
  OPERATOR_EMAIL_SET,
  OPERATOR_EMAIL_RESET,
  OPERATOR_FLEETS_RESET,
  OPERATOR_FLEETS_SET,
  OPERATOR_HAS_ABILITIES_SET,
  OPERATOR_LOADED_SET,
  OPERATOR_PHONE_RESET,
  OPERATOR_PHONE_SET,
  OPERATOR_PREFERENCE_SET,
  OPERATOR_PREFERENCES_RESET,
  OPERATOR_PREFERENCES_SET,
  OPERATOR_USERNAME_RESET,
  OPERATOR_USERNAME_SET,
  PERMISSION_GROUPS_RESET,
  RECALLS_RESET,
  USER_ABILITIES_SET,
  USER_AVATAR_SET,
  USER_AVATAR_FILE_TYPE_SET,
  USER_DISPLAY_NAME_SET,
  USER_EMAIL_SET,
  USER_PHONE_SET,
  USER_PREFERENCES_SET,
  USER_INSTANTIATE,
  USER_REMOVE,
  USERS_RESET,
  VEHICLE_INSTANTIATE,
  VEHICLES_MANAGED_SESSIONS_RESET,
  VEHICLES_MODEL_RELEASES_RESET,
  VEHICLES_MODELS_RESET,
  VEHICLES_RESET
} from '@/store/mutation-types'
import operatorLib from '@/lib/operator'

const main = {
  state: {
    abilities: [],
    avatar: '',
    displayName: '',
    email: '',
    fleets: [],
    hasAbilities: null,
    loaded: false,
    phone: '',
    preferences: [],
    username: ''
  },
  actions: {
    async [OPERATOR_FLEETS_SUMMON] ({ commit, state, getters, rootState }, { componentSelf, operator, force = false }) {
      const vehicleInStore = (vin) => getters[VINS].includes(vin)
      if (force) {
        commit(OPERATOR_FLEETS_RESET)
      }
      let fleets = null
      if (operator) {
        fleets = utility.objPropExists(operator, 'fleets') ? operator.fleets : null
      }
      if (!fleets) {
        fleets = utility.objPropExists(componentSelf, 'fleets') ? componentSelf.fleets : []
      }
      if (state.username && (force || !fleets || !fleets.length)) {
        utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        requestData.username = state.username
        /* eslint-disable prefer-const */
        let response = await requests.fleetsGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Active User Fleets List Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          utility.setLoadingAndToast(componentSelf.$parent, false, 'Operator Fleets')
          const operatorFleets = response.data.userGroups
          commit(OPERATOR_FLEETS_SET, operatorFleets)
          // instantiate each vehicle in store
          for (let i = 0; i < operatorFleets.length; i++) {
            const userFleet = operatorFleets[i]
            if (userFleet.vins) {
              for (let k = 0; k < userFleet.vins.length; k++) {
                if (!vehicleInStore(userFleet.vins[k])) {
                  commit(VEHICLE_INSTANTIATE, userFleet.vins[k])
                }
              }
            }
          }
        }
      }
    },
    async [OPERATOR_SUMMON] ({ commit, state, getters, rootState }, { componentSelf, force }) {
      const userInStore = (username) => getters[USERNAMES].includes(username)
      // invoked directly from App.vue when the username changes
      // or from a component that the data depends on the user

      if (!state.username) {
        const lsSession = ls.get(`${LOCAL_STORAGE_NAMESPACE}.${LOCAL_STORAGE_APPLICATION}.session`)
        if (lsSession) {
          state.idToken = lsSession.idToken
          state.accessToken = lsSession.accessToken
          state.refreshToken = lsSession.refreshToken
          state.sessionCreation = lsSession.creation
          state.sessionCurrentExpiration = lsSession.currentExpiration
          state.sessionMaxExpiration = lsSession.maxExpiration
        }
        // get and set username last to allow set session data
        // before automatic fetches happen based on username being set
        const lsUsername = ls.get(`${LOCAL_STORAGE_NAMESPACE}.${LOCAL_STORAGE_APPLICATION}.username`)
        if (lsUsername) {
          state.username = lsUsername
        }
      }
      const username = state.username
      if (force) {
        commit(OPERATOR_LOADED_SET, false)
        commit(OPERATOR_HAS_ABILITIES_SET, false)
        commit(OPERATOR_ABILITIES_RESET)
        commit(OPERATOR_AVATAR_RESET)
        commit(OPERATOR_DISPLAY_NAME_RESET)
        commit(OPERATOR_EMAIL_RESET)
        commit(OPERATOR_FLEETS_RESET)
        commit(OPERATOR_PHONE_RESET)
        commit(OPERATOR_PREFERENCES_RESET)

        commit(AUTHORITIES_RESET)
        commit(FLEETS_RESET)
        commit(PERMISSION_GROUPS_RESET)
        commit(RECALLS_RESET)
        commit(USERS_RESET)
        commit(VEHICLES_MANAGED_SESSIONS_RESET)
        commit(VEHICLES_MODEL_RELEASES_RESET)
        commit(VEHICLES_MODELS_RESET)
        commit(VEHICLES_RESET)
        if (userInStore(username)) {
          commit(USER_REMOVE, { username })
        }
      }
      if (!userInStore(username)) {
        commit(USER_INSTANTIATE, username)
      }

      if (force || !componentSelf.operator.username) {
        // available when coming from App.vue directly
        utility.setLoadingAndToast(componentSelf, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        requestData.username = state.username
        /* eslint-disable prefer-const */
        let response = await requests.userGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, false, null)
            // re-throw the error to catch and handle it where it was dispatched
            throw e
          })
        if (response && response.status === 200) {
          const abilities = response.data.abilities
          const profile = response.data.profile
          const avatar = profile.avatar
          const avatarFileType = profile.avatarFileType
          const displayName = profile.displayName
          const email = profile.email
          const phone = profile.phone
          const preferences = response.data.preferences

          commit(OPERATOR_ABILITIES_SET, abilities)
          let operatorHasAbilities = null
          if (abilities.length) {
            operatorHasAbilities = true
          } else {
            operatorHasAbilities = false
          }
          commit(OPERATOR_HAS_ABILITIES_SET, operatorHasAbilities)
          commit(OPERATOR_AVATAR_SET, avatar)
          commit(OPERATOR_AVATAR_FILE_TYPE_SET, avatarFileType)
          commit(OPERATOR_DISPLAY_NAME_SET, displayName)
          commit(OPERATOR_EMAIL_SET, email)
          commit(OPERATOR_PHONE_SET, phone)
          commit(OPERATOR_PREFERENCES_SET, preferences)
          commit(OPERATOR_LOADED_SET, true)

          commit(USER_ABILITIES_SET, { username, abilities })
          commit(USER_AVATAR_SET, { username, avatar })
          commit(USER_AVATAR_FILE_TYPE_SET, { username, avatarFileType })
          commit(USER_DISPLAY_NAME_SET, { username, displayName })
          commit(USER_EMAIL_SET, { username, email })
          commit(USER_PHONE_SET, { username, phone })
          commit(USER_PREFERENCES_SET, { username, preferences })

          utility.setLoadingAndToast(componentSelf, false, null)
          return true
        }
      }
    }
  },
  getters: {
    [ACCESS_ABILITIES]: state => {
      return operatorLib.hasAbilities(state.abilities, [ABILITIES_READ])
    },
    [ACCESS_ABILITY_CREATE]: state => {
      return operatorLib.hasAbilities(state.abilities, [ABILITY_CREATE])
    },
    [ACCESS_ABILITY_DELETE]: state => {
      return operatorLib.hasAbilities(state.abilities, [ABILITY_DELETE])
    },
    [ACCESS_ABILITY_EDIT]: state => {
      return operatorLib.hasAbilities(state.abilities, [ABILITY_EDIT])
    },
    [ACCESS_AUTHORITIES]: state => {
      return operatorLib.hasAbilities(state.abilities, [AUTHORITIES_LIST])
    },
    [ACCESS_AUTHORITY_CREATE]: state => {
      return operatorLib.hasAbilities(state.abilities, [AUTHORITY_CREATE])
    },
    [ACCESS_AUTHORITIES_ADMIN]: state => {
      return operatorLib.hasAbilities(state.abilities, [AUTHORITY_ADMIN])
    },
    [ACCESS_FIRMWARE_ADMIN]: state => {
      return operatorLib.hasAbilities(state.abilities, [FIRMWARE_ADMIN])
    },
    [ACCESS_FIRMWARE_READ]: state => {
      return operatorLib.hasAbilities(state.abilities, [FIRMWARE_READ])
    },
    [ACCESS_FIRMWARE_VEHICLE_READ]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_FIRMWARE_READ])
    },
    [ACCESS_FIRMWARE_VEHICLE_WRITE]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_FIRMWARE_WRITE])
    },
    [ACCESS_FLEET_SUPERVISOR]: state => {
      return operatorLib.hasAbilities(state.abilities, [FLEET_SUPERVISOR])
    },
    [ACCESS_FLEETS_ADMIN]: state => {
      return operatorLib.hasAbilities(state.abilities, [FLEETS_ADMIN])
    },
    [ACCESS_FLEETS_MANAGER]: state => {
      return operatorLib.hasAbilities(state.abilities, [FLEETS_MANAGER])
    },
    [ACCESS_FLEETS_GROUPS]: state => {
      return operatorLib.hasAbilities(state.abilities, [FLEETS_GROUP_READ])
    },
    [ACCESS_FLEETS_TOGGLE_MEMBERSHIP]: state => {
      return operatorLib.hasAbilities(state.abilities, [FLEETS_ADMIN])
    },
    [ACCESS_LOCATIONS_ADMIN]: state => {
      return operatorLib.hasAbilities(state.abilities, [LOCATIONS_ADMIN])
    },
    [ACCESS_MANAGED_SESSIONS_ADMIN]: state => {
      return operatorLib.hasAbilities(state.abilities, [MANAGED_SESSION_ADMIN])
    },
    [ACCESS_PERMISSION_GROUP_ADD_PERMISSION]: state => {
      return operatorLib.hasAbilities(state.abilities, [PERMISSION_GROUP_PERMISSIONS_ADD])
    },
    [ACCESS_PERMISSION_GROUP_CREATE]: state => {
      return operatorLib.hasAbilities(state.abilities, [PERMISSION_GROUP_CREATE_ENTITY])
    },
    [ACCESS_PERMISSION_GROUP_DELETE]: state => {
      return operatorLib.hasAbilities(state.abilities, [PERMISSION_ADMIN])
    },
    [ACCESS_PERMISSION_GROUP_REMOVE_PERMISSION]: state => {
      return operatorLib.hasAbilities(state.abilities, [PERMISSION_GROUP_PERMISSIONS_REMOVE])
    },
    [ACCESS_PERMISSION_GROUP_TOGGLE_MEMBERSHIP]: state => {
      return operatorLib.hasAbilities(state.abilities, [PERMISSION_GROUP_WRITE])
    },
    [ACCESS_PERMISSION_GROUPS]: state => {
      return operatorLib.hasAbilities(state.abilities, [USER_PERMISSION_GROUPS_READ])
    },
    [ACCESS_PERMISSIONS]: state => {
      return operatorLib.hasAbilities(state.abilities, [PERMISSIONS_READ])
    },
    [ACCESS_RECALL_ADMIN]: state => {
      return operatorLib.hasAbilities(state.abilities, [RECALL_ADMIN])
    },
    [ACCESS_RECALL_CREATE]: state => {
      return operatorLib.hasAbilities(state.abilities, [RECALL_CREATE])
    },
    [ACCESS_RECALLS]: state => {
      return operatorLib.hasAbilities(state.abilities, [RECALLS_READ])
    },
    [ACCESS_SUPER_ADMIN]: state => {
      return operatorLib.hasAbilities(state.abilities, [SUPER_ADMIN])
    },
    [ACCESS_USER_CREATE]: state => {
      return operatorLib.hasAbilities(state.abilities, [USER_CREATE])
    },
    [ACCESS_USER_EDIT_PROFILE]: state => {
      return operatorLib.hasAbilities(state.abilities, [USER_PROFILE_WRITE])
    },
    [ACCESS_USER_GRANT_ABILITY]: state => {
      return operatorLib.hasAbilities(state.abilities, [USER_GRANT_ABILITY])
    },
    [ACCESS_USER_RESEND_INVITE]: state => {
      return operatorLib.hasAbilities(state.abilities, [USER_CREATE])
    },
    [ACCESS_USER_TOGGLE_ENABLED]: state => {
      return operatorLib.hasAbilities(state.abilities, [USER_ENABLED_WRITE])
    },
    [ACCESS_USERS]: state => {
      return operatorLib.hasAbilities(state.abilities, [USER_READ])
    },
    [ACCESS_VEHICLE_DELIVER]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_DELIVER])
    },
    [ACCESS_VEHICLE_GROUPS]: state => {
      return operatorLib.hasAbilities(state.abilities, [FLEETS_GROUP_READ])
    },
    [ACCESS_VEHICLE_MANUFACTURING_CONFIGURATION]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_MANUFACTURING_CONFIG_WRITE])
    },
    [ACCESS_VEHICLE_OPTIONS]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_OPTIONS_WRITE])
    },
    [ACCESS_VEHICLE_PROVISION]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_PROVISION])
    },
    [ACCESS_VEHICLE_QUALITY]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_QUALITY])
    },
    [ACCESS_VEHICLE_SERVICE]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_SERVICE])
    },
    [ACCESS_VEHICLE_TOKEN_SIGN]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_TOKEN_SIGN])
    },
    [ACCESS_VEHICLE_TELEMETRY_BACKFILL]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_BACKFILL_TELEMETRY])
    },
    [ACCESS_VEHICLE_TELEMETRY_CONFIGURATION]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_TELMETRY_CONFIG_WRITE])
    },
    [ACCESS_VEHICLES]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_READ])
    },
    [ACCESS_VEHICLES_ADMIN]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_MAIN_ADMIN])
    },
    [ACCESS_VEHICLES_GPS_RECORD]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_GPS_RECORD_READ])
    },
    [ACCESS_VEHICLES_GPS_RECORD_SET]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_GPS_RECORD_WRITE])
    },
    [ACCESS_VEHICLES_WITH_AUTHORITIES]: state => {
      return operatorLib.hasAbilities(state.abilities, [VEHICLE_AUTHORITIES_READ])
    },
    [OPERATOR]: state => {
      return {
        abilities: state.abilities,
        avatar: state.avatar,
        displayName: state.displayName,
        email: state.email,
        fleets: state.fleets,
        phone: state.phone,
        preferences: state.preferences,
        username: state.username
      }
    },
    [OPERATOR_ABILITIES]: state => {
      return state.abilities
    },
    [OPERATOR_CONTROLS_VEHICLE]: state => (vin) => {
      const vins = new Set()
      state.fleets.map((fleet) => {
        if (fleet.vins) {
          fleet.vins.forEach((vin) => {
            vins.add(vin)
          })
        }
      })
      return Array.from(vins).includes(vin)
    },
    [OPERATOR_DISPLAY_NAME]: state => {
      return state.displayName
    },
    [OPERATOR_FLEET]: (state) => (fleetId) => {
      return state.fleets.find(fleet => {
        return fleet.id === fleetId
      })
    },
    [OPERATOR_FLEET_VEHICLES]: (state, getters) => fleetId => {
      const fleet = getters[OPERATOR_FLEET](fleetId)
      return fleet && fleet.vins ? [...fleet.vins].sort(utility.sortByVIN) : []
    },
    [OPERATOR_FLEET_VEHICLES_TELEMETRY_POINTS_LOADING]: (state, getters) => fleetId => {
      const fleetVehicles = getters[OPERATOR_FLEET_VEHICLES](fleetId)
      let fleetVehiclesTelemetryPointsLoading = false
      fleetVehicles.forEach(vin => {
        fleetVehiclesTelemetryPointsLoading = fleetVehiclesTelemetryPointsLoading || getters[VEHICLE_TELEMETRY_POINTS_LOADING](vin)
      })
      return fleetVehiclesTelemetryPointsLoading
    },
    [OPERATOR_FLEETS]: state => {
      return state.fleets
    },
    [OPERATOR_HAS_ABILITIES]: state => {
      return state.hasAbilities
    },
    [OPERATOR_IN_FLEET]: (state, getters) => fleetId => {
      const operatorFleets = getters[OPERATOR_FLEETS]
      if (!operatorFleets.length) {
        return null
      }
      const operatorInFleet = operatorFleets.some(item => item.id === fleetId)
      return operatorInFleet
    },
    [OPERATOR_LOADED]: state => {
      return state.loaded
    },
    [OPERATOR_PREFERENCE]: (state) => (preferenceName) => {
      const preference = utility.operatorFindPreference(state, preferenceName)
      return preference
    },
    [OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE]: (state) => {
      const preference = utility.operatorFindPreference(state, 'context_bar_outside_click_close')
      return utility.parsePreferenceBoolean(preference)
    },
    [OPERATOR_PREFERENCE_DARK_MODE]: (state) => {
      const preference = utility.operatorFindPreference(state, 'dark_mode')
      return utility.parsePreferenceBoolean(preference)
    },
    [OPERATOR_PREFERENCES]: state => {
      return state.preferences
    },
    [OPERATOR_USERNAME]: state => {
      return state.username
    },
    [OPERATOR_VINS]: state => {
      const vins = new Set()
      state.fleets.map((fleet) => {
        if (fleet.vins) {
          fleet.vins.forEach((vin) => {
            vins.add(vin)
          })
        }
      })
      return Array.from(vins)
    },
    [OPERATOR_IS_USER]: state => username => {
      return state.username === username
    }
  },
  mutations: {
    [OPERATOR_ABILITIES_RESET] (state) {
      state.abilities = []
    },
    [OPERATOR_ABILITIES_SET] (state, val) {
      state.abilities = val
    },
    [OPERATOR_AVATAR_RESET] (state) {
      state.avatar = ''
      state.avatarFileType = ''
    },
    [OPERATOR_AVATAR_SET] (state, val) {
      state.avatar = val
    },
    [OPERATOR_AVATAR_FILE_TYPE_SET] (state, val) {
      state.avatarFileType = val
    },
    [OPERATOR_DISPLAY_NAME_RESET] (state) {
      state.displayName = ''
    },
    [OPERATOR_DISPLAY_NAME_SET] (state, val) {
      state.displayName = val
    },
    [OPERATOR_PHONE_RESET] (state) {
      state.phone = ''
    },
    [OPERATOR_PHONE_SET] (state, val) {
      state.phone = val
    },
    [OPERATOR_EMAIL_RESET] (state) {
      state.email = ''
    },
    [OPERATOR_EMAIL_SET] (state, val) {
      state.email = val
    },
    [OPERATOR_FLEETS_RESET] (state) {
      state.fleets = []
    },
    [OPERATOR_FLEETS_SET] (state, val) {
      state.fleets = val
    },
    [OPERATOR_HAS_ABILITIES_SET] (state, val) {
      state.hasAbilities = val
    },
    [OPERATOR_LOADED_SET] (state, val) {
      state.loaded = val
    },
    [OPERATOR_PREFERENCE_SET] (state, val) {
      const preferences = state.preferences
      const preference = preferences.find(preference => preference.preference === val.preference)
      if (preference) {
        preference.value = val.value
      } else {
        const data = {
          preference: val.preference,
          value: val.value
        }
        if (val.description) {
          data.description = val.description
        }
        preferences.push(data)
      }
    },
    [OPERATOR_PREFERENCES_RESET] (state) {
      state.preferences = []
    },
    [OPERATOR_PREFERENCES_SET] (state, val) {
      state.preferences = val
    },
    [OPERATOR_USERNAME_RESET] (state) {
      state.username = ''
    },
    [OPERATOR_USERNAME_SET] (state, val) {
      state.username = val
    }
  }
}

export default main
