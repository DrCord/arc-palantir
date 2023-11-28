<template>
  <div class="vehicle-container">
    <div class="vehicle">
      <v-container class="top">
        <v-row>
          <v-col cols="12">
            <h2 v-if="!vehicle && !loading" class="problem">Unable to load vehicle data</h2>
          </v-col>
        </v-row>
        <v-row>
          <vehicle-status-cards :vin="vin"/>
        </v-row>
      </v-container>
      <v-card>
        <v-tabs
          v-model="activeTab"
          :show-arrows="isMobile"
          :vertical="!isMobile"
        >
          <v-tab>Alarms</v-tab>
          <v-tab>Authorities</v-tab>
          <v-tab>Firmware</v-tab>
          <v-tab>Fleets</v-tab>
          <v-tab v-show="operatorControlsVehicle">Location</v-tab>
          <v-tab>Managed Sessions</v-tab>
          <v-tab>Notes</v-tab>
          <v-tab>Parts</v-tab>
          <v-tab>PIN</v-tab>
          <v-tab>Recalls</v-tab>
          <v-tab>Registration</v-tab>
          <v-tab>Telemetry</v-tab>
          <v-tabs-slider color="arcimoto-blue" />
          <v-tabs-items v-model="activeTab">
            <v-tab-item>
              <vehicle-alarms :vin="vin" />
            </v-tab-item>
            <v-tab-item>
              <vehicle-authorities :vin="vin" />
            </v-tab-item>
            <v-tab-item>
              <vehicle-firmware :vin="vin" />
            </v-tab-item>
            <v-tab-item>
              <vehicle-fleets :vin="vin" />
            </v-tab-item>
            <v-tab-item>
              <vehicle-locations :vins="vins" />
            </v-tab-item>
            <v-tab-item>
              <vehicle-managed-sessions :vin="vin" />
            </v-tab-item>
            <v-tab-item>
              <vehicle-notes :vin="vin" />
            </v-tab-item>
            <v-tab-item>
              <vehicle-parts-installed :vin="vin" />
            </v-tab-item>
            <v-tab-item>
              <vehicle-pin :vin="vin" />
            </v-tab-item>
            <v-tab-item>
              <vehicle-recalls :vin="vin" />
            </v-tab-item>
            <v-tab-item>
              <vehicle-registration :vin="vin" />
            </v-tab-item>
            <v-tab-item class="telemetry">
              <v-container fluid class="top-panels">
                <v-row>
                  <vehicle-telemetry-cards :vin="vin"/>
                </v-row>
              </v-container>
              <vehicle-telemetry-settings :vin="vin" />
              <vehicle-telemetry-config :vin="vin" />
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-card>
    </div>
    <context-bar-toggle
      :visible="operatorCanAccessContextMenu"
      @context-bar-visible="toggleContextBar"
    />
    <context-bar
      :content-type="contextBarContentType"
      :width="contextBarWidth"
      :vin="vin"
      :visible="contextBarVisible"
      :vehicle-model-release="vehicleModelRelease"
      @change-context="changeContext"
      @close-context="closeContextBar"
      @context-bar-visible="toggleContextBar($event)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_FLEETS_TOGGLE_MEMBERSHIP,
  ACCESS_MANAGED_SESSIONS_ADMIN,
  ACCESS_VEHICLE_DELIVER,
  ACCESS_VEHICLE_SERVICE,
  ACCESS_VEHICLE_TELEMETRY_BACKFILL,
  ACCESS_VEHICLE_OPTIONS,
  ACCESS_VEHICLE_QUALITY,
  ACCESS_VEHICLE_TELEMETRY_CONFIGURATION,
  ACCESS_VEHICLE_TOKEN_SIGN,
  ACCESS_VEHICLES_GPS_RECORD_SET,
  LOADING,
  OPERATOR_CONTROLS_VEHICLE,
  OPERATOR_PREFERENCE,
  OPERATOR_VINS,
  VEHICLE,
  VEHICLE_LOADED,
  VEHICLE_MANAGED_SESSION_MODE,
  VEHICLE_MODEL,
  VEHICLE_MODEL_RELEASE
} from '@/store/getter-types'

