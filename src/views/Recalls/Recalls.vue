<template>
  <div class="recalls">
    <page-header title="Recalls" />
    <div class="recalls-container content-container">
      <RecallsList />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { RECALLS_SUMMON } from '@/store/action-types'
import { OPERATOR_LOADED } from '@/store/getter-types'

import PageHeader from '@/components/PageHeader.vue'
import RecallsList from '@/components/Recalls/RecallsList.vue'

export default {
  name: 'RecallsView',
  components: {
    PageHeader,
    RecallsList
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
          this.recallsSummon()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      recallsSummonAction: RECALLS_SUMMON
    }),
    async recallsSummon (force = false) {
      const componentSelf = this
      await this.recallsSummonAction({ componentSelf, force })
    }
  }
}
</script>
