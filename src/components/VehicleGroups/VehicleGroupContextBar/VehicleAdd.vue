<template>
  <div class="fleet-vehicle-add-container">
    <h3>Add Vehicle to Fleet</h3>
    <div v-if="availableVins.length">
      <vue-form :state="formstate" @submit.prevent>
        <vin-select-form-field
          :input-vins="availableVins"
          :vin="model.vin"
          @value-updated="updateVin"
        />
        <v-btn
          :disabled="!model.vin"
          color=success
          @click="vehicleFleetAdd"
        >Add Vehicle</v-btn>
      </vue-form>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
      <h4 v-else>No vehicles available to add to fleet</h4>
    </div>
  </div>
</template>

<script>
import VinSelectFormField from '@/components/Vehicles/VinSelectFormField.vue'

import { mapActions, mapGetters } from 'vuex'
import {
  FLEET_VEHICLE_ADD,
  VEHICLES_SUMMON
} from '@/store/action-types'
import {
  ENVIRONMENT_VIN_PREFIX,
  FLEET_VEHICLES,
  LOADING,
  VEHICLES
} from '@/store/getter-types'

export default {
  name: 'VehicleFleetAdd',
  components: {
    VinSelectFormField
  },
  props: {
    fleetId: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      formstate: {},
      model: {
        vin: null
      }
    }
  },
  computed: {
    ...mapGetters({
      fleetVehiclesGet: FLEET_VEHICLES,
      loading: LOADING,
      vehicles: VEHICLES,
      vinPrefix: ENVIRONMENT_VIN_PREFIX
    }),
    availableVehicles () {
      const vehicles = this.vehicles.filter(vehicle => {
        return !this.fleetVehicles.includes(vehicle.vin)
      })
      vehicles.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      return vehicles
    },
    availableVins () {
      return this.availableVehicles.map(vehicle => vehicle.vin)
    },
    fleetVehicles () {
      return this.fleetId && !this.loading ? this.fleetVehiclesGet(this.fleetId) : []
    },
    prefixedVin () {
      const { vinPrefix, model } = this
      return `${vinPrefix}${model.vin}`
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      fleetVehicleAddAction: FLEET_VEHICLE_ADD,
      vehiclesSummonAction: VEHICLES_SUMMON
    }),
    init () {
      this.vehiclesSummon()
    },
    updateVin (event) {
      this.model.vin = event.val
    },
    async vehicleFleetAdd () {
      const componentSelf = this
      const vin = this.prefixedVin
      const { fleetId } = this
      const payload = {
        vin,
        fleetId,
        body: {}
      }
      await this.fleetVehicleAddAction({ componentSelf, payload })
      this.$emit('fleet-add-vehicle-complete')
    },
    async vehiclesSummon () {
      const componentSelf = this
      await this.vehiclesSummonAction({ componentSelf })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .context-menu {
    .v-list-item {
      .fleet-vehicle-add-container {
        width: 100%;
        h3 {
          margin-bottom: 20px;
        }
        button {
          float: right;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
