<template>
  <v-navigation-drawer
    v-model="active"
    app
    class="context-menu"
    :hide-overlay="!contextBarOutsideClickClose"
    right
    :stateless="!contextBarOutsideClickClose"
    temporary
    :width="width ? width : '400px'"
    @input="outsideClickCloseEmit"
  >
    <v-list-item>
      <v-icon large @click="$emit('context-bar-visible', false)">mdi-close</v-icon>
    </v-list-item>
    <v-list-item v-if="visible && !contentType">
      <actions
        :vin="vin"
        @change-panel="changeContext"
        @vehicle-gps-record-save-complete="closeContext"
        @vehicle-managed-session-end-complete="closeContext"
        @vehicle-managed-session-start-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-governor-set'">
      <vehicle-governor-save
        :vin="vin"
        @vehicle-configuration-governor-save-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-deliver'">
      <p>Deliver Vehicle Component Placeholder</p>
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-firmware-service'">
      <firmware-service
        :vin="vin"
        @vehicle-firmware-service-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-fleet-add'">
      <fleet-add
        :vin="vin"
        @fleet-add-vehicle-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-fleet-remove'">
      <fleet-remove
        :vin="vin"
        @fleet-remove-vehicle-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-managed-session-start'">
      <managed-session-start
        :vin="vin"
        @managed-session-start-cancel="closeContext"
        @managed-session-start-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-model-release-set'">
      <model-release-set
        :vin="vin"
        @vehicle-model-release-set-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-part-install'">
      <part-set
        :vin="vin"
        @vehicle-part-set-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-reprovision'">
      <vehicle-re-provision
        :re-provision-vin="vin"
        :vehicle-model-release="vehicleModelRelease"
        @change-context="changeContext"
        @close-context="closeContext"
        @reprovision-complete="reprovisionComplete"
    />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-quality-check'">
      <quality-inspect
        :vin="vin"
        @vehicle-quality-check-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-token-sign'">
      <token-sign
        :vin="vin"
        @vehicle-sign-token-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-telemetry-backfill'">
      <telemetry-backfill
        :vin="vin"
        @vehicle-telemetry-backfill-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-telemetry-set-points'">
      <telemetry-points-config-set
        :vin="vin"
        @config-set-cancel="closeContext"
        @vehicle-telemetry-points-config-complete="closeContext"
      />
    </v-list-item>
    <v-list nav> </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  OPERATOR_LOADED,
  OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE
} from '@/store/getter-types'

import Actions from '@/components/Vehicles/VehicleContextBar/Actions.vue'
import FirmwareService from '@/components/Vehicles/VehicleContextBar/FirmwareService.vue'
import FleetAdd from '@/components/Vehicles/VehicleContextBar/FleetAdd.vue'
import FleetRemove from '@/components/Vehicles/VehicleContextBar/FleetRemove.vue'
import ManagedSessionStart from '@/components/Vehicles/VehicleContextBar/ManagedSessionStart.vue'
import ModelReleaseSet from '@/components/Vehicles/VehicleContextBar/ModelReleaseSet.vue'
import PartSet from '@/components/Vehicles/VehicleContextBar/PartSet.vue'
import QualityInspect from '@/components/Vehicles/VehicleContextBar/QualityInspect.vue'
import TelemetryBackfill from '@/components/Vehicles/VehicleContextBar/TelemetryBackfill.vue'
import TelemetryPointsConfigSet from '@/components/Vehicles/VehicleContextBar/TelemetryPointsConfigSet.vue'
import TokenSign from '@/components/Vehicles/VehicleContextBar/TokenSign.vue'
import VehicleGovernorSave from '@/components/Vehicles/VehicleContextBar/VehicleGovernorSave.vue'
import VehicleReProvision from '@/components/Vehicles/VehicleContextBar/ReProvision.vue'

export default {
  name: 'VehicleContextBar',
  components: {
    Actions,
    FirmwareService,
    FleetAdd,
    FleetRemove,
    ManagedSessionStart,
    ModelReleaseSet,
    PartSet,
    QualityInspect,
    TelemetryBackfill,
    TelemetryPointsConfigSet,
    TokenSign,
    VehicleGovernorSave,
    VehicleReProvision
  },
  props: {
    contentType: {
      default: null,
      type: String
    },
    vehicleModelRelease: {
      default: null,
      type: Object
    },
    vin: {
      default: null,
      type: String
    },
    visible: {
      default: false,
      type: Boolean
    },
    width: {
      default: '400px',
      type: String
    }
  },
  data: () => ({
    active: false
  }),
  computed: {
    ...mapGetters({
      operatorLoaded: OPERATOR_LOADED,
      operatorPreferenceContextBarOutsideClickClose: OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE
    }),
    contextBarOutsideClickClose () {
      const { operatorLoaded, operatorPreferenceContextBarOutsideClickClose } = this
      return operatorLoaded ? operatorPreferenceContextBarOutsideClickClose : null
    }
  },
  watch: {
    visible (newVal) {
      this.active = newVal
    }
  },
  methods: {
    changeContext (event) {
      this.$emit('change-context', event)
    },
    closeContext () {
      this.$emit('close-context')
    },
    closeContextBar () {
      this.$emit('context-bar-visible', false)
    },
    outsideClickCloseEmit (event) {
      if (event === false && this.contextBarOutsideClickClose) {
        this.closeContextBar()
      }
    },
    reprovisionComplete (event) {
      this.$emit('reprovision-complete', event)
    }
  }
}
</script>
