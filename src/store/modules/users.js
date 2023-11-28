import errors from '@/lib/errors'
import utility from '@/store/utility'

import usersRequests from '@/lib/requests/users'
import userRequests from '@/lib/requests/user'

import {
  PERMISSION_GROUP_ADD_USER,
  PERMISSION_GROUP_REMOVE_USER,
  PERMISSION_GROUP_SUMMON,
  USER_ABILITY_GRANT,
  USER_CREATE,
  USER_DISABLE,
  USER_ENABLE,
  USER_FLEET_ADD,
  USER_FLEET_REMOVE,
  USER_FLEETS_SUMMON,
  USER_MFA_SMS_DISABLE,
  USER_MFA_SMS_ENABLE,
  USER_MFA_TOTP_DISABLE,
  USER_MFA_TOTP_ENABLE,
  USER_MFA_TOTP_TOKEN_ASSOCIATE,
  USER_MFA_TOTP_TOKEN_VERIFY,
  USER_NOTE_CREATE,
  USER_NOTES_SUMMON,
  USER_PREFERENCE_SAVE,
  USER_PROFILE_EDIT,
  USER_RESEND_INVITE,
  USER_SUMMON,
  USERS_ABILITIES_SUMMON,
  USERS_ABILITY_CREATE,
  USERS_ABILITY_DELETE,
  USERS_ABILITY_EDIT,
  USERS_SUMMON,
  USERS_VERIFY_DL
} from '@/store/action-types'

import {
  ABILITIES,
  ABILITIES_SUMMONED,
  USER,
  USER_ABILITIES,
  USER_AVATAR,
  USER_COGNITO,
  USER_CONFIRMED,
  USER_CONTROLLED_VEHICLES,
  USER_DISPLAY_NAME,
  USER_EMAIL,
  USER_ENABLED,
  USER_EXISTS,
  USER_FLEETS,
  USER_HAS_ALL_ABILITIES,
  USER_HAS_ALL_FLEETS,
  USER_HAS_ALL_PERMISSION_GROUPS,
  USER_HAS_NO_ABILITIES,
  USER_HAS_NO_FLEETS,
  USER_HAS_NO_PERMISSION_GROUPS,
  USER_LOADED,
  USER_MFA,
  USER_MFA_ENABLED,
  USER_NOTES,
  USER_PERMISSION_GROUPS,
  USER_PERMISSIONS,
  USER_PHONE,
  USER_PHONE_FORMATTED,
  USER_PREFERENCES,
  USERNAMES,
  USERS,
  USERS_SUMMONED
} from '@/store/getter-types'

import {
  OPERATOR_PREFERENCE_SET,
  SESSION_TOTP_TOKEN_SECRET_CODE_SET,
  USER_ABILITIES_RESET,
  USER_ABILITIES_SET,
  USER_AVATAR_RESET,
  USER_AVATAR_SET,
  USER_AVATAR_FILE_TYPE_SET,
  USER_COGNITO_RESET,
  USER_COGNITO_SET,
  USER_DISPLAY_NAME_RESET,
  USER_DISPLAY_NAME_SET,
  USER_EMAIL_RESET,
  USER_EMAIL_SET,
  USER_ENABLED_SET,
  USER_FLEETS_RESET,
  USER_FLEETS_SET,
  USER_INSTANTIATE,
  USER_LOADED_SET,
  USER_MFA_PREFERRED_SET,
  USER_MFA_SMS_ENABLED_SET,
  USER_MFA_TOTP_ENABLED_SET,
  USER_NOTE_ADD,
  USER_NOTES_SET,
  USER_PHONE_RESET,
  USER_PHONE_SET,
  USER_PERMISSION_GROUPS_RESET,
  USER_PERMISSION_GROUPS_SET,
  USER_PERMISSIONS_RESET,
  USER_PERMISSIONS_SET,
  USER_PREFERENCE_SET,
  USER_PREFERENCES_RESET,
  USER_PREFERENCES_SET,
  USER_REMOVE,
  USERS_ABILITIES_SET,
  USERS_ABILITIES_SUMMONED_SET,
  USERS_ABILITY_ADD,
  USERS_ABILITY_REMOVE,
  USERS_ABILITY_SET,
  USERS_RESET,
  USERS_SUMMONED_SET
} from '@/store/mutation-types'

