<template>
  <div class="permission-group">
    <page-header title="Permission Group" />
    <div class="permission-group-container content-container">
      <permission-group-component :permission-group-id="permissionGroupId" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  PERMISSION_GROUP_SUMMON,
  PERMISSION_GROUPS_SUMMON,
  USERS_SUMMON
} from '@/store/action-types'
import {
  ACCESS_USERS,
  OPERATOR_ABILITIES,
  OPERATOR_LOADED,
  PERMISSION_GROUPS
} from '@/store/getter-types'

import PermissionGroupComponent from '@/components/PermissionGroups/PermissionGroup.vue'
import PageHeader from '@/components/PageHeader.vue'

import utility from '@/lib/utility'

export default {
  name: 'PermissionGroupView',
  components: {
    PageHeader,
    PermissionGroupComponent
  },
  data: () => ({
    permissionGroupId: null
  }),
  computed: {
    ...mapGetters({
      operatorAbilities: OPERATOR_ABILITIES,
      operatorCanAccessUsers: ACCESS_USERS,
      operatorLoaded: OPERATOR_LOADED,
      permissionGroups: PERMISSION_GROUPS
    })
  },
  watch: {
    operatorLoaded: {
      handler (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.summonEntities()
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      permissionGroupsSummonAction: PERMISSION_GROUPS_SUMMON,
      permissionGroupSummonAction: PERMISSION_GROUP_SUMMON,
      usersSummonAction: USERS_SUMMON
    }),
    init () {
      if (!this.$route.params.id) {
        this.redirectToPermissionGroups()
      }
    },
    async permissionGroupSummon (force = false) {
      const permissionGroupId = parseInt(this.$route.params.id, 10)
      const componentSelf = this
      await this.permissionGroupSummonAction({ componentSelf, permissionGroupId, force })
      this.permissionGroupId = permissionGroupId
    },
    async summonPermissionGroups () {
      if (!this.permissionGroups.length) {
        const componentSelf = this
        const force = false
        await this.permissionGroupsSummonAction({ componentSelf, force })
      }
    },
    async summonEntities () {
      this.summonPermissionGroups()
      if (this.operatorCanAccessUsers) {
        const componentSelf = this
        await this.usersSummonAction({ componentSelf })
      }
      this.permissionGroupSummon(true)
    },
    redirectToPermissionGroups () {
      utility.redirect(this, 'permission-groups')
    }
  }
}
</script>
