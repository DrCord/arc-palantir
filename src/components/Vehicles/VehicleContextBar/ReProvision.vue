<template>
  <div class="vehicle-reprovision-container">
    <div v-show="!reProvisionComplete" class="re-provision">
      <h3>Re-Provision Vehicle
        <v-tooltip bottom>
          <template #activator="{ on }">
              <v-icon v-on='on'>mdi-information</v-icon>
          </template>
          <span>Re-Create vehicle, generate replacement certificates and export updated identity.json file</span>
        </v-tooltip>
      </h3>
      <vue-form :state="formstate" @submit.prevent>
        <h3>VIN: {{ reProvisionVin  }} </h3>
        <div v-if="vinValid" class="vin-more">
          <h4>
            Model: {{ modelName }}
            <v-tooltip bottom>
              <template #activator="{ on }">
                  <v-icon v-on='on'>mdi-information</v-icon>
              </template>
              <span>The 5th digit in Arcimoto VINs indicates the model</span>
            </v-tooltip>
          </h4>
        </div>

        <div v-show="vinValid" class="vin-dependent-fields">
          <model-releases
            :firmware-sync-confirm="model.firmwareSyncConfirm"
            :model-from-vin-letter-code="modelFromVinLetterCode"
            :model-release-id="vehicleModelRelease.modelReleaseId"
            @value-updated="updateValue"
          />
          <reprovision-preserve-pin
            @preserve-pin="preservePinSet"
          />
          <manufactured-options
            :managed-session-mode-enable="model.managedSessionModeEnable"
            :manufactured-option-heated-grips="model.manufacturedOptionHeatedGrips"
            :manufactured-option-heated-seats="model.manufacturedOptionHeatedSeats"
            :manufactured-option-stereo-enabled="model.manufacturedOptionStereoEnabled"
            @value-updated="updateValue"
          />
        </div>
      </vue-form>

      <div v-if="vinValid" class="btn-container">
        <v-btn
          class="reprovision-vehicle"
          color="success"
          type="button"
          :disabled="!formValid"
          @click="vehicleReProvision"
        >Re-Provision Vehicle<v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </div>
    <post-provision
      v-if="reProvisionComplete"
      :model-name="modelName"
      :provision-data="provisionData"
      :reprovision=true
      @close-context="closeContext"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLE_PROVISION } from '@/store/action-types'
import {
  ENVIRONMENT_VIN_PREFIX,
  VEHICLES_MODELS,
  VEHICLE_MANAGED_SESSION_MODE,
  VEHICLE_OPTIONS,
  VINS
} from '@/store/getter-types'

import ManufacturedOptions from '@/components/Vehicles/Provision/ManufacturedOptions.vue'
import ModelReleases from '@/components/Vehicles/Provision/ModelReleases.vue'
import PostProvision from '@/components/Vehicles/Provision/PostProvision.vue'
import ReprovisionPreservePin from '@/components/Vehicles/Provision/ReprovisionPreservePin.vue'

