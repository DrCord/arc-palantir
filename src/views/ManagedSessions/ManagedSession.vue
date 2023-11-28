<template>
  <div class="managed-session">
    <page-header title="Managed Session" />
    <div class="managed-session-container content-container">
      <ManagedSessionComponent :managed-session-id="managedSessionId" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { MANAGED_SESSION_SUMMON } from '@/store/action-types'

import ManagedSessionComponent from '@/components/ManagedSessions/ManagedSession.vue'
import PageHeader from '@/components/PageHeader.vue'

import utility from '@/lib/utility'

export default {
  name: 'ManagedSessionView',
  components: {
    ManagedSessionComponent,
    PageHeader
  },
  data: () => ({
    managedSessionId: null
  }),
  mounted () {
    if (!this.$route.params.id) {
      this.redirectToManagedSessions()
    } else {
      this.summonManagedSession()
    }
  },
  methods: {
    ...mapActions({
      managedSessionSummonAction: MANAGED_SESSION_SUMMON
    }),
    async summonManagedSession () {
      const componentSelf = this
      const id = parseInt(this.$route.params.id, 10)
      await this.managedSessionSummonAction({ componentSelf, id })
      this.managedSessionId = id
    },
    redirectToManagedSessions () {
      utility.redirect(this, 'managed-sessions')
    }
  }
}
</script>
