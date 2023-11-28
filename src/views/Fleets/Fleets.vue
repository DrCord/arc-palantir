<template>
  <div class="fleets">
    <page-header
      title="Fleets"
    />
    <div
      v-if="operatorFleets.length"
      v-masonry
      class="fleets-container content-container"
      transition-duration="0.3s"
      item-selector=".fleet-summary-container"
      gutter="20"
      :fit-width="true"
    >
      <div
        v-for="fleet in operatorFleets"
        :key="fleet.id"
        v-masonry-tile
        class="fleet-summary-container"
      >
        <FleetSummary
          :id="fleet.id"
          :description="fleet.name"
          @click="navigateToViewFleet(fleet.id)"
        />
      </div>
    </div>
    <v-card v-if="!loading && !operatorFleets.length">
      <v-card-title>Active User Not a Member of Any Fleets</v-card-title>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { OPERATOR_FLEETS_SUMMON } from '@/store/action-types'
import {
  LOADING,
  OPERATOR,
  OPERATOR_LOADED,
  OPERATOR_FLEETS
} from '@/store/getter-types'

import FleetSummary from '@/components/Fleets/FleetSummary'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'FleetsView',
  components: {
    FleetSummary,
    PageHeader
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      operator: OPERATOR,
      operatorFleets: OPERATOR_FLEETS,
      operatorLoaded: OPERATOR_LOADED
    })
  },
  watch: {
    operatorLoaded: {
      handler (newVal) {
        if (newVal) {
          this.getData()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      operatorFleetsSummonAction: OPERATOR_FLEETS_SUMMON
    }),
    getData () {
      this.operatorFleetsSummon()
    },
    async operatorFleetsSummon () {
      const componentSelf = this
      const { operator } = this
      await this.operatorFleetsSummonAction({ componentSelf, operator })
    },
    navigateToViewFleet (fleetId) {
      this.$router.push({
        name: 'fleet',
        params: {
          fleetId
        }
      })
    }
  }
}
</script>
