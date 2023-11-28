import errors from '@/lib/errors'
import utility from '@/store/utility'

import recallsRequests from '@/lib/requests/recalls'

import {
  RECALL_CREATE,
  RECALL_DELETE,
  RECALL_REMEDY_CREATE,
  RECALL_REMEDY_DELETE,
  RECALL_REMEDY_EDIT,
  RECALL_SUMMON,
  RECALL_UPDATE,
  RECALL_VEHICLE_ADD,
  RECALL_VEHICLE_EDIT,
  RECALL_VEHICLE_REMOVE,
  RECALL_VEHICLE_SERVICE,
  RECALL_VEHICLES_ADD,
  RECALL_VEHICLES_SERVICE,
  RECALLS_SUMMON
} from '@/store/action-types'

import {
  RECALL,
  RECALL_VEHICLE_RECALL_ID,
  RECALL_VEHICLES,
  RECALLS,
  RECALLS_SUMMONED
} from '@/store/getter-types'

import {
  RECALL_INSTANTIATE,
  RECALL_REMOVE,
  RECALL_REMEDY_REMOVE,
  RECALL_REMEDY_SET,
  RECALL_SET,
  RECALL_VEHICLE_DELETE,
  RECALL_VEHICLE_SET,
  RECALLS_RESET,
  RECALLS_SET,
  RECALLS_SUMMONED_SET
} from '@/store/mutation-types'

