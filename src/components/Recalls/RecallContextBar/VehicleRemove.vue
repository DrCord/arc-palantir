<template>
  <div class="recall-vehicle-remove-container">
    <h3>Remove Vehicle from Recall</h3>
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
          @click="vehicleRemoveCancel"
        >Cancel<v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <v-btn
          class="save"
          color="success"
          type="button"
          :disabled="!vin"
          @click="recallVehicleRemove"
        >Remove Vehicle<v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </div>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  RECALL_VEHICLE_REMOVE,
  VEHICLES_SUMMON
} from '@/store/action-types'
import {
  ENVIRONMENT_VIN_PREFIX,
  LOADING,
  RECALL_VEHICLES
} from '@/store/getter-types'

import utilityLib from '@/lib/utility'

import VinSelectFormField from '@/components/Vehicles/VinSelectFormField.vue'

export default {
  name: 'RecallVehicleRemove',
  components: {
    VinSelectFormField
  },
  props: {
    recallId: {
      default: null,
      type: Number
    },
    requestedVin: {
      default: null,
      type: String
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
      recallVehiclesGet: RECALL_VEHICLES,
      loading: LOADING,
      vinPrefix: ENVIRONMENT_VIN_PREFIX
    }),
    availableVins () {
      return this.recallVehicles
    },
    prefixedVin () {
      const { vinPrefix, vin } = this
      return `${vinPrefix}${vin}`
    },
    recallVehicles () {
      return this.recallId ? this.recallVehiclesGet(this.recallId).sort(utilityLib.sortByVIN) : []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      recallVehicleRemoveAction: RECALL_VEHICLE_REMOVE,
      vehiclesSummonAction: VEHICLES_SUMMON
    }),
    init () {
      if (this.requestedVin) {
        this.vin = this.requestedVin.replace(this.vinPrefix, '')
      }
      this.vehiclesSummon()
    },
    async recallVehicleRemove () {
      const componentSelf = this
      const vin = this.prefixedVin
      const { recallId } = this
      const payload = {
        recallId,
        vin,
        body: {}
      }
      await this.recallVehicleRemoveAction({ componentSelf, payload })
      this.$emit('vehicle-remove-complete')
    },
    updateVin (event) {
      this.vin = event.val
    },
    vehicleRemoveCancel () {
      this.$emit('vehicle-remove-cancel')
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
  .recall-vehicle-remove-container {
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
