<template>
  <div class="vehicle-provision-container">
    <div v-show="!provisionComplete" class="pre-provision">
      <h3>Provision Vehicle
        <v-tooltip bottom>
          <template #activator="{ on }">
              <v-icon v-on='on'>mdi-information</v-icon>
          </template>
          <span>Create vehicle, generate certificates and export identity.json file</span>
        </v-tooltip>
      </h3>
      <vue-form :state="formstate" @submit.prevent="provisionVehicle">
        <vin-text-input-form-field
          :formstate-pristine="typeof formstate.vin !== 'undefined' ? formstate.vin.$pristine : true"
          :valid="vinValid"
          :vin="model.vin"
          @value-updated="updateValue"
        />
        <div v-if="vinValid" class="vin-more">
          <h4>
            Model: {{ modelFromVinLetterCode.modelName }}
            <v-tooltip bottom>
              <template #activator="{ on }">
                  <v-icon v-on='on'>mdi-information</v-icon>
              </template>
              <span>The 5th digit in Arcimoto VINs indicates the model</span>
            </v-tooltip>
          </h4>
        </div>
        <div
          v-else
          class="input-valid-vin-msg">
          <h4>Input a valid VIN to continue</h4>
        </div>

        <div v-show="vinValid" class="vin-dependent-fields">
          <model-releases
            :firmware-sync-confirm="model.firmwareSyncConfirm"
            :model-from-vin-letter-code="modelFromVinLetterCode"
            :model-release-id="model.modelReleaseId"
            @value-updated="updateValue"
          />
          <manufactured-options
            :managed-session-mode-enable="model.managedSessionModeEnable"
            :manufactured-option-heated-grips="model.manufacturedOptionHeatedGrips"
            :manufactured-option-heated-seats="model.manufacturedOptionHeatedSeats"
            :manufactured-option-stereo-enabled="model.manufacturedOptionStereoEnabled"
            @value-updated="updateValue"
          />
        </div>
      <div v-if="vinValid" id="go-to-vehicle-container">
        <entity-navigation-control
        entity-name="vehicle"
        @go-to-entity="navUpdate"
      />
      </div>
      <div v-if="vinValid" class="btn-container">
        <v-btn
          class="provision-vehicle"
          color="success"
          type="submit"
          :disabled="!formValid"
        >Provision Vehicle<v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
      </vue-form>
    </div>
    <post-provision
      v-if="provisionComplete"
      :model-name="modelName"
      :provision-data="provisionData"
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
  VINS
} from '@/store/getter-types'

import ManufacturedOptions from '@/components/Vehicles/Provision/ManufacturedOptions.vue'
import ModelReleases from '@/components/Vehicles/Provision/ModelReleases.vue'
import PostProvision from '@/components/Vehicles/Provision/PostProvision.vue'
import utility from '@/lib/utility'
import VinTextInputFormField from '@/components/Vehicles/VinTextInputFormField.vue'
import EntityNavigationControl from '@/components/EntityNavigationControl.vue'

export default {
  name: 'VehicleProvision',
  components: {
    EntityNavigationControl,
    ManufacturedOptions,
    ModelReleases,
    PostProvision,
    VinTextInputFormField
  },
  data () {
    return {
      formInInitialState: true,
      formstate: {},
      model: {
        firmwareSyncConfirm: false,
        managedSessionModeEnable: null,
        manufacturedOptionHeatedSeats: null,
        manufacturedOptionHeatedGrips: null,
        manufacturedOptionStereoEnabled: null,
        modelReleaseId: null,
        vin: null
      },
      provisionData: {},
      provisionComplete: false,
      goToVehicle: true
    }
  },
  computed: {
    ...mapGetters({
      vinPrefix: ENVIRONMENT_VIN_PREFIX,
      vehiclesModels: VEHICLES_MODELS,
      vins: VINS
    }),
    jsonDownload () {
      if (this.provisionData.vin) {
        return 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.provisionData))
      }
      return '#'
    },
    modelName () {
      const { modelFromVinLetterCode } = this
      return Object.keys(modelFromVinLetterCode).length ? modelFromVinLetterCode.modelName : null
    },
    modelFromVinLetterCode () {
      if (!this.vehiclesModels.length) {
        return {}
      }
      // get letter code for model lookup
      if (this.vinValid) {
        const modelLetterCode = this.model.vin.charAt(4)
        const vehicleModel = this.vehiclesModels.filter((vehicleModel) => {
          return vehicleModel.letterCode === modelLetterCode
        })
        return vehicleModel.length ? vehicleModel[0] : {}
      }
      return {}
    },
    vinValid () {
      return this.model.vin !== null &&
             this.formstate.vin &&
             this.formstate.vin.$error &&
             Object.keys(this.formstate.vin.$error).length === 0 &&
             this.formstate.vin.$error.constructor === Object
    },
    prefixedVin () {
      const { vinPrefix, model } = this
      return `${vinPrefix}${model.vin}`
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
    formValid () {
      return this.formstate.$valid && this.manufacturedOptionsValid
    }
  },
  watch: {
    vinValid (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        // check if VIN exists, if so redirect to 're-provision' panel
        if (this.vins.includes(this.prefixedVin)) {
          this.reProvisionRedirect()
        }
      }
    }
  },
  methods: {
    ...mapActions({
      vehicleProvisionAction: VEHICLE_PROVISION
    }),
    changeContext (contentType, params = {}) {
      this.$emit('change-context', { contentType, params })
    },
    closeContext () {
      this.$emit('close-context')
    },
    navUpdate (event) {
      this.goToVehicle = event.value
    },
    provisionVehicle () {
      const componentSelf = this
      const vin = this.prefixedVin
      const {
        managedSessionModeEnable,
        manufacturedOptionHeatedSeats,
        manufacturedOptionHeatedGrips,
        manufacturedOptionStereoEnabled,
        modelReleaseId
      } = this.model
      const payload = {
        body: {
          options: {
            heated_seats: manufacturedOptionHeatedSeats,
            heated_grips: manufacturedOptionHeatedGrips,
            stereo_enabled: manufacturedOptionStereoEnabled
          },
          managed_session_mode: managedSessionModeEnable,
          model_release_id: modelReleaseId
        },
        vin
      }
      this.vehicleProvisionAction({ componentSelf, payload })
        .catch(e => {
          throw e
        })
        .then((response) => {
          this.provisionData = response
          this.provisionComplete = true
          const event = {
            vin: this.prefixedVin,
            navigate: this.goToVehicle
          }
          this.$emit('provision-complete', event)
        })
    },
    reProvisionRedirect () {
      // pass VIN in event for reprovision component to load on init into input after switch
      const msg = 'VIN Exists: Redirecting to Re-Provision'
      utility.messageSet(this, msg, 'warning', 6000, 'toasted-warning')
      this.changeContext('vehicle-reprovision', { vin: this.model.vin })
    },
    updateValue (event) {
      this.model[event.itemName] = event.val
    }
  }
}
</script>

<style lang="scss">
#app {
  .vehicle-provision-container {
    padding-bottom: 40px;
    width: 100%;
    h3 {
      margin-bottom: 20px;
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
      .vin-dependent-fields {
        margin-top: 30px;
      }
    }
    .vin-text-input-form-field {
      .vf-field-pristine {
        .validation-msgs-container {
          display: none;
        }
      }
    }
    .input-valid-vin-msg {
      margin-top: 10px;
    }
    .vin-dependent-fields {
      margin-top: 30px;
    }
    .btn-container {
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
