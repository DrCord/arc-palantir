<template>
  <v-card
    class="mx-auto vehicle-card vehicle-control-card"
    height="206"
    max-width="206"
  >
    <v-card-title
      :class="[operatorControlsVehicle ? 'enabled' : 'disabled']"
    >
        <h3>Active User Control</h3>
    </v-card-title>
    <v-card-text
      :class="[operatorControlsVehicle ? 'enabled' : 'disabled']"
    >
      <div v-if="operatorControlsVehicle" class="text-container">
        <v-icon>mdi-check-circle-outline</v-icon>
      </div>
      <div v-if="!operatorControlsVehicle" class="text-container">
        <v-icon>mdi-close-circle-outline</v-icon>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { OPERATOR_CONTROLS_VEHICLE } from '@/store/getter-types'

export default {
  name: 'VehicleControlCard',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      operatorControlsVehicleGet: OPERATOR_CONTROLS_VEHICLE
    }),
    operatorControlsVehicle () {
      return this.vin ? this.operatorControlsVehicleGet(this.vin) : null
    }
  }
}
</script>

<style lang="scss">
#app {
  .vehicle-control-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 206px;
    .v-card__title {
      display: flex;
      justify-content: center;
      word-break: break-word;
    }
    h3 {
      line-height: 1.1;
      margin-bottom: 0;
      margin-top: 0;
    }
    h4 {
      font-size: 1.4rem;
      margin-top: 10px;
    }
    .text-container {
      text-align: center;
      i {
        font-size: 5rem;
      }
    }
    h4, i {
        text-shadow: 1px 1px 1px #000;
      }
    .enabled {
      h4, i {
        color: #159c2e;
      }
    }
    .disabled {
      h4, i {
        color: red;
      }
    }
  }
}
</style>
