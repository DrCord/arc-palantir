<template>
  <div class="recall-vehicle-service-container">
    <h3>Service Recalled Vehicles</h3>
    <div v-if="availableVehicles.length">
      <vue-form :state="formstate" @submit.prevent>
        <vins-select-form-field
          allow-load-from-csv-file
          allow-select-all
          :vins-available="availableVehicles"
          :vins-selected="model.selectedVins"
          @vins-updated="vinsUpdated"
        />

        <div class="service-reference form-field">
          <div class="field">
            <div class="label">
              <label for="serviceReference">Service Reference</label>
              <v-text-field
                id="service-reference"
                v-model="model.serviceReference"
                name="serviceReference"
                type="text"
                outlined
                hide-details="auto"
              />
            </div>
          </div>
        </div>

        <div class="service-date-menu">
          <v-menu
            v-model="serviceDateMenu"
            name="serviceDateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :nudge-top="40"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <div class="service-date form-field">
                <div class="field">
                  <div class="label">
                    <validate tag="div" class="service-date">
                      <label for="serviceDate">Service Date</label>
                        <v-text-field
                          id="service-date"
                          v-model="model.serviceDate"
                          name="serviceDate"
                          readonly
                          outlined
                          prepend-inner-icon="event"
                          v-on="on"
                        ></v-text-field>
                    </validate>
                  </div>
                </div>
              </div>
            </template>
            <v-date-picker
              v-model="model.serviceDate"
              name="serviceDatePicker"
              locale="en-in"
              no-title
              @input="serviceDateMenu = false"
            ></v-date-picker>
          </v-menu>
        </div>

        <div class="btn-container">
          <v-btn
            class="cancel"
            color="error"
            dark
            @click="vehiclesServiceCancel"
          >Cancel<v-icon>mdi-close-circle</v-icon>
          </v-btn>
          <v-btn
            class="save"
            color="success"
            type="button"
            :disabled="!model.selectedVins.length"
            @click="recallVehiclesService"
          >Mark Serviced<v-icon>mdi-progress-wrench</v-icon>
          </v-btn>
        </div>
      </vue-form>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
      <h4 v-else>No vehicles available to service</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  RECALL_VEHICLES_SERVICE,
  VEHICLES_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  RECALL,
  RECALL_VEHICLES
} from '@/store/getter-types'

import utilityLib from '@/lib/utility'

import VinsSelectFormField from '@/components/Vehicles/VinsSelectFormField.vue'

export default {
  name: 'RecallVehiclesService',
  components: {
    VinsSelectFormField
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
      model: {
        selectedVins: [],
        serviceDate: null,
        serviceReference: null
      },
      serviceDateMenu: false
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      recallGet: RECALL,
      recallVehiclesGet: RECALL_VEHICLES
    }),
    availableVehicles () {
      const serviceableVehicles = this.recallVehicles.filter(this.isServiceable)
      return serviceableVehicles
    },
    recall () {
      return this.recallId ? this.recallGet(this.recallId) : {}
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
      recallVehiclesServiceAction: RECALL_VEHICLES_SERVICE,
      vehiclesSummonAction: VEHICLES_SUMMON
    }),
    formatDate (date) {
      function padTo2Digits (num) {
        return num.toString().padStart(2, '0')
      }
      return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate())
      ].join('-')
    },
    init () {
      this.vehiclesSummon()
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      this.model.serviceDate = this.formatDate(now)
    },
    isServiceable (vin) {
      const recallVehicle = this.recall.vehicles.find(recallVehicle => {
        return recallVehicle.vin === vin
      })
      return !recallVehicle.serviceDate
    },
    async recallVehiclesService () {
      const componentSelf = this
      const { model, recallId } = this
      const { selectedVins, serviceDate, serviceReference } = model
      const payload = {
        recallId,
        body: {
          vins: selectedVins,
          service_reference: serviceReference,
          service_date: serviceDate.concat(' 12:00:00')
        }
      }
      await this.recallVehiclesServiceAction({ componentSelf, payload })
      this.$emit('vehicles-service-complete')
    },
    setSelectedVins (vins) {
      this.model.selectedVins = vins
    },
    vehiclesServiceCancel () {
      this.$emit('vehicles-service-cancel')
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

<style scoped lang="scss">
#app {
  .recall-vehicle-service-container {
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
