<template>
  <div v-if='fleet' class="fleet">
    <v-card>
      <v-card-title>
        <h3>Name: {{ fleet.name }}</h3>
      </v-card-title>
      <v-card-text>
        <div class="info-container">
          <h3>Fleet Id: {{ fleetId }}</h3>
          <h3>Insurance Reporting Type: {{ fleetTypeDisplay || 'None' }}</h3>
          <h3 v-if="fleet.code">Department: {{fleet.code}}  {{fleet.description}}</h3>
        </div>
        <div class="vin-container">
          <h4>Vehicles in Fleet</h4>
          <vins-list :vins="fleetVehicles" />
        </div>
        <div class="users-container">
          <h4>Users in Fleet</h4>
          <users-list :users="fleetUsers" />
        </div>
        <div v-if='fleetLocation' class="location-container">
          <h4>Location</h4>
          <location-display-card :location-id="fleetLocation" />
        </div>
      </v-card-text>
    </v-card>
    <context-bar-toggle
      :visible="operatorCanAccessContextMenu"
      @context-bar-visible="toggleContextBar"
    />
    <context-bar
      :content-type="contextBarContentType"
      :visible="contextBarVisible"
      :fleet-id="fleetId"
      @change-context="changeContext"
      @close-context="closeContextBar"
      @context-bar-visible="toggleContextBar($event)"
      @department-code-manage-cancel="toggleContextBar(true)"
      @department-code-manage-complete="toggleContextBar(true)"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { OPERATOR_FLEETS_SUMMON, USERS_SUMMON } from '@/store/action-types'
import {
  ACCESS_FLEET_SUPERVISOR,
  ACCESS_FLEETS_ADMIN,
  ACCESS_FLEETS_MANAGER,
  FLEET,
  FLEET_LOADED,
  FLEET_LOCATION_ID,
  FLEET_TYPE,
  FLEET_USERS,
  FLEET_VEHICLES,
  LOADING,
  OPERATOR_IN_FLEET,
  OPERATOR_LOADED,
  USERS
} from '@/store/getter-types'

import ContextBar from '@/components/VehicleGroups/VehicleGroupContextBar/ContextBar.vue'
import ContextBarToggle from '@/components/ContextBarToggle.vue'
import LocationDisplayCard from '@/components/Locations/LocationDisplayCard.vue'
import UsersList from '@/components/Users/UsersList.vue'
import VinsList from '@/components/Vehicles/VinsList.vue'

