<template>
  <div class="quick-actions-container">
    <h3>Vehicles Actions</h3>
    <v-list>
      <v-list-item v-if="operatorCanProvisionVehicle">
        <v-btn @click="provision">
          Provision Vehicle
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ACCESS_VEHICLE_PROVISION } from '@/store/getter-types'

export default {
  name: 'VehiclesActions',
  computed: {
    ...mapGetters({
      operatorCanProvisionVehicle: ACCESS_VEHICLE_PROVISION
    })
  },
  methods: {
    changePanel (contentType) {
      this.$emit('change-panel', { contentType })
    },
    provision () {
      this.changePanel('vehicle-provision')
    }
  }
}
</script>
