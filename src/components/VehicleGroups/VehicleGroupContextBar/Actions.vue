<template>
  <div class="quick-actions-container">
    <h3>Fleet Actions</h3>
    <v-list>
      <v-list-item v-if="operatorIsFleetsAdmin">
        <v-btn
          :disabled="fleetIsArcimoto"
          color="info"
          @click="fleetUpdate"
        >Rename Fleet
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorIsFleetsAdmin">
        <v-btn
          :disabled="fleetIsArcimoto"
          color="info"
          @click="typeSet"
        >Insurance Reporting Type - Set
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorIsFleetsAdmin">
        <v-btn
          :disabled="fleetIsArcimoto"
          color="info"
          @click="locationSet"
        >Location - Set
        </v-btn>
      </v-list-item>
        <v-list-item v-if="operatorIsFleetsAdmin">
        <v-btn
          color="info"
          @click="departmentCodeManage"
        >Manage Department Code
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanToggleFleetMembership">
        <v-btn
          :disabled="fleetHasAllUsers || fleetIsArcimoto"
          color="success"
          @click="userAdd"
        >User - Add<v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanToggleFleetMembership">
        <v-btn
          :disabled="fleetHasNoUsers || fleetIsArcimoto"
          color="error"
          @click="userRemove"
        >User - Remove<v-icon>mdi-minus-circle</v-icon>
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanToggleFleetMembership">
        <v-btn
          :disabled="fleetHasAllVehicles || fleetIsArcimoto"
          color="success"
          @click="vehicleAdd"
        >Vehicle - Add<v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanToggleFleetMembership">
        <v-btn
          :disabled="fleetHasNoVehicles || fleetIsArcimoto"
          color="error"
          @click="vehicleRemove">
          Vehicle - Remove<v-icon>mdi-minus-circle</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_FLEET_SUPERVISOR,
  ACCESS_FLEETS_ADMIN,
  ACCESS_FLEETS_MANAGER,
  FLEET_USERS,
  FLEET_VEHICLES,
  USERS,
  VEHICLES
} from '@/store/getter-types'

export default {
  name: 'VehicleGroupActions',
  props: {
    fleetId: {
      default: null,
      type: Number
    }
  },
  computed: {
    ...mapGetters({
      fleetUsersGet: FLEET_USERS,
      fleetVehiclesGet: FLEET_VEHICLES,
      operatorCanCreateFleet: ACCESS_FLEETS_MANAGER,
      operatorCanToggleFleetMembership: ACCESS_FLEET_SUPERVISOR,
      operatorIsFleetsAdmin: ACCESS_FLEETS_ADMIN,
      users: USERS,
      vehicles: VEHICLES
    }),
    fleetHasAllUsers () {
      return this.fleetId ? this.fleetUsers.length === this.users.length : null
    },
    fleetHasAllVehicles () {
      return this.fleetId ? this.fleetVehicles.length === this.vehicles.length : null
    },
    fleetIsArcimoto () {
      return this.fleetId ? this.fleetId === 1 : null
    },
    fleetHasNoUsers () {
      return this.fleetId ? this.fleetUsers.length === 0 : null
    },
    fleetHasNoVehicles () {
      return this.fleetId ? this.fleetVehicles.length === 0 : null
    },
    fleetUsers () {
      return this.fleetId ? this.fleetUsersGet(this.fleetId) : []
    },
    fleetVehicles () {
      return this.fleetId ? this.fleetVehiclesGet(this.fleetId) : []
    }
  },
  methods: {
    changePanel (contentType) {
      this.$emit('change-panel', { contentType })
    },
    departmentCodeManage () {
      this.changePanel('department-code-manage')
    },
    locationSet () {
      this.changePanel('location-set')
    },
    typeSet () {
      this.changePanel('type-set')
    },
    fleetUpdate () {
      this.changePanel('fleet-update')
    },
    userAdd () {
      this.changePanel('user-add')
    },
    userRemove () {
      this.changePanel('user-remove')
    },
    vehicleAdd () {
      this.changePanel('vehicle-add')
    },
    vehicleRemove () {
      this.changePanel('vehicle-remove')
    }
  }
}
</script>

<style lang="scss">
#app {
  .quick-actions-container {
    .v-btn {
      .v-icon {
        padding-left: 5px;
      }
    }
  }
}
</style>
