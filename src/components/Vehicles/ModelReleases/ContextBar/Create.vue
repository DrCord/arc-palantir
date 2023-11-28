<template>
  <div class="part-set-container">
    <h3>Model Release - Create</h3>
    <vue-form :state="formstate">
      <validate tag="div" class="model">
        <v-select
          v-model="model.modelId"
          dense
          label="Model"
          name="model"
          :items="models"
          item-text="modelName"
          item-value="id"
          required
          outlined
        ></v-select>
        <h4 v-if="!selectedModelName">Select a Model to Continue</h4>
      </validate>

      <validate v-if="selectedModelName" tag="div" class="description">
        <label for="description" class="required">Description</label>
        <v-textarea
          v-model="model.description"
          name="description"
          auto-grow
          required
          outlined
          rows="1"
          minlength="10"
          :error-messages="descriptionErrorMessages"
        >
        <v-icon
            v-if="descriptionErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-textarea>
      </validate>

      <div v-if="selectedModelName" class="parts-container">
        <h4 class="parts">Part Numbers</h4>

        <validate tag="div" class="bms">
          <label for="bms" class="required">BMS</label>
          <v-text-field
            id="bms"
            v-model="model.parts.bms"
            name="bms"
            required
            placeholder="Enter Part Number"
            minlength="6"
            maxlength="6"
            outlined
            :error-messages="partTypeErrorMessages(formstate.bms)"
          >
            <v-icon
              v-if="partTypeErrorMessages(formstate.bms)"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-text-field>
        </validate>

        <validate tag="div" class="charger">
          <label for="charger" class="required">Charger</label>
          <v-text-field
            id="charger"
            v-model="model.parts.charger"
            name="charger"
            required
            placeholder="Enter Part Number"
            minlength="6"
            maxlength="6"
            outlined
            :error-messages="partTypeErrorMessages(formstate.charger)"
          >
            <v-icon
              v-if="partTypeErrorMessages(formstate.charger)"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-text-field>
        </validate>

        <validate tag="div" class="comm">
          <label for="comm" class="required">Comm</label>
          <v-text-field
            id="comm"
            v-model="model.parts.comm"
            name="comm"
            required
            placeholder="Enter Part Number"
            minlength="6"
            maxlength="6"
            outlined
            :error-messages="partTypeErrorMessages(formstate.comm)"
          >
            <v-icon
              v-if="partTypeErrorMessages(formstate.comm)"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-text-field>
        </validate>

        <validate tag="div" class="display">
          <label for="display" class="required">Display</label>
          <v-text-field
            id="display"
            v-model="model.parts.display"
            name="display"
            required
            placeholder="Enter Part Number"
            minlength="6"
            maxlength="6"
            outlined
            :error-messages="partTypeErrorMessages(formstate.display)"
          >
            <v-icon
              v-if="partTypeErrorMessages(formstate.display)"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-text-field>
        </validate>

        <validate tag="div" class="epsu">
          <label for="epsu" class="required">EPSU</label>
          <v-text-field
            id="epsu"
            v-model="model.parts.epsu"
            name="epsu"
            required
            placeholder="Enter Part Number"
            minlength="6"
            maxlength="6"
            outlined
            :error-messages="partTypeErrorMessages(formstate.epsu)"
          >
            <v-icon
              v-if="partTypeErrorMessages(formstate.epsu)"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-text-field>
        </validate>

        <validate tag="div" class="h-bridge">
          <label for="hBridge" class="required">H Bridge</label>
          <v-text-field
            id="h-bridge"
            v-model="model.parts.hBridge"
            name="hBridge"
            required
            placeholder="Enter Part Number"
            minlength="6"
            maxlength="6"
            outlined
            :error-messages="partTypeErrorMessages(formstate.hBridge)"
          >
            <v-icon
              v-if="partTypeErrorMessages(formstate.hBridge)"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-text-field>
        </validate>

        <validate tag="div" class="inverter-left">
          <label for="inverterLeft" class="required">Inverter - Left</label>
          <v-text-field
            id="inverter-left"
            v-model="model.parts.inverterLeft"
            name="inverterLeft"
            required
            placeholder="Enter Part Number"
            minlength="6"
            maxlength="6"
            outlined
            :error-messages="partTypeErrorMessages(formstate.inverterLeft)"
          >
            <v-icon
              v-if="partTypeErrorMessages(formstate.inverterLeft)"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-text-field>
        </validate>

        <validate tag="div" class="inverter-right">
          <label for="inverterRight" class="required">Inverter - Right</label>
          <v-text-field
            id="inverter-right"
            v-model="model.parts.inverterRight"
            name="inverterRight"
            required
            placeholder="Enter Part Number"
            minlength="6"
            maxlength="6"
            outlined
            :error-messages="partTypeErrorMessages(formstate.inverterRight)"
          >
            <v-icon
              v-if="partTypeErrorMessages(formstate.inverterRight)"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-text-field>
        </validate>

        <validate tag="div" class="io-front">
          <label for="ioFront" class="required">IO Front</label>
          <v-text-field
            id="io-front"
            v-model="model.parts.ioFront"
            name="ioFront"
            required
            placeholder="Enter Part Number"
            minlength="6"
            maxlength="6"
            outlined
            :error-messages="partTypeErrorMessages(formstate.ioFront)"
          >
            <v-icon
              v-if="partTypeErrorMessages(formstate.ioFront)"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-text-field>
        </validate>

        <validate tag="div" class="io-rear">
          <label for="ioRear" class="required">IO Rear</label>
          <v-text-field
            id="io-rear"
            v-model="model.parts.ioRear"
            name="ioRear"
            required
            placeholder="Enter Part Number"
            minlength="6"
            maxlength="6"
            outlined
            :error-messages="partTypeErrorMessages(formstate.ioRear)"
          >
            <v-icon
              v-if="partTypeErrorMessages(formstate.ioRear)"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-text-field>
        </validate>

        <validate tag="div" class="kers-sensor">
          <label for="kersSensor" class="required">KERS Sensor</label>
          <v-text-field
            id="kers-sensor"
            v-model="model.parts.kersSensor"
            name="kersSensor"
            required
            placeholder="Enter Part Number"
            minlength="6"
            maxlength="6"
            outlined
            :error-messages="partTypeErrorMessages(formstate.kersSensor)"
          >
            <v-icon
              v-if="partTypeErrorMessages(formstate.kersSensor)"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-text-field>
        </validate>

        <validate tag="div" class="lv">
          <label for="lv" class="required">LV</label>
          <v-text-field
            id="lv"
            v-model="model.parts.lv"
            name="lv"
            required
            placeholder="Enter Part Number"
            minlength="6"
            maxlength="6"
            outlined
            :error-messages="partTypeErrorMessages(formstate.lv)"
          >
            <v-icon
              v-if="partTypeErrorMessages(formstate.lv)"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-text-field>
        </validate>

        <validate tag="div" class="vcu">
          <label for="vcu" class="required">VCU</label>
          <v-text-field
            id="vcu"
            v-model="model.parts.vcu"
            name="vcu"
            required
            placeholder="Enter Part Number"
            minlength="6"
            maxlength="6"
            outlined
            :error-messages="partTypeErrorMessages(formstate.vcu)"
          >
            <v-icon
              v-if="partTypeErrorMessages(formstate.vcu)"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-text-field>
        </validate>

        <h4
          v-if="partsMatchExistingModelRelease"
          class="parts-warning"
        >Parts Numbers Match Existing Release for Selected Model</h4>
      </div>

      <v-btn
        v-if="selectedModelName"
        :disabled="!formstate.$valid || partsMatchExistingModelRelease"
        color=success
        type="button"
        @click="modelReleaseCreate"
      >Create<v-icon>mdi-plus-circle</v-icon>
      </v-btn>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLES_MODEL_RELEASE_CREATE } from '@/store/action-types'
