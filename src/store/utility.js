const utility = {
  requestDataInstantiate: state => ({ idToken: state.session.idToken }),
  objPropExists: (el, propName) => Object.prototype.hasOwnProperty.call(el, propName),
  forceAction: (payload) => {
    let force = false
    if (typeof payload.force !== 'undefined') {
      force = payload.force
    }
    return force
  },
  setLoadingAndToast: (el, loading, itemType, message) => {
    const emitAvailable = utility.objPropExists(el, '$emit')
    const duration = 6000
    const loadingConfig = {
      msg: '',
      icon: 'hourglass_empty',
      duration,
      className: 'toasted-info'
    }
    const loadedConfig = {
      msg: '',
      icon: 'check',
      duration,
      className: 'toasted-message'
    }
    if (itemType === null && message) {
      loadingConfig.msg = message
      loadedConfig.msg = message
    } else {
      loadingConfig.msg = `${itemType} loading`
      loadedConfig.msg = `${itemType} loaded`
    }

    if (emitAvailable) {
      el.$emit('loading', loading)
      if (itemType || message) {
        if (loading) {
          el.$emit('toast', loadingConfig)
        } else {
          el.$emit('toast', loadedConfig)
        }
      }
    } else {
      // track up .$parent until el with properties found
      const findElWithProp = (element, propName) => {
        if (!utility.objPropExists(element, propName)) {
          if ('$parent' in element) {
            return findElWithProp(element.$parent, propName)
          } else {
            return null
          }
        }
        return element
      }

      const updateLoadingEl = findElWithProp(el, 'updateLoading')
      const showToastEl = findElWithProp(el, 'showToast')

      if (updateLoadingEl) {
        updateLoadingEl.updateLoading(loading)
      }
      if (showToastEl && (itemType || message)) {
        if (loading) {
          showToastEl.showToast(loadingConfig)
        } else {
          showToastEl.showToast(loadedConfig)
        }
      }
    }
  },
  operatorFindPreference: (state, preferenceName) => state.preferences.find(preference => {
    return preference.preference === preferenceName
  }),
  parsePreferenceBoolean: (preferenceData) => {
    if (preferenceData) {
      // handle actual Boolean values
      if (preferenceData.value === true) {
        return true
      } else if (preferenceData.value === false) {
        return false
      }
      const preferenceString = preferenceData.value + ''
      const truthyTrue = ['enable', 'enabled', 'on', 'true', '1'].includes(preferenceString.toLowerCase())
      if (truthyTrue) {
        return true
      }
      const truthyFalse = ['disable', 'disabled', 'off', 'false', '0'].includes(preferenceString.toLowerCase())
      if (truthyFalse) {
        return false
      }
    }
    return null
  },
  sortUsernamesUsingStoreData (usernamesToSort, usersFromStore) {
    // use the users in the store to sort by displayName if available, else username
    const findUser = (username) => usersFromStore.find(user => {
      return user.username === username
    })

    return usernamesToSort.sort((a, b) => {
      const aUser = findUser(a)
      const bUser = findUser(b)
      const aText = aUser !== undefined ? aUser.displayName : a
      const bText = bUser !== undefined ? bUser.displayName : b
      return (aText > bText) ? 1 : ((bText > aText) ? -1 : 0)
    })
  },
  stateFindAbility: (state, abilityId) => state.abilities.find(ability => {
    return ability.id === abilityId
  }),
  stateFindAuthority: (state, authorityId) => state.authorities.find(authority => {
    return authority.id === authorityId
  }),
  stateFindModelRelease: (state, modelReleaseId) => state.modelReleases.find(modelRelease => {
    return modelRelease.modelReleaseId === parseInt(modelReleaseId)
  }),
  stateFindPermissionGroup: (state, permissionGroupId) => state.permissionGroups.find(permissionGroup => {
    return permissionGroup.id === parseInt(permissionGroupId)
  }),
  stateFindUser: (state, username) => state.users.find(user => {
    return user.username === username
  }),
  stateFindVehicle: (state, vin) => state.vehicles.find(vehicle => {
    return vehicle.vin === vin
  })
}

export default utility
