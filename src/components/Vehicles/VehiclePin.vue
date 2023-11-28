<template>
  <div class="pin-container">
    <h3>Pin</h3>
    <v-list>
      <v-list-item v-for="item in normalizedPin" :key="item.name">
        <v-list-item-content>
          <v-list-item-title>{{ item.display }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.data }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  VEHICLE_LOADED,
  VEHICLE_PIN
} from '@/store/getter-types'

export default {
  name: 'VehiclePin',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      pin: {},
      tableHeaders: [
        {
          text: 'Name',
          value: 'name',
          sortable: false
        },
        {
          text: 'Value',
          value: 'data',
          sortable: false
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      vehicleLoadedGet: VEHICLE_LOADED,
      vehiclePinGet: VEHICLE_PIN
    }),
    normalizedPin () {
      const pinData = []
      for (const [name, data] of Object.entries(this.pin)) {
        pinData.push({ name, data })
      }
      return pinData.map(item => {
        const { name, data } = item
        const output = {
          name,
          data,
          display: this.capitalizeFirstLetter(name.replace(/([a-z])([A-Z])/g, '$1 $2'))
        }
        return output
      }).sort((a, b) => (a.display > b.display) ? 1 : ((b.display > a.display) ? -1 : 0))
    },
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : []
    }
  },
  watch: {
    vehicleLoaded: {
      handler (newVal) {
        if (newVal && this.vin) {
          this.pin = this.vehiclePinGet(this.vin)
        }
      },
      immediate: true
    }
  },
  methods: {
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle {
    .pin-container {
      h3 {
        text-align: left;
      }
    }
  }
}

</style>
