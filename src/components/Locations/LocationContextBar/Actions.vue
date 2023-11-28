<template>
  <div class="quick-actions-container">
    <h3>Location Actions</h3>
    <v-list>
      <v-list-item v-if="operatorCanDeleteLocation">
        <v-btn
          :disabled="locationId === 1"
          @click="deleteLocation">
          Delete
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanEditLocation || createdByOperator">
        <v-btn @click="editLocation">
          Edit
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanEditLocation">
        <v-btn @click="manageLocationCode">
          Link Location Code
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLES_SUMMON } from '@/store/action-types'
import {
  VEHICLES_LIST,
  VEHICLES_WITH_LOCATIONS_LIST
} from '@/lib/constants'
import {
  ACCESS_LOCATIONS_ADMIN,
  LOCATION,
  OPERATOR_USERNAME,
  VEHICLES
} from '@/store/getter-types'

export default {
  name: 'LocationActions',
  props: {
    locationId: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      locationGet: LOCATION,
      operatorCanDeleteLocation: ACCESS_LOCATIONS_ADMIN,
      operatorCanEditLocation: ACCESS_LOCATIONS_ADMIN,
      operatorUsername: OPERATOR_USERNAME,
      vehicles: VEHICLES
    }),
    createdByOperator () {
      return this.operatorUsername === this.location.createdBy
    },
    locationHasAllVehicles () {
      return this.vehicles.length && this.vehicles.length === this.locationVins.length
    },
    locationHasNoVehicles () {
      return !this.locationVins.length
    },
    location () {
      return this.locationId ? this.locationGet(this.locationId) : {}
    },
    locationVins () {
      return this.locationId ? this.locationVinsGet(this.locationId) : []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      vehiclesSummonAction: VEHICLES_SUMMON
    }),
    init () {
      this.vehiclesSummon()
    },
    changePanel (contentType) {
      this.$emit('change-panel', { contentType })
    },
    deleteLocation () {
      this.changePanel('location-delete')
    },
    editLocation () {
      this.changePanel('location-edit')
    },
    grantVehicleAccess () {
      this.changePanel('grant-vehicle-access')
    },
    manageLocationCode () {
      this.changePanel('location-code-manage')
    },
    revokeVehicleAccess () {
      this.changePanel('revoke-vehicle-access')
    },
    vehiclesSummon () {
      const componentSelf = this
      const { operatorCanAccessVehicles, operatorCanAccessVehiclesWithLocations } = this
      let listType = 'fleets'
      if (operatorCanAccessVehiclesWithLocations) {
        listType = VEHICLES_WITH_LOCATIONS_LIST
      } else if (operatorCanAccessVehicles) {
        listType = VEHICLES_LIST
      }
      this.vehiclesSummonAction({ componentSelf, listType })
    }
  }
}
</script>
