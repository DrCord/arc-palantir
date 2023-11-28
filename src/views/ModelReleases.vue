<template>
  <div class="model-releases">
    <page-header title="Model Releases" />
    <div class="model-releases-container content-container">
      <model-releases />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLES_MODEL_RELEASES_SUMMON } from '@/store/action-types'
import { OPERATOR_LOADED } from '@/store/getter-types'

import ModelReleases from '@/components/Vehicles/ModelReleases/ModelReleases.vue'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'ModelReleasesComponent',
  components: {
    ModelReleases,
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
          this.vehiclesModelReleasesSummon()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      vehiclesModelReleasesSummonAction: VEHICLES_MODEL_RELEASES_SUMMON
    }),
    vehiclesModelReleasesSummon () {
      const componentSelf = this
      const { vehiclesModelReleasesSummonAction } = this
      vehiclesModelReleasesSummonAction({ componentSelf })
    }
  }
}
</script>
