<template>
  <div v-if="userControlledVehicles.length" class="user-vehicles-container">
    <v-list
      dense
      flat
    >
      <v-list-item v-for="vin in userControlledVehicles" :key="vin">
        <router-link
          v-if="operatorCanAccessVehicles"
          :to="vin ? vehicleLinkObject(vin) : null"
        >{{ vin }}</router-link>
        <span v-else>{{ vin }}</span>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_VEHICLES,
  USER_CONTROLLED_VEHICLES
} from '@/store/getter-types'

export default {
  name: 'UserVehicles',
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
      operatorCanAccessVehicles: ACCESS_VEHICLES,
      userControlledVehiclesGet: USER_CONTROLLED_VEHICLES
    }),
    userControlledVehicles () {
      return this.username ? this.userControlledVehiclesGet(this.username) : []
    }
  },
  methods: {
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
  .user-vehicles-container {
    .v-list {
      padding-top: 10px;
      .v-list-item {
        display: inline-block;
      }
    }
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  #app {
    .user-vehicles-container {
      .v-list {
        columns: 2;
        -webkit-columns: 2;
        -moz-columns: 2;
      }
    }
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  #app {
    .user-vehicles-container {
      .v-list {
        columns: 3;
        -webkit-columns: 3;
        -moz-columns: 3;
      }
    }
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  #app {
    .user-vehicles-container {
      .v-list {
        columns: 4;
        -webkit-columns: 4;
        -moz-columns: 4;
      }
    }
  }
}
</style>