export default {
  name: 'VehicleReProvision',
  components: {
    ManufacturedOptions,
    ModelReleases,
    PostProvision,
    ReprovisionPreservePin
  },
  props: {
    reProvisionVin: {
      default: null,
      type: String
    },
    vehicleModelRelease: {
      default: null,
      type: Object
    }
  },
  data () {
    return {
      formInInitialState: true,
      formstate: {},
      model: {
        firmwareSyncConfirm: null,
        managedSessionModeEnable: null,
        manufacturedOptionHeatedGrips: null,
        manufacturedOptionHeatedSeats: null,
        manufacturedOptionStereoEnabled: null,
        modelReleaseId: null,
        preservePin: true,
        vin: null
      },
      options: {},
      provisionData: {},
      reProvisionComplete: false
    }
  },
  computed: {
    ...mapGetters({
      vinPrefix: ENVIRONMENT_VIN_PREFIX,
      vehiclesModels: VEHICLES_MODELS,
      vehicleOptionsGet: VEHICLE_OPTIONS,
      vehicleManagedSessionModeGet: VEHICLE_MANAGED_SESSION_MODE,
      vins: VINS
    }),
    formValid () {
      return this.formstate.$valid && this.manufacturedOptionsValid
    },
    jsonDownload () {
      if (this.provisionData.vin) {
        return 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.provisionData))
      }
      return '#'
    },
    managedSessionModeEnableNotNull () {
      return this.model.managedSessionModeEnable !== null
    },
    manufacturedOptionHeatedGripsNotNull () {
      return this.model.manufacturedOptionHeatedGrips !== null
    },
    manufacturedOptionHeatedSeatsNotNull () {
      return this.model.manufacturedOptionHeatedSeats !== null
    },
    manufacturedOptionStereoEnabledNotNull () {
      return this.model.manufacturedOptionStereoEnabled !== null
    },
    manufacturedOptionsValid () {
      return this.managedSessionModeEnableNotNull &&
             this.manufacturedOptionHeatedGripsNotNull &&
             this.manufacturedOptionHeatedSeatsNotNull &&
             this.manufacturedOptionStereoEnabledNotNull
    },
    modelFromVinLetterCode () {
      if (!this.vehiclesModels.length) {
        return {}
      }
      if (this.reProvisionVin) {
        const modelLetterCode = this.reProvisionVin.replace(this.vinPrefix, '').charAt(4)
        const vehicleModel = this.vehiclesModels.filter((vehicleModel) => {
          return vehicleModel.letterCode === modelLetterCode
        })
        return vehicleModel.length ? vehicleModel[0] : {}
      }
      return {}
    },
    modelName () {
      const { modelFromVinLetterCode } = this
      return Object.keys(modelFromVinLetterCode).length ? modelFromVinLetterCode.modelName : null
    },
    vehicleManagedSessionMode () {
      return this.reProvisionVin ? this.vehicleManagedSessionModeGet(this.reProvisionVin) : null
    },
    vehicleOptions () {
      return this.reProvisionVin ? this.vehicleOptionsGet(this.reProvisionVin) : null
    },
    vehicleOptionsHeatedGrips () {
      return this.vehicleOptions ? this.vehicleOptions.heatedGrips === 'true' : null
    },
    vehicleOptionsHeatedSeats () {
      return this.vehicleOptions ? this.vehicleOptions.heatedSeats === 'true' : null
    },
    vehicleOptionsStereoEnabled () {
      return this.vehicleOptions ? this.vehicleOptions.stereoEnabled === 'true' : null
    },
    vinValid () {
      return this.reProvisionVin !== null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      vehicleProvisionAction: VEHICLE_PROVISION
    }),
    init () {
      this.formSetDefaults()
    },
    changeContext (contentType, params = {}) {
      this.$emit('change-context', { contentType, params })
    },
    closeContext () {
      this.$emit('close-context')
    },
    formSetDefaults () {
      this.model.firmwareSyncConfirm = true
      this.formSetManagedSessionModeFromVehicle()
      this.formSetManufacturedOptionsFromVehicle()
      this.formSetModelReleaseIdFromVehicle()
    },
    formSetManagedSessionModeFromVehicle () {
      const { vehicleManagedSessionMode } = this
      this.model.managedSessionModeEnable = vehicleManagedSessionMode
    },
    formSetManufacturedOptionsFromVehicle () {
      const {
        vehicleOptionsHeatedGrips,
        vehicleOptionsHeatedSeats,
        vehicleOptionsStereoEnabled
      } = this
      this.model.manufacturedOptionHeatedSeats = vehicleOptionsHeatedGrips
      this.model.manufacturedOptionHeatedGrips = vehicleOptionsHeatedSeats
      this.model.manufacturedOptionStereoEnabled = vehicleOptionsStereoEnabled
    },
    formSetModelReleaseIdFromVehicle () {
      const { vehicleModelRelease } = this
      this.model.modelReleaseId = vehicleModelRelease.modelReleaseId
    },
    updateValue (event) {
      this.model[event.itemName] = event.val
      if (event.itemName === 'modelReleaseId') {
        this.model.firmwareSyncConfirm = false
      }
    },
    preservePinSet (value) {
      this.model.preservePin = value
    },
    vehicleReProvision () {
      const vin = this.reProvisionVin
      const componentSelf = this

      const {
        managedSessionModeEnable,
        manufacturedOptionHeatedSeats,
        manufacturedOptionHeatedGrips,
        manufacturedOptionStereoEnabled,
        modelReleaseId,
        preservePin
      } = this.model

      const payload = {
        body: {
          options: {
            heated_seats: manufacturedOptionHeatedSeats,
            heated_grips: manufacturedOptionHeatedGrips,
            stereo_enabled: manufacturedOptionStereoEnabled
          },
          managed_session_mode: managedSessionModeEnable,
          model_release_id: modelReleaseId,
          preserve_pin: preservePin
        },
        vin
      }
      this.vehicleProvisionAction({ componentSelf, payload })
        .catch(e => {
          throw e
        })
        .then((response) => {
          this.provisionData = response
          this.reProvisionComplete = true
          this.$emit('provision-complete')
        })
    }
  }
}
</script>

<style lang="scss">
#app {
  .vehicle-reprovision-container {
    padding-bottom: 40px;
    width: 100%;
    h3 {
      margin-bottom: 10px;
    }
    form {
      overflow: hidden;
      .vin-more {
        margin-top: 10px;
      }
      .v-icon.mdi-information {
        margin-left: 5px;
      }
      .v-input--checkbox {
        .v-messages {
          display: none;
        }
      }
      .input-valid-vin-msg {
        margin-top: 10px;
      }
      .vin-dependent-fields {
        margin-top: 30px;
      }
    }
    .btn-container {
      margin-right: 20px;
      margin-top: 10px;
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
