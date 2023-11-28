<template>
  <div class="user-abilities">
    <page-header title="Abilities" />
    <div class="user-abilities-container content-container">
      <abilities-list />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { USERS_ABILITIES_SUMMON } from '@/store/action-types'
import { OPERATOR_LOADED } from '@/store/getter-types'

import AbilitiesList from '@/components/Abilities/AbilitiesList.vue'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'AbilitiesView',
  components: {
    AbilitiesList,
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
          this.abilitiesSummon()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      abilitiesSummonAction: USERS_ABILITIES_SUMMON
    }),
    abilitiesSummon () {
      const componentSelf = this
      const { abilitiesSummonAction } = this
      abilitiesSummonAction({ componentSelf })
    }
  }
}
</script>
