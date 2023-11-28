<template>
  <div class="permission-group-delete-container">
    <h3>Delete Permission Group</h3>
    <p>Are you sure you want to delete this permission group?</p>

    <div class="btn-container">
      <v-btn
        class="save"
        color="error"
        type="button"
        @click="deleteGroup"
      >Delete<v-icon>mdi-minus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { PERMISSION_GROUP_DELETE } from '@/store/action-types'

import utility from '@/lib/utility'

export default {
  name: 'PermissionGroupDelete',
  props: {
    permissionGroupId: {
      default: null,
      type: Number
    }
  },
  methods: {
    ...mapActions({
      permissionGroupDeleteAction: PERMISSION_GROUP_DELETE
    }),
    async deleteGroup () {
      const componentSelf = this
      const permissionGroupId = this.permissionGroupId
      const payload = {
        permissionGroupId
      }
      await this.permissionGroupDeleteAction({ componentSelf, payload })
      utility.redirect(this, 'permission-groups')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .permission-group-delete-container {
    h3 {
      margin-bottom: 20px;
    }
    .btn-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      button {
        margin-left: 20px;
        &:first-of-type {
          margin-left: 0;
        }
      }
    }
  }
  &.theme--dark {
      p {
        color: #fff
      }
    }
}
</style>
