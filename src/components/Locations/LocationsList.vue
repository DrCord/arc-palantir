<template>
  <div class="locations-container">
    <div class="search-container">
      <v-text-field
        id="locations-search"
        v-model="locationsFilter"
        dense
        outlined
        placeholder="Filter Locations"
      />
    </div>
    <v-data-table
      :footer-props="dataTableDefaultFooterProps"
      :headers="tableHeaders"
      :items="locations"
      :items-per-page="defaultTableRows"
      :search="locationsFilter"
      :sort-by="['locationName']"
      @update:items-per-page="capturePagination"
    >
      <template #[`item.locationName`]="{ item }">
        <router-link :to="locationLinkObject(item.id)">{{
          item.locationName
        }}</router-link>
      </template>
    </v-data-table>
    <context-bar-toggle
      :visible="operatorCanAccessContextMenu"
      @context-bar-visible="toggleContextBar"
    />
    <context-bar
      :content-type="contextBarContentType"
      :visible="contextBarVisible"
      @change-context="changeContext"
      @context-bar-visible="toggleContextBar($event)"
      @location-create-cancel="locationActionCancel"
      @location-create-complete="locationActionComplete"
      @location-code-delete-cancel="locationActionCancel"
      @location-code-delete-complete="closeContextBar"
      @location-code-create-cancel="locationActionCancel"
      @location-code-create-complete="closeContextBar"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { LOCATIONS } from '@/store/getter-types'

import ContextBarToggle from '@/components/ContextBarToggle.vue'
import ContextBar from '@/components/Locations/LocationsContextBar/ContextBar.vue'

import utility from '@/lib/utility'
import TableRowsDefault from '@/mixins/TableRowsDefault.js'

export default {
  name: 'LocationsList',
  components: {
    ContextBarToggle,
    ContextBar
  },
  mixins: [TableRowsDefault],
  data: () => ({
    contextBarContentType: null,
    contextBarVisible: false,
    tableHeaders: [
      {
        text: 'Name',
        value: 'locationName',
        sortable: true
      },
      {
        text: 'Location Code',
        value: 'locationCode',
        sortable: true
      },
      {
        text: 'City',
        value: 'city',
        sortable: true
      },
      {
        text: 'State',
        value: 'governingDistrict',
        sortable: true
      }
    ],
    sortInfo: {
      type: 'locationName',
      dir: 'asc'
    },
    locationsFilter: ''
  }),
  computed: {
    ...mapGetters({
      locations: LOCATIONS
    }),
    dataTableDefaultFooterProps () {
      return utility.dataTableDefaultFooterProps()
    },
    operatorCanAccessContextMenu () {
      // this should check using an OR for each item/permission in the context menu
      return true // create can be done by any user
    }
  },
  methods: {
    changeContext (event) {
      this.contextBarVisible = true
      this.contextBarContentType = event.contentType
    },
    locationLinkObject (id) {
      return {
        name: 'location',
        params: { id }
      }
    },
    closeContextBar () {
      this.toggleContextBar(false)
    },
    locationActionCancel () {
      this.toggleContextBar(true, null)
    },
    locationActionComplete (event) {
      if (event && event.id && event.navigate) {
        const route = 'location/' + event.id
        this.$router.push(route)
      }
      this.toggleContextBar(false)
    },
    toggleContextBar (visible, contentType = null) {
      this.contextBarVisible = visible
      this.contextBarContentType = contentType
    }
  }
}
</script>

<style scoped lang="scss">
.locations {
  .search-container {
    max-width: 350px;
  }
}
</style>
