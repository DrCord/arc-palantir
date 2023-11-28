import errors from '@/lib/errors'
import utility from '@/store/utility'

import permissionsRequests from '@/lib/requests/permissions'

import {
  PERMISSION_GROUP_ADD_PERMISSION,
  PERMISSION_GROUP_CREATE,
  PERMISSION_GROUP_DELETE,
  PERMISSION_GROUP_REMOVE_PERMISSION,
  PERMISSION_GROUP_SUMMON,
  PERMISSION_GROUPS_SUMMON,
  PERMISSIONS_SUMMON
} from '@/store/action-types'

import {
  PERMISSIONS,
  PERMISSIONS_SUMMONED,
  PERMISSION_GROUP,
  PERMISSION_GROUP_HAS_ALL_MEMBERS,
  PERMISSION_GROUP_HAS_ALL_PERMISSIONS,
  PERMISSION_GROUP_HAS_NO_MEMBERS,
  PERMISSION_GROUP_HAS_NO_PERMISSIONS,
  PERMISSION_GROUP_PERMISSIONS,
  PERMISSION_GROUP_USERS,
  PERMISSION_GROUPS,
  PERMISSION_GROUPS_IDS,
  PERMISSION_GROUPS_SUMMONED
} from '@/store/getter-types'

import {
  PERMISSION_GROUP_INSTANTIATE,
  PERMISSION_GROUP_NAME_SET,
  PERMISSION_GROUP_PERMISSIONS_SET,
  PERMISSION_GROUP_REMOVE,
  PERMISSION_GROUP_USER_ADD,
  PERMISSION_GROUP_USER_REMOVE,
  PERMISSION_GROUP_USERS_SET,
  PERMISSION_GROUPS_RESET,
  PERMISSION_GROUPS_SUMMONED_SET,
  PERMISSIONS_SET,
  PERMISSIONS_SUMMONED_SET
} from '@/store/mutation-types'

