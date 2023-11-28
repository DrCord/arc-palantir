<template>
  <div class="quick-actions-container">
    <h3>Permission Groups Actions</h3>
    <v-list>
      <v-list-item v-if="operatorCanCreatePermissionGroup">
        <v-btn @click="create">
          Create
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ACCESS_PERMISSION_GROUP_CREATE } from '@/store/getter-types'

export default {
  name: 'PermissionGroupsActions',
  computed: {
    ...mapGetters({
      operatorCanCreatePermissionGroup: ACCESS_PERMISSION_GROUP_CREATE
    })
  },
  methods: {
    changePanel (contentType) {
      this.$emit('change-panel', { contentType })
    },
    create () {
      this.changePanel('permission-group-create')
    }
  }
}
</script>
