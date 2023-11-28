<template>
  <div class="telemetry-points-container">
    <h3>Telemetry Points</h3>
    <v-data-table
      dense
      :headers="tableHeaders"
      :items="normalizedTelemetryPoints"
    >
      <template #[`item.point`]="{ item }">
        {{ item.data.point }}
      </template>
      <template #[`item.time`]="{ item }">
        {{ item.data.time }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  LOADING,
  VEHICLE_TELEMETRY_POINTS
} from '@/store/getter-types'

export default {
  name: 'VehicleTelemetryPoints',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      telemetryPoints: {},
      tableHeaders: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Point',
          value: 'point'
        },
        {
          text: 'Time',
          value: 'time'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      vehicleTelemetryPointsGet: VEHICLE_TELEMETRY_POINTS
    }),
    normalizedTelemetryPoints () {
      const points = []
      for (const [name, data] of Object.entries(this.telemetryPoints)) {
        points.push({ name, data })
      }
      return points
    }
  },
  watch: {
    loading: {
      handler (newVal, oldVal) {
        if (newVal === false && newVal !== oldVal) {
          this.telemetryPoints = this.vin ? this.vehicleTelemetryPointsGet(this.vin) : {}
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
    .telemetry-points-container {
      h3 {
        text-align: left;
      }
    }
  }
}

</style>
