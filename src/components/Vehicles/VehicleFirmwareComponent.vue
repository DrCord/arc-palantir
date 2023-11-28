<template>
  <v-list-item
    two-line
    class="firmware-component"
  >
    <v-list-item-icon
      v-if="operatorCanViewFirmware"
      :class="iconClass"
    >
      <v-icon x-large>{{ iconName }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{ firmwareComponent.name }}</v-list-item-title>
      <v-list-item-subtitle>{{ firmwareComponent.hash }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-dialog
        v-model="dialog"
        width="500"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-show="operatorCanServiceVehicle && hasLatestFirmware === false"
            small
            color="blue lighten-2"
            class="ma-2 white--text service-vehicle-firmware"
            dark
            fab
            v-bind="attrs"
            v-on="on"
          ><v-icon>mdi-wrench</v-icon>
          </v-btn>
        </template>
        <v-card class="service-vehicle-firmware-card">
          <v-card-title class="text-h5">Mark {{ firmwareComponent.name }} Serviced
            <v-spacer />
            <v-btn
              icon
              @click="dialog = false"
            ><v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <p>This sets the vehicle firmware component ({{ firmwareComponent.name }}) firmware hash to match the latest stable release for the vehicle's model release in Arcimoto database records.</p>
            <p><b>Make absolutely sure you have actually physically updated the vehicle firmware before proceeding.</b></p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="vehicleFirmwareService"
            >Acknowledge &amp; Proceed
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-list-item>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLE_FIRMWARE_VERSION_SAVE } from '@/store/action-types'
import {
  ACCESS_FIRMWARE_READ,
  ACCESS_VEHICLE_SERVICE,
  LOADING
} from '@/store/getter-types'

export default {
  name: 'VehicleFirmwareComponent',
  props: {
    firmwareComponent: {
      default: () => {},
      type: Object
    },
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      dialog: null
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      operatorCanServiceVehicle: ACCESS_VEHICLE_SERVICE,
      operatorCanViewFirmware: ACCESS_FIRMWARE_READ
    }),
    iconClass () {
      const { hasLatestFirmware } = this
      let iconClass = 'unknown'
      if (hasLatestFirmware) {
        iconClass = 'latest'
      } else if (hasLatestFirmware === false) {
        iconClass = 'outdated'
      }
      return iconClass
    },
    iconName () {
      const { hasLatestFirmware } = this
      let iconName = 'mdi-help-circle-outline'
      if (hasLatestFirmware) {
        iconName = 'mdi-check-circle-outline'
      } else if (hasLatestFirmware === false) {
        iconName = 'mdi-close-circle-outline'
      }
      return iconName
    },
    hasLatestFirmware () {
      return this.firmwareComponent.hasLatestFirmware
    }
  },
  methods: {
    ...mapActions({
      vehicleFirmwareVersionSaveAction: VEHICLE_FIRMWARE_VERSION_SAVE
    }),
    async vehicleFirmwareService () {
      this.dialog = false
      const componentSelf = this
      const vin = this.vin
      const firmwareComponentName = this.firmwareComponent.name
      const payload = {
        vin,
        body: {
          firmware_modules_input: {}
        }
      }
      payload.body.firmware_modules_input[firmwareComponentName] = null
      await this.vehicleFirmwareVersionSaveAction({ componentSelf, payload })
      this.$emit('vehicle-firmware-service-complete')
    }
  }
}
</script>

<style lang="scss">
#app {
  .firmware-component {
    transform: translateZ(0); // Chrome fix: css columns 3rd row with box-shadow: button would not show
    .v-list-item__icon {
      margin-top: 16px;
      margin-bottom: 16px;
      margin-right: 12px;
      text-shadow: 1px 1px 1px #000;
      &.latest {
        i {
          color: #159c2e;
        }
      }
      &.outdated {
        i {
          color: red;
        }
      }
      &.unknown {
        i {
          color: orange;
        }
      }
      &.service-vehicle-firmware {
        margin-left: auto;
        margin-right: 0;
        button {
          &:before {
            color: dodgerblue;
            font-size: 2.0rem;
            text-shadow: 1px 1px 1px #000;
          }
        }
      }
    }
  }
  .v-dialog {
    .service-vehicle-firmware-card {
      p {
        font-size: 1.1rem;
        line-height: 1.5rem;
        margin-top: 20px;
        margin-bottom: 0;
      }
    }
  }
}
</style>
