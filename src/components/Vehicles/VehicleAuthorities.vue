<template>
  <div class="authorities-container">
    <h3>Authority Info</h3>
    <ul class="authorities">
      <li
        v-for="authority in sortedVehicleAuthorities"
        :key="authority.id"
        class="authority"
      >{{ authority.id }}<span v-if="authority.description"> - {{ authority.description }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  AUTHORITY,
  AUTHORITIES,
  VEHICLE_AUTHORITIES
} from '@/store/getter-types'
export default {
  name: 'VehicleAuthorities',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      authorityGet: AUTHORITY,
      authorities: AUTHORITIES,
      vehicleAuthoritiesGet: VEHICLE_AUTHORITIES
    }),
    sortedVehicleAuthorities () {
      if (!this.authorities.length) {
        return this.vehicleAuthorities
      }
      return this.vehicleAuthorities.map(authority => {
        return this.authorities.find(authorityFromStore => authorityFromStore.id === authority.id)
      })
    },
    vehicleAuthorities () {
      return this.vin ? this.vehicleAuthoritiesGet(this.vin) : []
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle {
    .authorities-container {
      h3 {
        text-align: left;
      }
      .authorities {
        display: flex;
        padding-inline-start: 0;
        list-style: none;
        .authority {
          padding-right: 3px;
          &:after {
            content: ', ';
          }
          &:last-of-type::after {
            content: '';
          }
        }
      }
    }
  }
}

</style>
