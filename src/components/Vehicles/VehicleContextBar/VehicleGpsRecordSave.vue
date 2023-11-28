<template>
  <div class="gps-record-toggle-container">
    <v-btn
      :disabled="loading"
      @click="vehicleGpsRecordSave"
    >GPS Record: {{ vehicleGpsRecord ? 'Disable' : 'Enable' }}
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLE_GPS_RECORD_SAVE } from '@/store/action-types'
import {
  LOADING,
  VEHICLE_GPS_RECORD
} from '@/store/getter-types'

export default {
  name: 'VehicleGpsRecordSet',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      vehicleGpsRecordGet: VEHICLE_GPS_RECORD
    }),
    vehicleGpsRecord () {
      return this.vin ? this.vehicleGpsRecordGet(this.vin) : null
    }
  },
  methods: {
    ...mapActions({
      vehicleGpsRecordSaveAction: VEHICLE_GPS_RECORD_SAVE
    }),
    async vehicleGpsRecordSave () {
      const componentSelf = this
      const payload = {
        vin: this.vin,
        body: {
          record_gps: !this.vehicleGpsRecord
        }
      }
      await this.vehicleGpsRecordSaveAction({ componentSelf, payload })
      this.$emit('vehicle-gps-record-save-complete')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .gps-record-enable {
    .v-input--switch {
      margin-top: 0;
    }
  }
}
</style>
