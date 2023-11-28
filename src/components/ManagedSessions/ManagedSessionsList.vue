<template>
  <div v-if="!loading" class="managed-sessions-list">
    <div class="filter-active">
      <v-checkbox
        id="filter-checkbox"
        v-model="activeFilter"
        label="Filter Active Sessions"
      />
    </div>

    <v-data-table
      id="sessions-table"
      :footer-props="dataTableDefaultFooterProps"
      :headers="tableHeaders"
      :items="existingManagedSessions"
      :sort-by="['id']"
      :sort-desc="[true]"
      :item-class="activeClass"
      :items-per-page="defaultTableRows"
      @update:items-per-page="capturePagination"
    >
      <template #[`item.id`]="{ item }">
        <router-link :to="managedSessionLinkObject(item.id)">{{
          item.id
        }}</router-link>
      </template>

      <template #[`item.vin`]="{ item }">
        <router-link :to="vehicleLinkObject(item.vin)">{{ item.vin }}</router-link>
      </template>
      <template #[`item.initialization`]="{ item }" class="active">
        {{ formatDateAndTime(item.initialization) }}
      </template>
      <template #[`item.completion`]="{ item }" class="active">
        {{ item.completion === "active" ? "Active" : formatDateAndTime(item.completion) }}
      </template>
      <template #[`item.pin`]="{ item }">
        {{ item.completion === "active" ? item.pin : "--" }}
      </template>
      <template #[`item.creator`]="{ item }">
        <router-link :to="userLinkObject(item.creator)">{{ item.creator }}</router-link>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_USERS,
  LOADING,
  VEHICLES_MANAGED_SESSIONS
} from '@/store/getter-types'

import DateUtility from '@/lib/dateUtility'
import utility from '@/lib/utility'
import TableRowsDefault from '@/mixins/TableRowsDefault.js'

export default {
  name: 'ManagedSessionsList',
  mixins: [TableRowsDefault],
  data: () => ({
    activeFilter: false
  }),
  computed: {
    ...mapGetters({
      loading: LOADING,
      managedSessions: VEHICLES_MANAGED_SESSIONS,
      operatorCanAccessUsers: ACCESS_USERS
    }),
    dataTableDefaultFooterProps () {
      return utility.dataTableDefaultFooterProps()
    },
    existingManagedSessions () {
      if (typeof this.managedSessions !== 'undefined') {
        let managedSessions = [...this.managedSessions]
        if (this.activeFilter) {
          managedSessions = managedSessions.filter(
            (session) => session.completion === 'active'
          )
        }
        return managedSessions
      }
      return []
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
    }
  },
  methods: {
    activeClass (item) {
      if (item.completion === 'active') {
        return 'active-session'
      }
    },
    vehicleLinkObject (vin) {
      return {
        name: 'vehicle',
        params: { vin }
      }
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
    },
    formatDateAndTime (datetime) {
      return DateUtility.formatDateAndTime(datetime)
    }
  }
}
</script>

<style scoped lang="scss">
#sessions-table ::v-deep .active-session {
  background: var(--v-active-item-base);
  a {
    color: var(--v-active-item-link-base);
  }
  font-weight: bolder;
}
.filter-active ::v-deep label {
  margin-bottom: 0;
}
</style>
