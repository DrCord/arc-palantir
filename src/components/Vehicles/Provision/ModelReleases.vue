<template>
  <div class="model-releases-container">
    <validate
      tag="div"
      class="model-releases form-field form-group"
    >
      <v-select
        v-model="modelReleaseIdLocal"
        class="model-releases-select"
        name="model-releases"
        label="Model Release"
        dense
        hide-details
        :items="modelReleasesFromVinLetterCode"
        item-value="modelReleaseId"
        item-text="modelReleaseDescription"
        required
      />
    </validate>
    <div
      v-if="selectedModelRelease"
      class="model-release-parts"
    >
      <v-tooltip bottom>
        <template #activator="{ on }">
          <span v-on='on'>View Parts for Selected Model Release</span>
          <v-icon v-on='on'>mdi-information</v-icon>
        </template>
        <table class="model-release-parts">
          <tr>
            <th>Part Type</th>
            <th>Part Number</th>
          </tr>
          <tr v-for="part in selectedModelRelease.parts" :key="part.partType" class="table table-sm">
            <td class="part-type">{{ part.partType }}</td>
            <td class="part-number">{{ part.partNumber }}</td>
          </tr>
        </table>
      </v-tooltip>
    </div>
    <firmware-sync-confirm
      :firmware-sync-confirm="firmwareSyncConfirm"
      @value-updated="updateValue"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLES_MODEL_RELEASES_SUMMON } from '@/store/action-types'
import { VEHICLES_MODEL_RELEASES } from '@/store/getter-types'
import FirmwareSyncConfirm from '@/components/Vehicles/Provision/FirmwareSyncConfirm.vue'

export default {
  name: 'ProvisionFormModelReleases',
  components: {
    FirmwareSyncConfirm
  },
  props: {
    firmwareSyncConfirm: {
      default: false,
      type: Boolean
    },
    modelFromVinLetterCode: {
      default: () => {},
      type: Object
    },
    modelReleaseId: {
      default: null,
      type: Number
    }
  },
  computed: {
    ...mapGetters({
      vehiclesModelReleases: VEHICLES_MODEL_RELEASES
    }),
    modelReleasesFromVinLetterCode () {
      if (!this.modelFromVinLetterCode) {
        return []
      }
      const modelName = this.modelFromVinLetterCode.modelName
      return this.vehiclesModelReleases.filter((vehicleModelRelease) => {
        return vehicleModelRelease.modelName === modelName
      }).reverse()
    },
    selectedModelRelease () {
      if (!this.modelReleaseIdLocal) {
        return null
      }
      const modelReleaseId = this.modelReleaseIdLocal
      const modelReleases = this.vehiclesModelReleases.filter((vehicleModelRelease) => {
        return vehicleModelRelease.modelReleaseId === modelReleaseId
      })
      return modelReleases.length ? modelReleases[0] : false
    },
    firmwareSyncConfirmLocal: {
      get () { return this.firmwareSyncConfirm },
      set (val) { this.valueUpdated('firmwareSyncConfirm', val) }
    },
    modelReleaseIdLocal: {
      get () { return this.modelReleaseId },
      set (val) { this.valueUpdated('modelReleaseId', val) }
    }
  },
  watch: {
    modelReleasesFromVinLetterCode (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        if (this.modelReleasesFromVinLetterCode.length) {
          this.modelReleaseIdLocal = this.modelReleasesFromVinLetterCode[0].modelReleaseId
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      vehiclesModelReleasesSummonAction: VEHICLES_MODEL_RELEASES_SUMMON
    }),
    init () {
      this.vehiclesModelReleasesSummon()
    },
    updateValue (event) {
      this[`${event.itemName}Local`] = event.val
    },
    valueUpdated (itemName, val) {
      this.$emit('value-updated', { itemName, val })
    },
    vehiclesModelReleasesSummon () {
      const componentSelf = this
      const force = false
      const { vehiclesModelReleasesSummonAction } = this
      vehiclesModelReleasesSummonAction({ componentSelf, force })
    }
  }
}
</script>

<style lang="scss">
#app {
  .model-releases-container {
    position: relative;
    .model-releases {
      margin-bottom: 5px;
    }
    .validation-messages-container {
      display: none;
    }
  }
  .model-release-parts {
    table {
      padding: 5px;
      width: 100%;
    }
  }
}
</style>
