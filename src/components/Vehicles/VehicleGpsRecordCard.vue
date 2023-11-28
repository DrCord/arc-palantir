<template>
  <div class="vehicle-gps-record-container">
    <v-card
      v-masonry-tile
      max-width="206"
      class="vehicle vehicle-card gps-record-card"
      color="card"
    >
      <v-card-title class="justify-center">GPS Record</v-card-title>
      <v-card-text>
        <v-container
          v-if="vehicleGpsRecord !== null"
          :class="[vehicleGpsRecord ? 'enabled' : 'disabled']"
        >
          <v-row
            class="h5 justify-center"
          >{{ vehicleGpsRecord ? 'Enabled' : 'Disabled' }}</v-row>
          <v-row>
            <v-icon v-if="vehicleGpsRecord">mdi-crosshairs-gps</v-icon>
            <v-icon v-else>mdi-crosshairs-off</v-icon>
          </v-row>
        </v-container>
        <v-container v-else class="unknown">
          <v-row class="h5">Unknown</v-row>
          <v-row><v-icon>mdi-crosshairs-question</v-icon></v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  LOADING,
  VEHICLE_GPS_RECORD
} from '@/store/getter-types'

export default {
  name: 'VehicleGpsRecordCard',
  props: {
    itemWidth: {
      default: '160px',
      type: String
    },
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      vehicleGpsRecord: null
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      vehicleGpsRecordGet: VEHICLE_GPS_RECORD
    })
  },
  watch: {
    loading: {
      handler (newVal) {
        if (newVal === false) {
          this.vehicleGpsRecord = this.vehicleGpsRecordGet(this.vin)
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
#app {
  .vehicle-gps-record-container {
    .vehicle {
      height: 230px;
      h5 {
        font-size: 0.9rem;
        text-align: center;
        overflow-wrap: break-word;
      }
      .row {
        display: flex;
        justify-content: center;
        &.h5 {
          font-size: 1.4rem;
        }
      }
      .disabled,
      .unknown {
        div, i {
          color: red;
          text-shadow: 1px 1px 1px #000;
        }
      }
      .enabled {
        div, i {
          color: #159c2e;
          text-shadow: 1px 1px 1px #000;
        }
      }
      i {
        font-size: 6rem;
      }
      .v-card__title {
        text-align: center;
        span {
          word-break: break-word;
        }
      }
    }
  }
}
</style>
