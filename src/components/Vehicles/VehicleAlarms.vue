<template>
  <div class="alarms-container">
    <h3>Alarms</h3>
    <v-data-table
      disable-pagination
      :headers="tableHeaders"
      :hide-default-footer="true"
      :items="normalizedAlarms"
      :items-per-page="10"
      dense>
      <template #[`item.name`]="{ item }">
        {{ item.name | capitalize }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  LOADING,
  VEHICLE_ALARMS
} from '@/store/getter-types'

export default {
  name: 'VehicleAlarms',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      alarms: {},
      tableHeaders: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Value',
          value: 'data'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      vehicleAlarmsGet: VEHICLE_ALARMS
    }),
    normalizedAlarms () {
      const alarms = []
      for (const [name, data] of Object.entries(this.alarms)) {
        alarms.push({ name, data })
      }
      return alarms
    }
  },
  watch: {
    loading: {
      handler (newVal, oldVal) {
        if (newVal === false && newVal !== oldVal) {
          if (this.vin) {
            this.alarms = this.vehicleAlarmsGet(this.vin)
          }
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle {
    .alarms-container {
      h3 {
        text-align: left;
      }
    }
  }
}
</style>
