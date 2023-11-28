<template>
  <div class="fleets-container">
    <v-data-table
      :footer-props="dataTableDefaultFooterProps"
      :items-per-page="defaultTableRows"
      :headers="tableHeaders"
      :items="fleets"
      :sort-by="['name']"
      dense
      @update:items-per-page="capturePagination"
    >
      <template v-slot:top>
        <v-container fluid class="filter">
          <v-row class="filter-fields">
            <v-col cols="12" xl="3" lg="3" md="6" sm="12">
              <v-row class="pa-3">
                <v-text-field
                  v-model="nameFilterValue"
                  append-icon="search"
                  clearable
                  dense
                  hide-details
                  outlined
                  placeholder="Filter name by text match"
                  aria-label="Filter name by text match"
                  class="text-filter name-filter"
                />
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template #[`item.id`]="{ item }">
        <router-link :to='fleetLinkObject(item.id)'>{{ item.id }}</router-link>
      </template>
      <template #[`item.name`]="{ item }">
        <router-link :to='fleetLinkObject(item.id)'>{{ item.name }}</router-link>
      </template>
    </v-data-table>
    <context-bar-toggle
      :visible="operatorCanAccessContextMenu"
      @context-bar-visible="toggleContextBar"
    />
    <vehicle-groups-context-bar
      :content-type="contextBarContentType"
      :visible="contextBarVisible"
      @change-context="changeContext"
      @context-bar-visible="toggleContextBar($event)"
      @fleet-create-cancel="fleetActionCancel"
      @fleet-create-complete="fleetActionComplete"
      @fleet-delete-cancel="fleetActionCancel"
      @fleet-delete-complete="fleetActionComplete"
      @department-code-delete-cancel="fleetActionCancel"
      @department-code-delete-complete="fleetActionComplete"
      @department-code-create-cancel="fleetActionCancel"
      @department-code-create-complete="fleetActionComplete"
      @department-code-manage-cancel="toggleContextBar(true)"
      @department-code-manage-complete="toggleContextBar(true)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_FLEETS_MANAGER,
  FLEETS
} from '@/store/getter-types'
import ContextBarToggle from '@/components/ContextBarToggle.vue'
import VehicleGroupsContextBar from '@/components/VehicleGroups/VehicleGroupsContextBar/ContextBar.vue'

import utility from '@/lib/utility'
import TableRowsDefault from '@/mixins/TableRowsDefault.js'

export default {
  name: 'Fleets',
  components: {
    ContextBarToggle,
    VehicleGroupsContextBar
  },
  mixins: [TableRowsDefault],
  data: () => ({
    contextBarContentType: null,
    contextBarVisible: false,
    nameFilterValue: ''
  }),
  computed: {
    ...mapGetters({
      operatorCanCreateFleet: ACCESS_FLEETS_MANAGER,
      fleets: FLEETS
    }),
    dataTableDefaultFooterProps () {
      return utility.dataTableDefaultFooterProps()
    },
    operatorCanAccessContextMenu () {
      // this should check using an OR for each item/permission in the context menu
      return this.operatorCanCreateFleet
    },
    tableHeaders () {
      const headers = [
        {
          text: 'Id',
          value: 'id',
          sortable: true
        },
        {
          text: 'Name',
          value: 'name',
          sortable: true,
          filter: this.filterName
        },
        {
          text: 'Department',
          value: 'code',
          sortable: true
        },
        {
          text: 'Description',
          value: 'description',
          sortable: true
        },
        {
          text: 'Location Code',
          value: 'locationCode',
          sortable: true
        }
      ]
      if (this.operatorCanAccessAuthorities) {
        headers.push({
          text: 'Authorities',
          value: 'authorities',
          sortable: true,
          filter: this.filterAuthorities
        })
      }
      return headers
    }
  },
  methods: {
    changeContext (event) {
      this.contextBarVisible = true
      this.contextBarContentType = event.contentType
    },
    filterName (value) {
      if (!this.nameFilterValue) {
        return true
      }
      // Check if the current loop value partially contains the searched word
      return value.toLowerCase().includes(this.nameFilterValue.toLowerCase())
    },
    fleetActionCancel () {
      this.toggleContextBar(true, null)
    },
    fleetActionComplete (event) {
      if (event && event.id && event.navigate) {
        const route = 'vehicle-groups/' + event.id
        this.$router.push(route)
      }
      this.toggleContextBar(false)
    },
    fleetLinkObject (id) {
      return {
        name: 'vehicle-group',
        params: {
          groupId: id
        }
      }
    },
    toggleContextBar (visible, contentType = null) {
      this.contextBarVisible = visible
      this.contextBarContentType = contentType
    }
  }
}
</script>
