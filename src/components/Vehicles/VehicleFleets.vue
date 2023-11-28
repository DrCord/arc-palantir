<template>
  <div class="fleets-container">
    <h3>Fleets</h3>
    <ul class="fleets">
      <li
        v-for="fleet in sortedFleets"
        :key="fleet.id"
        class="fleet"
      >
        <router-link
          v-if="operatorCanAccessFleetsGroups || operatorFleets.find(e => e.id === fleet)"
          :to="linkFleetObject(fleets.length ? fleet.id : fleet)"
        >{{ fleets.length ? fleet.id : fleet }}
          <span v-if="fleet.name"> - {{ fleet.name }}</span>
          <span v-else-if="operatorFleets.find(e => e.id === fleet)"> - {{ operatorFleets.find(e => e.id === fleet).name }}</span>
        </router-link>
        <span v-else>{{ fleet }}</span>
      </li>
    </ul>
    <div v-if="!loading && vehicleLoaded">
      <h4>Fleet Determined Location</h4>
      <div
        v-if="vehicleHasNoFleetsLocation === false && vehicleHasMultipleFleetsLocations === false"
        class="single-fleets-locations"
      >
        <p>{{ vehicleFleetsLocations[0] ? locationGet(vehicleFleetsLocations[0]).locationName : null }}</p>
      </div>
      <div
        v-else-if="vehicleHasMultipleFleetsLocations === true"
        class="multiple-fleets-locations"
      >
        <h5>Error: Multiple Fleet Determined Locations</h5>
        <ul>
          <li v-for="locationId in vehicleFleetsLocations" :key="locationId">{{ locationId }} - {{ locationGet(locationId).locationName }}</li>
        </ul>
      </div>
      <div
        v-else
        class="no-fleets-locations"
      >
        <p>None</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEET_SUMMON,
  FLEETS_SUMMON,
  LOCATIONS_SUMMON
} from '@/store/action-types'
import {
  ACCESS_FLEETS_GROUPS,
  FLEETS,
  LOADING,
  LOCATION,
  LOCATIONS,
  OPERATOR_FLEETS,
  OPERATOR_VINS,
  VEHICLE_FLEETS,
  VEHICLE_FLEETS_LOCATIONS,
  VEHICLE_LOADED
} from '@/store/getter-types'

export default {
  name: 'VehicleFleets',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      vehicleFleets: [],
      vehicleFleetsLocations: []
    }
  },
  computed: {
    ...mapGetters({
      fleets: FLEETS,
      loading: LOADING,
      locationGet: LOCATION,
      locations: LOCATIONS,
      operatorCanAccessFleetsGroups: ACCESS_FLEETS_GROUPS,
      operatorFleets: OPERATOR_FLEETS,
      operatorVins: OPERATOR_VINS,
      vehicleFleetsGet: VEHICLE_FLEETS,
      vehicleFleetsLocationGet: VEHICLE_FLEETS_LOCATIONS,
      vehicleLoadedGet: VEHICLE_LOADED
    }),
    sortedFleets () {
      if (!this.fleets.length) {
        return this.vehicleFleets
      }
      return this.vehicleFleets.map(vehicleFleet => {
        return this.fleets.find(fleetFromStore => fleetFromStore.id === vehicleFleet)
      })
    },
    vehicleHasNoFleetsLocation () {
      return this.vehicleFleetsLocations.length === 0
    },
    vehicleHasMultipleFleetsLocations () {
      return this.vehicleFleetsLocations.length > 1
    },
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : null
    }
  },
  watch: {
    loading: {
      handler (newVal) {
        if (!newVal && this.vehicleLoaded) {
          this.vehicleFleetsLocationSet()
        }
      },
      immediate: true
    },
    operatorCanAccessFleetsGroups: {
      handler (newVal) {
        if (newVal) {
          this.fleetsSummon()
          this.locationsSummon()
        }
      },
      immediate: true
    },
    vehicleLoaded: {
      handler (newVal) {
        if (newVal) {
          this.vehicleFleetsSet()
          this.vehicleFleets
            .filter(e => e !== 1)
            .forEach(fleetId => {
              this.fleetSummon(fleetId)
            })
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      fleetSummonAction: FLEET_SUMMON,
      fleetsSummonAction: FLEETS_SUMMON,
      locationsSummonAction: LOCATIONS_SUMMON
    }),
    linkFleetObject (id) {
      const operatorHasFleetAccess = (fleetId) => {
        for (let i = 0; i < this.operatorFleets.length; i++) {
          if (this.operatorFleets[i].id === fleetId) {
            return true
          }
        }
      }
      const linkObject = {}
      if (this.operatorVins.includes(this.vin) && operatorHasFleetAccess(id)) {
        linkObject.name = 'fleet'
        linkObject.params = {
          fleetId: id
        }
      } else {
        linkObject.name = 'vehicle-group'
        linkObject.params = {
          groupId: id
        }
      }
      return linkObject
    },
    async fleetSummon (fleetId) {
      const componentSelf = this
      await this.fleetSummonAction({ componentSelf, payload: { fleetId } })
    },
    async fleetsSummon () {
      const componentSelf = this
      const force = true
      await this.fleetsSummonAction({ componentSelf, force })
    },
    async locationsSummon () {
      const componentSelf = this
      const force = false
      this.locationsSummonAction({ componentSelf, force })
    },
    vehicleFleetsSet () {
      this.vehicleFleets = this.vin ? this.vehicleFleetsGet(this.vin) : []
    },
    vehicleFleetsLocationSet () {
      this.vehicleFleetsLocations = this.vin ? this.vehicleFleetsLocationGet(this.vin) : []
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle {
    .fleets-container {
      h3 {
        text-align: left;
      }
      .fleets {
        padding-inline-start: 0;
        .fleet {
          padding-right: 3px;
        }
      }
      h4 {
        text-align: left;
      }
      h5 {
        color: red;
        font-size: 1.1rem;
        padding-left: 10px;
      }
      .multiple-fleets-locations {
        ul {
          padding-left: 10px;
        }
      }
      .single-fleets-locations,
      .no-fleets-locations {
        p {
          padding-left: 10px;
        }
      }
    }
  }
}

</style>
