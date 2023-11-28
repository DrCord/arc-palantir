<template>
  <div class='fleets'>
    <page-header title="Fleets" />
    <div class="vehicle-groups-container content-container">
      <vehicle-groups-component />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { FLEETS_SUMMON } from '@/store/action-types'
import { OPERATOR_LOADED } from '@/store/getter-types'

import PageHeader from '@/components/PageHeader.vue'
import VehicleGroupsComponent from '@/components/VehicleGroups/VehicleGroups.vue'

export default {
  name: 'VehicleGroupsView',
  components: {
    PageHeader,
    VehicleGroupsComponent
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
          this.summonFleets()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      fleetsSummonAction: FLEETS_SUMMON
    }),
    async summonFleets () {
      const componentSelf = this
      await this.fleetsSummonAction({ componentSelf })
    }
  }
}
</script>
