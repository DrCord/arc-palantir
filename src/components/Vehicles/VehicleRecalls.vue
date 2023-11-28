<template>
  <div class="vehicleRecalls-container">
    <h3>Recalls</h3>
    <v-data-table
      dense
      :headers="tableHeaders"
      :items="vehicleRecalls"
      >
      <template #[`item.recallId`]="{ item }">
        <router-link :to="recallLinkObject(item.recallId)">{{
          item.recallId
        }}</router-link>
      </template>
      <template #[`item.serviceDate`]="{ item }">
        {{ formatDate(item.serviceDate) }}
      </template>
      <template #[`item.serviceReference`]="{ item }">
        {{ item.serviceReference !== '' ? item.serviceReference : 'None' }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { VEHICLE_RECALLS } from '@/store/getter-types'

import dateUtility from '@/lib/dateUtility'

export default {
  name: 'VehicleRecalls',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data: () => ({
    tableHeaders: [
      {
        text: 'Vehicle Recall Id',
        value: 'vehicleRecallId'
      },
      {
        text: 'Recall Id',
        value: 'recallId'
      },
      {
        text: 'Service Date',
        value: 'serviceDate'
      },
      {
        text: 'Service Reference',
        value: 'serviceReference'
      }
    ]
  }),
  computed: {
    ...mapGetters({
      vehicleRecallsGet: VEHICLE_RECALLS
    }),
    vehicleRecalls () {
      return this.vin ? this.vehicleRecallsGet(this.vin) : []
    }
  },
  methods: {
    formatDate (date) {
      return dateUtility.formatOutput(date)
    },
    recallLinkObject (id) {
      return {
        name: 'recall',
        params: { id }
      }
    }
  }
}
</script>

<style scoped lang='scss'>
#app {
  .vehicle {
    .vehicleRecalls-container {
      h3 {
        text-align: left;
      }
      table {
        min-width: 800px;
      }
    }
  }
}
</style>
