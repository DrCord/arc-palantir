<template>
  <div class="vehicle-fleet-add-container">
    <h3>Add Vehicle to Fleets</h3>
    <div class="controls">
      <v-autocomplete
        ref="fleetAutocomplete"
        v-model="fleetObjects"
        :items="availableFleets"
        item-text="name"
        return-object
        outlined
        multiple
        dense
        clearable
        small-chips
        deletable-chips
        no-data-text="No Fleets To Add"
        placeholder="Select Fleets"
        open-on-clear
      ></v-autocomplete>
    </div>
    <v-btn
        block
        :disabled="fleetObjects.length === 0"
        color=success
        @click="vehicleFleetAdd"
      >Save</v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEETS_SUMMON,
  VEHICLE_FLEET_ADD
} from '@/store/action-types'
import {
  FLEETS,
  LOADING,
  VEHICLE_FLEETS
} from '@/store/getter-types'

export default {
  name: 'VehicleFleetAdd',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      fleetObjects: []
    }
  },
  computed: {
    ...mapGetters({
      fleets: FLEETS,
      loading: LOADING,
      vehicleFleetsGet: VEHICLE_FLEETS
    }),
    availableFleets () {
      const fleets = this.fleets.filter(
        fleet => {
          return !this.vehicleFleets.includes(fleet.id)
        }
      )
      fleets.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      return fleets
    },
    vehicleFleets () {
      return this.vin ? this.vehicleFleetsGet(this.vin) : []
    }
  },
  mounted () {
    this.init()
    const autocompleteInput = this.$refs.fleetAutocomplete.$refs.input
    autocompleteInput.addEventListener('focus', this.onFocus, true)
    autocompleteInput.focus()
  },
  methods: {
    ...mapActions({
      fleetsSummonAction: FLEETS_SUMMON,
      vehicleFleetAddAction: VEHICLE_FLEET_ADD
    }),
    init () {
      this.fleetsSummon()
    },
    onFocus (e) {
      // opens the fleet menu on focus
      this.$refs.fleetAutocomplete.isMenuActive = true
    },
    async fleetsSummon () {
      const componentSelf = this
      await this.fleetsSummonAction({ componentSelf })
    },
    async vehicleFleetAdd () {
      const componentSelf = this
      const vin = this.vin
      const fleetObjects = this.fleetObjects

      for (const fleet of fleetObjects) {
        const id = fleet.id
        const payload = {
          vin,
          id,
          body: {}
        }
        await this.vehicleFleetAddAction({ componentSelf, payload })
        this.$emit('fleet-add-vehicle-complete')
      }
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle-fleet-add-container {
    h3 {
          margin-bottom: 20px;
          margin-top:20px;
          white-space: nowrap;
        }
    .controls{
      display: flex;
      flex-direction: column
    }
  }
}
</style>