const permissions = {
  state: {
    permissions: [],
    permissionsSummoned: false,
    permissionGroups: [],
    permissionGroupsSummoned: false
  },
  actions: {
    async [PERMISSION_GROUPS_SUMMON] ({ commit, getters, rootState }, { componentSelf, force = false }) {
      const permissionGroupInStore = (permissionGroupId) => {
        return getters[PERMISSION_GROUPS_IDS].includes(permissionGroupId)
      }
      if (force || !getters[PERMISSION_GROUPS_SUMMONED]) {
        commit(PERMISSION_GROUPS_RESET)
        commit(PERMISSION_GROUPS_SUMMONED_SET, false)
        const requestData = utility.requestDataInstantiate(rootState)
        utility.setLoadingAndToast(componentSelf, true, null, false)
        /* eslint-disable prefer-const */
        let response = await permissionsRequests.permissionsGroupsGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Permission Groups List Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          response.data.forEach(permissionGroup => {
            const permissionGroupId = permissionGroup.id
            if (!permissionGroupInStore(permissionGroupId)) {
              commit(PERMISSION_GROUP_INSTANTIATE, permissionGroupId)
            }
            commit(PERMISSION_GROUP_NAME_SET, permissionGroup)
            commit(PERMISSION_GROUP_PERMISSIONS_SET, permissionGroup)
            commit(PERMISSION_GROUP_USERS_SET, permissionGroup)
          })
          commit(PERMISSION_GROUPS_SUMMONED_SET, true)
          utility.setLoadingAndToast(componentSelf, false, 'Permission Groups')
        }
      }
    },
    async [PERMISSION_GROUP_SUMMON] ({ commit, getters, rootState }, { componentSelf, permissionGroupId, force }) {
      // check if permission group is in store, and that it has a permissions property
      const permissionGroupInStore = (permissionGroupId) => {
        const permissionGroup = getters[PERMISSION_GROUP](permissionGroupId)
        return permissionGroup !== undefined
      }
      if (force || !permissionGroupInStore(permissionGroupId)) {
        commit(PERMISSION_GROUP_REMOVE, permissionGroupId)
        utility.setLoadingAndToast(componentSelf, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        requestData.permissionGroupId = permissionGroupId
        /* eslint-disable prefer-const */
        const response = await permissionsRequests.permissionGroupGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Permission Group Get Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          const permissionGroup = response.data
          permissionGroup.id = permissionGroup.groupId
          delete permissionGroup.groupId
          commit(PERMISSION_GROUP_INSTANTIATE, permissionGroup.id)
          commit(PERMISSION_GROUP_NAME_SET, permissionGroup)
          commit(PERMISSION_GROUP_PERMISSIONS_SET, permissionGroup)
          commit(PERMISSION_GROUP_USERS_SET, { id: permissionGroupId, users: [] })
          if (permissionGroup.users) {
            permissionGroup.users.forEach(username => {
              const permissionGroupId = permissionGroup.id
              const payload = {
                permissionGroupId,
                username
              }
              commit(PERMISSION_GROUP_USER_ADD, payload)
            })
          }
          utility.setLoadingAndToast(componentSelf, false, 'Permission Group')
        }
      }
    },
    async [PERMISSIONS_SUMMON] ({ commit, getters, rootState }, { componentSelf, force = false }) {
      if (force || !getters[PERMISSIONS_SUMMONED]) {
        commit(PERMISSIONS_SUMMONED_SET, false)
        utility.setLoadingAndToast(componentSelf, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        /* eslint-disable prefer-const */
        let response = await permissionsRequests.permissionsGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Permissions List Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          commit(PERMISSIONS_SET, response.data)
          commit(PERMISSIONS_SUMMONED_SET, true)
          utility.setLoadingAndToast(componentSelf, false, 'Permissions')
        }
      }
    },
    async [PERMISSION_GROUP_CREATE]  ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await permissionsRequests.permissionGroupCreate(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Permission Group Create Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const commitPayload = {
          id: response.data.id,
          name: response.data.name
        }
        commit(PERMISSION_GROUP_INSTANTIATE, commitPayload.id)
        commit(PERMISSION_GROUP_NAME_SET, commitPayload)
        utility.setLoadingAndToast(componentSelf, false, null, 'Permission Group Created')
      }
    },
    async [PERMISSION_GROUP_DELETE]  ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const permissionGroupId = payload.permissionGroupId
      requestData.permissionGroupId = permissionGroupId
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await permissionsRequests.permissionGroupDelete(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Permission Group Delete Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        commit(PERMISSION_GROUP_REMOVE, permissionGroupId)
        utility.setLoadingAndToast(componentSelf, false, null, 'Permission Group Deleted')
      }
    },
    async [PERMISSION_GROUP_ADD_PERMISSION] ({ dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const permissionGroupId = payload.permissionGroupId
      requestData.permissionGroupId = permissionGroupId
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await permissionsRequests.permissionGroupAddPermission(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Permission Group - Add Permission Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        dispatch(PERMISSION_GROUP_SUMMON, { componentSelf, permissionGroupId, force: true })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Permission Added to Group')
      }
    },
    async [PERMISSION_GROUP_REMOVE_PERMISSION] ({ dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const permissionGroupId = payload.permissionGroupId
      requestData.permissionGroupId = permissionGroupId
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await permissionsRequests.permissionGroupRemovePermission(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Permission Group - Remove Permission Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        dispatch(PERMISSION_GROUP_SUMMON, { componentSelf, permissionGroupId, force: true })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Permission Removed from Group')
      }
    }
  },
  getters: {
    [PERMISSIONS]: (state) => {
      return state.permissions.sort((a, b) => (a.permission > b.permission) ? 1 : ((b.permission > a.permission) ? -1 : 0))
    },
    [PERMISSIONS_SUMMONED]: (state) => {
      return state.permissionsSummoned
    },
    [PERMISSION_GROUP]: (state, rootState) => (permissionGroupId) => {
      const permissionGroup = state.permissionGroups.find(permissionGroup => permissionGroup.id === parseInt(permissionGroupId))
      if (!permissionGroup) return permissionGroup
      permissionGroup.users = utility.sortUsernamesUsingStoreData([...permissionGroup.users], rootState['USERS:GET'])
      return permissionGroup
    },
    [PERMISSION_GROUP_HAS_ALL_MEMBERS]: (state, getters) => (permissionGroupId) => {
      const permissionGroupUsers = getters[PERMISSION_GROUP](permissionGroupId)
      const users = getters['USERS:GET']
      if (users && users.length && permissionGroupUsers) {
        return users.length === permissionGroupUsers.length
      }
    },
    [PERMISSION_GROUP_HAS_ALL_PERMISSIONS]: (state, getters) => (permissionGroupId) => {
      const permissionGroupPermissions = getters[PERMISSION_GROUP_PERMISSIONS](permissionGroupId)
      const permissions = getters[PERMISSIONS]
      if (permissions && permissions.length && permissionGroupPermissions) {
        return permissions.length === permissionGroupPermissions.length
      }
      return null
    },
    [PERMISSION_GROUP_HAS_NO_MEMBERS]: (state, getters) => (permissionGroupId) => {
      return getters[PERMISSION_GROUP_USERS](permissionGroupId).length === 0
    },
    [PERMISSION_GROUP_HAS_NO_PERMISSIONS]: (state, getters) => (permissionGroupId) => {
      return getters[PERMISSION_GROUP_PERMISSIONS](permissionGroupId).length === 0
    },
    [PERMISSION_GROUP_PERMISSIONS]: (state, getters) => (permissionGroupId) => {
      const permissionGroup = getters[PERMISSION_GROUP](permissionGroupId)
      if (!permissionGroup) return []
      return permissionGroup.permissions.map(permissionObject => permissionObject.permission)
    },
    [PERMISSION_GROUP_USERS]: (state, getters) => (permissionGroupId) => {
      const permissionGroup = getters[PERMISSION_GROUP](permissionGroupId)
      if (!permissionGroup) return []
      return utility.sortUsernamesUsingStoreData(permissionGroup.users, getters['USERS:GET'])
    },
    [PERMISSION_GROUPS]: (state) => {
      return state.permissionGroups
    },
    [PERMISSION_GROUPS_IDS]: (state) => {
      const ids = []
      const permissionGroups = state.permissionGroups
      for (let i = 0; i < permissionGroups.length; i++) {
        ids.push(permissionGroups[i].id)
      }
      return ids
    },
    [PERMISSION_GROUPS_SUMMONED]: (state) => {
      return state.permissionGroupsSummoned
    }
  },
  mutations: {
    [PERMISSION_GROUP_INSTANTIATE] (state, id) {
      const permissionGroup = utility.stateFindPermissionGroup(state, id)
      if (!permissionGroup) {
        state.permissionGroups.push({ id })
      }
    },
    [PERMISSION_GROUP_NAME_SET] (state, val) {
      const permissionGroup = utility.stateFindPermissionGroup(state, val.id)
      permissionGroup.name = val.name
    },
    [PERMISSION_GROUP_PERMISSIONS_SET] (state, val) {
      const permissionGroup = utility.stateFindPermissionGroup(state, val.id)
      permissionGroup.permissions = val.permissions ? val.permissions : []
    },
    [PERMISSION_GROUP_REMOVE] (state, id) {
      const permissionGroupIndex = state.permissionGroups.findIndex(permissionGroup => {
        return permissionGroup.id === id
      })
      if (permissionGroupIndex !== -1) {
        state.permissionGroups.splice(permissionGroupIndex, 1)
      }
    },
    [PERMISSION_GROUP_USER_ADD] (state, val) {
      const { permissionGroupId, username } = val
      const permissionGroup = utility.stateFindPermissionGroup(state, permissionGroupId)
      if (!permissionGroup.users.some(element => element.username === username)) {
        permissionGroup.users.push(username)
      }
    },
    [PERMISSION_GROUP_USER_REMOVE] (state, val) {
      const permissionGroup = utility.stateFindPermissionGroup(state, val.permissionGroupId)
      permissionGroup.users = permissionGroup.users.filter((username) => username !== val.username)
    },
    [PERMISSION_GROUP_USERS_SET] (state, val) {
      const permissionGroup = utility.stateFindPermissionGroup(state, val.id)
      permissionGroup.users = val.users ? val.users : []
    },
    [PERMISSION_GROUPS_RESET] (state, val) {
      state.permissionGroups = []
    },
    [PERMISSION_GROUPS_SUMMONED_SET] (state, val) {
      state.permissionGroupsSummoned = val
    },
    [PERMISSIONS_SET] (state, val) {
      state.permissions = val
    },
    [PERMISSIONS_SUMMONED_SET] (state, val) {
      state.permissionsSummoned = val
    }
  }
}

export default permissions
