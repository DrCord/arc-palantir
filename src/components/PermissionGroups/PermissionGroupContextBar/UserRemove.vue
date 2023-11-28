<template>
  <div class="user-remove-container">
    <h3>Permission Group: Remove User</h3>
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
        @click="removeUser"
      >Remove User</v-btn>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
      <h4 v-else>No users available to remove from group</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { PERMISSION_GROUP_REMOVE_USER } from '@/store/action-types'
import {
  LOADING,
  PERMISSION_GROUP_USERS,
  USERS
} from '@/store/getter-types'

export default {
  name: 'PermissionGroupRemoveUser',
  props: {
    permissionGroupId: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      permissionGroupUsers: [],
      user: {},
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
        return this.permissionGroupUsers.filter(username => username === user.username).length
      })
      // sort by display name
      users.sort((a, b) => (a.displayName > b.displayName) ? 1 : ((b.displayName > a.displayName) ? -1 : 0))
      return users
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      permissionGroupRemoveUserAction: PERMISSION_GROUP_REMOVE_USER
    }),
    init () {
      this.permissionGroupUsersSet()
    },
    async removeUser () {
      const componentSelf = this
      const { permissionGroupId, username } = this
      const payload = {
        permissionGroupId,
        username,
        body: {}
      }
      await this.permissionGroupRemoveUserAction({ componentSelf, payload })
      this.$emit('permission-group-remove-user-complete')
    },
    permissionGroupUsersSet () {
      this.permissionGroupUsers = this.permissionGroupUsersGet(this.permissionGroupId)
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .user-remove-container {
    h3 {
      margin-bottom: 20px;
    }
    button {
      float: right;
    }
  }
}
</style>
