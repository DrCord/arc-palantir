<template>
  <div class="locations">
    <page-header title="Locations" />
    <div class="locations-container content-container">
      <LocationsList />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { LOCATIONS_SUMMON } from '@/store/action-types'
import { OPERATOR_LOADED } from '@/store/getter-types'

import LocationsList from '@/components/Locations/LocationsList.vue'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'LocationsView',
  components: {
    LocationsList,
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
          this.locationsSummon()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      locationsSummonAction: LOCATIONS_SUMMON
    }),
    locationsSummon () {
      const componentSelf = this
      const force = false
      this.locationsSummonAction({ componentSelf, force })
    }
  }
}
</script>
