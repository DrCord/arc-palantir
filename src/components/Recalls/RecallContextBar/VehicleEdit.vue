<template>
  <div class="recall-vehicle-edit-container">
    <h3>Edit Vehicle</h3>
    <vue-form :state="formstate" @submit.prevent>
      <vin-select-form-field
        :input-vins="availableVins"
        :vin="vin"
        @value-updated="updateVin"
      />

      <div class="service-reference form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="service-reference">
              <label for="serviceReference">Service Reference</label>
              <v-text-field
                id="service-reference"
                v-model="model.serviceReference"
                name="serviceReference"
                type="text"
                outlined
                hide-details
              />
            </validate>
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
          @click="vehicleEditCancel"
        >Cancel<v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <v-btn
          class="save"
          color="success"
          type="button"
          :disabled="!vin || formstate.$pristine || formstate.$invalid"
          @click="recallVehicleEdit"
        >Update Record<v-icon>mdi-update</v-icon>
        </v-btn>
      </div>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  RECALL_VEHICLE_EDIT
} from '@/store/action-types'
import {
  ENVIRONMENT_VIN_PREFIX,
  LOADING,
  RECALL,
  RECALL_VEHICLES
} from '@/store/getter-types'

import dateUtility from '@/lib/dateUtility'
import utilityLib from '@/lib/utility'

import VinSelectFormField from '@/components/Vehicles/VinSelectFormField.vue'

export default {
  name: 'RecallVehicleEdit',
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
      serviceDateMenu: false,
      vin: null,
      dateTime: null,
      model: {
        serviceReference: null,
        serviceDate: null
      }
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      recallGet: RECALL,
      recallVehiclesGet: RECALL_VEHICLES,
      vinPrefix: ENVIRONMENT_VIN_PREFIX
    }),
    availableVehicles () {
      const editableVehicles = this.recallVehicles.filter(this.isEditable)
      return editableVehicles
    },
    availableVins () {
      return this.availableVehicles
    },
    prefixedVin () {
      const { vinPrefix, vin } = this
      return `${vinPrefix}${vin}`
    },
    recall () {
      return this.recallId ? this.recallGet(this.recallId) : {}
    },
    recallVehicles () {
      return this.recallId ? this.recallVehiclesGet(this.recallId).sort(utilityLib.sortByVIN) : []
    },
    selectedVehicle () {
      if (this.vin) {
        const selectedVehicle = this.recall.vehicles.find(vehicle => { return vehicle.vin === this.prefixedVin })
        return selectedVehicle
      } else {
        return null
      }
    }
  },
  watch: {
    selectedVehicle: {
      handler (newVal, oldVal) {
        if (newVal) {
          if (this.selectedVehicle) {
            this.model.serviceReference = this.selectedVehicle.serviceReference
            this.model.serviceDate = this.formatDate(this.selectedVehicle.serviceDate)
          }
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
      recallVehicleEditAction: RECALL_VEHICLE_EDIT
    }),
    init () {
      if (this.requestedVin) {
        this.vin = this.requestedVin.replace(this.vinPrefix, '')
      }
    },
    formatDate (date) {
      return dateUtility.formatDateIso(date)
    },
    isEditable (vin) {
      const recallVehicle = this.recall.vehicles.find(recallVehicle => {
        return recallVehicle.vin === vin
      })
      return !!recallVehicle.serviceDate
    },
    async recallVehicleEdit () {
      const componentSelf = this
      const vin = this.prefixedVin
      const { recallId } = this
      const vehicleId = this.selectedVehicle.id
      const serviceDate = this.model.serviceDate
      const startDate = this.formatDate(this.selectedVehicle.serviceDate)
      if (serviceDate === startDate) {
        this.dateTime = this.selectedVehicle.serviceDate
      } else {
        this.dateTime = serviceDate.concat(' 12:00:00')
      }
      const payload = {
        recallId,
        vehicleId,
        vin,
        body: {
          service_reference: this.model.serviceReference,
          service_date: this.dateTime
        }
      }
      await this.recallVehicleEditAction({ componentSelf, payload })
      this.$emit('vehicle-edit-complete')
    },
    updateVin (event) {
      this.vin = event.val
    },
    vehicleEditCancel () {
      this.$emit('vehicle-edit-cancel')
    },
    async vehiclesSummon () {
      const componentSelf = this
      await this.vehiclesSummonAction({ componentSelf })
    }
  }
}
</script>

<style lang="scss">
#app {
  .recall-vehicle-edit-container {
    width: 100%;
    h3 {
      margin-bottom: 20px;
    }
    .btn-container {
      margin-top: 10px;
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
