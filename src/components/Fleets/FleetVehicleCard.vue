<template>
  <v-card
    v-if="show"
    v-masonry-tile
    class="fleet-vehicle-card rounded"
    :height="`${cardHeight}px`"
    width="280px"
  >
    <v-card-text>
      <div class="header">
        <v-icon x-large color="primary">$fuv</v-icon>
        <div class="model">
          <h6>{{ vehicleModel }}</h6>
        </div>
        <template v-if="operatorCanAccessVehicles">
          <v-spacer></v-spacer>
          <v-icon @click="navigateToVehicle(vin)">mdi-arrow-top-right-thin-circle-outline</v-icon>
        </template>
      </div>
      <div class="vin">
        <h5>{{ vinUnprefixed }}</h5>
        <div v-if="lastUpdated">
          Updated {{ lastUpdated }}
          <v-tooltip bottom>
            <template #activator="{ on }">
                <v-icon v-on='on'>mdi-information-outline</v-icon>
            </template>
            <div>Charge: {{ dates.soc}}</div>
            <div>Odometer: {{ dates.odometer}}</div>
            <div>Location: {{ dates.location}}</div>
          </v-tooltip>
        </div>
      </div>
      <div
        v-if="vehicleTelemetryPointsLoadingGet(vin)"
        class="telemetry-data-loading-container"
      >
        <h6>Telemetry Loading...</h6>
        <v-progress-circular
          indeterminate
          size="50"
          width="5"
        ></v-progress-circular>
      </div>
      <div v-else class="telemetry-data-container">
        <v-row>
          <v-col cols="12" md="5" sm="5">
            <div class="soc telemetry-point-container">
              <v-icon color="primary">$battery</v-icon>
              <h6 class="data">{{ socDisplay }}</h6>
            </div>
          </v-col>
          <v-col cols="12" md="7" sm="7">
            <div class="odometer telemetry-point-container">
                <v-icon color="primary">$gauge</v-icon>
                <h6 class="data">{{ odometerDisplay }}</h6>
            </div>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <div class="location telemetry-point-container">
          <template v-if="locationAddressDisplayLine1 && locationAddressDisplayLine2">
            <v-icon color="primary">$locationPin</v-icon>
            <h6 class="data">{{ locationAddressDisplayLine1 }}<br> {{ locationAddressDisplayLine2 }}</h6>
          </template>
          <template v-else>
            <v-icon color="primary">$locationPin</v-icon>
            <h6 class="data">{{ locationGpsDisplay }}</h6>
          </template>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>

import Fleet from '@/mixins/Fleet.js'

export default {
  name: 'FleetVehicleCard',
  mixins: [Fleet],
  props: {
    cardHeight: {
      default: 210,
      type: Number
    }
  },
  computed: {
    vehicleModel () {
      return this.dataAvailable ? this.vehicleModelGet(this.vin) : null
    },
    vehicleOdometerMiles () {
      return this.telemetryLoaded.length && this.vin ? this.vehicleOdometerMilesGet(this.vin) : null
    },
    vehicleTelemetryOdometerAll () {
      return this.telemetryLoaded.length && this.vin ? this.vehicleTelemetryOdometer(this.vin) : null
    },
    vehicleSoc () {
      return this.telemetryLoaded.length && this.vin ? this.vehicleSocGet(this.vin) : null
    },
    vehicleTelemetryGps () {
      return this.telemetryLoaded.length && this.vin ? this.vehicleLocationGpsGet(this.vin) : null
    }
  },
  methods: {
    navigateToVehicle (vin) {
      this.$router.push({
        name: 'vehicle',
        params: { vin }
      })
    }
  }
}
</script>

<style lang="scss">
#app {
  .fleet-vehicle-card {
    margin-bottom: 10px;
    .telemetry-data-loading-container {
        text-align: center;
      h6 {
        text-align: left;
        padding-bottom: 20px;
      }
      .v-progress-circular {
        margin-bottom: 20px;
      }
    }
    .v-card__text {
      .header {
        display: flex;
        h6 {
          margin: 10px 0 0;
        }
      }
      .vin {
        h5 {
          margin: 5px 0 1px;
        }
        div {
          margin: 0px 0 5px;
        }
      }
      .telemetry-point-container {
        display: flex;
        h6 {
          font-size: 0.9rem;
          margin: 3px 0 0 10px;
        }
      }
    }
  }
  &.theme--light {
    .fleet-vehicle-card {
      .header {
        path {
          stroke: rgba(0, 0, 0, 0.6);
        }
        rect {
          fill: rgba(0, 0, 0, 0.6);
          stroke: rgba(0, 0, 0, 0.6);
        }
      }
      .soc {
        path,
        rect {
          stroke: rgba(0, 0, 0, 0.6);
        }
      }
      .odometer {
        path {
          fill: rgba(0, 0, 0, 0.6);
        }
        line {
          stroke: rgba(0, 0, 0, 0.6);
        }
      }
      .location {
        path {
          &.fill {
            fill: rgba(0, 0, 0, 0.6);
          }
          &.stroke {
            stroke: rgba(0, 0, 0, 0.6);
          }
        }
      }
    }
  }
}
</style>