export default {
  name: 'VehicleGroup',
  components: {
    ContextBar,
    ContextBarToggle,
    LocationDisplayCard,
    UsersList,
    VinsList
  },
  props: {
    fleetId: {
      default: null,
      type: Number
    }
  },
  data: () => ({
    contextBarContentType: null,
    contextBarVisible: false,
    fleetLocation: null,
    fleetType: null,
    fleetUsers: [],
    fleetVehicles: []
  }),
  computed: {
    ...mapGetters({
      fleetGet: FLEET,
      fleetLoadedGet: FLEET_LOADED,
      fleetLocationGet: FLEET_LOCATION_ID,
      fleetTypeGet: FLEET_TYPE,
      fleetUsersGet: FLEET_USERS,
      fleetVehiclesGet: FLEET_VEHICLES,
      loading: LOADING,
      operatorCanToggleFleetMembership: ACCESS_FLEET_SUPERVISOR,
      operatorInFleetGet: OPERATOR_IN_FLEET,
      operatorIsFleetsAdmin: ACCESS_FLEETS_ADMIN,
      operatorIsFleetsManager: ACCESS_FLEETS_MANAGER,
      operatorLoaded: OPERATOR_LOADED,
      users: USERS
    }),
    fleet () {
      return this.fleetId ? this.fleetGet(this.fleetId) : null
    },
    fleetLoaded () {
      return this.fleetId ? this.fleetLoadedGet(this.fleetId) : []
    },
    fleetTypeDisplay () {
      const { fleetType } = this
      return fleetType ? fleetType.charAt(0).toUpperCase() + fleetType.slice(1) : null
    },
    operatorCanAccessContextMenu () {
      // this should check using an OR for each item/permission in the context menu
      return (this.operatorCanToggleFleetMembership && this.operatorInFleet) ||
             this.operatorIsFleetsManager ||
             this.operatorIsFleetsAdmin
    },
    operatorInFleet () {
      return this.fleetId && this.operatorLoaded ? this.operatorInFleetGet(this.fleetId) : null
    }
  },
  watch: {
    fleetLoaded: {
      handler (newVal) {
        if (newVal && this.fleetId) {
          this.fleetLocationSet()
          this.fleetTypeSet()
          this.fleetVehiclesSet()
          this.usersSummon()
          this.fleetUsersSet()
        }
      },
      immediate: true
    },
    loading: {
      handler (newVal) {
        if (newVal === false) {
          this.fleetLocationSet()
          this.fleetTypeSet()
          this.fleetVehiclesSet()
          this.fleetUsersSet()
        }
      },
      immediate: true
    },
    operatorLoaded: {
      handler (newVal) {
        if (newVal) {
          this.operatorFleetsSummon()
        }
      },
      immediate: true
    },
    users: {
      handler (newVal) {
        if (newVal && newVal.length > 1) {
          this.fleetUsersSet()
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      operatorFleetsSummonAction: OPERATOR_FLEETS_SUMMON,
      usersSummonAction: USERS_SUMMON
    }),
    changeContext (event) {
      this.contextBarVisible = true
      this.contextBarContentType = event.contentType
    },
    closeContextBar () {
      this.toggleContextBar(false)
    },
    fleetLocationSet () {
      this.fleetLocation = this.fleetLocationGet(this.fleetId)
    },
    fleetTypeSet () {
      this.fleetType = this.fleetTypeGet(this.fleetId)
    },
    fleetUsersSet () {
      const filtered = this.fleetUsersGet(this.fleetId)
        .filter(username => this.users.find(x => x.username === username))
      this.fleetUsers = filtered
    },
    fleetVehiclesSet () {
      this.fleetVehicles = this.fleetVehiclesGet(this.fleetId)
    },
    init () {
      this.usersSummon()
    },
    async operatorFleetsSummon () {
      const componentSelf = this
      await this.operatorFleetsSummonAction({ componentSelf })
    },
    async usersSummon () {
      const componentSelf = this
      await this.usersSummonAction({ componentSelf })
    },
    toggleContextBar (visible, contentType = null) {
      this.contextBarVisible = visible
      this.contextBarContentType = contentType
    },
    vehicleLinkObject (vin) {
      return {
        name: 'vehicle',
        params: { vin }
      }
    },
    userLinkObject (username) {
      return {
        name: 'user',
        params: { username }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  .fleet {
    .info-container {
      margin: auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      text-align: left;
      h3 {
        color: rgba(0, 0, 0, 0.87);
        text-align: left;
      }
    }
    h4 {
      text-align: left;
      color: rgba(0, 0, 0, 0.87);
      margin-top: 15px;
    }
    .vin-container {
      ul {
        list-style: none;
      }
      .vin-list {
        display: grid;
        grid-column-gap: 10px;
        grid-row-gap: 5px;
        @media screen and (max-width: 600px) {
          grid-template-columns: 1fr;
        }
        @media screen and (min-width: 600px) {
          grid-template-columns: repeat(2, 1fr);
        }
        @media screen and (min-width: 900px) {
          grid-template-columns: repeat(3, 1fr);
        }
        @media screen and (min-width: 1200px) {
          grid-template-columns: repeat(4, 1fr);
        }
      }
    }
    .users-container {
      ul {
        list-style: none
      }
      .users-list {
        display: grid;
        grid-column-gap: 10px;
        grid-row-gap: 5px;
         @media screen and (max-width: 600px) {
          grid-template-columns: 1fr;
        }
        @media screen and (min-width: 600px) {
          grid-template-columns: repeat(2, 1fr);
        }
        @media screen and (min-width: 900px) {
          grid-template-columns: repeat(3, 1fr);
        }
        @media screen and (min-width: 1200px) {
          grid-template-columns: repeat(4, 1fr);
        }
      }
      .location-container {
        justify-content: left;
      }
    }
  }
  &.theme--dark {
    .fleet {
      .info-container {
        h3 {
          color: #fff
        }
      }
      h4 {
        color: #fff
      }
    }
  }
}
</style>
