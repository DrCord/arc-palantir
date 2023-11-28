<template>
  <div class="permission-group">
    <v-card v-if="permissionGroup" class="content">
      <v-card-title>
        <h3>{{ permissionGroup.name }}</h3>
      </v-card-title>
      <v-card-text>
        <h4>Permissions ({{ permissionGroup.permissions.length }})</h4>
        <ul class="permissions">
            <li v-for="permission in permissionGroupPermissions" :key="permission" >{{ permission }}</li>
        </ul>
        <h4>Users ({{ permissionGroupUsers.length }})</h4>
        <ul class="users">
          <li v-for="username in permissionGroupUsers" :key="username">
            <router-link :to="userLinkObject(username)">
              <span v-if="userGet(username)">{{ userGet(username).displayName }}</span>
              <span v-else>{{ username }}</span>
            </router-link>
          </li>
        </ul>
      </v-card-text>
    </v-card>
    <context-bar-toggle
      :visible="operatorCanAccessContextMenu"
      @context-bar-visible="toggleContextBar"
    />
    <context-bar
      :content-type="contextBarContentType"
      :permission-group-id="permissionGroupId"
      :visible="contextBarVisible"
      @change-context="changeContext"
      @context-bar-visible="toggleContextBar($event)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_PERMISSION_GROUP_ADD_PERMISSION,
  ACCESS_PERMISSION_GROUP_CREATE,
  ACCESS_PERMISSION_GROUP_REMOVE_PERMISSION,
  ACCESS_PERMISSION_GROUP_TOGGLE_MEMBERSHIP,
  ACCESS_USERS,
  PERMISSION_GROUP,
  PERMISSION_GROUP_PERMISSIONS,
  PERMISSION_GROUP_USERS,
  USER,
  USERS
} from '@/store/getter-types'

import utilityStore from '@/store/utility'
import ContextBarToggle from '@/components/ContextBarToggle.vue'
import ContextBar from '@/components/PermissionGroups/PermissionGroupContextBar/ContextBar.vue'

export default {
  name: 'PermissionGroupComponent',
  components: {
    ContextBar,
    ContextBarToggle
  },
  props: {
    permissionGroupId: {
      default: null,
      type: Number
    }
  },
  data: () => ({
    contextBarContentType: null,
    contextBarVisible: false
  }),
  computed: {
    ...mapGetters({
      operatorCanAccessUsers: ACCESS_USERS,
      operatorCanAddPermissionToGroup: ACCESS_PERMISSION_GROUP_ADD_PERMISSION,
      operatorCanCreatePermissionGroup: ACCESS_PERMISSION_GROUP_CREATE,
      operatorCanRemovePermissionFromGroup: ACCESS_PERMISSION_GROUP_REMOVE_PERMISSION,
      operatorCanTogglePermissionGroupMembership: ACCESS_PERMISSION_GROUP_TOGGLE_MEMBERSHIP,
      permissionGroupGet: PERMISSION_GROUP,
      permissionGroupPermissionsGet: PERMISSION_GROUP_PERMISSIONS,
      permissionGroupUsersGet: PERMISSION_GROUP_USERS,
      userGet: USER,
      users: USERS
    }),
    operatorCanAccessContextMenu () {
      // this should check using an OR for each item/permission in the context menu
      return this.operatorCanCreatePermissionGroup ||
             this.operatorCanTogglePermissionGroupMembership ||
             this.operatorCanAddPermissionToGroup ||
             this.operatorCanRemovePermissionFromGroup
    },
    permissionGroup () {
      const permissionGroup = {
        id: null,
        name: null,
        permissions: [],
        users: []
      }
      return this.permissionGroupId ? this.permissionGroupGet(this.permissionGroupId) : permissionGroup
    },
    permissionGroupPermissions () {
      return this.permissionGroupId ? this.permissionGroupPermissionsGet(this.permissionGroupId) : []
    },
    permissionGroupUsers () {
      return this.permissionGroupId ? this.permissionGroupUsersGet(this.permissionGroupId) : []
    }
  },
  methods: {
    changeContext (event) {
      this.contextBarVisible = true
      this.contextBarContentType = event.contentType
    },
    closeContextBar () {
      this.toggleContextBar(false)
    },
    permissionGroupUsersRemovePermission (permission) {
      // manually maintaining this as the store won't have caught up yet
      this.permissionGroupPermissions = this.permissionGroupPermissions.filter(pgPermission => pgPermission !== permission)
    },
    permissionGroupUsersRemoveUser (username) {
      // manually maintaining this as the store won't have caught up yet
      this.permissionGroupUsers = this.permissionGroupUsers.filter(pgUsername => pgUsername !== username)
    },
    permissionGroupUsersAddPermission (permission) {
      // manually maintaining this as the store won't have caught up yet
      this.permissionGroupPermissions.push(permission)
      this.permissionGroupPermissions.sort()
    },
    permissionGroupUsersAddUser (username) {
      // manually maintaining this as the store won't have caught up yet
      const { permissionGroupUsers, users } = this
      permissionGroupUsers.push(username)
      this.permissionGroupUsers = utilityStore.sortUsernamesUsingStoreData(permissionGroupUsers, users)
    },
    toggleContextBar (visible, contentType = null) {
      this.contextBarVisible = visible
      this.contextBarContentType = contentType
    },
    userLinkObject (username) {
      return {
        name: 'user',
        params: { username }
      }
    }
  }
}

</script>

<style lang="scss">
.permission-group {
  h4 {
    color: black;
  }
  .permissions,
  .users {
    list-style: none;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 5px;
    li {
      margin-top: 3px;
      color: rgba(0, 0, 0, 0.87);
    }
  }
  &.theme--dark {
    .permissions,
    .users {
      li {
        color: #fff;
      }
    }
  }
}
</style>
