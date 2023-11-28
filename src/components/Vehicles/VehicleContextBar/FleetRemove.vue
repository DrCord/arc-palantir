<template>
  <div class="vehicle-fleet-remove-container">
    <h3>Remove Vehicle from Fleet</h3>
    <div v-if="availableFleets.length">
      <v-select
        v-model="fleetId"
        :items="availableFleets"
        item-text="name"
        item-value="id"
        outlined
      ></v-select>
      <v-btn
        :disabled="!fleetId"
        color=success
        @click="vehicleFleetRemove"
      >Save</v-btn>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
      <h4 v-else>No fleets available to remove</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEETS_SUMMON,
  VEHICLE_FLEET_REMOVE
} from '@/store/action-types'
import {
  FLEETS,
  LOADING,
  VEHICLE_FLEETS
} from '@/store/getter-types'

export default {
  name: 'VehicleFleetRemove',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      fleetId: null
    }
  },
  computed: {
    ...mapGetters({
      fleets: FLEETS,
      loading: LOADING,
      vehicleFleetsGet: VEHICLE_FLEETS
    }),
    availableFleets () {
      const fleets = this.fleets.filter(fleet => {
        return this.vehicleFleets.includes(fleet.id) && fleet.id !== 1
      })
      fleets.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      return fleets
    },
    vehicleFleets () {
      return this.vin ? this.vehicleFleetsGet(this.vin) : []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      fleetsSummonAction: FLEETS_SUMMON,
      vehicleFleetRemoveAction: VEHICLE_FLEET_REMOVE
    }),
    init () {
      this.fleetsSummon()
    },
    async fleetsSummon () {
      const componentSelf = this
      await this.fleetsSummonAction({ componentSelf })
    },
    async vehicleFleetRemove () {
      const componentSelf = this
      const vin = this.vin
      const id = this.fleetId
      const payload = {
        vin,
        id,
        body: {}
      }
      await this.vehicleFleetRemoveAction({ componentSelf, payload })
      this.$emit('fleet-remove-vehicle-complete')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle-fleet-remove-container {
    h3 {
      margin-bottom: 20px;
    }
    button {
      float: right;
      margin-right: 30px;
    }
  }
}
</style>
