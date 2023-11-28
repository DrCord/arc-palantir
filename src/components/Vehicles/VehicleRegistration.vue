<template>
  <div class="registration-container">
    <h3>Registration</h3>
    <v-list>
      <v-list-item v-for="item in normalizedRegistrationData" :key="item.name">
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.data }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  LOADING,
  VEHICLE_REGISTRATION
} from '@/store/getter-types'

export default {
  name: 'VehicleRegistration',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      vehicleRegistrationGet: VEHICLE_REGISTRATION
    }),
    objectHasData () {
      return Object.entries(this.registration).length
    },
    normalizedRegistrationData () {
      const registrationData = []
      for (const [name, data] of Object.entries(this.registration)) {
        registrationData.push({ name, data })
      }
      return registrationData
    },
    registration () {
      return this.vin && !this.loading ? this.vehicleRegistrationGet(this.vin) : {}
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle {
    .registration-container {
      h3 {
        text-align: left;
      }
    }
  }
}

</style>
