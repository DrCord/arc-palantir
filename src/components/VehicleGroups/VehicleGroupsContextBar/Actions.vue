<template>
  <div class="quick-actions-container">
    <h3>Vehicle Groups Actions</h3>
    <v-list>
      <v-list-item v-if="operatorCanCreateVehicleGroup">
        <v-btn @click="createVehicleGroup">
          Create Vehicle Group
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanDeleteVehicleGroup">
        <v-btn @click="deleteVehicleGroup">
          Delete Vehicle Group
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanAddDepartmentCode">
        <v-btn @click="addDepartmentCode">
          Add Department Code
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanDeleteDepartmentCode">
        <v-btn @click="deleteDepartmentCode">
          Delete Department Code
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanAddDepartmentCode">
        <v-btn
          @click="departmentCodeManage"
        >Manage Department Codes
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_FLEETS_ADMIN,
  ACCESS_FLEETS_MANAGER
} from '@/store/getter-types'

export default {
  name: 'VehicleGroupsActions',
  computed: {
    ...mapGetters({
      operatorCanCreateVehicleGroup: ACCESS_FLEETS_MANAGER,
      operatorCanDeleteVehicleGroup: ACCESS_FLEETS_ADMIN,
      operatorCanAddDepartmentCode: ACCESS_FLEETS_ADMIN,
      operatorCanDeleteDepartmentCode: ACCESS_FLEETS_ADMIN
    })
  },
  methods: {
    changePanel (contentType) {
      this.$emit('change-panel', { contentType })
    },
    createVehicleGroup () {
      this.changePanel('vehicle-group-create')
    },
    deleteVehicleGroup () {
      this.changePanel('vehicle-group-delete')
    },
    departmentCodeManage () {
      this.changePanel('department-code-manage')
    },
    addDepartmentCode () {
      this.changePanel('department-code-create')
    },
    deleteDepartmentCode () {
      this.changePanel('department-code-delete')
    }
  }
}
</script>