import {
  VEHICLES_MODELS,
  VEHICLES_MODEL_RELEASES
} from '@/store/getter-types'

export default {
  name: 'ModelReleaseCreate',
  data () {
    return {
      formstate: {},
      model: {
        modelId: null,
        description: null,
        parts: {
          bms: null,
          charger: null,
          comm: null,
          display: null,
          epsu: null,
          hBridge: null,
          inverterLeft: null,
          inverterRight: null,
          ioFront: null,
          ioRear: null,
          kersSensor: null,
          lv: null,
          vcu: null
        }
      },
      partTypes: {
        bms: 'BMS',
        charger: 'Charger',
        comm: 'Comm',
        display: 'Display',
        epsu: 'EPSU',
        hbridge: 'H Bridge',
        inverterLeft: 'Inverter - Left',
        inverterRight: 'Inverter - Right',
        ioFront: 'IO Front',
        ioRear: 'IO Rear',
        kersSensor: 'KERS Sensor',
        lv: 'LV',
        vcu: 'VCU'
      }
    }
  },
  computed: {
    ...mapGetters({
      models: VEHICLES_MODELS,
      modelReleases: VEHICLES_MODEL_RELEASES
    }),
    descriptionErrorMessages () {
      if (this.descriptionErrorStateMinLength) {
        return 'Minimum length is 10 characters'
      }
      if (this.descriptionErrorStateRequired) {
        return 'Description is required'
      }
      return null
    },
    descriptionErrorStateMinLength () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { description } = formstate
      if (!description || description.$untouched) {
        return null
      }
      if (description.$invalid && description.$error.minlength) {
        return true
      }
      return null
    },
    descriptionErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { description } = formstate
      if (!description || description.$untouched) {
        return null
      }
      if (description.$invalid && description.$error.required) {
        return true
      }
      return null
    },
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    },
    partsFieldsAllHaveValues () {
      const { partTypesNormalized, model } = this
      return !partTypesNormalized.map(partType => !!model.parts[partType]).includes(false)
    },
    partsMatchExistingModelRelease () {
      const partsMatchModelRelease = (parts, modelReleaseParts) => {
        return Object.entries(this.partTypes).every(partType => {
          const partTypeNormalized = partType[0]
          const partTypeOriginal = partType[1]
          const modelReleasePart = modelReleaseParts.find(modelReleasePartMap => modelReleasePartMap.partType === partTypeOriginal)
          if (modelReleasePart !== undefined) {
            return parts[partTypeNormalized] === modelReleasePart.partNumber
          }
          return false
        })
      }

      if (!this.partsFieldsAllHaveValues) {
        return false
      }
      return this.modelReleases.some(modelRelease => {
        if (modelRelease.modelName === this.selectedModelName) {
          return partsMatchModelRelease(this.model.parts, modelRelease.parts)
        }
      })
    },
    partTypesNormalized () {
      return Object.keys(this.partTypes)
    },
    selectedModelName () {
      if (!this.model.modelId) {
        return false
      }
      return this.models.find(model => model.id === this.model.modelId).modelName
    }
  },
  methods: {
    ...mapActions({
      modelReleaseCreateAction: VEHICLES_MODEL_RELEASE_CREATE
    }),
    async modelReleaseCreate () {
      const { model, modelReleaseCreateAction } = this
      const { modelId, description, parts } = model
      const componentSelf = this
      const payload = {
        modelId,
        description,
        parts: {}
      }
      // map to expected part names
      Object.entries(this.partTypes).forEach(partTypeMap => {
        const partTypeNormalized = partTypeMap[0]
        const partTypeExpected = partTypeMap[1]
        payload.parts[partTypeExpected] = parts[partTypeNormalized]
      })
      await modelReleaseCreateAction({ componentSelf, payload })
      this.$emit('create-complete')
    },
    partTypeErrorMessages (partFormstate) {
      if (this.partTypeErrorStateMinLength(partFormstate)) {
        return 'Minimum length is 6 characters'
      }
      if (this.partTypeErrorStateRequired(partFormstate)) {
        return 'Part number is required'
      }
      return null
    },
    partTypeErrorStateMinLength (partFormstate) {
      const { formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      if (!partFormstate || partFormstate.$untouched) {
        return null
      }
      if (partFormstate.$invalid && partFormstate.$error.minlength) {
        return true
      }
      return null
    },
    partTypeErrorStateRequired (partFormstate) {
      const { formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      if (!partFormstate || partFormstate.$untouched) {
        return null
      }
      if (partFormstate.$invalid && partFormstate.$error.required) {
        return true
      }
      return null
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .part-set-container {
    form {
      .v-icon {
        &.field-error-icon {
          top: -5px;
        }
      }
    }
    h3 {
      margin-bottom: 0px;
    }
    .model {
      padding-top: 20px;
    }
    .v-btn {
      margin-top: 0px;
      margin-bottom: 50px;
    }
  }
}
</style>
