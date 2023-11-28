<template>
  <div class="firmware-container">
    <header>
      <v-row>
        <v-col cols="12" md="6">
        <h3>Firmware</h3>
      </v-col>
      <v-col cols="12" md="6">
        <h4
          v-if="operatorCanViewFirmware"
          class="vehicle-firmware-status"><v-icon
            :class="vehicleFirmwareUpToDateIconClass"
          >{{ vehicleFirmwareUpToDateIconName }}</v-icon>{{ vehicleFirmwareStatus }}
        </h4>
      </v-col>
    </v-row>
    </header>

    <div class="items">
      <v-list>
        <v-list-item-group
          v-model="selectedItem"
          color="primary"
        >
        <template v-for="item in vehicleFirmware">
          <vehicle-firmware-component
            :key="item.camel"
            :firmware-component="item"
            :vin="vin"
          />
        </template>
        </v-list-item-group>
      </v-list>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  VEHICLES_FIRMWARE_COMPONENTS_SUMMON,
  VEHICLES_FIRMWARE_VERSIONS_SUMMON
} from '@/store/action-types'
import {
  ACCESS_FIRMWARE_READ,
  ACCESS_VEHICLE_SERVICE,
  VEHICLE_FIRMWARE,
  VEHICLE_FIRMWARE_UP_TO_DATE,
  VEHICLE_LOADED
} from '@/store/getter-types'

import VehicleFirmwareComponent from '@/components/Vehicles/VehicleFirmwareComponent.vue'

export default {
  name: 'VehicleFirmware',
  components: {
    VehicleFirmwareComponent
  },
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      selectedItem: null
    }
  },
  computed: {
    ...mapGetters({
      operatorCanServiceVehicle: ACCESS_VEHICLE_SERVICE,
      operatorCanViewFirmware: ACCESS_FIRMWARE_READ,
      vehicleFirmwareGet: VEHICLE_FIRMWARE,
      vehicleFirmwareUpToDateGet: VEHICLE_FIRMWARE_UP_TO_DATE,
      vehicleLoadedGet: VEHICLE_LOADED
    }),
    dataAvailable () {
      return this.vin && this.vehicleLoaded
    },
    vehicleFirmwareUpToDateIconClass () {
      const { vehicleFirmwareUpToDate } = this
      let iconClass = 'unknown'
      if (vehicleFirmwareUpToDate) {
        iconClass = 'latest'
      } else if (vehicleFirmwareUpToDate === false) {
        iconClass = 'outdated'
      }
      return iconClass
    },
    vehicleFirmwareUpToDateIconName () {
      const { vehicleFirmwareUpToDate } = this
      let iconName = 'mdi-help-circle-outline'
      if (vehicleFirmwareUpToDate) {
        iconName = 'mdi-check-circle-outline'
      } else if (vehicleFirmwareUpToDate === false) {
        iconName = 'mdi-close-circle-outline'
      }
      return iconName
    },
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : null
    },
    vehicleFirmware () {
      return this.dataAvailable ? this.vehicleFirmwareGet(this.vin) : {}
    },
    vehicleFirmwareUpToDate () {
      return this.dataAvailable ? this.vehicleFirmwareUpToDateGet(this.vin) : null
    },
    vehicleFirmwareStatus () {
      const { vehicleFirmwareUpToDate } = this
      let status = 'Unknown'
      if (vehicleFirmwareUpToDate === false) {
        status = 'Update(s) Required'
      } else if (vehicleFirmwareUpToDate) {
        status = 'Up To Date'
      }
      return status
    }
  },
  watch: {
    vehicleLoaded: {
      handler (newVal) {
        if (newVal) {
          this.getData()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      vehiclesFirmwareComponentsSummonAction: VEHICLES_FIRMWARE_COMPONENTS_SUMMON,
      vehiclesFirmwareVersionsSummonAction: VEHICLES_FIRMWARE_VERSIONS_SUMMON
    }),
    getData () {
      if (this.operatorCanViewFirmware) {
        this.vehiclesFirmwareComponentsSummon()
        this.vehiclesFirmwareVersionsSummon()
      }
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
  .firmware-container {
    header {
      display: flex;
      justify-content: space-between;
    }
    h3, h4 {
      text-align: left;
    }
    .vehicle-firmware-status {
      margin-right: 20px;
      .v-icon {
        font-size: 3.0rem;
        padding-right: 10px;
        text-shadow: 1px 1px 1px #000;
        &.latest {
          color: #159c2e;
        }
        &.outdated {
          color: red;
        }
        &.unknown {
          color: orange;
        }
      }
    }
    .items {
      margin-bottom: 20px;
      .v-list {
        columns: auto;
        @media screen and (max-width: 600px) {
          columns: 1;
        }
        @media screen and (min-width: 992px) {
          columns: 2;
        }
        @media screen and (min-width: 1200px) {
          columns: 3;
        }
        .v-list-item {
          padding-left: 12px;
          padding-right: 12px;
        }
      }
    }
  }
}
</style>
