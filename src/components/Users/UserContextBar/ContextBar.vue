<template>
  <v-navigation-drawer
    v-model="active"
    app
    class="context-menu"
    :hide-overlay="!contextBarOutsideClickClose"
    right
    :stateless="!contextBarOutsideClickClose"
    temporary
    width="450px"
    @input="outsideClickCloseEmit"
  >
    <v-list-item>
      <v-icon large @click="$emit('context-bar-visible', false)">mdi-close</v-icon>
    </v-list-item>

    <v-list-item v-if="!contentType">
      <actions
        :username="username"
        @change-panel="changeContext"
        @resend-invite-complete="closeContextBar"
        @user-enabled-toggle-complete="closeContextBar"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'avatar'">
      <avatar-edit
        :username="username"
        @avatar-edit-complete="closeContextBar"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'profile'">
      <profile-edit
        :username="username"
        @profile-edit-cancel="cancelContextBarAction"
        @profile-edit-complete="closeContextBar"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'ability'">
      <ability-grant
        :username="username"
        @user-grant-ability-complete="closeContextBar"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'fleet' && actionType === 'add'">
      <fleet-add
        :username="username"
        @user-fleet-add-complete="closeContextBar"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'fleet' && actionType === 'remove'">
      <fleet-remove
        :username="username"
        @user-fleet-remove-complete="closeContextBar"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'permission-group' && actionType === 'add'">
      <permission-group-add
        :username="username"
        @permission-group-add-complete="closeContextBar"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'permission-group' && actionType === 'remove'">
      <permission-group-remove
        :username="username"
        @permission-group-remove-complete="closeContextBar"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'mfa-configuration' && actionType === 'open'">
      <mfa-configuration
        :username="username"
      />
    </v-list-item>
    <v-list nav> </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEETS_SUMMON,
  PERMISSION_GROUPS_SUMMON
} from '@/store/action-types'
import {
  ACCESS_FLEETS_GROUPS,
  ACCESS_PERMISSION_GROUPS,
  OPERATOR_LOADED,
  OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE
} from '@/store/getter-types'

import Actions from '@/components/Users/UserContextBar/Actions.vue'
import AbilityGrant from '@/components/Users/UserContextBar/AbilityGrant.vue'
import AvatarEdit from '@/components/Users/UserContextBar/AvatarEdit.vue'
import FleetAdd from '@/components/Users/UserContextBar/FleetAdd.vue'
import FleetRemove from '@/components/Users/UserContextBar/FleetRemove.vue'
import MfaConfiguration from '@/components/Users/UserContextBar/MfaConfiguration.vue'
import PermissionGroupAdd from '@/components/Users/UserContextBar/PermissionGroupAdd.vue'
import PermissionGroupRemove from '@/components/Users/UserContextBar/PermissionGroupRemove.vue'
import ProfileEdit from '@/components/Users/UserContextBar/ProfileEdit.vue'

export default {
  name: 'UserContextBar',
  components: {
    Actions,
    AbilityGrant,
    AvatarEdit,
    FleetAdd,
    FleetRemove,
    MfaConfiguration,
    PermissionGroupAdd,
    PermissionGroupRemove,
    ProfileEdit
  },
  props: {
    actionType: {
      type: String,
      default: null
    },
    contentType: {
      type: String,
      default: null
    },
    username: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    active: false
  }),
  computed: {
    ...mapGetters({
      operatorCanAccessFleets: ACCESS_FLEETS_GROUPS,
      operatorCanAccessPermissionGroups: ACCESS_PERMISSION_GROUPS,
      operatorLoaded: OPERATOR_LOADED,
      operatorPreferenceContextBarOutsideClickClose: OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE
    }),
    contextBarOutsideClickClose () {
      const { operatorLoaded, operatorPreferenceContextBarOutsideClickClose } = this
      return operatorLoaded ? operatorPreferenceContextBarOutsideClickClose : null
    }
  },
  watch: {
    operatorCanAccessFleets: {
      handler (newVal) {
        if (newVal) {
          this.fleetsSummon()
        }
      },
      immediate: true
    },
    operatorCanAccessPermissionGroups: {
      handler (newVal) {
        if (newVal) {
          this.permissionGroupsSummon()
        }
      },
      immediate: true
    },
    visible (newVal) {
      this.active = newVal
    }
  },
  methods: {
    ...mapActions({
      fleetsSummonAction: FLEETS_SUMMON,
      permissionGroupsSummonAction: PERMISSION_GROUPS_SUMMON
    }),
    changeContext (event) {
      this.$emit('change-context', event)
    },
    closeContextBar () {
      this.$emit('context-bar-visible', false)
    },
    cancelContextBarAction () {
      this.$emit('context-bar-visible', true)
    },
    async fleetsSummon () {
      const componentSelf = this
      await this.fleetsSummonAction({ componentSelf })
    },
    outsideClickCloseEmit (event) {
      if (event === false && this.contextBarOutsideClickClose) {
        this.closeContextBar()
      }
    },
    permissionGroupsSummon () {
      const componentSelf = this
      this.permissionGroupsSummonAction({ componentSelf })
    }
  }
}
</script>