const users = {
  state: {
    abilities: [],
    abilitiesSummoned: false,
    users: [],
    usersSummoned: false
  },
  actions: {
    async [PERMISSION_GROUP_ADD_USER] ({ dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const permissionGroupId = payload.permissionGroupId
      const username = payload.username
      requestData.username = username
      requestData.permissionGroupId = permissionGroupId
      /* eslint-disable prefer-const */
      let response = await userRequests.permissionGroupAdd(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Permission Group Add User Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const force = true
        dispatch(USER_SUMMON, { componentSelf, username, getTypes: ['main'], force })
        dispatch(PERMISSION_GROUP_SUMMON, { componentSelf, permissionGroupId, force })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User Added to Permission Group')
      }
    },
    async [PERMISSION_GROUP_REMOVE_USER] ({ dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const permissionGroupId = payload.permissionGroupId
      const username = payload.username
      requestData.username = username
      requestData.permissionGroupId = permissionGroupId
      /* eslint-disable prefer-const */
      let response = await userRequests.permissionGroupRemove(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Permission Group Remove User Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const force = true
        dispatch(USER_SUMMON, { componentSelf, username, getTypes: ['main'], force })
        dispatch(PERMISSION_GROUP_SUMMON, { componentSelf, permissionGroupId, force })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User Removed from Permission Group')
      }
    },
    async [USER_ABILITY_GRANT] ({ rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.username = payload.username
      requestData.abilityId = payload.abilityId
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await userRequests.grantAbility(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User Grant Ability Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Ability Granted to User')
      }
    },
    async [USER_CREATE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await userRequests.create(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User Create Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const username = response.data.username
        const displayName = payload.body.display_name
        const email = payload.body.email
        const phone = payload.body.phone
        commit(USER_INSTANTIATE, username)
        commit(USER_DISPLAY_NAME_SET, { username, displayName })
        commit(USER_EMAIL_SET, { username, email })
        commit(USER_PHONE_SET, { username, phone })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User Created')
        return username
      }
    },
    async [USER_DISABLE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.username = payload.username
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await userRequests.disable(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User Disable Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const username = payload.username
        commit(USER_ENABLED_SET, { username, enabled: false })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User Disabled')
      }
    },
    async [USER_ENABLE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.username = payload.username
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await userRequests.enable(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User Enable Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const username = payload.username
        commit(USER_ENABLED_SET, { username, enabled: true })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User Enabled')
      }
    },
    async [USER_FLEET_ADD] ({ dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { fleetId, username } = payload
      requestData.username = username
      requestData.fleetId = fleetId
      /* eslint-disable prefer-const */
      let response = await userRequests.fleetAdd(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User Fleet Add Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        dispatch(USER_FLEETS_SUMMON, { componentSelf, payload: { username } })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User Added to Fleet')
      }
    },
    async [USER_FLEET_REMOVE] ({ dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { fleetId, username } = payload
      requestData.username = username
      requestData.fleetId = fleetId
      /* eslint-disable prefer-const */
      let response = await userRequests.fleetRemove(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User Fleet Remove Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        dispatch(USER_FLEETS_SUMMON, { componentSelf, payload: { username } })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User Removed from Fleet')
      }
    },
    async [USER_FLEETS_SUMMON] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { username } = payload
      requestData.username = username
      /* eslint-disable prefer-const */
      let response = await userRequests.fleetsGet(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User Fleets List Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const fleets = response.data.userGroups
        commit(USER_FLEETS_SET, { username, fleets })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User Fleets Loaded')
      }
    },
    async [USER_MFA_SMS_DISABLE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { username } = payload
      requestData.username = username
      /* eslint-disable prefer-const */
      let response = await userRequests.mfaSmsDisable(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User MFA:SMS Disable Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const enabled = false
        const mfaType = 'SMS_MFA'
        const environment = rootState.main.environment
        commit(USER_MFA_SMS_ENABLED_SET, { username, enabled })
        commit(USER_MFA_PREFERRED_SET, { username, mfaPreferred: { enabled, mfaType, environment } })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User MFA SMS Disabled')
      }
    },
    async [USER_MFA_SMS_ENABLE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { username } = payload
      requestData.username = username
      /* eslint-disable prefer-const */
      let response = await userRequests.mfaSmsEnable(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User MFA:SMS Enable Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const enabled = true
        const mfaType = 'SMS_MFA'
        const environment = rootState.main.environment
        commit(USER_MFA_SMS_ENABLED_SET, { username, enabled })
        commit(USER_MFA_PREFERRED_SET, { username, mfaPreferred: { enabled, mfaType, environment } })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User MFA SMS Enabled')
      }
    },
    async [USER_MFA_TOTP_DISABLE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { username } = payload
      requestData.username = username
      // TODO - handle user without token -> may need to happen in request lib
      /* eslint-disable prefer-const */
      let response = await userRequests.mfaTotpDisable(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User MFA:TOTP Disable Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const enabled = false
        const mfaType = 'SOFTWARE_TOKEN_MFA'
        const environment = rootState.main.environment
        commit(USER_MFA_TOTP_ENABLED_SET, { username, enabled })
        commit(USER_MFA_PREFERRED_SET, { username, mfaPreferred: { enabled, mfaType, environment } })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User MFA TOTP Disabled')
      }
    },
    async [USER_MFA_TOTP_ENABLE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { username } = payload
      requestData.username = username
      // TODO - handle user without token -> may need to happen in request lib
      /* eslint-disable prefer-const */
      let response = await userRequests.mfaTotpEnable(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User MFA:TOTP Enable Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const enabled = true
        const mfaType = 'SOFTWARE_TOKEN_MFA'
        const environment = rootState.main.environment
        commit(USER_MFA_TOTP_ENABLED_SET, { username, enabled })
        commit(USER_MFA_PREFERRED_SET, { username, mfaPreferred: { enabled, mfaType, environment } })
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User MFA TOTP Enabled')
      }
    },
    async [USER_MFA_TOTP_TOKEN_ASSOCIATE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.username = payload.username
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await userRequests.mfaTotpTokenAssociate(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User MFA:TOTP Token Associate Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        commit(SESSION_TOTP_TOKEN_SECRET_CODE_SET, response.data.secretCode)
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User MFA TOTP - Token Associated')
      }
    },
    async [USER_MFA_TOTP_TOKEN_VERIFY] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.username = payload.username
      requestData.body = payload.body
      let tokenVerified = null
      /* eslint-disable prefer-const */
      let response = await userRequests.mfaTotpTokenVerify(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User MFA:TOTP - Token Verify Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        if ('errorMessage' in response.data) {
          tokenVerified = false
        } else {
          tokenVerified = true
        }
        // report back verification status to component that called action
        componentSelf.tokenVerified = tokenVerified
        if (tokenVerified) {
          utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User MFA TOTP - Token Verified')
        } else {
          errors.handleAxiosRequestError(componentSelf, 'User MFA TOTP - Token Verification Failed')
        }
      }
    },
    async [USER_NOTE_CREATE] ({ dispatch, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      const { body, username } = payload
      requestData.username = username
      requestData.body = body
      /* eslint-disable prefer-const */
      let response = await userRequests.noteCreate(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User Note Create Request Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User Note Created')
        dispatch(USER_NOTES_SUMMON, { componentSelf, payload: { username, force: true } })
      }
    },
    async [USER_NOTES_SUMMON] ({ commit, getters, rootState }, { componentSelf, payload }) {
      const { force = false, username } = payload
      if (force || !getters[USER_NOTES](username).length) {
        const requestData = utility.requestDataInstantiate(rootState)
        requestData.username = username
        utility.setLoadingAndToast(componentSelf, true, null, false)
        /* eslint-disable prefer-const */
        let response = await userRequests.notesGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `User Notes List Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          commit(USER_NOTES_SET, { username, notes: response.data })
          utility.setLoadingAndToast(componentSelf, false, 'User Notes')
        }
      }
    },
    async [USER_PREFERENCE_SAVE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.username = payload.username
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await userRequests.preferenceSet(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User Preference Save Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const commitData = {
          username: payload.username,
          preference: payload.body.preference_identifier,
          value: payload.body.preference_value,
          description: payload.body.preference_identifier
        }
        commit(USER_PREFERENCE_SET, commitData)
        commit(OPERATOR_PREFERENCE_SET, commitData)
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User Preference Saved')
      }
    },
    async [USER_PROFILE_EDIT] ({ rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.username = payload.username
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await userRequests.profileEdit(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User Profile Edit Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User Profile Edited')
      }
    },
    async [USER_RESEND_INVITE] ({ rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.username = payload.username
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await userRequests.resendInvite(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `User Resend Invite Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf.$parent, false, null, 'User Invite Resent')
      }
    },
    async [USER_SUMMON] ({ commit, getters, rootState }, { componentSelf, username, force }) {
      const userInStore = (username) => getters[USERNAMES].includes(username)
      if (force || !userInStore(username) || !getters[USER_LOADED](username)) {
        utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        requestData.username = username
        /* eslint-disable prefer-const */
        let response = await userRequests.userGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `User Get Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          const user = { username }
          Object.assign(user, response.data)
          if (!userInStore(username)) {
            commit(USER_INSTANTIATE, username)
          }
          if ('abilities' in user) {
            const abilities = user.abilities
            commit(USER_ABILITIES_SET, { username, abilities })
          }
          if ('cognito' in user) {
            const cognito = user.cognito
            commit(USER_COGNITO_SET, { username, cognito })
          }
          if ('permissionGroups' in user) {
            const permissionGroups = user.permissionGroups
            commit(USER_PERMISSION_GROUPS_SET, { username, permissionGroups })
          }
          if ('permissions' in user) {
            const permissions = user.permissions
            commit(USER_PERMISSIONS_SET, { username, permissions })
          }
          if ('profile' in user) {
            const userProfile = user.profile
            userProfile.username = username
            commit(USER_AVATAR_SET, userProfile)
            commit(USER_AVATAR_FILE_TYPE_SET, userProfile)
            commit(USER_DISPLAY_NAME_SET, userProfile)
            commit(USER_EMAIL_SET, userProfile)
            commit(USER_PHONE_SET, userProfile)
          }
          if ('preferences' in user) {
            const preferences = user.preferences
            commit(USER_PREFERENCES_SET, { username, preferences })
          }
          commit(USER_LOADED_SET, { username, loaded: true })
          utility.setLoadingAndToast(componentSelf.$parent, false, 'User')
        }
      }
    },
    async [USERS_ABILITIES_SUMMON] ({ commit, getters, rootState }, { componentSelf, force = false }) {
      if (force || !getters[ABILITIES_SUMMONED]) {
        utility.setLoadingAndToast(componentSelf, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        /* eslint-disable prefer-const */
        let response = await usersRequests.abilitiesGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `User Abilities List Request Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          commit(USERS_ABILITIES_SET, response.data)
          commit(USERS_ABILITIES_SUMMONED_SET, true)
          utility.setLoadingAndToast(componentSelf, false, 'Abilities')
        }
      }
    },
    async [USERS_ABILITY_CREATE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await usersRequests.abilityCreate(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Ability Create Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const commitPayload = {
          id: response.data.id,
          ability: payload.body.ability,
          constant: payload.body.constant,
          description: payload.body.description,
          permissions: payload.body.permissions
        }
        commit(USERS_ABILITY_ADD, commitPayload)
        utility.setLoadingAndToast(componentSelf, false, null, 'Ability Created')
      }
    },
    async [USERS_ABILITY_DELETE] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.abilityId = payload.abilityId
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await usersRequests.abilityDelete(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Ability Delete Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        commit(USERS_ABILITY_REMOVE, payload)
        utility.setLoadingAndToast(componentSelf, false, null, 'Ability Deleted')
      }
    },
    async [USERS_ABILITY_EDIT] ({ commit, rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.abilityId = payload.abilityId
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await usersRequests.abilityEdit(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Ability Edit Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        const data = payload.body
        const perms = payload.body.permissions.map((perm) => {
          // handle return payload sometimes containing a 1 level deeper set of permissions
          if (typeof (perm) !== 'string') return perm
          return { permission: perm, resource: '*' }
        })
        data.permissions = perms
        commit(USERS_ABILITY_SET, data)
        utility.setLoadingAndToast(componentSelf, false, null, 'Ability Edited')
      }
    },
    async [USERS_SUMMON] ({ commit, getters, rootState }, { componentSelf, force = false }) {
      const userInStore = (username) => getters[USERNAMES].includes(username)
      if (force) {
        commit(USERS_RESET)
      }
      if (force || !getters[USERS_SUMMONED]) {
        commit(USERS_SUMMONED_SET, false)
        utility.setLoadingAndToast(componentSelf.$parent, true, null, false)
        const requestData = utility.requestDataInstantiate(rootState)
        /* eslint-disable prefer-const */
        let response = await usersRequests.usersGet(requestData)
          .catch(e => {
            errors.handleAxiosRequestError(componentSelf, `Users List Failed: ${e.message}`)
          })
        if (response && response.status === 200) {
          const users = response.data
          // instantiate each user in store if needed
          for (let i = 0; i < users.length; i++) {
            const user = users[i]
            if (!userInStore(user.username)) {
              commit(USER_INSTANTIATE, user.username)
            }
            commit(USER_AVATAR_SET, user)
            commit(USER_DISPLAY_NAME_SET, user)
            commit(USER_EMAIL_SET, user)
            commit(USER_PHONE_SET, user)
          }
          commit(USERS_SUMMONED_SET, true)
          utility.setLoadingAndToast(componentSelf.$parent, false, null, 'Users Loaded')
        }
      }
    },
    async [USERS_VERIFY_DL] ({ rootState }, { componentSelf, payload }) {
      utility.setLoadingAndToast(componentSelf, true, null, false)
      const requestData = utility.requestDataInstantiate(rootState)
      requestData.abilityId = payload.abilityId
      requestData.body = payload.body
      /* eslint-disable prefer-const */
      let response = await usersRequests.verifyDl(requestData)
        .catch(e => {
          errors.handleAxiosRequestError(componentSelf, `Verify DL Failed: ${e.message}`)
        })
      if (response && response.status === 200) {
        utility.setLoadingAndToast(componentSelf, false, null, 'DL Verification Request Complete')
        return response.data
      }
      return null
    }
  },
  getters: {
    [ABILITIES]: (state) => {
      return state.abilities.sort((a, b) => {
        const textA = a.ability.toUpperCase()
        const textB = b.ability.toUpperCase()
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
    },
    [ABILITIES_SUMMONED]: (state) => {
      return state.abilitiesSummoned
    },
    [USER]: (state) => (username) => {
      return state.users.find(user => user.username === username)
    },
    [USER_ABILITIES]: (state, getters) => (username) => {
      const user = getters[USER](username)
      return user ? user.abilities : []
    },
    [USER_AVATAR]: (state, getters) => (username) => {
      const user = getters[USER](username)
      if (!user) {
        return null
      }
      const avatarImg = user.avatar
      const avatarFileType = user.avatarFileType
      const userAvatar = {
        avatarFileType,
        avatarImg
      }
      return userAvatar
    },
    [USER_COGNITO]: (state, getters) => (username) => {
      const user = getters[USER](username)
      if (user === undefined || user.cognito === undefined) { return null }
      return user.cognito
    },
    [USER_CONFIRMED]: (state, getters) => (username) => {
      const user = getters[USER](username)
      if (!user || !user.cognito) { return null }
      return user.cognito.UserStatus === 'CONFIRMED'
    },
    [USER_CONTROLLED_VEHICLES]: (state, getters) => (username) => {
      const mergeDedupe = (arr) => {
        return [...new Set([].concat(...arr))]
      }

      const userFleets = getters[USER_FLEETS](username)
      if (!userFleets.length) { return [] }
      const userFleetsVINs = userFleets.map(fleet => fleet.vins)
      return mergeDedupe(userFleetsVINs)
    },
    [USER_DISPLAY_NAME]: (state, getters) => (username) => {
      const user = getters[USER](username)
      if (user === undefined) { return null }
      return user.displayName
    },
    [USER_EMAIL]: (state, getters) => (username) => {
      const user = getters[USER](username)
      if (user === undefined) { return null }
      return user.email
    },
    [USER_ENABLED]: (state, getters) => (username) => {
      const user = getters[USER](username)
      if (!user || !user.cognito) { return null }
      return user.cognito.Enabled
    },
    [USER_EXISTS]: (state, getters) => (username) => {
      const user = getters[USER](username)
      return !!user
    },
    [USER_FLEETS]: (state, getters) => (username) => {
      const user = getters[USER](username)
      return user ? user.fleets : []
    },
    [USER_HAS_ALL_ABILITIES]: (state, getters) => (username) => {
      const userAbilities = getters[USER_ABILITIES](username)
      const userLoaded = getters[USER_LOADED](username)
      return (!userLoaded || userAbilities || !state.abilities.length) ? state.abilities.length === userAbilities.length : null
    },
    [USER_HAS_ALL_FLEETS]: (state, getters) => (username) => {
      const userFleets = getters[USER_FLEETS](username)
      const userLoaded = getters[USER_LOADED](username)
      const fleets = getters['FLEETS:GET']
      return (!userLoaded || userFleets || !state.fleets.length) ? fleets.length === userFleets.length : null
    },
    [USER_HAS_ALL_PERMISSION_GROUPS]: (state, getters) => (username) => {
      const userPermissionGroups = getters[USER_PERMISSION_GROUPS](username)
      const permissionGroups = getters['PERMISSIONS/GROUPS:GET']
      const userLoaded = getters[USER_LOADED](username)
      return (!userLoaded || userPermissionGroups || !permissionGroups.length) ? permissionGroups.length === userPermissionGroups.length : null
    },
    [USER_HAS_NO_ABILITIES]: (state, getters) => (username) => {
      const userAbilities = getters[USER_ABILITIES](username)
      const userLoaded = getters[USER_LOADED](username)
      return (!userLoaded || userAbilities) ? userAbilities.length === 0 : null
    },
    [USER_HAS_NO_FLEETS]: (state, getters) => (username) => {
      const userFleets = getters[USER_FLEETS](username)
      const userLoaded = getters[USER_LOADED](username)
      return (!userLoaded || userFleets) ? userFleets.length === 0 : null
    },
    [USER_HAS_NO_PERMISSION_GROUPS]: (state, getters) => (username) => {
      const userPermissionGroups = getters[USER_PERMISSION_GROUPS](username)
      const userLoaded = getters[USER_LOADED](username)
      return (!userLoaded || userPermissionGroups) ? userPermissionGroups.length === 0 : null
    },
    [USER_LOADED]: (state, getters) => (username) => {
      const user = getters[USER](username)
      if (!user) { return null }
      return user.loaded
    },
    [USER_MFA]: (state, getters) => (username) => {
      const user = getters[USER](username)
      if (user === undefined || user.cognito === undefined) { return false }
      const userMfa = {
        mfaOptions: user.cognito.MFAOptions,
        preferredMfaSetting: user.cognito.PreferredMfaSetting,
        userMfaSettingList: user.cognito.UserMFASettingList
      }
      return userMfa
    },
    [USER_MFA_ENABLED]: (state, getters) => (username) => {
      const user = getters[USER](username)
      if (!user || !user.cognito) { return false }
      const mfaOptions = user.cognito.MFAOptions
      const userMfaSettingList = user.cognito.UserMFASettingList
      if (mfaOptions.length !== 0 || userMfaSettingList.length !== 0) {
        return true
      }
      return false
    },
    [USER_NOTES]: (state, getters) => (username) => {
      const user = getters[USER](username)
      return user && user.notes ? user.notes : []
    },
    [USER_PERMISSION_GROUPS]: (state, getters) => (username) => {
      const user = getters[USER](username)
      if (!user) { return null }
      return user.permissionGroups
    },
    [USER_PERMISSIONS]: (state, getters) => (username) => {
      const user = getters[USER](username)
      if (!user) { return null }
      return user.permissions
    },
    [USER_PHONE]: (state, getters) => (username) => {
      const user = getters[USER](username)
      if (user === undefined) { return null }
      return user.phone
    },
    [USER_PHONE_FORMATTED]: (state, getters) => (username) => {
      const user = getters[USER](username)
      if (!user || !user.phone) { return null }
      return user.phone.replace(/(\+\d{1})(\d{3})(\d{3})(\d{4})/, '($2) $3-$4')
    },
    [USER_PREFERENCES]: (state, getters) => (username) => {
      const user = getters[USER](username)
      if (!user) { return null }
      const userPreferences = user.preferences.map(userPreference => {
        const { description, preference } = userPreference
        return {
          description,
          preference,
          value: utility.parsePreferenceBoolean(userPreference),
          actualValue: userPreference.value
        }
      })
      // sort alphabetically before returning
      return userPreferences.sort(function (a, b) {
        var textA = a.preference.toUpperCase()
        var textB = b.preference.toUpperCase()
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
    },
    [USERNAMES]: state => {
      const usernames = []
      for (let i = 0; i < state.users.length; i++) {
        usernames.push(state.users[i].username)
      }
      return usernames
    },
    [USERS]: (state) => {
      return state.users
    },
    [USERS_SUMMONED]: (state) => {
      return state.usersSummoned
    }
  },
  mutations: {
    [USER_ABILITIES_RESET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.abilities = []
    },
    [USER_ABILITIES_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.abilities = val.abilities
    },
    [USER_AVATAR_RESET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.avatar = null
      user.avatarFileType = null
    },
    [USER_AVATAR_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.avatar = val.avatar
    },
    [USER_AVATAR_FILE_TYPE_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.avatarFileType = val.avatarFileType
    },
    [USER_COGNITO_RESET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.cognito = null
    },
    [USER_COGNITO_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.cognito = val.cognito
    },
    [USER_DISPLAY_NAME_RESET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.displayName = null
    },
    [USER_DISPLAY_NAME_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.displayName = val.displayName
    },
    [USER_EMAIL_RESET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.email = null
    },
    [USER_EMAIL_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.email = val.email
    },
    [USER_ENABLED_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.cognito.Enabled = val.enabled
    },
    [USER_FLEETS_RESET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.fleets = []
    },
    [USER_FLEETS_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.fleets = val.fleets
    },
    [USER_INSTANTIATE] (state, username) {
      if (!username) {
        return
      }
      const user = utility.stateFindUser(state, username)
      if (!user) {
        const abilities = []
        const avatar = null
        const avatarFileType = null
        const cognito = null
        const displayName = null
        const email = null
        const fleets = []
        const phone = null
        const loaded = false
        const permissionGroups = []
        const permissions = []
        const preferences = []

        const user = {
          username,
          abilities,
          avatar,
          avatarFileType,
          cognito,
          displayName,
          email,
          fleets,
          loaded,
          phone,
          permissionGroups,
          permissions,
          preferences
        }
        state.users.push(user)
      }
    },
    [USER_LOADED_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.loaded = val.loaded
    },
    [USER_MFA_PREFERRED_SET] (state, val) {
      const { username, mfaPreferred, environment } = val
      const user = utility.stateFindUser(state, username)
      if (user === undefined) {
        return false
      }
      if (mfaPreferred.enabled === false) {
        let preferredMfaSettingValue = null
        if (environment === 'prod') {
          if (mfaPreferred.mfaType === 'SOFTWARE_TOKEN_MFA') {
            if (user.cognito.UserMFASettingList.includes('SMS_MFA')) {
              preferredMfaSettingValue = 'SMS_MFA'
            }
          }
        }
        user.cognito.PreferredMfaSetting = preferredMfaSettingValue
      } else {
        user.cognito.PreferredMfaSetting = mfaPreferred.mfaType
      }
    },
    [USER_MFA_SMS_ENABLED_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      if (user === undefined) {
        return false
      }
      const mfaSmsConstant = 'SMS_MFA'
      const userMfaSettingList = user.cognito.UserMFASettingList
      if (val.enabled) {
        user.cognito.MFAOptions = [
          {
            DeliveryMedium: 'SMS',
            AttributeName: 'phone_number'
          }
        ]
        if (!userMfaSettingList.includes(mfaSmsConstant)) {
          userMfaSettingList.push(mfaSmsConstant)
        }
      } else {
        user.cognito.MFAOptions = []
        if (userMfaSettingList.includes(mfaSmsConstant)) {
          const smsItemIndex = userMfaSettingList.findIndex(item => item === mfaSmsConstant)
          userMfaSettingList.splice(smsItemIndex, 1)
        }
      }
    },
    [USER_MFA_TOTP_ENABLED_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      if (user === undefined) {
        return false
      }
      const mfaTotpConstant = 'SOFTWARE_TOKEN_MFA'
      const userMfaSettingList = user.cognito.UserMFASettingList
      if (val.enabled) {
        if (!userMfaSettingList.includes(mfaTotpConstant)) {
          userMfaSettingList.push(mfaTotpConstant)
        }
      } else {
        if (userMfaSettingList.includes(mfaTotpConstant)) {
          const totpItemIndex = userMfaSettingList.findIndex(item => item === mfaTotpConstant)
          userMfaSettingList.splice(totpItemIndex, 1)
        }
      }
    },
    [USER_NOTE_ADD] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.notes.psuh(val.note)
    },
    [USER_NOTES_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.notes = val.notes
    },
    [USER_PHONE_RESET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.phone = null
    },
    [USER_PHONE_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.phone = val.phone
    },
    [USER_PERMISSION_GROUPS_RESET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.permissionGroups = []
    },
    [USER_PERMISSION_GROUPS_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.permissionGroups = val.permissionGroups
    },
    [USER_PERMISSIONS_RESET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.permissions = []
    },
    [USER_PERMISSIONS_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.permissions = val.permissions
    },
    [USER_PREFERENCES_RESET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.preferences = []
    },
    [USER_PREFERENCES_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      user.preferences = val.preferences
    },
    [USER_PREFERENCE_SET] (state, val) {
      const user = utility.stateFindUser(state, val.username)
      const userPreferences = user.preferences
      const preference = userPreferences.find(preference => preference.preference === val.preference)
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
        userPreferences.push(data)
      }
    },
    [USER_REMOVE] (state, val) {
      const userIndex = state.users.findIndex((user) => {
        return user.username === val.username
      })
      state.users.splice(userIndex, 1)
    },
    [USERS_ABILITIES_SET] (state, val) {
      state.abilities = val
    },
    [USERS_ABILITIES_SUMMONED_SET] (state, val) {
      state.abilitiesSummoned = val
    },
    [USERS_ABILITY_ADD] (state, val) {
      state.abilities.push(val)
    },
    [USERS_ABILITY_REMOVE] (state, val) {
      if (state.abilities !== undefined) {
        const abilityIndex = state.abilities.findIndex((ability) => {
          return ability.id === val.abilityId
        })
        state.abilities.splice(abilityIndex, 1)
      }
    },
    [USERS_ABILITY_SET] (state, val) {
      if (state.abilities !== undefined) {
        const ability = utility.stateFindAbility(state, val.abilityId)
        ability.id = val.abilityId
        ability.ability = val.ability
        ability.constant = val.constant
        ability.description = val.description
        ability.permissions = val.permissions
      }
    },
    [USERS_RESET] (state) {
      state.usersSummoned = false
      state.users = []
    },
    [USERS_SUMMONED_SET] (state, val) {
      state.usersSummoned = val
    }
  }
}

export default users
