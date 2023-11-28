import errors from '@/lib/errors'
import utility from '@/store/utility'

import fleetsRequests from '@/lib/requests/fleets'

import {
  FLEET_CREATE,
  FLEET_DELETE,
  FLEET_UPDATE,
  FLEET_LOCATION_SAVE,
  FLEET_SUMMON,
  FLEET_TYPE_SAVE,
  FLEET_USER_ADD,
  FLEET_USER_REMOVE,
  FLEET_VEHICLE_ADD,
  FLEET_VEHICLE_REMOVE,
  FLEETS_DEPARTMENT_CODE_CREATE,
  FLEETS_DEPARTMENT_CODE_DELETE,
  FLEETS_DEPARTMENT_CODE_SET,
  FLEETS_DEPARTMENT_CODES_SUMMON,
  FLEETS_SUMMON,
  FLEETS_TYPES_SUMMON
} from '@/store/action-types'

import {
  FLEET,
  FLEET_LOADED,
  FLEET_LOCATION_ID,
  FLEET_TYPE,
  FLEET_USERS,
  FLEET_VEHICLES,
  FLEETS,
  FLEETS_DEPARTMENT_CODES,
  FLEETS_DEPARTMENT_CODES_SUMMONED,
  FLEETS_IDS,
  FLEETS_SUMMONED,
  FLEETS_TYPES
} from '@/store/getter-types'

import {
  FLEET_INSTANTIATE,
  FLEET_LOADED_SET,
  FLEET_LOCATION_SET,
  FLEET_NAME_SET,
  FLEET_TYPE_SET,
  FLEET_USER_POP,
  FLEET_USER_PUSH,
  FLEET_USERS_SET,
  FLEET_VEHICLE_POP,
  FLEET_VEHICLE_PUSH,
  FLEET_VEHICLES_SET,
  FLEETS_DEPARTMENT_CODE_INSTANTIATE,
  FLEETS_DEPARTMENT_CODE_REMOVE,
  FLEETS_DEPARTMENT_CODE_RESET,
  FLEETS_DEPARTMENT_CODES_SET,
  FLEETS_DEPARTMENT_CODES_SUMMONED_SET,
  FLEETS_RESET,
  FLEETS_SET,
  FLEETS_SUMMONED_SET,
  FLEETS_TYPES_SET,
  LOCATION_SET
} from '@/store/mutation-types'

