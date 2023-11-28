<template>
  <div class="vehicle-model-release-set-container">
    <h3>Model Release Set</h3>
    <p>Model Release: configuration of part types to part numbers and corresponding firmware allowed to be installed in a vehicle.</p>
    <div v-if="availableModelReleases.length">
      <v-select
        v-model="modelReleaseId"
        :items="availableModelReleases"
        hint="Options listed newest to oldest"
        persistent-hint
        item-text="modelReleaseDescription"
        item-value="modelReleaseId"
        outlined
      ></v-select>
      <v-btn
        :disabled="!modelReleaseId"
        color="success"
        @click="vehicleModelReleaseSet"
      >Save</v-btn>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  VEHICLE_MODEL_RELEASE_SAVE,
  VEHICLES_MODEL_RELEASES_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  VEHICLES_MODEL_RELEASES,
  VEHICLE_MODEL_RELEASE
} from '@/store/getter-types'

export default {
  name: 'VehicleModelReleaseSet',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      modelReleaseId: null
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      vehiclesModelReleases: VEHICLES_MODEL_RELEASES,
      vehicleModelReleaseGet: VEHICLE_MODEL_RELEASE
    }),
    availableModelReleases () {
      const modelReleases = this.vehiclesModelReleases
        .filter(vehiclesModelRelease => {
          return this.vehicleModelRelease.modelName === vehiclesModelRelease.modelName
        })
        .filter(vehiclesModelRelease => {
          return this.vehicleModelRelease.modelReleaseId !== vehiclesModelRelease.modelReleaseId
        })
      modelReleases.sort((a, b) => {
        // newest to oldest
        const aCompare = a.modelReleaseId
        const bCompare = b.modelReleaseId
        return (aCompare < bCompare) ? 1 : ((bCompare < aCompare) ? -1 : 0)
      })
      return modelReleases
    },
    vehicleModelRelease () {
      return this.vin ? this.vehicleModelReleaseGet(this.vin) : []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      vehicleModelReleaseSaveAction: VEHICLE_MODEL_RELEASE_SAVE,
      vehiclesModelReleasesSummonAction: VEHICLES_MODEL_RELEASES_SUMMON
    }),
    init () {
      this.vehiclesModelReleasesSummon()
    },
    async vehiclesModelReleasesSummon () {
      const componentSelf = this
      await this.vehiclesModelReleasesSummonAction({ componentSelf })
    },
    async vehicleModelReleaseSet () {
      const componentSelf = this
      const { modelReleaseId, vin } = this
      const payload = {
        vin,
        modelReleaseId,
        body: {}
      }
      await this.vehicleModelReleaseSaveAction({ componentSelf, payload })
      this.$emit('vehicle-model-release-set-complete')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle-model-release-set-container {
    h3 {
      margin-bottom: 20px;
    }
    button {
      float: right;
    }
  }
}
</style>
