<template>
  <v-navigation-drawer
    v-model="active"
    app
    class="context-menu"
    :hide-overlay="!contextBarOutsideClickClose"
    right
    :stateless="!contextBarOutsideClickClose"
    temporary
    width="400px"
    @input="outsideClickCloseEmit"
  >
    <v-list-item>
      <v-icon large @click="$emit('context-bar-visible', false)">mdi-close</v-icon>
    </v-list-item>

    <v-list-item v-if="!contentType">
      <actions
        :permission-group-id="permissionGroupId"
        @change-panel="changeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'permission-group-delete'">
      <permission-group-delete
        :permission-group-id="permissionGroupId"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'permission-group-add-user'">
      <permission-group-add-user
        :permission-group-id="permissionGroupId"
        @permission-group-add-user-complete="closeContextBar"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'permission-group-remove-user'">
      <permission-group-remove-user
        :permission-group-id="permissionGroupId"
        @permission-group-remove-user-complete="closeContextBar"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'permission-group-add-permission'">
      <permission-group-add-permission
        :permission-group-id="permissionGroupId"
        @permission-group-add-permission-complete="closeContextBar"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'permission-group-remove-permission'">
      <permission-group-remove-permission
        :permission-group-id="permissionGroupId"
        @permission-group-remove-permission-complete="closeContextBar"
      />
    </v-list-item>
    <v-list nav> </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  OPERATOR_LOADED,
  OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE
} from '@/store/getter-types'

import Actions from '@/components/PermissionGroups/PermissionGroupContextBar/Actions.vue'
import PermissionGroupAddPermission from '@/components/PermissionGroups/PermissionGroupContextBar/PermissionAdd.vue'
import PermissionGroupAddUser from '@/components/PermissionGroups/PermissionGroupContextBar/UserAdd.vue'
import PermissionGroupDelete from '@/components/PermissionGroups/PermissionGroupContextBar/Delete.vue'
import PermissionGroupRemovePermission from '@/components/PermissionGroups/PermissionGroupContextBar/PermissionRemove.vue'
import PermissionGroupRemoveUser from '@/components/PermissionGroups/PermissionGroupContextBar/UserRemove.vue'

export default {
  name: 'PermissionGroupContextBar',
  components: {
    Actions,
    PermissionGroupAddPermission,
    PermissionGroupAddUser,
    PermissionGroupDelete,
    PermissionGroupRemovePermission,
    PermissionGroupRemoveUser
  },
  props: {
    contentType: {
      default: null,
      type: String
    },
    permissionGroupId: {
      default: null,
      type: Number
    },
    visible: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    active: false
  }),
  computed: {
    ...mapGetters({
      operatorLoaded: OPERATOR_LOADED,
      operatorPreferenceContextBarOutsideClickClose: OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE
    }),
    contextBarOutsideClickClose () {
      const { operatorLoaded, operatorPreferenceContextBarOutsideClickClose } = this
      return operatorLoaded ? operatorPreferenceContextBarOutsideClickClose : null
    }
  },
  watch: {
    visible (newVal) {
      this.active = newVal
    }
  },
  methods: {
    changeContext (event) {
      this.$emit('change-context', event)
    },
    closeContextBar () {
      this.$emit('context-bar-visible', false)
    },
    outsideClickCloseEmit (event) {
      if (event === false && this.contextBarOutsideClickClose) {
        this.closeContextBar()
      }
    }
  }
}
</script>
