<template>
  <div class="permission-group-add-container">
    <h3>Add to Permission Group</h3>
    <div v-if="availablePermissionGroups.length">
      <v-select
        v-model="permissionGroupId"
        :items="availablePermissionGroups"
        item-text="name"
        item-value="id"
        outlined
      ></v-select>
      <v-btn
        :disabled="!permissionGroupId"
        color=success
        @click="userPermissionGroupAdd"
      >Save</v-btn>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
      <h4 v-else>No permission groups available to join</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  PERMISSION_GROUP_ADD_USER,
  PERMISSION_GROUPS_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  PERMISSION_GROUPS,
  USER_PERMISSION_GROUPS
} from '@/store/getter-types'

export default {
  name: 'UserPermissionGroupAdd',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      permissionGroupId: null
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      permissionGroups: PERMISSION_GROUPS,
      userPermissionGroupsGet: USER_PERMISSION_GROUPS
    }),
    availablePermissionGroups () {
      // check against user permission groups
      const permissionGroups = this.permissionGroups.filter(permissionGroup => {
        return !this.userPermissionGroups.includes(permissionGroup.name)
      })
      // sort by permission group name
      permissionGroups.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      return permissionGroups
    },
    userPermissionGroups () {
      return this.username ? this.userPermissionGroupsGet(this.username) : []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      permissionGroupAddUserAction: PERMISSION_GROUP_ADD_USER,
      permissionGroupsSummonAction: PERMISSION_GROUPS_SUMMON
    }),
    init () {
      const componentSelf = this
      this.permissionGroupsSummonAction({ componentSelf })
    },
    userPermissionGroupAdd () {
      const componentSelf = this
      const username = this.username
      const permissionGroupId = this.permissionGroupId
      const payload = {
        username,
        permissionGroupId,
        body: {}
      }
      this.permissionGroupAddUserAction({ componentSelf, payload })
        .then(() => {
          this.$emit('permission-group-add-complete')
        })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .permission-group-add-container {
    h3 {
      margin-bottom: 20px;
    }
    button {
      float: right;
    }
  }
}
</style>
