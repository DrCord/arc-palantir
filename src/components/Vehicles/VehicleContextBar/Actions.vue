<template>
  <div class="quick-actions-container">
    <h3>Vehicle Actions</h3>
    <v-list>
      <v-list-item v-if="vehicleGovernorAllowed && operatorCanSetOptions">
        <v-btn
          :disabled="loading"
          @click="governorSet"
        >Speed Governor - Set
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanServiceVehicle">
        <v-btn
          :disabled="vehicleFirmwareUpToDate || loading"
          @click="firmwareService"
        >Firmware - Service{{ vehicleFirmwareUpToDate ? ': Up to Date' : null }}
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanToggleFleetMembership">
        <v-btn
          :disabled="vehicleInAllFleets || loading"
          @click="fleetAdd"
        >Fleet - Add
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanToggleFleetMembership">
        <v-btn
          :disabled="vehicleOnlyInArcimotoFleet || loading"
          @click="fleetRemove"
        >Fleet - Remove
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanSetGpsRecord">
        <vehicle-gps-record-save
          :vin="vin"
          @vehicle-gps-record-save-complete="vehicleGpsRecordSaveComplete"
        />
      </v-list-item>
      <v-list-item v-if="vehicleAllowManagedSessionStart">
        <v-btn
          :disabled="loading"
          @click="managedSessionStart"
        >Managed Session: Start
        </v-btn>
      </v-list-item>
      <v-list-item
        v-if="vehicleAllowManagedSessionEnd"
      >
        <managed-session-end
          :vin="vin"
          @vehicle-managed-session-end-complete="managedSessionEndComplete"
        />
      </v-list-item>
      <v-list-item v-if="operatorCanServiceVehicle">
        <v-btn
          :disabled="loading"
          @click="modelReleaseSet"
        >Model Release - Set
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanServiceVehicle">
        <v-btn
          :disabled="loading"
          @click="partInstall"
        >Part - Install
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanQualityCheckVehicle">
        <v-btn
          :disabled="loading"
          @click="qualityCheck"
        >Quality Inspection
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanProvisionVehicle">
        <v-btn
          :disabled="loading"
          @click="reprovision"
          >Re-Provision Vehicle
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanSignToken">
        <v-btn
          :disabled="vehicleHasOnlyArcimotoAuthority || loading"
          @click="signToken"
        >Sign Token
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanBackfillTelemetry">
        <v-btn
          :disabled="loading"
          @click="telemetryBackfill"
        >Telemetry - Backfill
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanSetTelemetryConfiguration">
        <v-btn
          :disabled="loading"
          @click="telemetrySetPoints"
        >Telemetry - Set Reported Points
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { FLEETS_SUMMON } from '@/store/action-types'
import {
  ACCESS_FLEETS_GROUPS,
  ACCESS_FLEETS_TOGGLE_MEMBERSHIP,
  ACCESS_MANAGED_SESSIONS_ADMIN,
  ACCESS_VEHICLE_DELIVER,
  ACCESS_VEHICLE_SERVICE,
  ACCESS_VEHICLE_TELEMETRY_BACKFILL,
  ACCESS_VEHICLE_OPTIONS,
  ACCESS_VEHICLE_PROVISION,
  ACCESS_VEHICLE_QUALITY,
  ACCESS_VEHICLE_TELEMETRY_CONFIGURATION,
  ACCESS_VEHICLE_TOKEN_SIGN,
  ACCESS_VEHICLES_GPS_RECORD_SET,
  FLEETS,
  LOADING,
  OPERATOR_CONTROLS_VEHICLE,
  VEHICLE_AUTHORITIES,
  VEHICLE_FIRMWARE_UP_TO_DATE,
  VEHICLE_FLEETS,
  VEHICLE_GOVERNOR_ALLOWED,
  VEHICLE_LOADED,
  VEHICLE_MANAGED_SESSION_ACTIVE,
  VEHICLE_MANAGED_SESSION_MODE
} from '@/store/getter-types'

import ManagedSessionEnd from '@/components/Vehicles/VehicleContextBar/ManagedSessionEnd.vue'
import VehicleGpsRecordSave from '@/components/Vehicles/VehicleContextBar/VehicleGpsRecordSave.vue'

