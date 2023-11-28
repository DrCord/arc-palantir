<template>
  <div class="managed-sessions">
    <page-header title="Managed Sessions" />
      <div class="managed-sessions-container content-container">
        <ManagedSessionsList />
      </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { MANAGED_SESSIONS_SUMMON } from '@/store/action-types'
import { OPERATOR_LOADED } from '@/store/getter-types'

import ManagedSessionsList from '@/components/ManagedSessions/ManagedSessionsList.vue'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'ManagedSessionsView',
  components: {
    ManagedSessionsList,
    PageHeader
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
          this.managedSessionsSummon()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      managedSessionsSummonAction: MANAGED_SESSIONS_SUMMON
    }),
    async managedSessionsSummon () {
      const componentSelf = this
      await this.managedSessionsSummonAction({ componentSelf })
    }
  }
}
</script>