import ContextBarToggle from '@/components/ContextBarToggle.vue'
import ContextBar from '@/components/Vehicles/VehicleContextBar/ContextBar.vue'
import VehicleAlarms from './VehicleAlarms.vue'
import VehicleAuthorities from './VehicleAuthorities.vue'
import VehicleFirmware from './VehicleFirmware.vue'
import VehicleFleets from './VehicleFleets.vue'
import VehicleLocations from './VehicleLocations.vue'
import VehicleManagedSessions from './VehicleManagedSessions.vue'
import VehicleNotes from './VehicleNotes.vue'
import VehiclePartsInstalled from './VehiclePartsInstalled.vue'
import VehiclePin from './VehiclePin.vue'
import VehicleRecalls from './VehicleRecalls.vue'
import VehicleRegistration from './VehicleRegistration.vue'
import VehicleStatusCards from '@/components/Vehicles/VehicleStatusCards.vue'
import VehicleTelemetryCards from '@/components/Vehicles/VehicleTelemetryCards.vue'
import VehicleTelemetryConfig from './VehicleTelemetryConfig.vue'
import VehicleTelemetrySettings from './VehicleTelemetrySettings.vue'
import VehicleInfo from '@/mixins/VehicleInfo.js'
import VehicleTabData from '@/mixins/VehicleTabData.js'

