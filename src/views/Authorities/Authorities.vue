<template>
  <div class="authorities">
    <page-header title="Authorities" />
    <div class="authorities-container content-container">
      <AuthoritiesList />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { AUTHORITIES_SUMMON } from '@/store/action-types'
import { OPERATOR_LOADED } from '@/store/getter-types'

import AuthoritiesList from '@/components/Authorities/AuthoritiesList.vue'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'AuthoritiesView',
  components: {
    AuthoritiesList,
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
          this.authoritiesSummon()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      authoritiesSummonAction: AUTHORITIES_SUMMON
    }),
    authoritiesSummon () {
      const componentSelf = this
      const force = false
      this.authoritiesSummonAction({ componentSelf, force })
    }
  }
}
</script>
