<template>
  <div>
    <page-header title="Vehicle Group" />
    <div class="vehicle-group-container content-container">
      <vehicle-group-component :fleet-id="fleetId" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEET_SUMMON,
  FLEETS_SUMMON
} from '@/store/action-types'
import {
  FLEETS_IDS,
  OPERATOR_LOADED
} from '@/store/getter-types'

import VehicleGroupComponent from '@/components/VehicleGroups/VehicleGroup.vue'
import PageHeader from '@/components/PageHeader.vue'

import utility from '@/lib/utility'

export default {
  name: 'VehicleGroupView',
  components: {
    PageHeader,
    VehicleGroupComponent
  },
  data: () => ({
    fleetId: null
  }),
  computed: {
    ...mapGetters({
      fleetsIds: FLEETS_IDS,
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
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      fleetSummonAction: FLEET_SUMMON,
      fleetsSummonAction: FLEETS_SUMMON
    }),
    init () {
      if (!this.$route.params.groupId) {
        this.redirectToVehicleGroups()
      }
    },
    async summonFleets () {
      const id = parseInt(this.$route.params.groupId, 10)
      const componentSelf = this
      await this.fleetsSummonAction({ componentSelf })
      if (!this.fleetsIds.includes(id)) {
        const toastPayload = {
          msg: `Vehicle Group ${id} does not exist`,
          icon: 'error'
        }
        this.$emit('toast', toastPayload)
        this.redirectToVehicleGroups()
      } else {
        this.summonFleet(id)
      }
    },
    async summonFleet (fleetId) {
      const componentSelf = this
      await this.fleetSummonAction({ componentSelf, payload: { fleetId } })
      this.fleetId = fleetId
    },
    redirectToVehicleGroups () {
      utility.redirect(this, 'vehicle-groups')
    }
  }
}
</script>
