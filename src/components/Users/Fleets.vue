<template>
  <div class="fleets-container">
    <v-data-table
      :headers="tableHeaders"
      :items="userFleets"
      dense
    >
      <template #[`item.name`]="{ item }">
        <router-link
          :to='item.id ? fleetLinkObject(item.id) : null'
        >{{ item.name }}</router-link>
      </template>
      <template #[`item.vins`]="{ item }">
        <v-list
          dense
          flat
        >
          <v-list-item v-for="vin in item.vins" :key="vin">
            <span v-if="!operatorCanAccessVehicles">{{ vin }}</span>
            <router-link v-else :to="vehicleLinkObject(vin)">{{ vin }}</router-link>
          </v-list-item>
        </v-list>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_VEHICLE_GROUPS,
  ACCESS_VEHICLES,
  USER_FLEETS
} from '@/store/getter-types'

export default {
  name: 'UserFleets',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  data: () => ({
    tableHeaders: [
      {
        text: 'Id',
        value: 'id',
        sortable: true
      },
      {
        text: 'Name',
        value: 'name',
        sortable: true
      },
      {
        text: 'VINs',
        value: 'vins',
        sortable: false
      }
    ]
  }),
  computed: {
    ...mapGetters({
      operatorCanAccessVehicleGroupss: ACCESS_VEHICLE_GROUPS,
      operatorCanAccessVehicles: ACCESS_VEHICLES,
      userFleetsGet: USER_FLEETS
    }),
    userFleets () {
      return this.username ? this.userFleetsGet(this.username) : []
    }
  },
  methods: {
    fleetLinkObject (id) {
      if (this.operatorCanAccessVehicleGroupss) {
        return {
          name: 'vehicle-group',
          params: {
            groupId: id
          }
        }
      }
      return {
        name: 'fleet',
        params: {
          fleetId: id
        }
      }
    },
    vehicleLinkObject (vin) {
      return {
        name: 'vehicle',
        params: { vin }
      }
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .fleets-container {
    .v-data-table > .v-data-table__wrapper > table > tbody > tr {
      .v-list {
        background-color: transparent;
        .v-list-item {
          background-color: transparent;
          min-height: 27px;
        }
      }
    }
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  #app {
    .fleets-container {
      .v-data-table > .v-data-table__wrapper > table > tbody > tr {
        .v-list {
          columns: 2;
          -webkit-columns: 2;
          -moz-columns: 2;
        }
      }
    }
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  #app {
    .fleets-container {
      .v-data-table > .v-data-table__wrapper > table > tbody > tr {
        .v-list {
          columns: 3;
          -webkit-columns: 3;
          -moz-columns: 3;
        }
      }
    }
  }
}
</style>
