<template>
  <div class="quick-actions-container">
    <h3>Permission Group Actions</h3>
    <v-list>
      <v-list-item v-if="operatorCanDeletePermissionGroup">
        <v-btn @click="deleteGroup">Delete</v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanTogglePermissionGroupMembership">
        <v-btn
          :disabled="permissionGroupHasAllMembers"
          @click="addUser"
        >User - Add
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanTogglePermissionGroupMembership">
        <v-btn
          :disabled="permissionGroupHasNoMembers"
          @click="removeUser"
        >User - Remove
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanAddPermissionToGroup">
        <v-btn
          :disabled="permissionGroupHasAllPermissions"
          @click="addPermission"
          >Permission - Add
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanRemovePermissionFromGroup">
        <v-btn
          :disabled="permissionGroupHasNoPermissions"
          @click="removePermission"
        >Permission - Remove
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_PERMISSION_GROUP_ADD_PERMISSION,
  ACCESS_PERMISSION_GROUP_DELETE,
  ACCESS_PERMISSION_GROUP_REMOVE_PERMISSION,
  ACCESS_PERMISSION_GROUP_TOGGLE_MEMBERSHIP,
  PERMISSION_GROUP,
  PERMISSION_GROUP_HAS_ALL_MEMBERS,
  PERMISSION_GROUP_HAS_ALL_PERMISSIONS,
  PERMISSION_GROUP_HAS_NO_MEMBERS,
  PERMISSION_GROUP_HAS_NO_PERMISSIONS,
  PERMISSION_GROUP_USERS
} from '@/store/getter-types'

export default {
  name: 'PermissionGroupActions',
  props: {
    permissionGroupId: {
      default: null,
      type: Number
    }
  },
  computed: {
    ...mapGetters({
      operatorCanAddPermissionToGroup: ACCESS_PERMISSION_GROUP_ADD_PERMISSION,
      operatorCanDeletePermissionGroup: ACCESS_PERMISSION_GROUP_DELETE,
      operatorCanRemovePermissionFromGroup: ACCESS_PERMISSION_GROUP_REMOVE_PERMISSION,
      operatorCanTogglePermissionGroupMembership: ACCESS_PERMISSION_GROUP_TOGGLE_MEMBERSHIP,
      permissionGroupGet: PERMISSION_GROUP,
      permissionGroupHasAllMembersGet: PERMISSION_GROUP_HAS_ALL_MEMBERS,
      permissionGroupHasAllPermissionsGet: PERMISSION_GROUP_HAS_ALL_PERMISSIONS,
      permissionGroupHasNoMembersGet: PERMISSION_GROUP_HAS_NO_MEMBERS,
      permissionGroupHasNoPermissionsGet: PERMISSION_GROUP_HAS_NO_PERMISSIONS,
      permissionGroupUsersGet: PERMISSION_GROUP_USERS
    }),
    permissionGroup () {
      return this.permissionGroupId ? this.permissionGroupGet(this.permissionGroupId) : {}
    },
    permissionGroupHasAllMembers () {
      return this.permissionGroupId ? this.permissionGroupHasAllMembersGet(this.permissionGroupId) : null
    },
    permissionGroupHasAllPermissions () {
      return this.permissionGroupId ? this.permissionGroupHasAllPermissionsGet(this.permissionGroupId) : null
    },
    permissionGroupHasNoMembers () {
      return this.permissionGroupId ? this.permissionGroupHasNoMembersGet(this.permissionGroupId) : null
    },
    permissionGroupHasNoPermissions () {
      return this.permissionGroupId ? this.permissionGroupHasNoPermissionsGet(this.permissionGroupId) : null
    },
    permissionGroupUsers () {
      return this.permissionGroupId ? this.permissionGroupUsersGet(this.permissionGroupId) : []
    }
  },
  methods: {
    addPermission () {
      this.changePanel('permission-group-add-permission')
    },
    addUser () {
      this.changePanel('permission-group-add-user')
    },
    changePanel (contentType) {
      this.$emit('change-panel', { contentType })
    },
    deleteGroup () {
      this.changePanel('permission-group-delete')
    },
    removePermission () {
      this.changePanel('permission-group-remove-permission')
    },
    removeUser () {
      this.changePanel('permission-group-remove-user')
    }
  }
}
</script>
