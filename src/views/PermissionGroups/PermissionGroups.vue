<template>
  <div class="permission-groups">
    <page-header title="Permission Groups" />
    <div class="permission-groups-container content-container">
      <permission-groups />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { PERMISSION_GROUPS_SUMMON } from '@/store/action-types'
import { OPERATOR_LOADED } from '@/store/getter-types'

import PermissionGroups from '@/components/PermissionGroups/PermissionGroups.vue'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'PermissionGroupsView',
  components: {
    PageHeader,
    PermissionGroups
  },
  computed: {
    ...mapGetters({
      operatorLoaded: OPERATOR_LOADED
    })
  },
  watch: {
    operatorLoaded: {
      handler (newVal) {
        if (newVal) {
          this.permissionGroupsSummon()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      permissionGroupsSummonAction: PERMISSION_GROUPS_SUMMON
    }),
    async permissionGroupsSummon () {
      const componentSelf = this
      const force = false
      await this.permissionGroupsSummonAction({ componentSelf, force })
    }
  }
}
</script>
