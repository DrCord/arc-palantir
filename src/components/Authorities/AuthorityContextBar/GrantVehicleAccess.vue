<template>
  <div class="authority-grant-vehicle-access-container">
    <h3>Grant Vehicle Access</h3>
    <div v-if="!authorityHasAllVehicles" class="form">
      <v-select
          v-model="vin"
          :items="availableVehicles"
          outlined
        ></v-select>

      <div class="btn-container">
        <v-btn
          class="save"
          color="success"
          type="button"
          @click="grantVehicleAccess"
        >Grant Access<v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </div>
    <div v-else>
      <p>Authority has access to all vehicles</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  AUTHORITY_GRANT_VEHICLE_ACCESS,
  VEHICLES_SUMMON
} from '@/store/action-types'
import {
  VEHICLES_LIST,
  VEHICLES_WITH_AUTHORITIES_LIST
} from '@/lib/constants'
import {
  ACCESS_VEHICLES,
  ACCESS_VEHICLES_WITH_AUTHORITIES,
  AUTHORITY,
  AUTHORITY_VINS,
  VINS
} from '@/store/getter-types'

export default {
  name: 'GrantVehicleAccess',
  props: {
    authorityId: {
      default: null,
      type: [Number, String]
    }
  },
  data () {
    return {
      vin: null
    }
  },
  computed: {
    ...mapGetters({
      authorityGet: AUTHORITY,
      authorityVinsGet: AUTHORITY_VINS,
      operatorCanAccessVehicles: ACCESS_VEHICLES,
      operatorCanAccessVehiclesWithAuthorities: ACCESS_VEHICLES_WITH_AUTHORITIES,
      vins: VINS
    }),
    authority () {
      return this.authorityId ? this.authorityGet(this.authorityId) : {}
    },
    authorityHasAllVehicles () {
      return this.vins.length && this.vins.length === this.authorityVins.length
    },
    authorityVins () {
      return this.authorityId ? this.authorityVinsGet(this.authorityId) : []
    },
    availableVehicles () {
      if (!this.authorityVins) {
        return this.vins
      }
      // check against authority vins
      const vins = this.vins
        .filter(vehicleVin => {
          return !this.authorityVins.filter(authorityVin => authorityVin === vehicleVin).length
        })
      return vins
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      authorityGrantVehicleAccessAction: AUTHORITY_GRANT_VEHICLE_ACCESS,
      vehiclesSummonAction: VEHICLES_SUMMON
    }),
    init () {
      this.vehiclesSummon()
    },
    grantVehicleAccess () {
      const componentSelf = this
      const { authorityId, vin } = this
      const payload = {
        authorityId,
        vin,
        body: {}
      }
      this.authorityGrantVehicleAccessAction({ componentSelf, payload })
        .then(() => {
          this.$emit('authority-grant-vehicle-access-complete')
        })
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

<style scoped lang="scss">
#app {
  .authority-grant-vehicle-access-container {
    h3 {
      margin-bottom: 20px;
    }
    .btn-container {
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
