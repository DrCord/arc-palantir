<template>
  <div class="vehicle-locations">
    <h3>GPS Locations</h3>
    <telemetry-map
      :vins="[vin]"
      :vehicles-telemetry-points="normalizedGpsData"
    />
  </div>
</template>

<script>
import TelemetryMap from '@/components/TelemetryMap.vue'
export default {
  name: 'GpsLocations',
  components: {
    TelemetryMap
  },
  props: {
    gpsData: {
      type: Array,
      default: () => []
    },
    render: {
      type: Boolean,
      default: false
    },
    vin: {
      type: String,
      default: ''
    }
  },
  computed: {
    normalizedGpsData () {
      const normalizedData = {}
      normalizedData[this.vin] = this.gpsData.map(dataPoint => {
        return {
          gpsLatitude: {
            point: dataPoint.latitude,
            time: dataPoint.time
          },
          gpsLongitude: {
            point: dataPoint.longitude
          }
        }
      })
      return normalizedData
    }
  }
}
</script>

<style scoped lang="scss">
.vehicle-locations {
  margin: 20px 0;
  .map-container {
    background-color: #aaa;
    border-radius: 5px;
    padding: 8px;
  }
  .vin {
    color: #333;
    font-weight: bold;
  }
}
</style>
