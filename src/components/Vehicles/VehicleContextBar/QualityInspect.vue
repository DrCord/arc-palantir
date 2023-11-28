<template>
  <div class="quality-inspect-container">
    <v-card>
      <v-card-title>Quality Inspection</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Factory PIN</v-list-item-title>
              <v-list-item-subtitle>{{ factoryPin }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Firmware Components Up to Date</v-list-item-title>
              <v-list-item-icon :class="[vehicleFirmwareUpToDate ? 'up-to-date' : 'outdated']">
                <v-icon
                  v-if="vehicleFirmwareUpToDate"
                  x-large
                >mdi-check-circle-outline</v-icon>
                <v-icon
                  v-else
                  x-large
                >mdi-close-circle-outline</v-icon>
              </v-list-item-icon>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="dataAvailable && !vehicleFirmwareUpToDate">
            <v-list-item-content>
              <v-list-item-title>Outdated Firmware Components</v-list-item-title>
              <v-data-table
                id="vehicle-firmware-components-outdated"
                :headers="tableHeaders"
                :items="vehicleFirmwareComponentsOutdated"
                :sort-by="['name']"
                disable-pagination
                :hide-default-footer="true"
                :items-per-page="30"
              ></v-data-table>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <div class="button-container">
          <v-btn
            right
            class="success"
            @click="finishInspection"
          >Finish Inspection</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  VEHICLES_FIRMWARE_COMPONENTS_SUMMON,
  VEHICLES_FIRMWARE_VERSIONS_SUMMON
} from '@/store/action-types'
import {
  VEHICLE_FIRMWARE_COMPONENTS_OUTDATED,
  VEHICLE_FIRMWARE_UP_TO_DATE,
  VEHICLE_LOADED,
  VEHICLE_PIN
} from '@/store/getter-types'

export default {
  name: 'QualityInspection',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      firmwareComponentName: null,
      tableHeaders: [
        {
          text: 'Name',
          value: 'name',
          sortable: false
        },
        {
          text: 'Part Type',
          value: 'partType',
          sortable: false
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      vehicleFirmwareComponentsOutdatedGet: VEHICLE_FIRMWARE_COMPONENTS_OUTDATED,
      vehicleFirmwareUpToDateGet: VEHICLE_FIRMWARE_UP_TO_DATE,
      vehicleLoadedGet: VEHICLE_LOADED,
      vehiclePinGet: VEHICLE_PIN
    }),
    factoryPin () {
      return this.vehiclePin ? this.vehiclePin.factoryPin : null
    },
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : null
    },
    vehicleFirmwareComponentsOutdated () {
      return this.dataAvailable ? this.vehicleFirmwareComponentsOutdatedGet(this.vin) : []
    },
    vehicleFirmwareUpToDate () {
      return this.dataAvailable ? this.vehicleFirmwareUpToDateGet(this.vin) : null
    },
    vehiclePin () {
      return this.dataAvailable ? this.vehiclePinGet(this.vin) : null
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
      vehiclesFirmwareComponentsSummonAction: VEHICLES_FIRMWARE_COMPONENTS_SUMMON,
      vehiclesFirmwareVersionsSummonAction: VEHICLES_FIRMWARE_VERSIONS_SUMMON
    }),
    init () {
      this.vehiclesFirmwareComponentsSummon()
      this.vehiclesFirmwareVersionsSummon()
    },
    finishInspection () {
      this.$emit('vehicle-quality-check-complete')
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
  .quality-inspect-container {
    h4 {
      margin-bottom: 0;
      text-align: left;
    }
    .v-list-item__icon {
      margin: 0;
      i {
        text-shadow: 1px 1px 1px #000;
      }
      &.up-to-date {
        i {
          color: #159c2e;
        }
      }
      &.outdated {
        i {
          color: red;
        }
      }
    }
    .v-data-table {
      margin-top: 5px;
    }
    .button-container {
      display: flex;
      flex-direction: row-reverse;
    }
  }
}
</style>
