<template>
  <div class="parts-container">
    <h3>Parts</h3>
    <v-data-table
      dense
      :headers="tableHeaders"
      :items="parts"
      disable-pagination
      :hide-default-footer="true"
      :items-per-page="20"
    >
      <template #[`item.installed`]="{ item }">
        {{ formatDate(item.installed) }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  VEHICLE_LOADED,
  VEHICLE_PARTS
} from '@/store/getter-types'

import dateUtilty from '@/lib/dateUtility'

export default {
  name: 'VehiclePartsInstalled',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      parts: [],
      tableHeaders: [
        {
          text: 'Part Number',
          value: 'partNumber'
        },
        {
          text: 'Part Type',
          value: 'partType'
        },
        {
          text: 'Installed',
          value: 'installed'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      vehicleLoadedGet: VEHICLE_LOADED,
      vehiclePartsGet: VEHICLE_PARTS
    }),
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : []
    }
  },
  watch: {
    vehicleLoaded: {
      handler (newVal) {
        if (newVal && this.vin) {
          this.partsSet()
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.partsSet()
    },
    formatDate (date) {
      return dateUtilty.formatOutput(date)
    },
    partsSet () {
      this.parts = this.vehiclePartsGet(this.vin)
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle {
    .parts-container {
      h3 {
        text-align: left;
      }
    }
  }
}
</style>
