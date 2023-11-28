<template>
  <div class="recall-vehicles-add-container">
    <h3>Add Vehicles to Recall</h3>
    <div v-if="availableVehicles.length">
      <vue-form :state="formstate" @submit.prevent>
        <vins-select-form-field
          allow-load-from-csv-file
          allow-select-all
          :vins-available="availableVehicles"
          :vins-selected="selectedVins"
          @vins-updated="vinsUpdated"
        />
        <div class="btn-container">
          <v-btn
            class="cancel"
            color="error"
            dark
            @click="vehiclesAddCancel"
          >Cancel<v-icon>mdi-close-circle</v-icon>
          </v-btn>
          <v-btn
            class="save"
            color="success"
            type="button"
            :disabled="!selectedVins"
            @click="recallVehiclesAdd"
          >Add to Recall<v-icon>mdi-plus-circle</v-icon>
          </v-btn>
        </div>
      </vue-form>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
      <h4 v-else>No vehicles available to add to recall</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  RECALL_VEHICLES_ADD,
  VEHICLES_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  RECALL_VEHICLES,
  VINS
} from '@/store/getter-types'

import VinsSelectFormField from '@/components/Vehicles/VinsSelectFormField.vue'

export default {
  name: 'RecallVehiclesAdd',
  components: {
    VinsSelectFormField
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
      selectedVins: []
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      recallVehiclesGet: RECALL_VEHICLES,
      vins: VINS
    }),
    availableVehicles () {
      const vehicles = this.vins.filter(selectedVins => {
        return !this.recallVehicles.includes(selectedVins)
      })
      vehicles.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0))
      return vehicles
    },
    icon () {
      if (this.allAvailableVehiclesSelected) return 'mdi-close-box'
      if (this.someAvailableVehiclesSelected) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    recallVehicles () {
      return this.recallId ? this.recallVehiclesGet(this.recallId) : []
    },
    allAvailableVehiclesSelected () {
      return this.selectedVins.length === this.availableVehicles.length
    },
    someAvailableVehiclesSelected () {
      return this.selectedVins.length > 0 && !this.allAvailableVehiclesSelected
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      recallVehiclesAddAction: RECALL_VEHICLES_ADD,
      vehiclesSummonAction: VEHICLES_SUMMON
    }),
    init () {
      this.vehiclesSummon()
    },
    async recallVehiclesAdd () {
      const componentSelf = this
      const { recallId, selectedVins } = this
      const payload = {
        recallId,
        body: {
          vins: selectedVins
        }
      }
      await this.recallVehiclesAddAction({ componentSelf, payload })
      this.$emit('vehicles-add-complete')
    },
    selectAllToggle () {
      this.$nextTick(() => {
        if (this.allAvailableVehiclesSelected) {
          this.selectedVins = []
        } else {
          this.selectedVins = this.availableVehicles.slice()
        }
      })
    },
    setSelectedVins (vins) {
      this.selectedVins = vins
    },
    vehiclesAddCancel () {
      this.$emit('vehicles-add-cancel')
    },
    async vehiclesSummon () {
      const componentSelf = this
      await this.vehiclesSummonAction({ componentSelf })
    },
    vinsUpdated (vins) {
      this.setSelectedVins(vins)
    }
  }
}
</script>

<style lang="scss">
#app {
  .recall-vehicles-add-container {
    width: 100%;
    .select-all {
      margin-left: 10px;
      .v-list-item__action {
        margin-left: 0;
      }
    }
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
        .v-icon {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