export default {
  name: 'VehicleComponent',
  components: {
    ContextBar,
    ContextBarToggle,
    VehicleAlarms,
    VehicleAuthorities,
    VehicleFirmware,
    VehicleFleets,
    VehicleLocations,
    VehicleManagedSessions,
    VehicleNotes,
    VehiclePartsInstalled,
    VehiclePin,
    VehicleRecalls,
    VehicleRegistration,
    VehicleStatusCards,
    VehicleTelemetryCards,
    VehicleTelemetryConfig,
    VehicleTelemetrySettings
  },
  mixins: [VehicleInfo, VehicleTabData],
  props: {
    vin: {
      default: null,
      type: String
    },
    quickLinkAction: {
      default: null,
      type: Object
    }
  },
  data () {
    return {
      contextBarContentType: null,
      contextBarVisible: false,
      contextBarWidth: null,
      vehicleMangedSessionMode: false
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      operatorCanBackfillTelemetry: ACCESS_VEHICLE_TELEMETRY_BACKFILL,
      operatorCanDeliverVehicle: ACCESS_VEHICLE_DELIVER,
      operatorCanQualityCheckVehicle: ACCESS_VEHICLE_QUALITY,
      operatorCanServiceVehicle: ACCESS_VEHICLE_SERVICE,
      operatorCanSetGpsRecord: ACCESS_VEHICLES_GPS_RECORD_SET,
      operatorCanSetOptions: ACCESS_VEHICLE_OPTIONS,
      operatorCanSetTelemetryConfiguration: ACCESS_VEHICLE_TELEMETRY_CONFIGURATION,
      operatorCanSignToken: ACCESS_VEHICLE_TOKEN_SIGN,
      operatorCanToggleFleetMembership: ACCESS_FLEETS_TOGGLE_MEMBERSHIP,
      operatorControlsVehicleGet: OPERATOR_CONTROLS_VEHICLE,
      operatorIsManagedSessionsAdmin: ACCESS_MANAGED_SESSIONS_ADMIN,
      operatorPreference: OPERATOR_PREFERENCE,
      operatorVins: OPERATOR_VINS,
      vehicleGet: VEHICLE,
      vehicleLoadedGet: VEHICLE_LOADED,
      vehicleMangedSessionModeGet: VEHICLE_MANAGED_SESSION_MODE,
      vehicleModelGet: VEHICLE_MODEL,
      vehicleModelReleaseGet: VEHICLE_MODEL_RELEASE
    }),
    activeTab: {
      set (val) {
        const query = { ...this.$route.query }
        query.tab = this.vehicleTabs[val]
        this.$router.replace({ query: query })
      },
      get () {
        const requestedTab = this.$route.query.tab
        let requestedTabIndex = -1
        if (requestedTab) {
          requestedTabIndex = this.requestedTabIndexGet(requestedTab)
        }
        return requestedTabIndex !== -1 ? requestedTabIndex : this.vehicleTabs[0]
      }
    },
    isMobile () {
      return this.$isMobile()
    },
    operatorCanAccessContextMenu () {
      // check using an OR for each action/permission-set in the context menu
      return this.operatorCanBackfillTelemetry ||
             this.operatorCanDeliverVehicle ||
             this.operatorCanQualityCheckVehicle ||
             this.operatorCanServiceVehicle ||
             this.operatorCanSetGpsRecord ||
             this.operatorCanSetOptions ||
             this.operatorCanSetTelemetryConfiguration ||
             this.operatorCanSignToken ||
             this.operatorCanToggleFleetMembership ||
             (this.operatorIsManagedSessionsAdmin && this.operatorControlsVehicle && this.vehicleMangedSessionMode)
    },
    operatorControlsVehicle () {
      return this.vin ? this.operatorControlsVehicleGet(this.vin) : null
    },
    vins () {
      return this.vin ? [this.vin] : []
    }
  },
  watch: {
    vehicleLoaded: {
      handler (newVal) {
        if (newVal) {
          this.vehicleMangedSessionMode = this.vehicleMangedSessionModeGet(this.vin)
        }
      },
      immediate: true
    },
    quickLinkAction: {
      handler: function (newVal) {
        this.changeContext({ contentType: newVal.quick })
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    changeContext (event) {
      this.contextBarVisible = true
      this.contextBarContentType = event.contentType
      if (event.width) {
        this.contextBarWidth = event.width
      }
    },
    closeContextBar () {
      this.toggleContextBar(false)
    },
    init () {
      const pref = this.operatorPreference('default_vehicle_tab')
      if (pref && 'value' in pref) {
        this.activeTab = this.requestedTabIndexGet(pref.value)
      }
    },
    requestedTabIndexGet (requestedTabName) {
      return this.vehicleTabs.findIndex(item => item === requestedTabName)
    },
    toggleContextBar (visible, contentType = null) {
      this.contextBarVisible = visible
      this.contextBarContentType = contentType
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle-container {
    h2 {
      margin-bottom: 10px;
      font-size: 1.5rem;
      &.problem {
        color: red;
      }
    }
    h2, h4 {
      text-align: left;
    }
    .vehicle {
      .vin {
        margin-bottom: 0;
        margin-top: 0;
        white-space: nowrap;
      }
      h3 {
        margin-top: 10px;
        text-align: left;
      }
      .top-panels {
        padding-left: 0;
        padding-right: 0;
      }
      .authorities {
        display: flex;
        padding-inline-start: 0;
        list-style: none;
        .authority {
          padding-right: 3px;
          &:after {
            content: ', ';
          }
          &:last-of-type::after {
            content: '';
          }
        }
      }
      .top {
        h3 {
          font-size: 1.1rem;
          padding-left: 10px;
          text-align: left;
        }
      }
    }
  }
}
</style>

<style lang="scss">
#app {
  .vehicle-container {
    .v-data-table {
      margin-bottom: 20px;
    }
  }
  &.mobile {
    .vehicle-container {
      .v-tabs-items {
        h3 {
          text-align: center;
        }
        .filter-container {
          padding-left: 20px;
        }
        .vehicle-firmware-status {
          border-bottom: 1px solid #333;
          padding-bottom: 20px;
          margin-left: 20px;
          text-align: center;
        }
      }
    }
  }
}
</style>
