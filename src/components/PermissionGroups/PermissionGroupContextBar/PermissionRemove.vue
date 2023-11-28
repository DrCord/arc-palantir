<template>
  <div class="permission-remove-container">
    <h3>Permission Group: Remove Permission</h3>
    <div v-if="availablePermissions.length">
      <v-select
        v-model="permission"
        :items="availablePermissions"
        outlined
      ></v-select>
      <v-btn
        :disabled="!permission"
        color=success
        @click="removePermission"
      >Remove Permission</v-btn>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
      <h4 v-else>No permissions available to remove to group</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  PERMISSION_GROUP_REMOVE_PERMISSION,
  PERMISSIONS_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  PERMISSION_GROUP_PERMISSIONS,
  PERMISSIONS
} from '@/store/getter-types'

export default {
  name: 'PermissionGroupRemovePermission',
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
          return this.permissionGroupPermissions.filter(pgPermission => pgPermission === permissionObject.permission).length
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
      permissionGroupRemovePermissionAction: PERMISSION_GROUP_REMOVE_PERMISSION,
      permissionsSummonAction: PERMISSIONS_SUMMON
    }),
    init () {
      this.permissionsSummon()
    },
    async removePermission () {
      const componentSelf = this
      const { permissionGroupId, permission } = this
      const payload = {
        permissionGroupId,
        body: {
          permission,
          resource: '*'
        }
      }
      await this.permissionGroupRemovePermissionAction({ componentSelf, payload })
      this.$emit('permission-group-remove-permission-complete')
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
  .permission-remove-container {
    h3 {
      margin-bottom: 20px;
    }
    button {
      float: right;
    }
  }
}
</style>
