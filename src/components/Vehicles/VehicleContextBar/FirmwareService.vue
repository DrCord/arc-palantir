<template>
  <div class="vehicle-fleet-add-container">
    <h3>Service Firmware Components</h3>
    <p>You are setting the vehicle firmware component to match the latest stable release for the vehicle's model release. Make absolutely sure you have actually physically updated the vehicle firmware before proceeding.</p>
    <div v-if="vehicleFirmwareComponentsOutdated.length">
      <v-select
        v-model="firmwareComponentName"
        :items="vehicleFirmwareComponentsOutdated"
        item-text="name"
        item-value="name"
        label="Servicable Firmware Components"
        outlined
      ></v-select>
      <v-btn
        :disabled="!firmwareComponentName"
        color=success
        @click="vehicleFirmwareService"
      >Service Firmware Component</v-btn>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
      <h4 v-else>Firmware Components Up to Date</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  VEHICLE_FIRMWARE_VERSION_SAVE,
  VEHICLES_FIRMWARE_COMPONENTS_SUMMON,
  VEHICLES_FIRMWARE_VERSIONS_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  VEHICLE_FIRMWARE_COMPONENTS_OUTDATED,
  VEHICLE_FIRMWARE_UP_TO_DATE,
  VEHICLE_LOADED,
  VEHICLES_FIRMWARE_COMPONENTS,
  VEHICLES_FIRMWARE_VERSIONS
} from '@/store/getter-types'

export default {
  name: 'VehicleFirmwareService',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      firmwareComponentName: null
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      vehicleFirmwareComponentsOutdatedGet: VEHICLE_FIRMWARE_COMPONENTS_OUTDATED,
      vehicleFirmwareUpToDateGet: VEHICLE_FIRMWARE_UP_TO_DATE,
      vehicleLoadedGet: VEHICLE_LOADED,
      vehiclesFirmwareComponents: VEHICLES_FIRMWARE_COMPONENTS,
      vehiclesFirmwareVersions: VEHICLES_FIRMWARE_VERSIONS
    }),
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : null
    },
    vehicleFirmwareComponentsOutdated () {
      return this.dataAvailable ? this.vehicleFirmwareComponentsOutdatedGet(this.vin) : []
    },
    vehicleFirmwareUpToDate () {
      return this.dataAvailable ? this.vehicleFirmwareUpToDateGet(this.vin) : null
    },
    dataAvailable () {
      return this.vin && this.vehicleLoaded
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      vehicleFirmwareVersionSaveAction: VEHICLE_FIRMWARE_VERSION_SAVE,
      vehiclesFirmwareComponentsSummonAction: VEHICLES_FIRMWARE_COMPONENTS_SUMMON,
      vehiclesFirmwareVersionsSummonAction: VEHICLES_FIRMWARE_VERSIONS_SUMMON
    }),
    init () {
      this.vehiclesFirmwareComponentsSummon()
      this.vehiclesFirmwareVersionsSummon()
    },
    async vehicleFirmwareService () {
      const componentSelf = this
      const vin = this.vin
      const firmwareComponentName = this.firmwareComponentName
      const payload = {
        vin,
        body: {
          firmware_modules_input: {}
        }
      }
      payload.body.firmware_modules_input[firmwareComponentName] = null
      await this.vehicleFirmwareVersionSaveAction({ componentSelf, payload })
      this.$emit('vehicle-firmware-service-complete')
    },
    async vehiclesFirmwareComponentsSummon () {
      const componentSelf = this
      await this.vehiclesFirmwareComponentsSummonAction({ componentSelf })
    },
    async vehiclesFirmwareVersionsSummon () {
      const componentSelf = this
      await this.vehiclesFirmwareVersionsSummonAction({ componentSelf })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle-fleet-add-container {
    h3 {
      margin-bottom: 20px;
    }
    button {
      float: right;
    }
  }
}
</style>