const recalls = {
  state: {
    recalls: [],
    recallsSummoned: false
  },
  actions: {
    async [RECALL_CREATE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await recallsRequests.recallCreate(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Recall Create Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const recallId = response.data.id
        const recall = {
          recallId: recallId,
          title: response.data.title,
          mfrCampaignId: response.data.mfrCampaignId,
          nhtsaNumber: response.data.nhtsaNumber,
          safetyRecall: response.data.safetyRecall,
          vehicles: []
        }
        commit(RECALL_INSTANTIATE, recallId)
        commit(RECALL_SET, { recall })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Recall Created')
        return recallId
      }
    },
    async [RECALL_DELETE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const recallId = payload.recallId
      requestData.id = recallId
      requestData.body = payload.body
      let response = await recallsRequests.recallDelete(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Recall Delete Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Recall Deleted')
        commit(RECALL_REMOVE, recallId)
      }
    },
    async [RECALL_REMEDY_CREATE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const recallId = payload.recallId
      requestData.id = recallId
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await recallsRequests.recallRemedyCreate(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Remedy Create Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const remedyId = response.data.remedyId
        const groupData = {
          recallId: recallId,
          remedy: {
            description: response.data.description,
            id: remedyId
          }
        }
        commit(RECALL_REMEDY_SET, groupData)
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Remedy Created')
      }
    },
    async [RECALL_REMEDY_DELETE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const remedyId = payload.remedyId
      const recallId = payload.recallId
      requestData.id = remedyId
      requestData.body = payload.body
      let response = await recallsRequests.recallsRemedyDelete(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Remedy Delete Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Remedy Deleted')
        commit(RECALL_REMEDY_REMOVE, recallId)
      }
    },
    async [RECALL_REMEDY_EDIT] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const recallId = payload.recallId
      const remedyId = payload.remedyId
      requestData.id = remedyId
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await recallsRequests.recallsRemedyEdit(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Remedy Edit Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const groupData = {
          recallId: recallId,
          remedy: {
            description: response.data.description,
            id: remedyId
          }
        }
        commit(RECALL_REMEDY_SET, groupData)
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Remedy Updated')
      }
    },
    async [RECALL_UPDATE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const recallId = payload.recallId
      requestData.id = recallId
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await recallsRequests.recallEdit(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Recall Update Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const recall = response.data
        commit(RECALL_SET, { recall })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Recall Updated')
      }
    },
    async [RECALL_VEHICLE_ADD] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { recallId, vin } = payload
      requestData.id = recallId
      requestData.vin = vin
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await recallsRequests.recallVehicleAdd(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Recall Vehicle Add Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        for (let i = 0; i < response.data.vins.length; i++) {
          const vehicleRecallId = response.data.vehicleRecallIds[i]
          const vin = response.data.vins[i]
          const vehicle = {
            recallId: recallId,
            vin: vin,
            serviceDate: null,
            id: vehicleRecallId
          }
          commit(RECALL_VEHICLE_SET, vehicle)
        }
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle Added')
      }
    },
    async [RECALL_VEHICLE_EDIT] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { recallId, vin, vehicleId } = payload
      requestData.id = recallId
      requestData.vin = vin
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await recallsRequests.recallVehicleEdit(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Recall Vehicle Edit Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const vehicle = {
          recallId: recallId,
          vin: response.data.vin,
          serviceReference: response.data.serviceReference,
          serviceDate: response.data.serviceDate,
          id: vehicleId
        }
        commit(RECALL_VEHICLE_SET, vehicle)
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle Updated')
      }
    },
    async [RECALL_VEHICLE_REMOVE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { recallId, vin } = payload
      requestData.id = recallId
      requestData.vin = vin
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await recallsRequests.recallVehicleDelete(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Recall Vehicle Remove Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const vehicle = payload
        commit(RECALL_VEHICLE_DELETE, vehicle)
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle Removed')
      }
    },
    async [RECALL_VEHICLE_SERVICE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { recallId, vin } = payload
      requestData.id = recallId
      requestData.vin = vin
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await recallsRequests.recallVehicleService(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Recall Vehicle Service Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const vehicleServiceRecords = response.data.vehicleServiceRecords
        for (let i = 0; i < vehicleServiceRecords.length; i++) {
          const vehicle = vehicleServiceRecords[i]
          commit(RECALL_VEHICLE_SET, vehicle)
        }
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle Serviced')
      }
    },
    async [RECALL_VEHICLES_ADD] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { recallId, vins } = payload
      requestData.id = recallId
      requestData.vins = vins
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await recallsRequests.recallVehiclesAdd(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Recall Add Vehicle(s) Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        for (let i = 0; i < response.data.vins.length; i++) {
          const vehicleRecallId = response.data.vehicleRecallIds[i]
          const vin = response.data.vins[i]
          const vehicle = {
            recallId: recallId,
            vin: vin,
            serviceDate: null,
            id: vehicleRecallId
          }
          commit(RECALL_VEHICLE_SET, vehicle)
        }
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle(s) Added to Recall')
      } else {
        errors.handleAxiosRequestError(componentSelf, `Recall Add Vehicle(s) Request Failed: ${response}`)
      }
    },
    async [RECALL_VEHICLES_SERVICE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { recallId } = payload
      requestData.id = recallId
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await recallsRequests.recallVehiclesService(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Recall Vehicles Service Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const vehicleServiceRecords = response.data.vehicleServiceRecords
        for (let i = 0; i < vehicleServiceRecords.length; i++) {
          const vehicle = vehicleServiceRecords[i]
          commit(RECALL_VEHICLE_SET, vehicle)
        }
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Vehicle(s) Serviced')
      }
    },
    async [RECALLS_SUMMON] ({ commit, getters, rootState }, { componentSelf, force = false }) {
      if (force || !getters[RECALLS_SUMMONED]) {
        utility.setLoadingAndToast(componentSelf, true, null)
        commit(RECALLS_RESET)
        commit(RECALLS_SUMMONED_SET, false)
        const requestData = utility.requestDataInstantiate(rootState)
        /* eslint-disable prefer-const */
        let response = await recallsRequests.recallsGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Recalls List Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          commit(RECALLS_SET, response.data.recalls)
          commit(RECALLS_SUMMONED_SET, true)
          utility.setLoadingAndToast(componentSelf, false, 'Recalls')
        }
      }
    },
    async [RECALL_SUMMON] ({ commit, getters, rootState }, { componentSelf, recallId, force }) {
      if (force || !getters[RECALL] || !getters[RECALL].vehicles) {
        utility.setLoadingAndToast(componentSelf, true, null)
        const requestData = utility.requestDataInstantiate(rootState)
        requestData.id = recallId
        /* eslint-disable prefer-const */
        let response = await recallsRequests.recallGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Recall Get Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          const recall = response.data
          commit(RECALL_SET, { recall })
          utility.setLoadingAndToast(componentSelf, false, 'Recall')
        }
      }
    }
  },
  getters: {
    [RECALL]: (state) => (recallId) => {
      return state.recalls.find(recall => { return recall.recallId === recallId })
    },
    [RECALL_VEHICLE_RECALL_ID]: (state, getters) => (recallId, vin, recallVehicleId) => {
      // find by recall id, then grab vehicle by vin, then retrieve vehicle recall id
      const recall = getters[RECALL](recallId)
      if (recall && recall.vehicles) {
        for (let i = 0; i < recall.vehicles.length; i++) {
          if (recall.vehicles[i].vin === vin && recall.vehicles[i].id === recallVehicleId) {
            return recall.vehicles[i]
          }
        }
      }
      return {}
    },
    [RECALL_VEHICLES]: (state, getters) => recallId => {
      const recall = getters[RECALL](recallId)
      const recallVins = recall.vehicles.map(vehicle => vehicle.vin)
      return recall && recall.vehicles ? recallVins : []
    },
    [RECALLS]: (state) => {
      return state.recalls
    },
    [RECALLS_SUMMONED]: (state) => {
      return state.recallsSummoned
    }
  },
  mutations: {
    [RECALL_INSTANTIATE] (state, recallId) {
      state.recalls.push({ recallId })
    },
    [RECALL_REMOVE] (state, recallId) {
      const recallIndex = state.recalls.findIndex(recall => { return recall.recallId === recallId })
      state.recalls.splice(recallIndex, 1)
    },
    [RECALL_REMEDY_REMOVE] (state, recallId) {
      const recall = state.recalls.find(recall => { return recall.recallId === recallId })
      recall.remedyId = null
      recall.remedy = null
      state.recalls.push(recall)
    },
    [RECALL_REMEDY_SET] (state, groupData) {
      const recall = state.recalls.find(recall => { return recall.recallId === groupData.recallId })
      recall.remedyId = groupData.remedy.id
      recall.remedy = groupData.remedy
      state.recalls.push(recall)
    },
    [RECALL_SET] (state, val) {
      const indexOfRecall = state.recalls.findIndex(recall => {
        return recall.recallId === val.recall.recallId
      })
      if (indexOfRecall !== -1) {
        state.recalls.splice(indexOfRecall, 1, val.recall)
      } else {
        state.recalls.push(val.recall)
      }
    },
    [RECALL_VEHICLE_DELETE] (state, vehicle) {
      const recall = state.recalls.find(recall => { return recall.recallId === vehicle.recallId })
      const vehicleIndex = recall.vehicles.findIndex(recallVehicle => {
        return recallVehicle.vin === vehicle.vin
      })
      recall.vehicles.splice(vehicleIndex, 1)
    },
    [RECALL_VEHICLE_SET] (state, vehicle) {
      const recall = state.recalls.find(recall => { return recall.recallId === vehicle.recallId })
      const vehicleIndex = recall.vehicles.findIndex(recallVehicle => {
        return recallVehicle.vin === vehicle.vin
      })
      if (vehicleIndex !== -1) {
        recall.vehicles.splice(vehicleIndex, 1, vehicle)
      } else {
        recall.vehicles.push(vehicle)
      }
    },
    [RECALLS_RESET] (state) {
      state.recallsSummoned = false
      state.recalls = []
    },
    [RECALLS_SET] (state, recalls) {
      state.recalls = recalls
    },
    [RECALLS_SUMMONED_SET] (state, val) {
      state.recallsSummoned = val
    }
  }
}

export default recalls
