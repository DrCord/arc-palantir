<template>
  <v-card
    v-if="vin"
    class="vehicle-info-panel header-blue"
  >
    <v-card-text>
      <div class="header">
        <div class="icon-container">
          <v-icon
            small
            color="white"
            @click="close"
          >$close</v-icon>
        </div>
        <div class="top">
          <v-icon x-large color="primary">$fuv</v-icon>
          <div class="model">
            <h6>{{ vehicleModel }}</h6>
          </div>
        </div>
        <h5>{{ vinUnprefixed }}</h5>
      </div>
      <v-card>
        <div class="location telemetry-point-container">
          <template v-if="locationAddressDisplayLine1 && locationAddressDisplayLine2">
            <v-row>
              <v-col cols="12" md="4" class="item-title">
                <h6>Location</h6>
              </v-col>
              <v-col cols="12" md="8" class="item-data">
                <h6 class="data">{{ locationAddressDisplayLine1 }}<br> {{ locationAddressDisplayLine2 }}</h6>
              </v-col>
            </v-row>
          </template>
          <template v-else>
            <v-row>
              <v-col cols="12" md="4" class="item-title">
                <h6>Location</h6>
              </v-col>
              <v-col cols="12" md="8" class="item-data">
                <h6 class="data">{{ locationGpsDisplay }}</h6>
              </v-col>
            </v-row>
          </template>
        </div>
        <v-divider></v-divider>
        <div class="odometer telemetry-point-container">
          <v-row>
            <v-col cols="12" md="4" class="item-title">
              <h6>Odometer</h6>
            </v-col>
            <v-col cols="12" md="8" class="item-data">
              <h6 class="data">{{ odometerDisplay }}</h6>
            </v-col>
          </v-row>
        </div>
        <v-divider></v-divider>
        <div class="soc telemetry-point-container">
          <v-row>
            <v-col cols="12" md="4" class="item-title">
              <h6>Charge</h6>
            </v-col>
            <v-col cols="12" md="8" class="item-data">
              <h6 class="data">{{ socDisplay }}</h6>
            </v-col>
          </v-row>
        </div>
        <v-divider></v-divider>
        <div class="telemetry-point-container">
          <v-row>
            <v-col cols="12" md="4" class="item-title">
              <h6>Last Updated</h6>
            </v-col>
            <v-col cols="12" md="8" class="item-data">
              <h6 class="data">{{ lastUpdated }}
                <v-tooltip bottom>
                  <template #activator="{ on }">
                      <v-icon v-on='on'>mdi-information-outline</v-icon>
                  </template>
                  <div>Charge: {{ dates.soc}}</div>
                  <div>Odometer: {{ dates.odometer}}</div>
                  <div>Location: {{ dates.location}}</div>
                </v-tooltip>
              </h6>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>

import Fleet from '@/mixins/Fleet.js'

export default {
  name: 'VehicleDetailsPanel',
  mixins: [Fleet],
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
#app {
  .vehicle-info-panel {
    padding: 2px;
    .header {
      padding: 10px;
      .icon-container {
        float: right;
      }
      .top {
        display: flex;
      }
    }
    .v-card {
      padding: 10px;
      .telemetry-point-container {
        display: flex;
        .row {
          .item-title {
            padding-right: 0;
            h6 {
              font-size: 0.6rem;
            }
          }
          .item-data {
            padding-left: 10px;
          }
        }
        h6 {
          font-size: 0.7rem;
          margin: 0;
          text-transform: uppercase;
          &.data {
            text-transform: none;
          }
        }
      }
    }
    .v-card__text {
      padding: 0;
      .header {
        color: #eee;
        h6 {
          margin: 10px 0 0;
        }
      }
      .vin {
        h5 {
          margin: 5px 0 15px;
        }
      }
      .telemetry-point-container {
        display: flex;
      }
    }
  }
}
</style>
