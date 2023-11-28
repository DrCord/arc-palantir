<template>
  <div class="vehicle">
    <page-header
      :title=vin
      :subtitle=vehicleModelInfo
      :quick-links="quickLinksLocal"
      @quick-link-event="handleQuickLink"
    />
    <div class="vehicle-container content-container">
      <vehicle-component
        :vin="vin"
        :quick-link-action="quickLink"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEETS_SUMMON,
  OPERATOR_FLEETS_SUMMON,
  VEHICLE_SUMMON,
  VEHICLES_MODEL_RELEASES_SUMMON
} from '@/store/action-types'
import {
  ACCESS_MANAGED_SESSIONS_ADMIN,
  ACCESS_RECALLS,
  ACCESS_VEHICLES,
  ACCESS_VEHICLES_GPS_RECORD,
  ACCESS_VEHICLE_PROVISION,
  ACCESS_VEHICLES_WITH_AUTHORITIES,
  LOADING,
  OPERATOR,
  OPERATOR_LOADED,
  VEHICLE_LOADED,
  VEHICLE_MODEL,
  VEHICLE_MODEL_RELEASE,
  VEHICLES,
  VINS
} from '@/store/getter-types'

import PageHeader from '@/components/PageHeader.vue'
import VehicleComponent from '@/components/Vehicles/Vehicle.vue'
import VehicleInfo from '@/mixins/VehicleInfo.js'
import VehicleTabData from '@/mixins/VehicleTabData.js'

import utility from '@/lib/utility'

export default {
  name: 'VehicleView',
  components: {
    PageHeader,
    VehicleComponent
  },
  mixins: [VehicleInfo, VehicleTabData],
  data () {
    return {
      vin: null,
      quickLink: null
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      operator: OPERATOR,
      operatorCanAccessManagedSessions: ACCESS_MANAGED_SESSIONS_ADMIN,
      operatorCanAccessRecalls: ACCESS_RECALLS,
      operatorCanAccessVehicles: ACCESS_VEHICLES,
      operatorCanAccessVehiclesGps: ACCESS_VEHICLES_GPS_RECORD,
      operatorCanAccessVehiclesWithAuthorities: ACCESS_VEHICLES_WITH_AUTHORITIES,
      operatorCanProvisionVehicle: ACCESS_VEHICLE_PROVISION,
      operatorLoaded: OPERATOR_LOADED,
      vehicleLoadedGet: VEHICLE_LOADED,
      vehicleModelGet: VEHICLE_MODEL,
      vehicleModelReleaseGet: VEHICLE_MODEL_RELEASE,
      vehicles: VEHICLES,
      vins: VINS
    }),
    quickLinksLocal () {
      var links = []
      if (this.operatorCanProvisionVehicle) {
        links = [
          { text: 'Re-Provision', emit: 'vehicle-reprovision' }
        ]
      }
      return links
    }
  },
  watch: {
    vins: {
      handler (newVal) {
        if (newVal.length) {
          this.getData()
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
      fleetsSummonAction: FLEETS_SUMMON,
      operatorFleetsSummonAction: OPERATOR_FLEETS_SUMMON,
      vehicleSummonAction: VEHICLE_SUMMON,
      vehiclesModelReleasesSummonAction: VEHICLES_MODEL_RELEASES_SUMMON
    }),
    init () {
      if (!this.$route.params.vin) {
        this.redirectToVehicles()
      }
    },
    getData () {
      if (this.operatorLoaded && this.vins.length) {
        this.dataSummon()
      }
    },
    handleQuickLink (quick) {
      this.quickLink = { quick: quick }
    },
    async dataSummon () {
      const {
        operator,
        operatorFleetsSummonAction,
        vehicleSummon,
        vins
      } = this

      const componentSelf = this
      const incomingVin = this.$route.params.vin
      await operatorFleetsSummonAction({ componentSelf, operator })
      if (vins.includes(incomingVin)) {
        vehicleSummon(incomingVin)
      } else {
        const toastPayload = {
          msg: `VIN ${incomingVin} unavailable`,
          icon: 'error'
        }
        this.$emit('toast', toastPayload)
        this.redirectToVehicles()
      }
    },
    async vehicleSummon (vin) {
      const componentSelf = this
      const {
        operatorCanAccessVehicles,
        operatorCanAccessVehiclesWithAuthorities,
        operatorCanAccessVehiclesGps,
        operatorCanAccessRecalls,
        operatorCanAccessManagedSessions,
        vehicleSummonAction,
        vehiclesModelReleasesSummonAction
      } = this

      const getTypes = ['notes']
      if (operatorCanAccessVehicles) getTypes.push('vehicle')
      if (operatorCanAccessVehiclesWithAuthorities) getTypes.push('authorities')
      if (operatorCanAccessVehiclesGps) getTypes.push('gps')
      if (operatorCanAccessRecalls) getTypes.push('recalls')
      if (operatorCanAccessManagedSessions) getTypes.push('managed-sessions')

      await vehicleSummonAction({ componentSelf, vin, getTypes })
      this.vin = vin
      const force = false
      await vehiclesModelReleasesSummonAction({ componentSelf, force })
    },
    redirectToVehicles () {
      utility.redirect(this, 'vehicles')
    }
  }
}
</script>

<style lang="scss">
#app {
  .vehicle {
    h2 {
      margin-bottom: 10px;
    }
  }
}
</style>
