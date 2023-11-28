<template>
  <div class="recall-vehicle-add-container">
    <h3>Add Vehicle to Recall</h3>
    <vue-form :state="formstate" @submit.prevent>
      <vin-select-form-field
        :input-vins="availableVins"
        :vin="vin"
        @value-updated="updateVin"
      />
      <div class="btn-container">
        <v-btn
          class="cancel"
          color="error"
          dark
          @click="vehicleAddCancel"
        >Cancel<v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <v-btn
          class="save"
          color="success"
          type="button"
          :disabled="!vin"
          @click="recallVehicleAdd"
        >Add Vehicle<v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </div>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  RECALL_VEHICLE_ADD,
  VEHICLES_SUMMON
} from '@/store/action-types'
import {
  ENVIRONMENT_VIN_PREFIX,
  LOADING,
  RECALL_VEHICLES,
  VINS
} from '@/store/getter-types'
import VinSelectFormField from '@/components/Vehicles/VinSelectFormField.vue'

export default {
  name: 'RecallVehicleAdd',
  components: {
    VinSelectFormField
  },
  props: {
    recallId: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      formstate: {},
      vin: null
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      recallVehiclesGet: RECALL_VEHICLES,
      vinPrefix: ENVIRONMENT_VIN_PREFIX,
      vins: VINS
    }),
    availableVehicles () {
      const vehicles = this.vins.filter(vin => {
        return !this.recallVehicles.includes(vin)
      })
      vehicles.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      return vehicles
    },
    availableVins () {
      return this.availableVehicles
    },
    prefixedVin () {
      const { vinPrefix, vin } = this
      return `${vinPrefix}${vin}`
    },
    recallVehicles () {
      return this.recallId ? this.recallVehiclesGet(this.recallId) : []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      recallVehicleAddAction: RECALL_VEHICLE_ADD,
      vehiclesSummonAction: VEHICLES_SUMMON
    }),
    init () {
      this.vehiclesSummon()
    },
    async recallVehicleAdd () {
      const componentSelf = this
      const vin = this.prefixedVin
      const { recallId } = this
      const payload = {
        recallId,
        vin,
        body: {
          vins: [vin]
        }
      }
      await this.recallVehicleAddAction({ componentSelf, payload })
      this.$emit('vehicle-add-complete')
    },
    updateVin (event) {
      this.vin = event.val
    },
    vehicleAddCancel () {
      this.$emit('vehicle-add-cancel')
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
  .recall-vehicle-add-container {
    width: 100%;
    h3 {
      margin-bottom: 20px;
    }
    .btn-container {
      margin-top: 0px;
      margin-bottom: 50px;
      display: flex;
      justify-content: flex-end;
      button {
        margin-left: 20px;
        &:first-of-type {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
