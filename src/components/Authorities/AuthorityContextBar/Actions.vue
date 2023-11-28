<template>
  <div class="quick-actions-container">
    <h3>Authority Actions</h3>
    <v-list>
      <v-list-item v-if="operatorCanDeleteAuthority">
        <v-btn @click="deleteAuthority">
          Delete
        </v-btn>
      </v-list-item>
      <v-list-item v-if="!authorityHasAllVehicles && operatorCanGrantVehicleAccess">
        <v-btn @click="grantVehicleAccess">
          Grant Vehicle Access
        </v-btn>
      </v-list-item>
      <v-list-item v-if="!authorityHasNoVehicles && operatorCanRevokeVehicleAccess">
        <v-btn @click="revokeVehicleAccess">
          Revoke Vehicle Access
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
  VEHICLES_WITH_AUTHORITIES_LIST
} from '@/lib/constants'
import {
  ACCESS_AUTHORITIES_ADMIN,
  ACCESS_VEHICLES,
  ACCESS_VEHICLES_WITH_AUTHORITIES,
  AUTHORITY,
  AUTHORITY_VINS,
  VEHICLES
} from '@/store/getter-types'

export default {
  name: 'AuthorityActions',
  props: {
    authorityId: {
      type: [Number, String],
      default: null
    }
  },
  computed: {
    ...mapGetters({
      authorityGet: AUTHORITY,
      authorityVinsGet: AUTHORITY_VINS,
      operatorCanAccessVehicles: ACCESS_VEHICLES,
      operatorCanAccessVehiclesWithAuthorities: ACCESS_VEHICLES_WITH_AUTHORITIES,
      operatorCanDeleteAuthority: ACCESS_AUTHORITIES_ADMIN,
      operatorCanGrantVehicleAccess: ACCESS_AUTHORITIES_ADMIN,
      operatorCanRevokeVehicleAccess: ACCESS_AUTHORITIES_ADMIN,
      vehicles: VEHICLES
    }),
    authorityHasAllVehicles () {
      return this.vehicles.length && this.vehicles.length === this.authorityVins.length
    },
    authorityHasNoVehicles () {
      return !this.authorityVins.length
    },
    authority () {
      return this.authorityId ? this.authorityGet(this.authorityId) : {}
    },
    authorityVins () {
      return this.authorityId ? this.authorityVinsGet(this.authorityId) : []
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
    deleteAuthority () {
      this.changePanel('authority-delete')
    },
    grantVehicleAccess () {
      this.changePanel('grant-vehicle-access')
    },
    revokeVehicleAccess () {
      this.changePanel('revoke-vehicle-access')
    },
    vehiclesSummon () {
      const componentSelf = this
      const { operatorCanAccessVehicles, operatorCanAccessVehiclesWithAuthorities } = this
      let listType = 'fleets'
      if (operatorCanAccessVehiclesWithAuthorities) {
        listType = VEHICLES_WITH_AUTHORITIES_LIST
      } else if (operatorCanAccessVehicles) {
        listType = VEHICLES_LIST
      }
      this.vehiclesSummonAction({ componentSelf, listType })
    }
  }
}
</script>
