<template>
  <div class="user-container">
    <div class="user user-card user-details--text">
      <v-tabs
        v-model="activeTab"
        mobile-breakpoint=""
        show-arrows=""
      >
        <v-tab>Abilities</v-tab>
        <v-tab>Fleets</v-tab>
        <v-tab>Permission Groups</v-tab>
        <v-tab>Permissions</v-tab>
        <v-tab>Preferences</v-tab>
        <v-tab>Notes</v-tab>
        <v-tab>Vehicles</v-tab>
      </v-tabs>
      <v-tabs-slider color="arcimoto-blue"></v-tabs-slider>
      <v-tabs-items v-model="activeTab">
        <v-tab-item>
          <abilities :username="username" />
        </v-tab-item>
        <v-tab-item>
          <fleets :username="username" />
        </v-tab-item>
        <v-tab-item>
          <permission-groups :username="username" />
        </v-tab-item>
        <v-tab-item>
          <permissions :username="username" />
        </v-tab-item>
        <v-tab-item>
          <preferences :username="username" />
        </v-tab-item>
        <v-tab-item>
          <user-notes :username="username" />
        </v-tab-item>
        <v-tab-item>
          <vehicles :username="username" />
        </v-tab-item>
      </v-tabs-items>
    </div>
    <context-bar-toggle
      :visible="operatorCanAccessContextMenu"
      @context-bar-visible="toggleContextBar"
    />
    <context-bar
      :action-type="actionType"
      :content-type="contentType"
      :loading="loading"
      :username="username"
      :visible="contextBarVisible"
      @change-context="changeContext"
      @context-bar-visible="toggleContextBar($event)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ABILITIES,
  ACCESS_FLEETS_TOGGLE_MEMBERSHIP,
  ACCESS_PERMISSION_GROUP_TOGGLE_MEMBERSHIP,
  ACCESS_USER_EDIT_PROFILE,
  ACCESS_USER_GRANT_ABILITY,
  ACCESS_USER_RESEND_INVITE,
  ACCESS_USER_TOGGLE_ENABLED,
  FLEETS,
  LOADING,
  OPERATOR_IS_USER,
  OPERATOR_PREFERENCE,
  PERMISSION_GROUPS,
  USER,
  USER_EXISTS,
  USER_HAS_ALL_ABILITIES,
  USER_HAS_ALL_FLEETS,
  USER_HAS_ALL_PERMISSION_GROUPS,
  USER_HAS_NO_FLEETS,
  USER_HAS_NO_PERMISSION_GROUPS
} from '@/store/getter-types'

import Abilities from '@/components/Users/Abilities.vue'
import ContextBarToggle from '@/components/ContextBarToggle.vue'
import ContextBar from '@/components/Users/UserContextBar/ContextBar.vue'
import Fleets from '@/components/Users/Fleets.vue'
import PermissionGroups from '@/components/Users/PermissionGroups.vue'
import Permissions from '@/components/Users/Permissions.vue'
import Preferences from '@/components/Users/Preferences.vue'
import UserNotes from '@/components/Users/UserNotes.vue'
import Vehicles from '@/components/Users/Vehicles.vue'
import UserTabData from '@/mixins/UserTabData.js'

export default {
  name: 'UserComponent',
  components: {
    Abilities,
    ContextBarToggle,
    ContextBar,
    Fleets,
    PermissionGroups,
    Permissions,
    Preferences,
    UserNotes,
    Vehicles
  },
  mixins: [UserTabData],
  props: {
    username: {
      default: null,
      type: String
    },
    mfaEvent: {
      default: null,
      type: Object
    },
    userProfileEvent: {
      default: null,
      type: Object
    }
  },
  data () {
    return {
      contextBarVisible: false,
      contentType: null,
      actionType: null
    }
  },
  computed: {
    ...mapGetters({
      abilities: ABILITIES,
      fleets: FLEETS,
      loading: LOADING,
      operatorCanEditProfile: ACCESS_USER_EDIT_PROFILE,
      operatorCanGrantAbility: ACCESS_USER_GRANT_ABILITY,
      operatorCanResendInvite: ACCESS_USER_RESEND_INVITE,
      operatorCanToggleFleetMembership: ACCESS_FLEETS_TOGGLE_MEMBERSHIP,
      operatorCanTogglePermissionGroupMembership: ACCESS_PERMISSION_GROUP_TOGGLE_MEMBERSHIP,
      operatorCanToggleUserEnabled: ACCESS_USER_TOGGLE_ENABLED,
      operatorIsUserGet: OPERATOR_IS_USER,
      operatorPreference: OPERATOR_PREFERENCE,
      permissionGroups: PERMISSION_GROUPS,
      userGet: USER,
      userExistsGet: USER_EXISTS,
      userHasAllAbilitiesGet: USER_HAS_ALL_ABILITIES,
      userHasAllFleetsGet: USER_HAS_ALL_FLEETS,
      userHasAllPermissionGroupsGet: USER_HAS_ALL_PERMISSION_GROUPS,
      userHasNoFleetsGet: USER_HAS_NO_FLEETS,
      userHasNoPermissionGroupsGet: USER_HAS_NO_PERMISSION_GROUPS
    }),
    activeTab: {
      set (val) {
        const query = { ...this.$route.query }
        query.tab = this.userTabs[val]
        this.$router.replace({ query: query })
      },
      get () {
        const requestedTab = this.$route.query.tab
        let requestedTabIndex = -1
        if (requestedTab) {
          requestedTabIndex = this.requestedTabIndexGet(requestedTab)
        }
        return requestedTabIndex !== -1 ? requestedTabIndex : this.userTabs[0]
      }
    },
    operatorCanAccessContextMenu () {
      // OR - check for any of the items in context menu or if user is self
      return this.operatorIsUser ||
             this.operatorCanEditProfile ||
             (this.operatorCanToggleUserEnabled && !this.operatorIsUser) ||
             this.operatorCanResendInvite ||
             (this.operatorCanGrantAbility && !this.userHasAllAbilities) ||
             this.operatorCanToggleFleetMembership ||
             (this.operatorCanTogglePermissionGroupMembership && !this.userIsUnitTestUser)
    },
    operatorIsUser () {
      return this.username ? this.operatorIsUserGet(this.username) : null
    },
    user () {
      return this.username ? this.userGet(this.username) : null
    },
    userExists () {
      return this.username ? this.userExistsGet(this.username) : null
    },
    userHasAllAbilities () {
      return this.username ? this.userHasAllAbilitiesGet(this.username) : null
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
  watch: {
    mfaEvent: {
      handler:
        function () {
          this.toggleContextBar(true, this.mfaEvent.type, this.mfaEvent.name)
        }
    },
    userProfileEvent: {
      function (event) {
        this.toggleContextBar(true, event.type, event.name)
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    changeContext (event) {
      this.contextBarVisible = true
      this.actionType = event.actionType
      this.contentType = event.contentType
    },
    init () {
      const pref = this.operatorPreference('default_user_tab')
      if (pref && 'value' in pref) {
        this.activeTab = this.requestedTabIndexGet(pref.value)
      }
    },
    toggleContextBar (visible, actionType = null, contentType = null) {
      this.contextBarVisible = visible
      this.actionType = actionType
      this.contentType = contentType
    },
    requestedTabIndexGet (requestedTabName) {
      return this.userTabs.findIndex(item => item === requestedTabName)
    }
  }
}
</script>

<style scoped lang="scss">
.user {
  border-radius: 7px;
  padding: 10px 22px 14px;
  margin-bottom: 20px;
  margin-top: 20px;
  .username {
    white-space: nowrap;
  }
}
</style>
