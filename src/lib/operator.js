import {
  ABILITIES_READ,
  ABILITY_CREATE,
  ABILITY_DELETE,
  ABILITY_EDIT,
  AUTHORITIES_LIST,
  AUTHORITY_ADMIN,
  AUTHORITY_CREATE,
  FLEETS_GROUP_READ,
  FLEETS_ADMIN,
  MANAGED_SESSION_ADMIN,
  PERMISSION_ADMIN,
  PERMISSION_GROUP_PERMISSIONS_ADD,
  PERMISSION_GROUP_CREATE_ENTITY,
  PERMISSION_GROUP_PERMISSIONS_REMOVE,
  PERMISSION_GROUP_WRITE,
  PERMISSIONS_READ,
  RECALL_CREATE,
  RECALLS_READ,
  SUPER_ADMIN,
  USER_CREATE,
  USER_ENABLED_WRITE,
  USER_GRANT_ABILITY,
  USER_PROFILE_WRITE,
  USER_READ,
  VEHICLE_AUTHORITIES_READ,
  VEHICLE_GPS_RECORD_READ,
  VEHICLE_READ
} from '@/lib/ability-types'

const operator = {
  hasAbility (operatorAbilities, requiredAbility) {
    return operatorAbilities.some((ability) => {
      return ability.constant === requiredAbility
    })
  },
  hasAbilities (operatorAbilities, requiredAbilitys) {
    let userHasAbilities = true
    for (let i = 0; i < requiredAbilitys.length; i++) {
      const userHasAbility = this.hasAbility(operatorAbilities, requiredAbilitys[i])
      userHasAbilities = userHasAbilities && userHasAbility
    }
    return userHasAbilities
  },
  hasNoAbilities (operatorAbilities) {
    return !operatorAbilities.length
  },
  canAccessAbilities (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [ABILITIES_READ])
  },
  canAccessAuthorities (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [AUTHORITIES_LIST])
  },
  canAccessFleetsGroups (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [FLEETS_GROUP_READ])
  },
  canAccessPermissions (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [PERMISSIONS_READ])
  },
  canCreateRecall (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [RECALL_CREATE])
  },
  canAccessRecalls (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [RECALLS_READ])
  },
  canAccessUsers (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [USER_READ])
  },
  canAccessVehicles (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [VEHICLE_READ])
  },
  canAccessVehiclesGps (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [VEHICLE_GPS_RECORD_READ])
  },
  canAccessVehiclesWithAuthorities (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [VEHICLE_AUTHORITIES_READ])
  },
  canCreateAbility (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [ABILITY_CREATE])
  },
  canCreateAuthority (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [AUTHORITY_CREATE])
  },
  canAddPermissionToGroup (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [PERMISSION_GROUP_PERMISSIONS_ADD])
  },
  canCreatePermissionGroup (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [PERMISSION_GROUP_CREATE_ENTITY])
  },
  canCreateUser (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [USER_CREATE])
  },
  canDeleteAbility (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [ABILITY_DELETE])
  },
  canDeletePermissionGroup (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [PERMISSION_ADMIN])
  },
  canEditAbility (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [ABILITY_EDIT])
  },
  canEditProfile (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [USER_PROFILE_WRITE])
  },
  canGrantAbility (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [USER_GRANT_ABILITY])
  },
  canRemovePermissionFromGroup (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [PERMISSION_GROUP_PERMISSIONS_REMOVE])
  },
  canResendInvite (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [USER_CREATE])
  },
  canToggleFleetMembership (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [FLEETS_ADMIN])
  },
  canTogglePermissionGroupMembership (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [PERMISSION_GROUP_WRITE])
  },
  canToggleUserEnabled (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [USER_ENABLED_WRITE])
  },
  isManagedSessionAdmin (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [MANAGED_SESSION_ADMIN])
  },
  isAuthorityAdmin (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [AUTHORITY_ADMIN])
  },
  isSuperAdmin (operatorAbilities) {
    return this.hasAbilities(operatorAbilities, [SUPER_ADMIN])
  }
}

export default operator
