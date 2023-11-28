<template>
  <div class="vehicle-managed-sessions">
    <div class="sessions">
      <h3>Managed Sessions</h3>
      <div class="filter-container">
        <label for="filter-checkbox">Filter Active: </label>
        <input id="filter-checkbox" v-model="filterActive" type="checkbox" />
      </div>
      <v-data-table
        id="sessions-table"
        :headers="tableHeaders"
        :items="managedSessionsfiltered"
        :sort-by="['id']"
        :sort-desc="[true]"
        dense
        :item-class="activeClass"
      >
        <template #[`item.id`]="{ item }">
          <router-link :to="managedSessionLinkObject(item.id)">{{ item.id }}</router-link>
        </template>
        <template #[`item.date`]="{ item }">
          {{ formatDate(item.initialization) }}
        </template>
        <template #[`item.initialization`]="{ item }">
          {{ formatDate(item.initialization) }}
        </template>
        <template #[`item.completion`]="{ item }">
          {{ item.completion !== "active" ? formatDate(item.completion) : "Active" }}
        </template>
        <template #[`item.pin`]="{ item }">
          {{ item.completion !== "active" ? "--" : item.pin }}
        </template>
        <template #[`item.verificationId`]="{ item }">
          {{ item.verificationId ? item.verificationId : "--" }}
        </template>
        <template #[`item.creator`]="{ item }">
          <router-link :to="userLinkObject(item.creator)">{{ item.creator }}</router-link>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_USERS,
  VEHICLE_LOADED,
  VEHICLE_MANAGED_SESSIONS
} from '@/store/getter-types'

import DateUtility from '@/lib/dateUtility'

export default {
  name: 'VehicleManagedSessions',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data: () => ({
    sortInfo: {
      type: 'id',
      dir: 'desc'
    },
    filterActive: false
  }),
  computed: {
    ...mapGetters({
      vehicleLoadedGet: VEHICLE_LOADED,
      operatorCanAccessUsers: ACCESS_USERS,
      vehicleManagedSessionsGet: VEHICLE_MANAGED_SESSIONS
    }),
    managedSessionsfiltered () {
      if (typeof this.managedSessions !== 'undefined') {
        let sessions = [...this.managedSessions]
        if (this.filterActive) {
          sessions = sessions.filter(
            (session) => session.completion === 'active'
          )
        }
        return sessions
      }
      return []
    },
    managedSessions () {
      return this.vehicleLoaded ? this.vehicleManagedSessionsGet(this.vin) : []
    },
    tableHeaders () {
      const headers = [
        {
          text: 'Id',
          value: 'id',
          sortable: true
        },
        {
          text: 'VIN',
          value: 'vin',
          sortable: true
        },
        {
          text: 'Start',
          value: 'initialization',
          sortable: true
        },
        {
          text: 'End',
          value: 'completion',
          sortable: true
        },
        {
          text: 'Pin',
          value: 'pin',
          sortable: false
        }
      ]
      if (this.operatorCanAccessUsers) {
        headers.push({
          text: 'Created By',
          value: 'creator',
          sortable: true
        })
      }
      return headers
    },
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : null
    }
  },
  methods: {
    activeClass (item) {
      if (item.completion === 'active') {
        return 'active-session'
      }
    },
    formatDate (date) {
      return DateUtility.formatDateAndTime(date)
    },
    managedSessionLinkObject (id) {
      return {
        name: 'managed-session',
        params: { id }
      }
    },
    userLinkObject (username) {
      return {
        name: 'user',
        params: { username }
      }
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle {
    .vehicle-managed-sessions {
      h3 {
        text-align: left;
      }
    }
  }
  #filter-checkbox {
    margin: 10px 0 10px 5px;
    vertical-align: middle;
  }
}
#sessions-table ::v-deep .active-session {
  background: var(--v-active-item-base);
  a {
    color: var(--v-active-item-link-base)
  }
  font-weight: bolder;
}
</style>
