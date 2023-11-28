<template>
  <div class="vehicles">
    <page-header title="Models" />
    <div class="models-container content-container">
      <models />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLES_MODELS_SUMMON } from '@/store/action-types'
import { OPERATOR_LOADED } from '@/store/getter-types'

import Models from '@/components/Vehicles/Models.vue'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'ModelsView',
  components: {
    Models,
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
          this.vehiclesModelsSummon()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      vehiclesModelsSummonAction: VEHICLES_MODELS_SUMMON
    }),
    async vehiclesModelsSummon () {
      const componentSelf = this
      const force = false
      await this.vehiclesModelsSummonAction({ componentSelf, force })
    }
  }
}
</script>
