<template>
  <div class="permission-add-container">
    <h3>Permission Group: Add Permission</h3>
    <div v-if="availablePermissions.length">
      <v-select
        v-model="permission"
        :items="availablePermissions"
        outlined
      ></v-select>
      <v-btn
        :disabled="!permission"
        color=success
        @click="addPermission"
      >Add Permission</v-btn>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
      <h4 v-else>No permissions available to add to group</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  PERMISSION_GROUP_ADD_PERMISSION,
  PERMISSIONS_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  PERMISSION_GROUP_PERMISSIONS,
  PERMISSIONS
} from '@/store/getter-types'

export default {
  name: 'PermissionGroupAddPermission',
  props: {
    permissionGroupId: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      permission: null
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      permissions: PERMISSIONS,
      permissionGroupPermissionsGet: PERMISSION_GROUP_PERMISSIONS
    }),
    availablePermissions () {
      if (!this.permissionGroupPermissions) {
        return this.permissions.map(permissionObject => permissionObject.permission)
      }
      // check against permission group permissions
      const permissions = this.permissions
        .filter(permissionObject => {
          return !this.permissionGroupPermissions.filter(pgPermission => pgPermission === permissionObject.permission).length
        })
        .map(permissionObject => permissionObject.permission)
      return permissions
    },
    permissionGroupPermissions () {
      return this.permissionGroupId ? this.permissionGroupPermissionsGet(this.permissionGroupId) : []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      permissionGroupAddPermissionAction: PERMISSION_GROUP_ADD_PERMISSION,
      permissionsSummonAction: PERMISSIONS_SUMMON
    }),
    init () {
      this.permissionsSummon()
    },
    async addPermission () {
      const componentSelf = this
      const { permissionGroupId, permission } = this
      const payload = {
        permissionGroupId,
        body: {
          permission,
          resource: '*'
        }
      }
      await this.permissionGroupAddPermissionAction({ componentSelf, payload })
      this.$emit('permission-group-add-permission-complete')
    },
    permissionsSummon () {
      const componentSelf = this
      const force = false
      this.permissionsSummonAction({ componentSelf, force })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .permission-add-container {
    h3 {
      margin-bottom: 20px;
    }
    button {
      float: right;
    }
  }
}
</style>
