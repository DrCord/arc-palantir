<template>
  <div class="quick-actions-container">
    <h3>Recall Actions</h3>
    <v-list>
      <v-list-item v-if="operatorCanDeleteRecall">
        <v-btn
          :disabled="!!recall.remedy"
          @click="deleteRecall">
          Recall - Delete
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanEditRecall">
        <v-btn @click="editRecall">
          Recall - Edit
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanCreateRemedy">
        <v-btn
          :disabled="!!recall.remedy"
          @click="createRemedy"
        >Remedy - Create
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanDeleteRemedy">
        <v-btn
          :disabled="!recall.remedy || recallHasServicedVehicles"
          @click="deleteRemedy"
        >Remedy - Delete
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanEditRemedy">
        <v-btn
          :disabled="!recall.remedy"
          @click="editRemedy"
        >Remedy - Edit
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanAddVehicle">
        <v-btn
          :disabled="recallHasAllVehicles"
          @click="addVehicle"
        >Vehicle - Add
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanEditVehicle">
        <v-btn
          :disabled="!recall.remedy || recallHasNoVehiclesToEdit"
          @click="editVehicle"
        >Vehicle - Edit
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanRemoveVehicle">
        <v-btn
          :disabled="recallHasNoVehicles"
          @click="removeVehicle"
        >Vehicle - Remove
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanServiceVehicle">
        <v-btn
          :disabled="!recall.remedy || recallHasNoVehiclesToService"
          @click="serviceVehicle"
        >Vehicle - Service
        </v-btn>
      </v-list-item>
      <template v-if="operatorCanAddVehicles || operatorCanServiceVehicles">
        <v-list-item>
          <v-divider></v-divider>
        </v-list-item>
        <v-list-item>
          <h4>Batch Operations</h4>
        </v-list-item>
        <v-list-item v-if="operatorCanAddVehicles">
          <v-btn
            :disabled="recallHasAllVehicles"
            @click="addVehicles"
          >Vehicles - Add
          </v-btn>
        </v-list-item>
        <v-list-item v-if="operatorCanServiceVehicles">
          <v-btn
            :disabled="!recall.remedy || recallHasNoVehiclesToService"
            @click="serviceVehicles"
          >Vehicles - Service
          </v-btn>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_RECALL_ADMIN,
  ACCESS_RECALL_CREATE,
  ACCESS_VEHICLE_SERVICE,
  RECALL,
  RECALL_VEHICLES,
  VINS
} from '@/store/getter-types'
export default {
  name: 'RecallsActions',
  props: {
    recallId: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      operatorCanAddVehicle: ACCESS_RECALL_ADMIN,
      operatorCanAddVehicles: ACCESS_RECALL_ADMIN,
      operatorCanCreateRemedy: ACCESS_RECALL_CREATE,
      operatorCanDeleteRecall: ACCESS_RECALL_ADMIN,
      operatorCanDeleteRemedy: ACCESS_RECALL_ADMIN,
      operatorCanEditRecall: ACCESS_RECALL_CREATE,
      operatorCanEditRemedy: ACCESS_RECALL_CREATE,
      operatorCanEditVehicle: ACCESS_RECALL_ADMIN,
      operatorCanRemoveVehicle: ACCESS_RECALL_ADMIN,
      operatorCanServiceVehicle: ACCESS_VEHICLE_SERVICE,
      operatorCanServiceVehicles: ACCESS_RECALL_ADMIN,
      recallGet: RECALL,
      recallVehiclesGet: RECALL_VEHICLES,
      vins: VINS
    }),
    recall () {
      return this.recallId ? this.recallGet(this.recallId) : {}
    },
    recallHasAllVehicles () {
      return this.recallId ? this.recallVehicles.length === this.vins.length : null
    },
    recallHasNoVehicles () {
      return this.recallId ? this.recallVehicles.length === 0 : null
    },
    recallHasNoVehiclesToEdit () {
      return this.recallVehicles ? this.servicedVehicles.length === 0 : null
    },
    recallHasNoVehiclesToService () {
      return this.recallVehicles ? this.serviceableVehicles.length === 0 : null
    },
    recallHasServicedVehicles () {
      return this.recallVehicles ? this.servicedVehicles.length > 0 : null
    },
    recallVehicles () {
      return this.recallId ? this.recallVehiclesGet(this.recallId) : []
    },
    serviceableVehicles () {
      const serviceableVehicles = this.recallVehicles.filter(this.isServiceable)
      return serviceableVehicles
    },
    servicedVehicles () {
      const servicedVehicles = this.recallVehicles.filter(recallVehicle => {
        return !this.serviceableVehicles.includes(recallVehicle)
      })
      return servicedVehicles
    }
  },
  methods: {
    addVehicle () {
      this.changePanel('vehicle-add')
    },
    addVehicles () {
      this.changePanel('vehicles-add')
    },
    changePanel (contentType) {
      this.$emit('change-panel', { contentType })
    },
    createRemedy () {
      this.changePanel('remedy-create')
    },
    deleteRecall () {
      this.changePanel('recall-delete')
    },
    deleteRemedy () {
      this.changePanel('remedy-delete')
    },
    editRecall () {
      this.changePanel('recall-edit')
    },
    editRemedy () {
      this.changePanel('remedy-edit')
    },
    editVehicle () {
      this.changePanel('vehicle-edit')
    },
    isServiceable (vin) {
      const recallVehicle = this.recall.vehicles.find(recallVehicle => {
        return recallVehicle.vin === vin
      })
      return !recallVehicle.serviceDate
    },
    removeVehicle () {
      this.changePanel('vehicle-remove')
    },
    serviceVehicle () {
      this.changePanel('vehicle-service')
    },
    serviceVehicles () {
      this.changePanel('vehicles-service')
    }
  }
}
</script>
