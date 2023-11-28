<template>
  <div class="user-permissions">
    <page-header title="Permissions" />
    <div class="permissions-container content-container">
      <permissions-list />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { PERMISSIONS_SUMMON } from '@/store/action-types'
import { OPERATOR_HAS_ABILITIES } from '@/store/getter-types'

import PageHeader from '@/components/PageHeader.vue'
import PermissionsList from '@/components/Permissions/PermissionsList.vue'

export default {
  name: 'PermissionsView',
  components: {
    PageHeader,
    PermissionsList
  },
  computed: {
    ...mapGetters({
      operatorHasAbilities: OPERATOR_HAS_ABILITIES
    })
  },
  watch: {
    operatorHasAbilities: {
      handler (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.permissionsSummon()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      permissionsSummonAction: PERMISSIONS_SUMMON
    }),
    getData () {
      if (this.operatorAbilities.length) {
        this.permissionsSummon()
      }
    },
    permissionsSummon () {
      const componentSelf = this
      this.permissionsSummonAction({ componentSelf })
    }
  }
}
</script>
