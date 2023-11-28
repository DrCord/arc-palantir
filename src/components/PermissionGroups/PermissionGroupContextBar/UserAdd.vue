<template>
  <div class="user-add-container">
    <h3>Permission Group: Add User</h3>
    <div v-if="availableUsers.length">
      <v-select
        v-model="username"
        :items="availableUsers"
        item-text="displayName"
        item-value="username"
        outlined
      ></v-select>
      <v-btn
        :disabled="!username"
        color=success
        @click="addUser"
      >Add User</v-btn>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
      <h4 v-else>No users available to add to group</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { PERMISSION_GROUP_ADD_USER } from '@/store/action-types'
import {
  LOADING,
  PERMISSION_GROUP_USERS,
  USERS
} from '@/store/getter-types'

export default {
  name: 'PermissionGroupAddUser',
  props: {
    permissionGroupId: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      username: null
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      permissionGroupUsersGet: PERMISSION_GROUP_USERS,
      users: USERS
    }),
    availableUsers () {
      if (!this.permissionGroupUsers) {
        return this.users
      }
      // check against user permission groups
      const users = this.users.filter(user => {
        return !this.permissionGroupUsers.filter(username => username === user.username).length
      })
      // sort by display name
      users.sort((a, b) => (a.displayName > b.displayName) ? 1 : ((b.displayName > a.displayName) ? -1 : 0))
      return users
    },
    permissionGroupUsers () {
      return this.permissionGroupId ? this.permissionGroupUsersGet(this.permissionGroupId) : []
    }
  },
  methods: {
    ...mapActions({
      permissionGroupAddUserAction: PERMISSION_GROUP_ADD_USER
    }),
    async addUser () {
      const componentSelf = this
      const { permissionGroupId, username } = this
      const payload = {
        permissionGroupId,
        username,
        body: {}
      }
      await this.permissionGroupAddUserAction({ componentSelf, payload })
      this.$emit('permission-group-add-user-complete')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .user-add-container {
    h3 {
      margin-bottom: 20px;
    }
    button {
      float: right;
    }
  }
}
</style>
