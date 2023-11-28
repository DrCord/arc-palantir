<template>
  <div class="quick-actions-container">
    <h3>User</h3>
    <v-list>
      <v-list-item>
        <h4>Actions</h4>
      </v-list-item>
      <v-list-item v-if="operatorIsUser || operatorCanEditProfile">
        <v-btn @click="editAvatar">
          Avatar: Edit
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorIsUser">
        <v-btn @click="navigateTo('/change-password')">
          Change Password
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanToggleFleetMembership && !userHasAllFleets">
        <v-btn @click="fleetAdd">
          Fleet: Add
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanToggleFleetMembership && !userHasNoFleets">
        <v-btn @click="fleetRemove">
          Fleet: Remove
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanTogglePermissionGroupMembership && !userHasAllPermissionGroups && !userIsUnitTestUser">
        <v-btn @click="permissionGroupAdd">
          Permission Group: Add
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanTogglePermissionGroupMembership && !userHasNoPermissionGroups && !userIsUnitTestUser">
        <v-btn @click="permissionGroupRemove">
          Permission Group: Remove
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorIsUser || operatorCanEditProfile">
        <v-btn @click="editProfile">
          Profile: Edit
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanToggleUserEnabled && operatorIsUser === false">
        <enabled-toggle
          :username="username"
          @user-enabled-toggle-complete="userEnabledToggleComplete"
        />
      </v-list-item>
      <v-list-item v-if="operatorCanResendInvite && userConfirmed === false">
        <resend-invite
          :username="username"
          @resend-invite-complete="resendInviteComplete"
        />
      </v-list-item>
      <template v-if="operatorIsUser">
        <v-list-item>
          <v-divider></v-divider>
        </v-list-item>
        <v-list-item>
          <h4>Preferences</h4>
        </v-list-item>
        <v-list-item>
          <context-bar-outside-click-close-toggle />
        </v-list-item>
        <v-list-item>
          <dark-mode-toggle />
        </v-list-item>
        <v-list-item>
          <default-landing />
        </v-list-item>
        <v-list-item v-if="operatorCanAccessUsers">
          <default-tab
            :tab-options="formattedTabs(userTabs)"
            :label="userLabel"
            :default-property="userTabPreferencePropertyName"
          />
        </v-list-item>
        <v-list-item v-if="operatorCanAccessVehicles">
          <default-tab
            :tab-options="formattedTabs(vehicleTabs)"
            :label="vehicleLabel"
            :default-property="vehicleTabPreferencePropertyName"
          />
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_USERS,
  ACCESS_VEHICLES,
  ACCESS_FLEETS_TOGGLE_MEMBERSHIP,
  ACCESS_PERMISSION_GROUP_TOGGLE_MEMBERSHIP,
  ACCESS_USER_EDIT_PROFILE,
  ACCESS_USER_RESEND_INVITE,
  ACCESS_USER_TOGGLE_ENABLED,
  OPERATOR_IS_USER,
  USER_CONFIRMED,
  USER_HAS_ALL_FLEETS,
  USER_HAS_ALL_PERMISSION_GROUPS,
  USER_HAS_NO_FLEETS,
  USER_HAS_NO_PERMISSION_GROUPS
} from '@/store/getter-types'

import ContextBarOutsideClickCloseToggle from '@/components/ContextBarOutsideClickCloseToggle.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import DefaultLanding from '@/components/Users/UserContextBar/DefaultLanding.vue'
import DefaultTab from '@/components/Users/UserContextBar/DefaultTab.vue'
import EnabledToggle from '@/components/Users/UserContextBar/EnabledToggle.vue'
import ResendInvite from '@/components/Users/UserContextBar/ResendInvite.vue'
import VehicleTabData from '@/mixins/VehicleTabData.js'
import UserTabData from '@/mixins/UserTabData.js'