export default {
  name: 'VehicleActions',
  components: {
    ManagedSessionEnd,
    VehicleGpsRecordSave
  },
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      vehicleManagedSessionMode: false
    }
  },
  computed: {
    ...mapGetters({
      fleets: FLEETS,
      loading: LOADING,
      operatorCanAccessFleetsGroups: ACCESS_FLEETS_GROUPS,
      operatorCanBackfillTelemetry: ACCESS_VEHICLE_TELEMETRY_BACKFILL,
      operatorCanDeliverVehicle: ACCESS_VEHICLE_DELIVER,
      operatorCanProvisionVehicle: ACCESS_VEHICLE_PROVISION,
      operatorCanQualityCheckVehicle: ACCESS_VEHICLE_QUALITY,
      operatorCanServiceVehicle: ACCESS_VEHICLE_SERVICE,
      operatorCanSetGpsRecord: ACCESS_VEHICLES_GPS_RECORD_SET,
      operatorCanSetOptions: ACCESS_VEHICLE_OPTIONS,
      operatorCanSetTelemetryConfiguration: ACCESS_VEHICLE_TELEMETRY_CONFIGURATION,
      operatorCanSignToken: ACCESS_VEHICLE_TOKEN_SIGN,
      operatorCanToggleFleetMembership: ACCESS_FLEETS_TOGGLE_MEMBERSHIP,
      operatorControlsVehicleGet: OPERATOR_CONTROLS_VEHICLE,
      operatorIsManagedSessionsAdmin: ACCESS_MANAGED_SESSIONS_ADMIN,
      vehicleAuthoritiesGet: VEHICLE_AUTHORITIES,
      vehicleFirmwareUpToDateGet: VEHICLE_FIRMWARE_UP_TO_DATE,
      vehicleFleetsGet: VEHICLE_FLEETS,
      vehicleGovernorAllowedGet: VEHICLE_GOVERNOR_ALLOWED,
      vehicleLoadedGet: VEHICLE_LOADED,
      vehicleManagedSessionActiveGet: VEHICLE_MANAGED_SESSION_ACTIVE,
      vehicleManagedSessionModeGet: VEHICLE_MANAGED_SESSION_MODE
    }),
    dataLoaded () {
      return this.vin && this.vehicleLoaded
    },
    operatorControlsVehicle () {
      return this.vin ? this.operatorControlsVehicleGet(this.vin) : null
    },
    vehicleAuthorities () {
      return this.dataLoaded ? this.vehicleAuthoritiesGet(this.vin) : []
    },
    vehicleFirmwareUpToDate () {
      return this.dataLoaded ? this.vehicleFirmwareUpToDateGet(this.vin) : null
    },
    vehicleFleets () {
      return this.dataLoaded ? this.vehicleFleetsGet(this.vin) : []
    },
    vehicleGovernorAllowed () {
      return this.dataLoaded ? this.vehicleGovernorAllowedGet(this.vin) : null
    },
    vehicleHasOnlyArcimotoAuthority () {
      return this.dataLoaded ? this.vehicleAuthorities.length === 1 : null
    },
    vehicleInAllFleets () {
      return this.dataLoaded ? this.vehicleFleets.length === this.fleets.length : null
    },
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : null
    },
    vehicleOnlyInArcimotoFleet () {
      return this.dataLoaded ? this.vehicleFleets.length === 1 : null
    },
    vehicleManagedSessionActive () {
      return this.vin ? this.vehicleManagedSessionActiveGet(this.vin) : null
    },
    vehicleAllowManagedSession () {
      return this.operatorIsManagedSessionsAdmin &&
          this.operatorControlsVehicle &&
          this.vehicleManagedSessionMode
    },
    vehicleAllowManagedSessionEnd () {
      return this.vehicleAllowManagedSession &&
          this.vehicleManagedSessionActive
    },
    vehicleAllowManagedSessionStart () {
      return this.vehicleAllowManagedSession &&
          !this.vehicleManagedSessionActive
    }

  },
  watch: {
    vehicleLoaded: {
      handler (newVal) {
        if (newVal) {
          this.vehicleManagedSessionMode = this.vehicleManagedSessionModeGet(this.vin)
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
      fleetsSummonAction: FLEETS_SUMMON
    }),
    init () {
      if (this.operatorCanAccessFleetsGroups) {
        this.fleetsSummon()
      }
    },
    changePanel (contentType, width = '400px') {
      this.$emit('change-panel', { contentType, width })
    },
    deliverVehicle () {
      this.changePanel('vehicle-deliver')
    },
    firmwareService () {
      this.changePanel('vehicle-firmware-service')
    },
    fleetAdd () {
      this.changePanel('vehicle-fleet-add')
    },
    fleetRemove () {
      this.changePanel('vehicle-fleet-remove')
    },
    async fleetsSummon () {
      const componentSelf = this
      await this.fleetsSummonAction({ componentSelf })
    },
    gpsRecordSet () {
      this.changePanel('vehicle-gps-record-set')
    },
    governorSet () {
      this.changePanel('vehicle-governor-set')
    },
    managedSessionEndComplete () {
      this.$emit('vehicle-managed-session-end-complete')
    },
    managedSessionStartComplete () {
      this.$emit('vehicle-managed-session-start-complete')
    },
    managedSessionStart () {
      this.changePanel('vehicle-managed-session-start')
    },
    modelReleaseSet () {
      this.changePanel('vehicle-model-release-set')
    },
    partInstall () {
      this.changePanel('vehicle-part-install')
    },
    reprovision () {
      this.changePanel('vehicle-reprovision')
    },
    qualityCheck () {
      this.changePanel('vehicle-quality-check')
    },
    signToken () {
      this.changePanel('vehicle-token-sign')
    },
    telemetryBackfill () {
      this.changePanel('vehicle-telemetry-backfill')
    },
    telemetrySetPoints () {
      this.changePanel('vehicle-telemetry-set-points', '520px')
    },
    vehicleGpsRecordSaveComplete () {
      this.$emit('vehicle-gps-record-save-complete')
    }
  }
}
</script>
