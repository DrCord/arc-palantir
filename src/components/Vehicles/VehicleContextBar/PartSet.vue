<template>
  <div class="vehicle-part-set-container">
    <h3>Part Set</h3>
    <div v-if="vehicleLoaded">
      <h4>{{ vin }} - {{ vehicleModel }} v{{ vehicleModelReleaseId }}</h4>
      <div
        v-if="vehicleParts.length"
        id="model-release-parts"
      >
        <h4>Current Parts <span class="model-release-id">(Model Release {{ vehicleModelReleaseId }})</span></h4>
        <v-data-table
          disable-filtering
          disable-pagination
          disable-sort
          :headers="tableHeaders"
          :hide-default-footer="true"
          :items="vehicleParts"
          :items-per-page="20"
          dense
        >
          <template #[`item.installed`]="{ item }">{{ formatDate(item.installed) }}</template>
        </v-data-table>
      </div>
      <p v-else>Vehicle pre-registered: no parts marked installed</p>
    </div>
    <div v-if="vehiclesModelReleaseParts.length">
      <v-select
        v-model="selectedVehiclePart"
        :items="vehiclesModelReleaseParts"
        label="Parts"
        item-text="displayText"
        item-value="partType"
        outlined
        @change="vehiclePartSelected"
      ></v-select>
      <v-btn
        :disabled="!selectedVehiclePart"
        color="success"
        @click="vehiclePartSet"
      >Install Part</v-btn>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  VEHICLE_PART_SAVE,
  VEHICLES_MODEL_RELEASES_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  VEHICLE_LOADED,
  VEHICLE_MODEL,
  VEHICLE_PARTS,
  VEHICLES_MODEL_RELEASE_PARTS,
  VEHICLE_MODEL_RELEASE
} from '@/store/getter-types'

import DateUtility from '@/lib/dateUtility'

export default {
  name: 'VehiclePartSet',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      selectedVehiclePart: null,
      model: {
        partType: null,
        partNumber: null
      },
      tableHeaders: [
        {
          text: 'Part Type',
          value: 'partType'
        },
        {
          text: 'Part Number',
          value: 'partNumber'
        },
        {
          text: 'Installed',
          value: 'installed'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      vehicleLoadedGet: VEHICLE_LOADED,
      vehicleModelGet: VEHICLE_MODEL,
      vehiclePartsGet: VEHICLE_PARTS,
      vehicleModelReleaseGet: VEHICLE_MODEL_RELEASE,
      vehiclesModelReleasePartsGet: VEHICLES_MODEL_RELEASE_PARTS
    }),
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : {}
    },
    vehicleModel () {
      return this.vin ? this.vehicleModelGet(this.vin) : {}
    },
    vehicleParts () {
      return this.vin ? this.vehiclePartsGet(this.vin) : {}
    },
    vehicleModelRelease () {
      return this.vin ? this.vehicleModelReleaseGet(this.vin) : {}
    },
    vehicleModelReleaseId () {
      return Object.keys(this.vehicleModelRelease).length ? this.vehicleModelRelease.modelReleaseId : null
    },
    vehiclesModelReleaseParts () {
      const { vehicleModelReleaseId } = this
      if (!vehicleModelReleaseId) { return [] }
      const vehiclesModelReleaseParts = this.vehiclesModelReleasePartsGet(vehicleModelReleaseId)
      if (!vehiclesModelReleaseParts.length) { return [] }
      return vehiclesModelReleaseParts.map(item => {
        return { ...item, displayText: `${item.partType}: ${item.partNumber}` }
      })
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      vehiclePartSaveAction: VEHICLE_PART_SAVE,
      vehiclesModelReleasesSummonAction: VEHICLES_MODEL_RELEASES_SUMMON
    }),
    init () {
      this.vehiclesModelReleasesSummon()
    },
    formatDate (date) {
      return DateUtility.formatOutput(date)
    },
    async vehiclesModelReleasesSummon () {
      const componentSelf = this
      await this.vehiclesModelReleasesSummonAction({ componentSelf })
    },
    async vehiclePartSet () {
      const componentSelf = this
      const { vin } = this
      const { partNumber, partType } = this.model
      const payload = {
        vin,
        body: {
          part_number: partNumber,
          part_type: partType
        }
      }
      await this.vehiclePartSaveAction({ componentSelf, payload })
      this.$emit('vehicle-part-set-complete')
    },
    vehiclePartSelected (partType) {
      const selectedPart = this.vehiclesModelReleaseParts.filter(part => part.partType === partType)[0]
      this.model.partNumber = selectedPart.partNumber
      this.model.partType = selectedPart.partType
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle-part-set-container {
    h3 {
      margin-bottom: 20px;
    }
    button {
      float: right;
    }
  }
}
</style>