export default {
  name: 'UserActions',
  components: {
    ContextBarOutsideClickCloseToggle,
    DarkModeToggle,
    DefaultLanding,
    DefaultTab,
    EnabledToggle,
    ResendInvite
  },
  mixins: [VehicleTabData, UserTabData],
  props: {
    username: {
      default: null,
      type: String
    }
  },
  data: () => {
    return {
      userLabel: 'Default User Tab',
      userTabPreferencePropertyName: 'default_user_tab',
      vehicleLabel: 'Default Vehicle Tab',
      vehicleTabPreferencePropertyName: 'default_vehicle_tab'
    }
  },
  computed: {
    ...mapGetters({
      operatorCanAccessUsers: ACCESS_USERS,
      operatorCanAccessVehicles: ACCESS_VEHICLES,
      operatorCanEditProfile: ACCESS_USER_EDIT_PROFILE,
      operatorCanResendInvite: ACCESS_USER_RESEND_INVITE,
      operatorCanToggleFleetMembership: ACCESS_FLEETS_TOGGLE_MEMBERSHIP,
      operatorCanTogglePermissionGroupMembership: ACCESS_PERMISSION_GROUP_TOGGLE_MEMBERSHIP,
      operatorCanToggleUserEnabled: ACCESS_USER_TOGGLE_ENABLED,
      operatorIsUserGet: OPERATOR_IS_USER,
      userConfirmedGet: USER_CONFIRMED,
      userHasAllFleetsGet: USER_HAS_ALL_FLEETS,
      userHasAllPermissionGroupsGet: USER_HAS_ALL_PERMISSION_GROUPS,
      userHasNoFleetsGet: USER_HAS_NO_FLEETS,
      userHasNoPermissionGroupsGet: USER_HAS_NO_PERMISSION_GROUPS
    }),
    operatorIsUser () {
      return this.username ? this.operatorIsUserGet(this.username) : null
    },
    userConfirmed () {
      return this.username ? this.userConfirmedGet(this.username) : null
    },
    userHasAllFleets () {
      return this.username ? this.userHasAllFleetsGet(this.username) : null
    },
    userHasAllPermissionGroups () {
      return this.username ? this.userHasAllPermissionGroupsGet(this.username) : null
    },
    userHasNoFleets () {
      return this.username ? this.userHasNoFleetsGet(this.username) : null
    },
    userHasNoPermissionGroups () {
      return this.username ? this.userHasNoPermissionGroupsGet(this.username) : null
    },
    userIsUnitTestUser () {
      const unitTestUsernames = [
        '87136858-81a4-4330-802d-b68568acef34', // no permissions unit test user
        '47a728a9-db7c-4294-9ad2-87d293135025' // all permissions unit test user
      ]
      return unitTestUsernames.includes(this.username)
    }
  },
  methods: {
    changePanel (actionType, contentType) {
      this.$emit('change-panel', { actionType, contentType })
    },
    editAvatar () {
      this.changePanel('edit', 'avatar')
    },
    editProfile () {
      this.changePanel('edit', 'profile')
    },
    fleetAdd () {
      this.changePanel('add', 'fleet')
    },
    fleetRemove () {
      this.changePanel('remove', 'fleet')
    },
    formattedTabs (tabs) {
      const options = tabs
      const betterOptions = []
      options.forEach((option, index) => {
        const removeDash = option.replaceAll('-', ' ')
        const caps = removeDash.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
        betterOptions[index] = {
          text: caps,
          value: option
        }
      })
      return betterOptions
    },
    navigateTo (route) {
      this.$router.push(route)
    },
    permissionGroupAdd () {
      this.changePanel('add', 'permission-group')
    },
    permissionGroupRemove () {
      this.changePanel('remove', 'permission-group')
    },
    resendInviteComplete () {
      this.$emit('resend-invite-complete')
    },
    userEnabledToggleComplete (event) {
      this.$emit('user-enabled-toggle-complete', event)
    }
  }
}
</script>

<style lang="scss">
  h3, h4 {
    margin: 0px;
    padding: 0px;
  }

</style>
