import errors from '@/lib/errors'
import utility from '@/store/utility'
import utilityLib from '@/lib/utility'

import authoritiesRequests from '@/lib/requests/authorities'

import {
  AUTHORITIES_SUMMON,
  AUTHORITY_CREATE,
  AUTHORITY_DELETE,
  AUTHORITY_GRANT_VEHICLE_ACCESS,
  AUTHORITY_REVOKE_VEHICLE_ACCESS,
  AUTHORITY_SUMMON
} from '@/store/action-types'

import {
  AUTHORITIES,
  AUTHORITIES_IDS,
  AUTHORITIES_SUMMONED,
  AUTHORITY,
  AUTHORITY_VINS
} from '@/store/getter-types'

import {
  AUTHORITIES_RESET,
  AUTHORITIES_SUMMONED_SET,
  AUTHORITY_CHILDREN_SET,
  AUTHORITY_DESCRIPTION_SET,
  AUTHORITY_INSTANTIATE,
  AUTHORITY_PARENT_ID_SET,
  AUTHORITY_REMOVE,
  AUTHORITY_VIN_ADD,
  AUTHORITY_VIN_REMOVE,
  AUTHORITY_VINS_SET
} from '@/store/mutation-types'

const authorities = {
  state: {
    authorities: [],
    authoritiesSummoned: false
  },
  actions: {
    async [AUTHORITIES_SUMMON] ({ commit, getters, rootState }, { componentSelf, force = false }) {
      const authorityInStore = (authorityId) => getters[AUTHORITIES_IDS].includes(authorityId)
      if (force || !getters[AUTHORITIES_SUMMONED]) {
        utility.setLoadingAndToast(componentSelf, true, null, false)
        commit(AUTHORITIES_RESET)
        commit(AUTHORITIES_SUMMONED_SET, false)
        const requestData = utility.requestDataInstantiate(rootState)
        /* eslint-disable prefer-const */
        let response = await authoritiesRequests.authoritiesGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Authorities List Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          response.data.forEach(authority => {
            const authorityId = authority.id
            if (!authorityInStore(authorityId)) {
              commit(AUTHORITY_INSTANTIATE, authorityId)
            }
            commit(AUTHORITY_DESCRIPTION_SET, authority)
            commit(AUTHORITY_PARENT_ID_SET, authority)
            commit(AUTHORITY_VINS_SET, authority)
          })
          commit(AUTHORITIES_SUMMONED_SET, true)
          utility.setLoadingAndToast(componentSelf, false, 'Authorities')
        }
      }
    },
    async [AUTHORITY_CREATE]  ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await authoritiesRequests.authorityCreate(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Authority Create Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const authority = {
          id: response.data.id,
          description: payload.body.description,
          parentId: 1, // we aren't allowing users to create authorities with a non-arcimoto parent for now
          vins: []
        }
        commit(AUTHORITY_INSTANTIATE, authority.id)
        commit(AUTHORITY_DESCRIPTION_SET, authority)
        commit(AUTHORITY_PARENT_ID_SET, authority)
        commit(AUTHORITY_VINS_SET, authority)
        utility.setLoadingAndToast(componentSelf, false, null, 'Authority Created')
      }
    },
    async [AUTHORITY_DELETE]  ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const authorityId = payload.authorityId
      requestData.authorityId = authorityId
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await authoritiesRequests.authorityDelete(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Authority Delete Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf, false, null, 'Authority Deleted')
        commit(AUTHORITY_REMOVE, authorityId)
      }
    },
    async [AUTHORITY_GRANT_VEHICLE_ACCESS]  ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const authorityId = payload.authorityId
      const vin = payload.vin
      requestData.authorityId = authorityId
      requestData.vin = vin
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await authoritiesRequests.authorityGrantVehicleAccess(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Vehicle Grant Authority Access Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        commit(AUTHORITY_VIN_ADD, { id: authorityId, vin })
        utility.setLoadingAndToast(componentSelf, false, null, 'Access Granted to Vehicle')
      }
    },
    async [AUTHORITY_REVOKE_VEHICLE_ACCESS]  ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const authorityId = payload.authorityId
      const vin = payload.vin
      requestData.authorityId = authorityId
      requestData.vin = vin
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await authoritiesRequests.authorityRevokeVehicleAccess(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Vehicle Revoke Authority Access Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        commit(AUTHORITY_VIN_REMOVE, { id: authorityId, vin })
        utility.setLoadingAndToast(componentSelf, false, null, 'Access Revoked for Vehicle')
      }
    },
    async [AUTHORITY_SUMMON] ({ commit, getters, rootState }, { componentSelf, authorityId, force }) {
      const authorityInStore = (authorityId) => getters[AUTHORITIES_IDS].includes(authorityId)
      if (force || !authorityInStore(authorityId)) {
        commit(AUTHORITY_REMOVE, authorityId)
        const requestData = utility.requestDataInstantiate(rootState)
        requestData.authorityId = authorityId
        utility.setLoadingAndToast(componentSelf, true, null, false)
        /* eslint-disable prefer-const */
        let response = await authoritiesRequests.authorityGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Authority Get Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          const authority = response.data
          commit(AUTHORITY_INSTANTIATE, authorityId)
          authority.id = authorityId
          authority.vins = authority.vehicles
          delete authority.vehicles
          authority.parentId = authority.parent
          delete authority.parent
          commit(AUTHORITY_CHILDREN_SET, authority)
          commit(AUTHORITY_DESCRIPTION_SET, authority)
          commit(AUTHORITY_PARENT_ID_SET, authority)
          commit(AUTHORITY_VINS_SET, authority)
          utility.setLoadingAndToast(componentSelf, false, 'Authority')
        }
      }
    }
  },
  getters: {
    [AUTHORITIES]: (state) => {
      return state.authorities
    },
    [AUTHORITIES_IDS]: (state) => {
      const ids = []
      const authorities = state.authorities
      for (let i = 0; i < authorities.length; i++) {
        ids.push(authorities[i].id)
      }
      return ids
    },
    [AUTHORITIES_SUMMONED]: (state) => {
      return state.authoritiesSummoned
    },
    [AUTHORITY]: (state) => (authorityId) => {
      return utility.stateFindAuthority(state, authorityId)
    },
    [AUTHORITY_VINS]: (state, getters) => (authorityId) => {
      const authority = getters[AUTHORITY](authorityId)
      return authority && authority.vins ? authority.vins.sort(utilityLib.sortByVIN) : []
    }
  },
  mutations: {
    [AUTHORITY_CHILDREN_SET] (state, val) {
      const authority = utility.stateFindAuthority(state, val.id)
      authority.children = val.children
    },
    [AUTHORITY_DESCRIPTION_SET] (state, val) {
      const authority = utility.stateFindAuthority(state, val.id)
      authority.description = val.description
    },
    [AUTHORITY_INSTANTIATE] (state, id) {
      const authority = utility.stateFindAuthority(state, id)
      if (!authority) {
        state.authorities.push({ id })
      }
    },
    [AUTHORITY_PARENT_ID_SET] (state, val) {
      const authority = utility.stateFindAuthority(state, val.id)
      authority.parentId = val.parentId
    },
    [AUTHORITY_REMOVE] (state, id) {
      const authorityIndex = state.authorities.findIndex(authority => {
        return authority.id === id
      })
      state.authorities.splice(authorityIndex, 1)
    },
    [AUTHORITY_VIN_ADD] (state, val) {
      const authority = utility.stateFindAuthority(state, val.id)
      if (!authority.vins.includes(val.vin)) {
        authority.vins.push(val.vin)
        authority.vins.sort(utilityLib.sortByVIN)
      }
    },
    [AUTHORITY_VIN_REMOVE] (state, val) {
      const authorityId = val.id
      const authority = utility.stateFindAuthority(state, authorityId)
      const authorityVehicleIndex = authority.vins.findIndex(vin => {
        return vin === val.vin
      })
      authority.vins.splice(authorityVehicleIndex, 1)
    },
    [AUTHORITY_VINS_SET] (state, val) {
      const authority = utility.stateFindAuthority(state, val.id)
      authority.vins = val.vins
      authority.vins.sort(utilityLib.sortByVIN)
    },
    [AUTHORITIES_RESET] (state) {
      state.authorities = []
    },
    [AUTHORITIES_SUMMONED_SET] (state, val) {
      state.authoritiesSummoned = val
    }
  }
}
export default authorities
