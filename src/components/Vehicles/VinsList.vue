<template>
  <div class="vins-list-container">
    <v-list
      v-if="vins.length"
      class="vins-list"
      dense
    >
      <v-list-item v-for="vin in vins" :key="vin">
        <router-link
          v-if="operatorCanAccessVehicles || operatorControlsVehicle(vin)"
          :to="vehicleLinkObject(vin)"
        >{{ vin }}</router-link>
        <span v-else>{{ vin }}</span>
      </v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item>None</v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_VEHICLES,
  OPERATOR_VINS
} from '@/store/getter-types'
export default {
  name: 'VinsList',
  props: {
    vins: {
      default: () => [],
      type: Array
    }
  },
  computed: {
    ...mapGetters({
      operatorCanAccessVehicles: ACCESS_VEHICLES,
      operatorVins: OPERATOR_VINS
    })
  },
  methods: {
    vehicleLinkObject (vin) {
      return {
        name: 'vehicle',
        params: {
          vin
        }
      }
    },
    operatorControlsVehicle (vin) {
      return this.operatorVins.includes(vin)
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vins-list-container {
      ul {
        list-style: none;
      }
      .vins-list {
        display: grid;
        grid-column-gap: 5px;
        grid-row-gap: 0;
        @media screen and (max-width: 600px) {
          grid-template-columns: 1fr;
        }
        @media screen and (min-width: 600px) {
          grid-template-columns: repeat(2, 1fr);
        }
        @media screen and (min-width: 768px) {
          grid-template-columns: repeat(3, 1fr);
        }
        @media screen and (min-width: 992px) {
          grid-template-columns: repeat(4, 1fr);
        }
        @media screen and (min-width: 1200px) {
          grid-template-columns: repeat(5, 1fr);
        }
      }
    }
}

</style>