const fleets = {
  state: {
    fleets: [],
    fleetsTypes: [],
    departmentCodes: [],
    departmentCodesSummoned: false,
    summoned: false
  },
  actions: {
    async [FLEET_CREATE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await fleetsRequests.fleetCreate(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Fleet Create Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const fleetId = response.data.groupId
        const groupName = response.data.group
        const groupData = {
          id: fleetId,
          name: groupName
        }
        commit(FLEET_INSTANTIATE, fleetId)
        commit(FLEET_NAME_SET, groupData)
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Fleet Created')
        return Promise.resolve(fleetId)
      }
      return Promise.resolve(false)
    },
    async [FLEET_UPDATE] ({ commit, getters, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const fleetId = payload.id
      requestData.fleetId = fleetId
      requestData.body = payload.body
      let response = await fleetsRequests.fleetUpdate(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Fleet Update Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const fleetName = response.data.fleetName

        const fleetData = {
          id: fleetId,
          name: fleetName
        }
        commit(FLEET_NAME_SET, fleetData)
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Fleet Updated')
      }
    },
    async [FLEET_DELETE] ({ commit, getters, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const fleetId = payload.fleetId
      requestData.fleetId = fleetId
      requestData.body = payload.body
      let response = await fleetsRequests.fleetDelete(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Fleet Delete Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const force = true
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Fleet Deleted')
        await dispatch(FLEETS_SUMMON, { componentSelf, force })
      }
    },
    async [FLEET_LOCATION_SAVE] ({ commit, getters, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const fleetId = payload.fleetId
      requestData.fleetId = fleetId
      requestData.body = payload.body
      let response = await fleetsRequests.fleetLocationSet(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Fleet Location Set Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Fleet Location Set')
        const locationId = payload.body.location_id
        const locationCode = payload.body.locationCode
        commit(FLEET_LOCATION_SET, { locationId, fleetId, locationCode })
      }
    },
    async [FLEET_SUMMON] ({ commit, getters, rootState }, { componentSelf, payload }) {
      const { force, fleetId } = payload
      const vehiclesDataExists = (fleetId) => {
        return getters[FLEET_VEHICLES](fleetId) !== undefined && getters[FLEET_VEHICLES](fleetId).length > 0
      }
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.fleetId = fleetId
      if (force || !vehiclesDataExists(fleetId)) {
      // make request, if the group doesnt exist in fleets, instantiate it, otherwise, add vehicles and users to it
        utility.setLoadingAndToast(componentSelf, true, null, false)
        /* eslint-disable prefer-const */
        let response = await fleetsRequests.fleetGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Fleet Get Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          const groupData = response.data
          const groupType = groupData.type
          groupData.id = fleetId
          if (!getters[FLEET](fleetId)) {
            commit(FLEET_INSTANTIATE, fleetId)
          }
          commit(FLEET_NAME_SET, groupData)
          commit(FLEET_VEHICLES_SET, groupData)
          commit(FLEET_USERS_SET, groupData)
          commit(FLEET_TYPE_SET, { fleetId, groupType })
          if (groupData.location) {
            const location = groupData.location
            const locationId = location.id
            commit(FLEET_LOCATION_SET, { fleetId, locationId })
            commit(LOCATION_SET, { location })
          }
          commit(FLEET_LOADED_SET, { fleetId, loaded: true })
          utility.setLoadingAndToast(componentSelf, false, 'Fleet')
        }
      }
    },
    async [FLEET_TYPE_SAVE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { groupType, typeId, fleetId } = payload
      requestData.fleetId = fleetId
      requestData.body = {
        type_id: typeId
      }
      let response = await fleetsRequests.fleetTypeSet(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Fleet Type Set Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Fleet Type Set')
        commit(FLEET_TYPE_SET, { fleetId, groupType })
      }
    },
    async [FLEET_USER_ADD] ({ commit, getters, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const username = payload.username
      const fleetId = payload.fleetId
      requestData.username = username
      requestData.fleetId = fleetId
      requestData.body = payload.body
      let response = await fleetsRequests.fleetUserAdd(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Fleet User Add Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User Added to Fleet')
        const { username, fleetId } = payload
        commit(FLEET_USER_PUSH, { username, fleetId })
      }
    },
    async [FLEET_USER_REMOVE] ({ commit, getters, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const username = payload.username
      const fleetId = payload.fleetId
      requestData.username = username
      requestData.fleetId = fleetId
      requestData.body = payload.body
      let response = await fleetsRequests.fleetUserRemove(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Fleet User Remove Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User Removed from Fleet')
        const { username, fleetId } = payload
        commit(FLEET_USER_POP, { username, fleetId })
      }
    },
    async [FLEET_VEHICLE_ADD] ({ commit, getters, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const vin = payload.vin
      const fleetId = payload.fleetId
      requestData.vin = vin
      requestData.fleetId = fleetId
      requestData.body = payload.body
      let response = await fleetsRequests.fleetAddVehicle(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Fleet Vehicle Add Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle Added to Fleet')
        const { vin, fleetId } = payload
        commit(FLEET_VEHICLE_PUSH, { vin, fleetId })
      }
    },
    async [FLEET_VEHICLE_REMOVE] ({ commit, getters, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const vin = payload.vin
      const fleetId = payload.fleetId
      requestData.vin = vin
      requestData.fleetId = fleetId
      requestData.body = payload.body
      let response = await fleetsRequests.fleetRemoveVehicle(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Fleet Vehicle Remove Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle Removed from Fleet')
        const { vin, fleetId } = payload
        commit(FLEET_VEHICLE_POP, { vin, fleetId })
      }
    },
    async [FLEETS_DEPARTMENT_CODE_CREATE] ({ commit, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await fleetsRequests.fleetsDepartmentCodeCreate(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Department Code Create Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const department = {
          id: response.data.id,
          code: payload.body.code,
          description: payload.body.description
        }
        commit(FLEETS_DEPARTMENT_CODE_INSTANTIATE, department)
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Department Code Created')
      }
    },
    async [FLEETS_DEPARTMENT_CODE_DELETE] ({ commit, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const departmentCodeId = payload.id
      requestData.id = departmentCodeId
      requestData.body = payload.body
      let response = await fleetsRequests.fleetsDepartmentCodeDelete(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Department Code Delete Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const data = {
          id: departmentCodeId,
          code: payload.code
        }
        commit(FLEETS_DEPARTMENT_CODE_REMOVE, data)
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Department Code Deleted')
      } else {
        errors.handleAxiosRequestError(componentSelf, 'Department Code Delete Request Failed')
      }
    },
    async [FLEETS_DEPARTMENT_CODE_SET] ({ commit, getters, dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const fleetId = payload.fleetId
      requestData.fleetId = fleetId
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await fleetsRequests.fleetsDepartmentCodeSet(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Department Code Update Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const data = {
          id: fleetId,
          code: payload.body.code,
          description: payload.body.description
        }
        commit(FLEETS_DEPARTMENT_CODE_RESET, data)
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Department Code Updated')
      }
    },
    async [FLEETS_DEPARTMENT_CODES_SUMMON] ({ commit, getters, rootState }, { componentSelf, force = false }) {
      if (force || !getters[FLEETS_DEPARTMENT_CODES_SUMMONED]) {
        utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        /* eslint-disable prefer-const */
        let response = await fleetsRequests.fleetsDepartmentCodesList(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Department Codes List Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          utility.setLoadingAndToast(componentSelf.$parent, false, 'Department Codes')
          const departmentCodes = response.data.accountingDepartmentCodes
          commit(FLEETS_DEPARTMENT_CODES_SET, { departmentCodes })
          commit(FLEETS_DEPARTMENT_CODES_SUMMONED_SET, { summoned: true })
        }
      }
    },
    async [FLEETS_SUMMON] ({ commit, getters, rootState }, { componentSelf, force = false }) {
      if (force || !getters[FLEETS_SUMMONED]) {
        const requestData = utility.requestDataInstantiate(rootState)
        utility.setLoadingAndToast(componentSelf, true, null, false)
        /* eslint-disable prefer-const */
        let response = await fleetsRequests.fleetsGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Fleets List Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          commit(FLEETS_SET, response.data)
          commit(FLEETS_SUMMONED_SET, { summoned: true })
          utility.setLoadingAndToast(componentSelf, false, 'Fleets')
        }
      }
    },
    async [FLEETS_TYPES_SUMMON] ({ commit, getters, rootState }, { componentSelf, force }) {
      if (force || !Object.keys(getters[FLEETS_TYPES]).length) {
        utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        /* eslint-disable prefer-const */
        let response = await fleetsRequests.fleetsTypesGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Fleets Types List Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          commit(FLEETS_TYPES_SET, response.data.groupTypes)
          utility.setLoadingAndToast(componentSelf, false, 'Fleets Types')
        }
      }
    }
  },
  getters: {
    [FLEET]: (state) => (fleetId) => {
      return state.fleets.find(fleet => {
        return fleet.id === fleetId
      })
    },
    [FLEET_LOADED]: (state, getters) => (fleetId) => {
      const fleet = getters[FLEET](fleetId)
      return fleet ? fleet.loaded : null
    },
    [FLEET_LOCATION_ID]: (state, getters) => (fleetId) => {
      const fleet = getters[FLEET](fleetId)
      return fleet ? fleet.locationId : null
    },
    [FLEET_TYPE]: (state, getters) => fleetId => {
      const fleet = getters[FLEET](fleetId)
      return fleet ? fleet.type : null
    },
    [FLEET_USERS]: (state, getters) => fleetId => {
      const fleet = getters[FLEET](fleetId)
      return fleet && fleet.users ? utility.sortUsernamesUsingStoreData(fleet.users, getters['USERS:GET']) : []
    },
    [FLEET_VEHICLES]: (state, getters) => fleetId => {
      const fleet = getters[FLEET](fleetId)
      return fleet && fleet.vehicles ? fleet.vehicles.sort(utility.sortByVIN) : []
    },
    [FLEETS]: (state) => {
      return state.fleets
    },
    [FLEETS_DEPARTMENT_CODES]: (state) => {
      return state.departmentCodes
    },
    [FLEETS_DEPARTMENT_CODES_SUMMONED]: (state) => {
      return state.departmentCodesSummoned
    },
    [FLEETS_IDS]: state => {
      const ids = []
      state.fleets.forEach(fleet => {
        ids.push(fleet.id)
      })
      return ids
    },
    [FLEETS_SUMMONED]: (state) => {
      return state.fleets ? state.fleets.summoned : null
    },
    [FLEETS_TYPES]: state => {
      return state.fleetsTypes
    }
  },
  mutations: {
    [FLEET_INSTANTIATE] (state, fleetId) {
      state.fleets.push({ id: fleetId, loaded: false })
    },
    [FLEET_LOADED_SET] (state, val) {
      const group = state.fleets.find(group => { return group.id === val.fleetId })
      group.loaded = val.loaded
    },
    [FLEET_LOCATION_SET] (state, val) {
      const group = state.fleets.find(group => { return group.id === val.fleetId })
      group.locationId = val.locationId
      if ('locationCode' in val) {
        group.locationCode = val.locationCode
      }
    },
    [FLEET_NAME_SET] (state, groupData) {
      const group = state.fleets.find(group => { return group.id === groupData.id })
      group.name = groupData.name
    },
    [FLEET_TYPE_SET] (state, val) {
      const group = state.fleets.find(group => { return group.id === val.fleetId })
      group.type = val.groupType
    },
    [FLEET_USER_POP] (state, val) {
      const group = state.fleets.find(group => { return group.id === val.fleetId })
      const userIndex = group.users.findIndex(user => { return user === val.username })
      group.users.splice(userIndex, 1)
    },
    [FLEET_USER_PUSH] (state, val) {
      const group = state.fleets.find(group => { return group.id === val.fleetId })
      group.users = [...group.users, val.username]
    },
    [FLEET_VEHICLE_POP] (state, val) {
      const group = state.fleets.find(group => { return group.id === val.fleetId })
      const vehicleIndex = group.vehicles.findIndex(vin => { return vin === val.vin })
      group.vehicles.splice(vehicleIndex, 1)
    },
    [FLEET_VEHICLE_PUSH] (state, val) {
      const group = state.fleets.find(group => { return group.id === val.fleetId })
      group.vehicles = [...group.vehicles, val.vin]
    },
    [FLEET_USERS_SET] (state, groupData) {
      const group = state.fleets.find(group => { return group.id === groupData.id })
      group.users = groupData.users
    },
    [FLEET_VEHICLES_SET] (state, groupData) {
      const group = state.fleets.find(group => { return group.id === groupData.id })
      group.vehicles = groupData.vehicles
    },
    [FLEETS_DEPARTMENT_CODE_INSTANTIATE] (state, department) {
      state.departmentCodes.push(department)
    },
    [FLEETS_DEPARTMENT_CODE_REMOVE] (state, data) {
      const departmentCode = state.departmentCodes.findIndex(departmentCode => { return departmentCode.id === data.id })
      state.departmentCodes.splice(departmentCode, 1)
      state.fleets.forEach((fleet, index) => {
        if (fleet.code === data.code) {
          state.fleets[index].code = null
          state.fleets[index].description = null
        }
      })
    },
    [FLEETS_DEPARTMENT_CODE_RESET] (state, data) {
      const index = state.fleets.findIndex(fleet => { return fleet.id === data.id })
      state.fleets[index].code = data.code
      state.fleets[index].description = data.description
    },
    [FLEETS_DEPARTMENT_CODES_SET] (state, val) {
      state.departmentCodes = val.departmentCodes
    },
    [FLEETS_DEPARTMENT_CODES_SUMMONED_SET] (state, val) {
      state.departmentCodesSummoned = val.summoned
    },
    [FLEETS_RESET] (state) {
      state.fleets = []
    },
    [FLEETS_SET] (state, fleets) {
      fleets.forEach(fleet => {
        fleet.loaded = false
      })
      state.fleets = fleets
    },
    [FLEETS_SUMMONED_SET] (state, val) {
      state.fleets.summoned = val.summoned
    },
    [FLEETS_TYPES_SET] (state, val) {
      state.fleetsTypes = val
    }
  }
}

export default fleets
